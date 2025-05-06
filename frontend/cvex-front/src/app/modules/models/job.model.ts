export interface Job {
    id: number;
    file_name: string;
    destination: string;
    job_status: string;
    description?: string | null;
    embedding?: any | null;
    location?: string | null;
    note?: string | null;
    salaire_minimum?: number | null;
    salaire_maximum?: number | null;
    start_date?: string | null;
    target_client?: number | null;
}

export interface JobResponse {
    results: Job[];
    count: number;
    next: string | null;
    previous: string | null;
}
export interface FileData {
    id: number; // Converti en string
    file_name: string;
    description: string | null;
    location: string | null;
    salaire_minimum: number | null; // Converti en string
    salaire_maximum: number | null; // Converti en string
    note: string | null;
    destination: string;
    start_date: string | null;
    job_status: string;
    embedding: string | null;
    target_client: number; // Converti en string
}
