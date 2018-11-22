import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormInicialPage } from './form-inicial';

@NgModule({
  declarations: [
    FormInicialPage,
  ],
  imports: [
    IonicPageModule.forChild(FormInicialPage),
  ],
})
export class FormInicialPageModule {}
