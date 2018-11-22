import { InicioPage } from './../pages/inicio/inicio';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from "./../pages/home/home";
import { Storage } from '@ionic/storage';
import { timer } from "rxjs/observable/timer";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;
  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    platform.ready().then(() => {
      this.storage.get('primerInicio2').then((val) => {
        console.log(val);
        if(val==null){
          console.log('Primer Inicio es:', val);
           this.storage.set('primerInicio2', 'false');
           this.rootPage=InicioPage;
         }
         else
         this.rootPage=HomePage;
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(()=>{
        this.showSplash=false;
      });
    });
  }
}

