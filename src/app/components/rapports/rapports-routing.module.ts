import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RapportsComponent } from './rapports.component';

const routes: Routes = [{ path: '', component: RapportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportsRoutingModule { }
