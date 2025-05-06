export interface Client {
    id: number;
    client: number;
    nom_client: string;
    location: string;
    adresse: string;
    ville: string;
    code_postale: string;
    telephone: string;
    mobile: string;
    courriel: string;
    site_web: string;
    langue: string;
}
export interface ClientResponse {
    results: Client[];
    count: number;
    next: string | null;
    previous: string | null;
}