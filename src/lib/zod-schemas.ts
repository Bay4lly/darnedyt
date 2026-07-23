import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  company: z.string().optional(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms of Service & Privacy Policy' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const contactTicketSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  company: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  category: z.enum(['SPONSORSHIP', 'BUSINESS', 'COLLABORATION', 'SUPPORT', 'COPYRIGHT', 'OTHER']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  estimatedBudget: z.string().optional(),
  startDate: z.string().optional(),
  contentType: z.string().optional(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms of Service & Privacy Policy' }),
  }),
});

export const ticketReplySchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().min(2, 'Message cannot be empty'),
  sendEmailCopy: z.boolean().optional().default(true),
});

export const adminTicketUpdateSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(['OPEN', 'PENDING', 'IN_PROGRESS', 'ANSWERED', 'CLOSED', 'SPAM']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  assignedToId: z.string().optional().nullable(),
  adminNote: z.string().optional(),
});

export const sponsorshipPackageSchema = z.object({
  id: z.string().optional(),
  titleEn: z.string().min(2),
  titleTr: z.string().min(2),
  descEn: z.string().min(5),
  descTr: z.string().min(5),
  price: z.string().min(1),
  showPrice: z.boolean().default(true),
  featuresEn: z.string(),
  featuresTr: z.string(),
  isPopular: z.boolean().default(false),
  orderIndex: z.number().default(0),
});

export const emailComposerSchema = z.object({
  recipient: z.string().email('Invalid recipient email'),
  subject: z.string().min(3, 'Subject is required'),
  body: z.string().min(10, 'Email body is required'),
  isHtml: z.boolean().default(true),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword.length > 0) {
    return data.currentPassword && data.currentPassword.length > 0;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['currentPassword'],
});
