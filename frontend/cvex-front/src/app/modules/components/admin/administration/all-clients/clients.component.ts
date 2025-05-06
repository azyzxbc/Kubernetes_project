import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StateService } from 'app/shared/services/serviceState';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientServices } from 'app/shared/services/client.services';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { DetailClientComponent } from '../detail-client/detail-client.component';
import { Client, ClientResponse } from 'app/modules/models/client.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
    @ViewChild(MatTable) table!: MatTable<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    cards = [{ title: 'placement' }];
    url: any;
    clientForm: FormGroup;
    modalVisible: boolean = false;
    fileDataSource = new MatTableDataSource<Client>();
    originalFileNames: Client[] = [];
    displayedColumns: string[] = [
        'id',
        'nom_client',
        'adresse',
        'ville',
        'telephone',
        'code_postale',
        'actions',
    ];
    currentPage: number | any;
    totalItems: number;
    searchValue: string;
    nextPage: string;
    previousPage: string;
    tooltipVisible = false;
    selectedClient: Client = null;
    isLoading: boolean = false;
    private unsubscribe$ = new Subject<void>();

    /**
     * Constructor
     */
    constructor(
        private clientServices: ClientServices,
        private router: Router,
        private stateService: StateService,
        private dialog: MatDialog
    ) {}
    ngOnInit(): void {
                this.clientServices.getAllClient().subscribe();

        this.clientServices.clients$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((clients) => {
                this.fileDataSource.data = clients;
                this.totalItems = clients.length; 
            });
    
    }

    loadClients(nextUrl?: string): void {
        this.isLoading = true;
        this.clientServices
            .getAllClient(nextUrl)
            .pipe(
                tap((data) => {
                    this.fileDataSource.data = data.results;
                    this.totalItems = data.count;
                    this.nextPage = data.next;
                    this.previousPage = data.previous;
                }),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                error: (err) => {
                    console.error('Error loading clients', err);
                    this.isLoading = false;
                },
            });
    }

    deleteClient(clientId: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the client.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                this.clientServices.deleteClient(clientId).subscribe(() => {
                    Swal.fire(
                        'Deleted!',
                        'The client has been successfully deleted.',
                        'success'
                    );
                });
            }
        });
    }
    
    viewClientDetails(client: Client): void {
        this.dialog.open(DetailClientComponent, {
            width: '700px',
            data: client,
        });
    }
    viewEditClient(idClient: number): void {
        this.clientServices.getClientById(idClient).subscribe((client) => {
            const dialogRef = this.dialog.open(EditClientComponent, {
                width: '700px',
                data: client,
                disableClose: true,
            });

            dialogRef
                .afterClosed()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((updatedClient: Client) => {
                    if (updatedClient) {
                        // No manual refresh needed, auto-refresh will handle it
                    }
                });
        });
    }

    refreshData(): void {
        this.isLoading = true;
        this.clientServices
            .getAllClient()
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (data: ClientResponse) => {
                    this.fileDataSource.data = data.results;
                    this.totalItems = data.count;
                    this.nextPage = data.next;
                    this.previousPage = data.previous;
                    this.currentPage = 1;
                },
                error: (error) => {
                    console.error('Error refreshing data:', error);
                },
            });
    }

    onButtonClicked(card: any): void {
        this.stateService.setCardState(card);
        this.router.navigate(['Travail/PlusDetails']);
    }
    toggleTooltip() {
        this.tooltipVisible = !this.tooltipVisible;
    }
    getStatusColor(status: string): string {
        switch (status) {
            case 'open':
                return '#8bc34a'; // Soft Green for Open
            case 'on hold':
                return '#f1c40f'; // Yellow for On Hold
            case 'completed':
                return '#388e3c'; // Dark Green for Completed
            case 'canceled':
                return '#e74c3c'; // Blue for Canceled
            default:
                return '#000000'; // Default color (Black)
        }
    }

    applyFilter(query: string): void {
        this.fileDataSource.filterPredicate = (
            data: Client,
            filter: string
        ) => {
            return data.nom_client.toLowerCase().includes(filter);
        };
        this.fileDataSource.filter = query.trim().toLowerCase();
    }

    handlePageEvent(event: PageEvent): void {
        const nextUrl =
            event.pageIndex > this.currentPage - 1
                ? this.nextPage
                : this.previousPage;

        this.clientServices.getAllClient(nextUrl).subscribe(
            (data: ClientResponse) => {
                this.fileDataSource.data = data.results; // Remplace les données du tableau
                this.totalItems = data.count; // Met à jour le total des éléments
                this.nextPage = data.next; // URL de la prochaine page
                this.previousPage = data.previous; // URL de la page précédente
                this.currentPage = event.pageIndex + 1; // Met à jour la page actuelle
            },
            (error) => {
                console.error(
                    'Erreur lors du chargement des données de pagination',
                    error
                );
            }
        );
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
