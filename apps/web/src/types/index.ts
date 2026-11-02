export type Role = 'worker' | 'employer';

export type ServiceSkill =
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'painter'
  | 'cleaning'
  | 'maid'
  | 'nurse'
  | 'salon';

export type PaymentMode = 'upi' | 'cash';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'completed'
  | 'tomorrow'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'marked_paid' | 'paid' | 'disputed';

export type OfferStatus = 'new' | 'accepted' | 'skipped';

export type NotificationType =
  | 'new_order'
  | 'quote_approved'
  | 'quote_received'
  | 'payment_marked'
  | 'payment_received'
  | 'order_update'
  | 'worker_assigned'
  | 'order_cancelled';

export type Language = 'en' | 'hi' | 'bn' | 'ta';

export type When = 'now' | 'tomorrow' | 'monthly';

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  skill?: ServiceSkill;
  area: string;
  rating: number;
  ratingCount: number;
  avatarInitials: string;
  visitCharge: number;
  dailyRate?: number;
  monthlySalary?: number;
  serviceRadiusKm: number;
  upiId?: string;
  available: boolean;
  workingHours: string;
  landmark?: string;
}

export interface WorkerPin {
  id: string;
  name: string;
  skill: ServiceSkill;
  rating: number;
  ratingCount: number;
  distanceKm: number;
  visitCharge: number;
  etaMinutes: number;
  area: string;
  initials: string;
  x: number;
  y: number;
}

export interface Offer {
  id: string;
  skill: ServiceSkill;
  employerName: string;
  employerArea: string;
  distanceKm: number;
  landmark: string;
  visitCharge: number;
  paymentMode: PaymentMode;
  timeLabel: string;
  when: When;
  status: OfferStatus;
  createdAt: string;
}

export interface QuoteItem {
  label: string;
  amount: number;
}

export interface Quote {
  labour: number;
  material: number;
  note?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}

export interface Order {
  id: string;
  skill: ServiceSkill;
  customerName: string;
  customerArea: string;
  landmark: string;
  distanceKm: number;
  visitCharge: number;
  paymentMode: PaymentMode;
  status: OrderStatus;
  when: When;
  timeLabel: string;
  rating?: number;
  quote?: Quote;
  totalAmount?: number;
  workerName?: string;
  workerInitials?: string;
  employerName?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  mode: PaymentMode;
  date: string;
  skill: ServiceSkill;
  party: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface MapMarker {
  id: string;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  home?: boolean;
  route?: boolean;
}

export interface VoiceState {
  status: 'idle' | 'recording' | 'processing' | 'speaking';
  transcript: string;
  aiReply: string;
}
