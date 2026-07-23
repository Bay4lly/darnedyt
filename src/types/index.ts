export enum Role {
  USER = 'USER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  ANSWERED = 'ANSWERED',
  CLOSED = 'CLOSED',
  SPAM = 'SPAM',
}

export enum TicketPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketCategory {
  SPONSORSHIP = 'SPONSORSHIP',
  BUSINESS = 'BUSINESS',
  COLLABORATION = 'COLLABORATION',
  SUPPORT = 'SUPPORT',
  COPYRIGHT = 'COPYRIGHT',
  OTHER = 'OTHER',
}
