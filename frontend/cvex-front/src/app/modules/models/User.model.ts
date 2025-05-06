export interface UserProfile {
    given_name?: string;
    family_name?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    sub?: string;
    updated_at?: string;
    user_metadata?: {
        company?: string;
        location?: string;
        id_client?: string;
        phone_number?: number;
    };
}

export interface UserRole {
    id: string;
    name: string;
    description: string;
}
