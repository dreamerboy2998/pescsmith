
//Módulos Nativos
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Páginas
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InformePage } from './../pages/informe/informe';
import { SeleccionPage } from './../pages/seleccion/seleccion';
import { FormInicialPage } from './../pages/form-inicial/form-inicial';
import { InicioPage } from './../pages/inicio/inicio';
import { InfoPage } from "../pages/info/info";


//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Servicios
import { ServiciosFireBase} from '../modules/servicios'

//Importaciones Librerías Nativas Cordova
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera'
import { SafeHtmlPipe } from '../pipes/safe-html/safe-html';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FilePath } from '@ionic-native/file-path';
import { DatabaseProvider } from '../providers/database/database';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicStorageModule } from '@ionic/storage';


export const firebaseConfig = {
  apiKey: "AIzaSyAUcd25QH9Kk1604nHcWPttPAxw_gaSQ1U",
    authDomain: "pesqueros-5ffbc.firebaseapp.com",
    databaseURL: "https://pesqueros-5ffbc.firebaseio.com",
    projectId: "pesqueros-5ffbc",
    storageBucket: "pesqueros-5ffbc.appspot.com",
    messagingSenderId: "621304532810"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InformePage,
    SafeHtmlPipe,
    SeleccionPage, 
    FormInicialPage,
    InicioPage,
    InfoPage
  ],
  
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InformePage,
    SeleccionPage,
    FormInicialPage,
    InicioPage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    ServiciosFireBase,
    FileChooser,
    File,
    Camera,
    Geolocation,
    Network,
    Diagnostic,
    AndroidPermissions,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLite,
    BackgroundMode,
  ]
})
export class AppModule {}
