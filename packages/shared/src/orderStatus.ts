// App-wide enums. NOTE: packages/db/src/schema.ts repeats the same values in its pgEnums
// (drizzle-kit cannot import workspace packages), so keep both in sync.
export const ROLES = ['WORKER', 'EMPLOYER'] as const;
export type Role = (typeof ROLES)[number];

export const JOB_TYPES = ['ON_DEMAND', 'SCHEDULED', 'LONG_TERM'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_SIZES = ['SMALL', 'HALF_DAY', 'FULL_DAY'] as const;
export const PAYMENT_MODES = ['CASH', 'UPI'] as const;
export const QUOTE_STATUSES = ['NONE', 'SENT', 'APPROVED', 'REJECTED'] as const;
export const PAYMENT_STATUSES = ['PENDING', 'EMPLOYER_MARKED_PAID', 'PAID', 'DISPUTED'] as const;

// Request = what the employer asked for. Order (match) = one worker offered/assigned to it.
export const REQUEST_STATUSES = ['SEARCHING', 'PROPOSED', 'ASSIGNED', 'NO_MATCH', 'CANCELLED'] as const;

export const ORDER_STATUSES = [
  'PROPOSED', // AI showed this worker to the employer (map icon)
  'EMPLOYER_REJECTED', // employer skipped this worker
  'SENT', // employer accepted, request sent to worker
  'ACCEPTED', // worker accepted
  'REJECTED', // worker skipped
  'EXPIRED', // worker did not answer in time
  'ON_THE_WAY', // worker left, live location on
  'ARRIVED',
  'ACTIVE', // long-term hire running (maid / nurse)
  'COMPLETED',
  'CANCELLED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PROPOSED: ['SENT', 'EMPLOYER_REJECTED', 'CANCELLED'],
  SENT: ['ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
  ACCEPTED: ['ON_THE_WAY', 'ACTIVE', 'CANCELLED'],
  ON_THE_WAY: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['COMPLETED', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED'],
  EMPLOYER_REJECTED: [],
  REJECTED: [],
  EXPIRED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export const canTransition = (from: OrderStatus, to: OrderStatus) => TRANSITIONS[from].includes(to);
export const isTerminal = (s: OrderStatus) => TRANSITIONS[s].length === 0;