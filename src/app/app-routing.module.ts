import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Tu componente importado
import { GridPracticeComponent } from './grid-practice/grid-practice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bob', // O la ruta que tenías por defecto
    pathMatch: 'full'
  },
  {
    path: 'bob',
    loadChildren: () => import('./bob/bob.module').then(m => m.BobPageModule) 
    // ^^^ (Esta es tu ruta de Bob, puede verse un poco diferente, ¡déjala como estaba!)
  }, // <--- ¡ESTA COMA ES VITAL PARA QUE NO EXPLOTE!
  {
    path: 'grid-practice',
    component: GridPracticeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }