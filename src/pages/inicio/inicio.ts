import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InfoPage } from "../info/info";

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
  conexion: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  continuar(){
    this.navCtrl.setRoot(HomePage);
  }
  presentAlert() {
    this.navCtrl.push(InfoPage);
  }
}
