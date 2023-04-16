import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-quartiers',
  templateUrl: './quartiers.component.html',
  styleUrls: ['./quartiers.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class QuartiersComponent implements OnInit {
  private apiUrl: string | undefined;
  quartiers: any[] = [];
  selectedData: any = {};
  isAdding: boolean = false;
  isEditing: boolean = false;


  displayConfirmationDelete = false;
  displayConfirmationDialog = false;
  dataForm = new FormGroup({
    title: new FormControl(''),
    missions: new FormControl(''),


  });
  constructor(private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  readonly API_URL = `${environment.apiUrl}/quartiers`;

  ngOnInit(): void {
    this.get();
  }
  clear(table: Table) {
    table.clear();
  }
  private handleError(error: any): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
  }


  get() {
    this.http.get<any[]>(`${this.API_URL}`).subscribe({
      next: data => {
        this.quartiers = data.filter(quartier => !quartier.deletedAt);
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });

  }
  add(quartier: any) {
    this.http.post<any>(`${this.API_URL}`, quartier).subscribe({
      next: data => {
        this.quartiers.push(data);
        this.isAdding = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rue ajoutée' });
        this.dataForm.reset();
        this.get();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }


  edit(id: number, quartier: any) {
    console.log(quartier)
    if (!quartier) {
      console.error('Données invalides', quartier);
      return;
    }
    // Vérifier chaque champ de la quartier et utiliser la valeur actuelle si le champ n'a pas été modifié
    const updatedRue = {
      title: quartier.title !== null ? quartier.title : this.selectedData.title,
      missions: quartier.missions !== null ? quartier.missions : this.selectedData.missions,

      // Ajouter les autres champs de la quartier ici si nécessaire
    };
    const url = `${this.API_URL}/${id}`;
    this.http.patch<any>(url, updatedRue).subscribe({
      next: data => {
        const index = this.quartiers.findIndex(r => r._id === data._id);
        this.quartiers[index] = data;
        this.selectedData = {};
        this.isEditing = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification effectuée' });
        this.dataForm.reset();
        this.get();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });

  }
  onConfirmDelete(mission: any) {
    this.displayConfirmationDelete = true;
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer cette mission ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete(mission._id);
      }
    });
  }
  delete(id: number) {
    this.http.delete<any>(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this.quartiers = this.quartiers.filter(r => r.id !== id);
        this.messageService.add({ severity: 'warn', summary: 'Suppression', detail: 'Rue effacée' });
        this.get();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });
  }
  deleteDeleted(): void {
    this.displayConfirmationDialog = true;
    //
  }

  confirmDeleteDeleted(): void {
    // Mettez ici le code pour supprimer définitivement les données supprimées
    const url = `${this.API_URL}/purge`;
    this.http.post(url, {}).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Toutes les données ont été complètement effacées' });
        this.get(); // Met à jour la liste
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.error.message });
      }
    });

    this.displayConfirmationDialog = false;
  }

  selectData(donnee: any) {
    this.selectedData = { ...donnee };
  }


  cancel() {
    this.selectedData = {};
    this.isAdding = false;
    this.isEditing = false;
  }

  toggleAdd() {
    this.isAdding = !this.isAdding;
    this.selectedData = {};
    this.dataForm.reset();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    console.log(this.selectedData)

  }

  search() {

    this.get();
  }
}


