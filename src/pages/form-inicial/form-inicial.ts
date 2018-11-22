import { SeleccionPage } from './../seleccion/seleccion';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-form-inicial',
  templateUrl: 'form-inicial.html',
})
export class FormInicialPage {
  duracion: string;
  nomPescador: string;
  nomEmbarcacion: string;
  nomCapitan: string;
  datosForm:string[];
  data:string;
  datosFoto: any[];
  nomLocacion: string;
  fecha: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast : ToastController) {
    this.data = navParams.get('data');
    this.datosForm = navParams.get('datosForm');
    console.log(this.datosForm);
    this.datosFoto = navParams.get('datosFoto');
    this.fecha = navParams.get('timestamp')
    console.log("Timestamp capturado: ");
    console.log(this.fecha);
  }

  ionViewDidLoad() {
    console.log('Se ha cargado correctamente la página de FormInicial');
    if(this.datosForm!=null){
      this.duracion=this.datosForm[0];
      this.nomPescador=this.datosForm[1];
      this.nomEmbarcacion=this.datosForm[2];
      this.nomCapitan=this.datosForm[3];
      this.nomLocacion=this.datosForm[4];
    }
  }

  continuar(){
    console.log(this.duracion,this.nomPescador,this.nomEmbarcacion,this.nomCapitan);
    console.log(this.duracion);
    if(this.duracion!=undefined && this.nomLocacion!=undefined){
      if(this.duracion!="" && this.nomLocacion!=""){
        this.datosForm = [this.duracion,this.nomPescador,this.nomEmbarcacion,this.nomCapitan,this.nomLocacion];
        this.navCtrl.setRoot(SeleccionPage,  {datosForm:this.datosForm, data:this.data, datosFoto:this.datosFoto, timestamp:this.fecha});
      } 
      else{
        this.toast.create({
          message: "El campo de duración y localidad son obligatorios!",
          duration: 5000,
          position: 'top'
        }).present();
      }
    }else{
      this.toast.create({
        message: "El campo de duración es obligatorio!",
        duration: 5000,
        position: 'top'
      }).present();
    }
  }

  salir(){
    this.navCtrl.setRoot(HomePage);
  }
}
