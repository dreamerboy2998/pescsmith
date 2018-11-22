import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeleccionPage } from './seleccion';

@NgModule({
  declarations: [
    SeleccionPage,
  ],
  imports: [
    IonicPageModule.forChild(SeleccionPage),
  ],
})
export class SeleccionPageModule {}
