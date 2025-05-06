import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';
import { Client, ClientResponse } from 'app/modules/models/client.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ClientServices {
    private clientsSubject = new BehaviorSubject<Client[]>([]);
    public clients$ = this.clientsSubject.asObservable();

    constructor(private http: HttpClient) {}

    getAllClient(nextUrl?: string): Observable<ClientResponse> {
        const url = nextUrl || `${environment.base_url}/api/target-client/`;
        return this.http.get<ClientResponse>(url).pipe(
            tap((response) => {
                this.clientsSubject.next(response.results); 
            })
        );
    }

    getClientById(id: number): Observable<Client> {
        return this.http.get<Client>(
            `${environment.base_url}/api/target-client/${id}/`
        );
    }

    addClient(data: Client): Observable<Client> {
        return this.http.post<Client>(
            `${environment.base_url}/api/target-client/`,
            data
        ).pipe(
            tap((newClient) => {
                const updatedClients = [newClient, ...this.clientsSubject.value];
                this.clientsSubject.next(updatedClients);
            })
        );
    }

    editClient(id: number, updatedClient: Client): Observable<Client> {
        return this.http.put<Client>(
            `${environment.base_url}/api/target-client/${id}/`,
            updatedClient
        ).pipe(
            tap((editedClient) => {
                const updatedClients = this.clientsSubject.value.map(client =>
                    client.id === id ? editedClient : client
                );
                this.clientsSubject.next(updatedClients);
            })
        );
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete<any>(
            `${environment.base_url}/api/target-client/${id}/`
        ).pipe(
            tap(() => {
                const updatedClients = this.clientsSubject.value.filter(client => client.id !== id);
                this.clientsSubject.next(updatedClients);
            })
        );
    }
}
