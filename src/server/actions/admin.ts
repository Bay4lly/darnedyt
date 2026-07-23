'use server';

import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { createAuditLog, sanitizeInput } from '@/lib/security';
import { emailComposerSchema, sponsorshipPackageSchema } from '@/lib/zod-schemas';
import { sendEmail } from '@/lib/mail';
import { Role } from '@/types';

async function checkAdminAuth() {
  const user = await getSessionUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && user.role !== Role.STAFF)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function updateUserRoleAction(userId: string, newRole: Role) {
  try {
    const admin = await checkAdminAuth();
    if (admin.role !== Role.SUPER_ADMIN && admin.role !== Role.ADMIN) {
      return { success: false, error: 'Only Admins can change user roles.' };
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await createAuditLog(admin.userId, 'USER_ROLE_CHANGED', `User ${updatedUser.email} role changed to ${newRole}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update user role' };
  }
}

export async function toggleUserBanAction(userId: string, isBanned: boolean) {
  try {
    const admin = await checkAdminAuth();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isBanned },
    });

    await createAuditLog(admin.userId, isBanned ? 'USER_BANNED' : 'USER_UNBANNED', `User ${updatedUser.email} status changed`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update user ban status' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const admin = await checkAdminAuth();
    if (admin.role !== Role.SUPER_ADMIN) {
      return { success: false, error: 'Only Super Admins can permanently delete accounts.' };
    }

    await db.user.delete({ where: { id: userId } });
    await createAuditLog(admin.userId, 'USER_DELETED', `User ID ${userId} deleted`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete user' };
  }
}

export async function upsertPackageAction(formData: any) {
  try {
    const admin = await checkAdminAuth();
    const validated = sponsorshipPackageSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { id, titleEn, titleTr, descEn, descTr, price, showPrice, featuresEn, featuresTr, isPopular, orderIndex } = validated.data;

    if (id) {
      await db.sponsorshipPackage.update({
        where: { id },
        data: {
          titleEn,
          titleTr,
          descEn,
          descTr,
          price,
          showPrice,
          featuresEn,
          featuresTr,
          isPopular,
          orderIndex,
        },
      });
    } else {
      await db.sponsorshipPackage.create({
        data: {
          titleEn,
          titleTr,
          descEn,
          descTr,
          price,
          showPrice,
          featuresEn,
          featuresTr,
          isPopular,
          orderIndex,
        },
      });
    }

    await createAuditLog(admin.userId, 'PACKAGE_UPSERTED', `Sponsorship package ${titleEn} updated`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to save package' };
  }
}

export async function updateSiteSettingAction(key: string, value: string) {
  try {
    const admin = await checkAdminAuth();

    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    await createAuditLog(admin.userId, 'SETTING_UPDATED', `Setting ${key} changed to ${value}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update setting' };
  }
}

export async function sendDirectEmailAction(formData: any) {
  try {
    const admin = await checkAdminAuth();
    const validated = emailComposerSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { recipient, subject, body, isHtml } = validated.data;
    const sanitizedBody = isHtml ? body : sanitizeInput(body);

    const sent = await sendEmail({
      to: recipient,
      subject,
      html: isHtml ? sanitizedBody : `<p style="white-space: pre-wrap;">${sanitizedBody}</p>`,
    });

    if (!sent) {
      return { success: false, error: 'Email delivery failed.' };
    }

    await createAuditLog(admin.userId, 'ADMIN_EMAIL_SENT', `Direct email sent to ${recipient}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}
