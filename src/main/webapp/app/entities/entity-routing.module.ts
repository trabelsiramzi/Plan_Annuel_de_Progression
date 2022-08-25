import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'affectation',
        data: { pageTitle: 'papApp.affectation.home.title' },
        loadChildren: () => import('./affectation/affectation.module').then(m => m.AffectationModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'papApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'projet',
        data: { pageTitle: 'papApp.projet.home.title' },
        loadChildren: () => import('./projet/projet.module').then(m => m.ProjetModule),
      },
      {
        path: 'entretien',
        data: { pageTitle: 'papApp.entretien.home.title' },
        loadChildren: () => import('./entretien/entretien.module').then(m => m.EntretienModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
