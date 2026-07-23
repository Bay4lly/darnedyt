'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { clearSessionCookie, getSessionUser, setSessionCookie, signJwtToken } from '@/lib/auth';
import { forgotPasswordSchema, loginSchema, profileUpdateSchema, registerSchema, resetPasswordSchema } from '@/lib/zod-schemas';
import { checkRateLimit, createAuditLog } from '@/lib/security';
import { sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/mail';
import { Role } from '@/types';

export async function registerAction(formData: any) {
  try {
    const rateCheck = checkRateLimit('register-action', 5, 60000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many registration attempts. Please try again in a minute.' };
    }

    const validated = registerSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { name, username, email, password, company } = validated.data;

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return { success: false, error: 'Username is already taken.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        company,
        role: Role.USER,
        isEmailVerified: true,
      },
    });

    await createAuditLog(user.id, 'USER_REGISTERED', `New account created for ${email}`);

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token, false);

    // Asynchronous email dispatch in background so registration response never blocks
    sendWelcomeEmail(user.email, user.name).catch((err) => console.warn('Welcome email notice:', err));

    return { success: true, role: user.role };
  } catch (error: any) {
    console.error('Register action error:', error);
    return { success: false, error: error?.message || 'An unexpected error occurred during registration.' };
  }
}

export async function loginAction(formData: any) {
  try {
    const rateCheck = checkRateLimit(`login-${formData?.email || 'anon'}`, 5, 60000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many login attempts. Please wait 60 seconds before trying again.' };
    }

    const validated = loginSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { email, password, rememberMe } = validated.data;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'Invalid email address or password.' };
    }

    if (user.isBanned) {
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      await createAuditLog(user.id, 'LOGIN_FAILED', `Failed login attempt for ${email}`);
      return { success: false, error: 'Invalid email address or password.' };
    }

    const token = signJwtToken(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      rememberMe ? '30d' : '7d'
    );

    await setSessionCookie(token, rememberMe);
    await createAuditLog(user.id, 'LOGIN_SUCCESS', `User ${email} logged in successfully`);

    return { success: true, role: user.role };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: 'An error occurred while signing in.' };
  }
}

export async function logoutAction() {
  const user = await getSessionUser();
  if (user) {
    await createAuditLog(user.userId, 'USER_LOGOUT', `User ${user.email} logged out`);
  }
  await clearSessionCookie();
  return { success: true };
}

export async function forgotPasswordAction(formData: any) {
  try {
    const validated = forgotPasswordSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { email } = validated.data;
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return { success: true, message: 'If an account exists for this email, a password reset link has been sent.' };
    }

    const resetTokenStr = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await db.passwordResetToken.create({
      data: {
        email,
        token: resetTokenStr,
        expires,
      },
    });

    sendPasswordResetEmail(email, resetTokenStr).catch((err) => console.warn('Reset email notice:', err));
    await createAuditLog(user.id, 'FORGOT_PASSWORD_REQUESTED', `Password reset token generated for ${email}`);

    return { success: true, message: 'If an account exists for this email, a password reset link has been sent.' };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, error: 'Failed to process request.' };
  }
}

export async function resetPasswordAction(formData: any) {
  try {
    const validated = resetPasswordSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { token, password } = validated.data;

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired password reset link.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.update({
      where: { email: resetToken.email },
      data: { passwordHash: hashedPassword },
    });

    await db.passwordResetToken.delete({ where: { id: resetToken.id } });
    await createAuditLog(user.id, 'PASSWORD_RESET_SUCCESS', `Password successfully reset for ${user.email}`);

    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password.' };
  }
}

export async function updateProfileAction(formData: any) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) return { success: false, error: 'Unauthorized' };

    const validated = profileUpdateSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { name, company, currentPassword, newPassword } = validated.data;

    const dbUser = await db.user.findUnique({ where: { id: currentUser.userId } });
    if (!dbUser) return { success: false, error: 'User not found' };

    let updatedPasswordHash = dbUser.passwordHash;

    if (newPassword && newPassword.length > 0) {
      if (!currentPassword) {
        return { success: false, error: 'Current password is required.' };
      }
      const isMatch = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!isMatch) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    await db.user.update({
      where: { id: currentUser.userId },
      data: {
        name,
        company,
        passwordHash: updatedPasswordHash,
      },
    });

    await createAuditLog(currentUser.userId, 'PROFILE_UPDATED', `User updated profile information`);

    return { success: true, message: 'Profile updated successfully.' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}
