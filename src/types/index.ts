// Shared API types.

export type Role = 'youth' | 'nvo' | 'admin';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Nvo {
  id: number;
  user_id: number;
  organization_name: string;
  pib: string | null;
  website: string | null;
  description: string | null;
  intro_message: string | null;
  verified: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  date_of_birth: string | null;
  city: string | null;
  education_level: string | null;
  avatar: string | null;
  bio: string | null;
  email_verified_at: string | null;
  interests?: Category[];
  nvo?: Nvo | null;
  created_at: string;
}

export type CallType =
  | 'seminar'
  | 'conference'
  | 'education'
  | 'camp'
  | 'competition'
  | 'course'
  | 'workshop'
  | 'mentorship'
  | 'volunteering';

export type CallStatus = 'active' | 'finished' | 'cancelled';

export interface CallNvoSummary {
  id: number;
  name: string;
  organization_name: string;
  verified: boolean;
}

export interface Call {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  type: CallType;
  application_deadline: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  is_online: boolean;
  max_participants: number | null;
  price: number;
  is_free: boolean;
  prerequisites: string[];
  status: CallStatus;
  views: number;
  average_rating: number;
  applications_count?: number;
  categories?: Category[];
  nvo?: CallNvoSummary;
  is_saved?: boolean;
  has_applied?: boolean;
  created_at: string;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Application {
  id: number;
  status: ApplicationStatus;
  message: string | null;
  created_at: string;
  call?: Call;
  user?: {
    id: number;
    name: string;
    email: string;
    city: string | null;
    education_level: string | null;
    interests: Category[];
  };
}

export interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: { id: number; name: string };
  call?: { id: number; title: string };
}

export interface Paginated<T> {
  data: T[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface NvoStats {
  calls_count: number;
  active_calls: number;
  applications_count: number;
  pending_applications: number;
  total_views: number;
  total_saves: number;
  average_rating: number;
  recent_feedbacks: Feedback[];
}

export interface PlatformStats {
  nvos: number;
  calls: number;
  youth: number;
  applications: number;
}
