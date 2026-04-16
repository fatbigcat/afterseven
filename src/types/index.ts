export interface Event {
  id: string;
  title: string;
  event_date: string;
  capacity: number;
  spots_remaining: number;
  email_content: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  party_size: number;
  reservation_code: string;
  created_at: string;
}

export interface ReservationInput {
  full_name: string;
  email: string;
  party_size: number;
}

export interface ReservationResult {
  success: true;
  reservation_code: string;
  reservation_id: string;
  event_title: string;
  event_date: string;
  party_size: number;
}

export interface DashboardData {
  event: Event | null;
  reservations: Reservation[];
}

export interface CreateEventInput {
  title: string;
  event_date: string;
  capacity: number;
  email_content: string;
}
