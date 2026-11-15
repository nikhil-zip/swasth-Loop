export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type TimestampColumns = {
  created_at: string;
};

type SubmittedColumns = {
  submitted_at: string;
};

export type AccountRole = "patient" | "doctor" | "admin";
export type DoctorApplicationStatus = "pending" | "approved" | "rejected";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed"
  | "no_show";

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        TimestampColumns & {
          id: string;
          full_name: string;
          role: AccountRole;
          updated_at: string;
        },
        { id: string; full_name: string; role?: AccountRole },
        { full_name?: string }
      >;
      specialties: Table<
        TimestampColumns & { id: string; name: string; slug: string; is_active: boolean },
        { id?: string; name: string; slug: string; is_active?: boolean }
      >;
      doctor_verification_applications: Table<
        SubmittedColumns & {
          id: string;
          applicant_id: string;
          specialty_id: string;
          registration_authority: string;
          registration_number: string;
          qualifications: string;
          years_experience: number;
          status: DoctorApplicationStatus;
          reviewed_at: string | null;
          reviewed_by: string | null;
          review_note: string | null;
        },
        {
          id?: string;
          applicant_id: string;
          specialty_id: string;
          registration_authority: string;
          registration_number: string;
          qualifications: string;
          years_experience: number;
          status?: DoctorApplicationStatus;
        }
      >;
      doctor_profiles: Table<
        TimestampColumns & {
          user_id: string;
          specialty_id: string;
          qualifications: string;
          years_experience: number;
          biography: string | null;
          is_verified: boolean;
          verified_at: string | null;
          verified_by: string | null;
          updated_at: string;
        },
        {
          user_id: string;
          specialty_id: string;
          qualifications: string;
          years_experience: number;
          is_verified?: boolean;
        }
      >;
      clinics: Table<
        TimestampColumns & {
          id: string;
          name: string;
          address_line: string;
          locality: string | null;
          city: string;
          state: string;
          postal_code: string | null;
          is_active: boolean;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          address_line: string;
          locality?: string | null;
          city?: string;
          state?: string;
          postal_code?: string | null;
          is_active?: boolean;
        }
      >;
      doctor_clinics: Table<
        TimestampColumns & {
          doctor_user_id: string;
          clinic_id: string;
          is_primary: boolean;
          is_approved: boolean;
        },
        { doctor_user_id: string; clinic_id: string; is_primary?: boolean }
      >;
      appointments: Table<
        TimestampColumns & {
          id: string;
          patient_user_id: string;
          doctor_user_id: string;
          requested_for: string;
          status: AppointmentStatus;
          updated_at: string;
        },
        {
          id?: string;
          patient_user_id: string;
          doctor_user_id: string;
          requested_for: string;
          status?: AppointmentStatus;
        }
      >;
      appointment_status_history: Table<
        { id: number; appointment_id: string; previous_status: AppointmentStatus | null; new_status: AppointmentStatus; changed_by: string | null; changed_at: string },
        { appointment_id: string; previous_status?: AppointmentStatus | null; new_status: AppointmentStatus; changed_by?: string | null }
      >;
      notifications: Table<
        TimestampColumns & {
          id: string;
          recipient_user_id: string;
          notification_type: "account" | "doctor_application" | "appointment";
          title: string;
          message: string;
          read_at: string | null;
        },
        {
          id?: string;
          recipient_user_id: string;
          notification_type: "account" | "doctor_application" | "appointment";
          title: string;
          message: string;
          read_at?: string | null;
        },
        { read_at?: string | null }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: { Args: Record<string, never>; Returns: AccountRole | null };
      review_doctor_application: {
        Args: { application_id: string; decision: DoctorApplicationStatus; note?: string | null };
        Returns: undefined;
      };
    };
    Enums: {
      account_role: AccountRole;
      doctor_application_status: DoctorApplicationStatus;
      appointment_status: AppointmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
