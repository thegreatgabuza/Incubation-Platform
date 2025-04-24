import { Timestamp } from "firebase/firestore";

/**
 * This file defines the data models for the mentorship/consultancy feature.
 * These models should be used when creating or querying Firestore collections.
 */

/**
 * Participant model - extends the base user model with specific fields
 * for participants in the incubation program
 */
export interface Participant {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  stage: 'Ideation' | 'Validation' | 'MVP' | 'Growth' | 'Scale';
  needs: string[];
  biography?: string;
  joinDate: Timestamp;
  avatar?: string;
}

/**
 * Consultant model - represents mentors or consultants who provide guidance
 * to participants
 */
export interface Consultant {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  expertise: string[];
  biography?: string;
  availability: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
  };
  rating?: number;  // Average rating from all assignments
  totalSessions?: number;
  avatar?: string;
  joinDate: Timestamp;
  active: boolean;
}

/**
 * Assignment model - represents the relationship between a consultant and
 * a participant for mentorship
 */
export interface Assignment {
  id: string;
  participantId: string;
  participantName: string;
  consultantId: string;
  consultantName: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  createdBy: string;  // User ID who created the assignment
  lastSessionDate?: Timestamp;
  nextSessionDate?: Timestamp;
  notes?: string;
  sessions?: Session[];
}

/**
 * Session model - represents individual mentoring sessions between
 * a consultant and a participant
 */
export interface Session {
  id: string;
  assignmentId: string;
  date: Timestamp;
  duration: number;  // In minutes
  notes?: string;
  topics: string[];
  feedback?: Feedback;
  status: 'scheduled' | 'completed' | 'cancelled';
}

/**
 * Feedback model - represents feedback provided after a mentoring session
 */
export interface Feedback {
  id: string;
  sessionId: string;
  rating: number;  // 1-5 star rating
  comments?: string;
  providedBy: 'participant' | 'consultant';
  providedById: string;
  createdAt: Timestamp;
}

/**
 * Firestore collection names
 */
export const FIRESTORE_COLLECTIONS = {
  PARTICIPANTS: 'participants',
  CONSULTANTS: 'consultants',
  ASSIGNMENTS: 'assignments',
  SESSIONS: 'sessions',
  FEEDBACK: 'feedback'
}; 