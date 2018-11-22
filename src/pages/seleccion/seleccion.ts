import { FormInicialPage } from './../form-inicial/form-inicial';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InformePage } from '../informe/informe';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-seleccion',
  templateUrl: 'seleccion.html',
})

export class SeleccionPage {
  picudo:string;
  data: string;
  datosForm:String[];
  datosFoto: any[];
  fecha: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController) {
    this.data = navParams.get('data');
    this.datosForm = navParams.get('datosForm');
    this.datosFoto = navParams.get('datosFoto');
    this.fecha = navParams.get('timestamp')

      console.log("Picudo Capturado");
      console.log(this.data);
      console.log("Datos obtenidos anteriormente");
      console.log(this.datosForm);
      console.log(this.datosFoto);
      console.log("Timestamp capturado: ");
      console.log(this.fecha);

  }

  ionViewDidLoad() {
    console.log('Se ha cargado correctamente página de selección de picudos!');
    this.picudo=this.data;
  }

  probarResult(){
    console.log(this.picudo);
    if(this.picudo != undefined){
      this.data=this.picudo;
      this.navCtrl.setRoot(InformePage, {data:this.data, datosForm:this.datosForm, datosFoto:this.datosFoto, timestamp:this.fecha});
    }
    else{
      this.toast.create({
        message: "Debe seleccionar el picudo capturado",
        duration: 5000,
        position: 'top'
      }).present();
    }
    
  }
  
  atras(){
    this.data=this.picudo;
    this.navCtrl.setRoot(FormInicialPage, {data:this.data, datosForm:this.datosForm, datosFoto:this.datosFoto, timestamp:this.fecha});
  }
  salir(){
    this.navCtrl.setRoot(HomePage);
  }

}
