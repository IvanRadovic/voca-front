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
  headline: string | null;
  about: string | null;
  education: string | null;
  work_experience: string | null;
  skills: string | null;
  linkedin: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
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
  nvo_id: number | null;
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
  my_application_status?: ApplicationStatus | null;
  created_at: string;
}

export interface Mentor {
  id: number;
  name: string;
  title: string;
  bio: string | null;
  expertise: string[];
  avatar: string | null;
  linkedin: string | null;
}

export interface MentorAdmin {
  id: number;
  name: string;
  title: string;
  bio: string | null;
  expertise: string | null;
  avatar: string | null;
  email: string | null;
  linkedin: string | null;
  is_active: boolean;
  created_at: string;
}

export type PostType = "resource" | "blog";

export interface Post {
  id: number;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  published_at: string | null;
  author?: { id: number; name: string };
  can_edit?: boolean;
}

export interface Story {
  id: number;
  body: string;
  image: string | null;
  created_at: string;
  author?: { id: number; name: string; avatar: string | null; city: string | null };
  call?: { id: number; title: string };
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
    age: number | null;
    gender: string | null;
    headline: string | null;
    about: string | null;
    education: string | null;
    work_experience: string | null;
    skills: string | null;
    linkedin: string | null;
    phone: string | null;
    avatar: string | null;
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

export interface Gamification {
  counts: { applications: number; completed: number; reviews: number; certificates: number };
  level: {
    level: number;
    points: number;
    current_floor: number;
    next_threshold: number | null;
    progress: number;
  };
  badges: { key: string; earned: boolean }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string | null;
  points: number;
  level: number;
}

export interface Certificate {
  code: string;
  issued_at: string;
  recipient?: string;
  organization?: string;
  call?: { id: number; title: string; type: CallType };
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

export interface NvoAnalytics {
  period: number;
  calls_count: number;
  applications_count: number;
  by_status: { pending: number; accepted: number; rejected: number; completed: number };
  series: { month: string; applications: number; calls: number }[];
  age_distribution: { range: string; count: number }[];
  city_distribution: { city: string; count: number }[];
  top_categories: { name: string; count: number }[];
  total_views: number;
  average_rating: number;
}

export interface PublicNvo {
  nvo: {
    id: number;
    organization_name: string;
    description: string | null;
    intro_message: string | null;
    website: string | null;
    verified: boolean;
    member_since: string;
  };
  stats: { calls: number; applications: number; average_rating: number };
  calls: Call[];
}
