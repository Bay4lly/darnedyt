'use me';
'use server';

import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { adminTicketUpdateSchema, contactTicketSchema, ticketReplySchema } from '@/lib/zod-schemas';
import { checkRateLimit, createAuditLog, sanitizeInput } from '@/lib/security';
import { generateTicketNumber } from '@/lib/utils';
import { sendAdminNewTicketAlert, sendTicketConfirmationEmail, sendTicketReplyNotification } from '@/lib/mail';
import { Role, TicketCategory, TicketPriority, TicketStatus } from '@/types';

export async function createTicketAction(formData: any) {
  try {
    const rateCheck = checkRateLimit(`contact-ticket-${formData?.email || 'anon'}`, 3, 60000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'You are submitting inquiries too fast. Please wait 60 seconds.' };
    }

    const validated = contactTicketSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const {
      name,
      company,
      email,
      phone,
      category,
      subject,
      message,
      estimatedBudget,
      startDate,
      contentType,
    } = validated.data;

    const user = await getSessionUser();
    const ticketNumber = generateTicketNumber();

    const sanitizedMessage = sanitizeInput(message);
    const sanitizedSubject = sanitizeInput(subject);

    const ticket = await db.ticket.create({
      data: {
        ticketNumber,
        userId: user?.userId || null,
        name: sanitizeInput(name),
        company: company ? sanitizeInput(company) : null,
        email,
        phone: phone ? sanitizeInput(phone) : null,
        category,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        estimatedBudget,
        startDate,
        contentType,
        status: TicketStatus.OPEN,
        priority: TicketPriority.NORMAL,
      },
    });

    await db.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: user?.userId || null,
        senderName: ticket.name,
        senderEmail: ticket.email,
        isFromAdmin: false,
        message: sanitizedMessage,
      },
    });

    if (user?.userId) {
      await db.notification.create({
        data: {
          userId: user.userId,
          title: 'Ticket Submitted',
          message: `Your inquiry ${ticketNumber} has been received.`,
          link: `/dashboard/tickets/${ticketNumber}`,
        },
      });
    }

    await createAuditLog(user?.userId || null, 'TICKET_CREATED', `Ticket ${ticketNumber} created by ${email}`);

    await sendTicketConfirmationEmail(email, name, ticketNumber, subject);
    await sendAdminNewTicketAlert(ticketNumber, name, email, subject, category);

    return { success: true, ticketNumber };
  } catch (error: any) {
    console.error('Create ticket action error:', error);
    return { success: false, error: 'An error occurred while creating your ticket.' };
  }
}

export async function addTicketMessageAction(formData: any) {
  try {
    const user = await getSessionUser();
    const validated = ticketReplySchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { ticketId, message, sendEmailCopy } = validated.data;

    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { user: true },
    });

    if (!ticket || ticket.isDeleted) {
      return { success: false, error: 'Ticket not found.' };
    }

    const isAdmin = user && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN || user.role === Role.STAFF);

    if (!isAdmin) {
      if (!user || ticket.userId !== user.userId) {
        return { success: false, error: 'Unauthorized access to ticket.' };
      }
    }

    const sanitizedMessage = sanitizeInput(message);

    const newMessage = await db.ticketMessage.create({
      data: {
        ticketId,
        senderId: user?.userId || null,
        senderName: user?.name || ticket.name,
        senderEmail: user?.email || ticket.email,
        isFromAdmin: Boolean(isAdmin),
        message: sanitizedMessage,
      },
    });

    const newStatus = isAdmin ? TicketStatus.ANSWERED : TicketStatus.IN_PROGRESS;
    await db.ticket.update({
      where: { id: ticketId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    if (isAdmin && sendEmailCopy) {
      await sendTicketReplyNotification(ticket.email, ticket.name, ticket.ticketNumber, sanitizedMessage);
    }

    await createAuditLog(user?.userId || null, 'TICKET_REPLY_ADDED', `Reply added to ${ticket.ticketNumber} by ${user?.email}`);

    return { success: true, message: newMessage };
  } catch (error: any) {
    console.error('Add ticket message error:', error);
    return { success: false, error: 'Failed to send message.' };
  }
}

export async function updateAdminTicketAction(formData: any) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && user.role !== Role.STAFF)) {
      return { success: false, error: 'Forbidden' };
    }

    const validated = adminTicketUpdateSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { ticketId, status, priority, assignedToId, adminNote } = validated.data;

    const ticket = await db.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        priority,
        assignedToId: assignedToId || null,
      },
    });

    if (adminNote && adminNote.trim().length > 0) {
      await db.adminNote.create({
        data: {
          ticketId,
          authorId: user.userId,
          note: sanitizeInput(adminNote),
        },
      });
    }

    await createAuditLog(user.userId, 'TICKET_UPDATED_BY_ADMIN', `Ticket ${ticket.ticketNumber} status set to ${status}`);

    return { success: true };
  } catch (error) {
    console.error('Update ticket admin error:', error);
    return { success: false, error: 'Failed to update ticket.' };
  }
}

export async function softDeleteTicketAction(ticketId: string) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
      return { success: false, error: 'Forbidden' };
    }

    await db.ticket.update({
      where: { id: ticketId },
      data: { isDeleted: true },
    });

    await createAuditLog(user.userId, 'TICKET_SOFT_DELETED', `Ticket ID ${ticketId} deleted by admin`);

    return { success: true };
  } catch (error) {
    console.error('Soft delete ticket error:', error);
    return { success: false, error: 'Failed to delete ticket.' };
  }
}
