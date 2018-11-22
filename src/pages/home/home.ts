
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ToastController } from 'ionic-angular';
import { FormInicialPage } from './../form-inicial/form-inicial';
import { DatabaseProvider } from '../../providers/database/database';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
var array: {} = [{}];
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  fecha: Date;
  constructor(public navCtrl: NavController,
              private diagnostic: Diagnostic, 
              public toast: ToastController, 
              private database: DatabaseProvider,
              public backgroundMode: BackgroundMode,
              public network: Network) {
  }

  ionViewDidEnter(){
    this.database.openSQLiteDatabase().then(opened=>{
      console.log(opened);
         this.database.obtenerInformes().then(res=>{
         console.log(res)
      });
    });
  }
  
  ionViewDidLoad(){
   console.log("Ha cargado perfectamente la página Inicio")
  }

  nuevoInforme(){
    this.fecha = new Date();
    this.navCtrl.setRoot(FormInicialPage, {timestamp:this.fecha});
  }
  comprobarGps(){
    this.diagnostic.isLocationEnabled().then((result)=>{
      if(result==false){
      this.toast.create({
        message: "Porfavor encienda los servicios de Ubicación, y vuelva a intentarlo.",
        duration: 5000,
        position: 'top'
      }).present();
    }
    else{
      this.diagnostic.isWifiEnabled().then(state=>{
        if(state==false){
          this.toast.create({
            message: "Porfavor encienda el servicios WiFi (Mejorar triangulación GPS), y vuelva a intentarlo.",
            duration: 5000,
            position: 'top'
          }).present();
        }
        else
          this.nuevoInforme();
      });
    }
    }, (error)=>{
      console.log("Ha ocurrido un error.");
    });
  }

}
