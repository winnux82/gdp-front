import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GetDataService } from 'src/app/services/getData/get-data.service';
import { Rapport } from 'src/app/interfaces/Rapports.interface';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dailie } from 'src/app/interfaces/Dailies.interface';

@Component({
    selector: 'app-create-rapport',
    templateUrl: './create-rapport.component.html',
    styleUrls: ['./create-rapport.component.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateRapportComponent implements OnInit {
    private apiUrl: string | undefined;
    rapports: Rapport[] = [];
    @ViewChild('table') table: Table | undefined;
    dataForm: FormGroup;
    agents: any[] = [];
    horaires: any[] = [];
    quartiers: any[] = [];
    quartierMissionsValidate: any[] = [];
    missions: any[] = [];
    vehicules: any[] = [];
    currentDate: any = Date;

    readonly API_URL = `${environment.apiUrl}/rapports`;
    readonly API_URL_DAILIE = `${environment.apiUrl}/dailies`;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private getDataService: GetDataService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.dataForm = this.formBuilder.group({
            daily: [{ value: '', disabled: true }, Validators.required],
            agents: ['', Validators.required],
            date: [new Date(), Validators.required],
            horaire: [''],
            vehicule: [''],
            quartiers: [''],
            quartierMissionsValidate: [''],
            missions: [''],
            notes: [[]],
            annexes: [[]],
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        console.log('ID de la route :', id);
        this.getDailieById(id);

        this.getDataService.agents$.subscribe(agents => {
            this.agents = agents.map(agent => ({
                value: agent._id,
                label: agent.matricule,
            }));
        });

        this.getDataService.horaires$.subscribe(
            horaires => {
                this.horaires = horaires.map(horaire => horaire.horaire);
            },
            error => {
                console.error(error);
            }
        );
        this.getDataService.quartiers$.subscribe(quartiers => {
            this.quartiers = quartiers.map(quartier => {
                // console.log(quartier); // Affiche les valeurs de quartier dans la console
                return {
                    value: quartier._id,
                    label: quartier.title,
                    missions: quartier.missions,
                };
            });
        });
        this.getDataService.missions$.subscribe(missions => {
            this.quartierMissionsValidate = missions.map(mission => ({
                value: mission._id,
                label: mission.title,
            }));
        });
        this.getDataService.missions$.subscribe(missions => {
            this.missions = missions.map(mission => ({
                value: mission._id,
                label: mission.title,
            }));
        });

        this.getDataService.vehicules$.subscribe(
            vehicules => {
                this.vehicules = vehicules.map(vehicule => vehicule.marque);
            },
            error => {
                console.error(error);
            }
        );
    }

    private handleError(error: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
        });
    }

    getDailieById(id: string) {
        const url = `${this.API_URL_DAILIE}/${id}`;
        this.http.get<Dailie>(url).subscribe({
            next: daily => {
                // console.log(daily);
                const date = daily?.date ? new Date(daily.date) : null;
                console.log('Daily récupéré :', daily);
                // console.log(daily.quartiers);
                // if (Array.isArray(daily.quartiers)) {
                //     const result = daily.quartiers.map(id => {
                //         const mission = this.missions.find(
                //             mission => mission._id === id
                //         );
                //         return {
                //             value: mission?._id,
                //             label: mission?.title,
                //         };
                //     });

                //     // Utilisez le résultat de la transformation ici
                //     console.log(result);
                // } else {
                //     // Gérez le cas où 'daily.quartiers' n'est pas un tableau
                //     console.error("daily.quartiers n'est pas un tableau.");
                // }

                // const quartierMissionsValidate =
                //     daily.quartiers.missions.map(quartierMissionId => {
                //         const mission = missions.find(
                //             mission =>
                //                 parseInt(mission._id) ===
                //                 quartierMissionId.toString()
                //         );
                //         return {
                //             value: mission?._id,
                //             label: mission?.title,
                //         };
                //     });
                this.dataForm.patchValue({
                    daily: id,
                    agents: daily.agents, // Supposant qu'il n'y a qu'un seul agent dans le tableau agents
                    date: date,
                    horaire: daily.horaire,
                    vehicule: daily.vehicule,
                    quartiers: daily.quartiers, // Supposant qu'il n'y a qu'un seul quartier dans le tableau quartiers
                    // quartierMissionsValidate: daily.quartierMissionsValidate,
                    missions: daily.missions, // Supposant qu'il n'y a qu'une seule mission dans le tableau missions
                    notes: daily.notes,
                });
            },
            error: error => {
                console.log(
                    'Erreur lors de la récupération du rapport :',
                    error
                );
            },
        });
    }

    addRapport(rapports: any) {
        // console.log(this.dataForm.value);
        this.dataForm.controls['vehicule'].getRawValue()?.toString();
        this.dataForm.controls['horaire'].getRawValue()?.toString();

        this.http.post<any>(`${this.API_URL}`, this.dataForm.value).subscribe({
            next: data => {
                this.rapports.push(data);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Rapport ajouté',
                });
                this.cancel();
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error.message,
                });
            },
        });
    }

    getCurrentDate(): Date {
        return new Date();
    }

    cancel() {
        this.dataForm.reset();
        this.router.navigate(['dailies']);
    }

    clear(table: Table) {
        table.clear();
    }

    resetForm() {
        this.dataForm.reset();
        this.dataForm.markAsPristine();
        this.dataForm.markAsUntouched();
    }

    fillWithCurrentDate() {
        this.currentDate = new Date();
        this.dataForm.patchValue({
            date: this.currentDate,
        });
    }
}
