import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BobPage } from './bob.page';

const routes: Routes = [
  {
    path: '',
    component: BobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BobPageRoutingModule {}
