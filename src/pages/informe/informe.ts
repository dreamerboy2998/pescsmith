import { SeleccionPage } from './../seleccion/seleccion';
import { HomePage } from './../home/home';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController } from 'ionic-angular';
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs";
import { DatabaseProvider } from '../../providers/database/database';
//Variables Globales
let docID;


@IonicPage()
@Component({
  selector: 'page-informe',
  templateUrl: 'informe.html',
})
export class InformePage {
  
  //Declaración de variables
  conectedSub:  Subscription
  disconectedSub:  Subscription
  percentage: number=0;
  data: string;
  datosForm: string[];
  datosFoto: any[];
  carga: boolean;
  captura: boolean;
  buffer: ArrayBuffer;
  urlFoto: string;
  image:any;
  picname:any;
  pictures: firebase.storage.Reference;
  position: Geoposition;
  lat: number;
  long: number;
  fecha: Date;
  conexion: boolean;
  //Constructor, maneja los datos y mantiene la comunicación entre la selección de picudos y la página principal del informe.
  constructor(private camara: Camera, public navCtrl: NavController, public navParams: NavParams, public toast: ToastController,
     public geoloca: Geolocation, private diagnostic: Diagnostic, private alertCtrl: AlertController, private network: Network, private database : DatabaseProvider) {
      if(!this.isConnected()){
        this.conexion=false;
      }
      else{
        this.conexion=true;
      }

      this.data = navParams.get('data');
      this.datosForm=navParams.get('datosForm');
      this.datosFoto=navParams.get('datosFoto');
      this.fecha = navParams.get('timestamp');
      console.log("Picudos capturados:");
      console.log(this.data);
      console.log("Datos capturados:");
      console.log(this.datosForm);
      console.log("Foto capturada:");
      console.log(this.datosFoto);
      console.log("Timestamp capturado: ");
      console.log(this.fecha);
      
  }

  //Método que se ejecuta al cargar la página, comprueba si está vacío el arreglo de los picudos, lo cual solo sucede una vez 
  //iniciado el informe, lo cual permite que este mesaje se muestre en un toast una sola vez. A su vez, verifica si el nombre de
  //la imagen y la imagen son null, para reasignar los contenidos en las etiquetas del documento html principal del informe.
  
  ionViewDidLoad() {
    console.log('Se ha cargado página de selección de foto correctamente!');
    console.log(this.datosFoto);
      this.picname=this.datosFoto[0];
      this.image=this.datosFoto[1];
      console.log(this.picname);
      console.log(this.image);
    //Se comprueba la data del arreglo.
    if(this.data==null){
      this.toast.create({
      message: "Por favor, encender Wifi y datos móviles para obtener con mayor precisión su ubicación. Omitir este aviso si los tiene activados",
      duration: 7000,
      position: 'top'
      }).present();
    }

    //Verifica si el nombre de la imagen y la imagen tienen algún dato para mostrarlos al abrir la página de informe.

    if(this.picname!=null && this.image!=null){
        document.getElementById("infoselec").innerHTML=`Imagen obtenida: `;
        document.getElementById("nomFoto").innerHTML=`<span>${this.picname}.jpg</span>`;
        document.getElementById("imagen").innerHTML=`<img src="${this.image}" alt="imagencapturada" />`;
    }
  }

  
    //Método que da inicio a la vista de la página de selección de picudos.
    seleccionPicudos(){
      this.navCtrl.push(SeleccionPage, {data:this.data});
    }

    isConnected(): boolean {
      let conntype = this.network.type;
      return conntype && conntype !== 'unknown' && conntype !== 'none';
    }


    comprobarConexion(){
      this.disconectedSub = this.network.onDisconnect().subscribe(() => {
      this.conexion=false
      console.log(this.conexion);
      });

      this.conectedSub = this.network.onConnect().subscribe(() => {
      this.conexion=true
      console.log(this.conexion);
      });
  }
  //Método de Geolocalización, da como resultado el punte referencial gps de latitud y longitud el cual el usuario está ubicado.
  geolocation(){
    this.diagnostic.isLocationEnabled().then((result)=>{
        if(result==false){
          this.toast.create({
            message: "Porfavor encienda los servicios de Ubicación, y vuelva a intentarlo.",
            duration: 5000,
            position: 'top'
          }).present();
        } 
        else{
          this.geoloca.getCurrentPosition().then((geoposition: Geoposition)=>{
          this.position=geoposition;
          this.lat = geoposition.coords.latitude;
          this.long = geoposition.coords.longitude;
          console.log(this.position); 
          document.getElementById("coorconfi").innerHTML=`<span style='color:green;'>Ubicación obtenida correctamente!</span>`;
        },
      
        (error)=>{
          alert(error);
            this.toast.create({
              message: "No se ha podido obtener localización",
              duration: 5000,
              position: 'top'
            }).present();
            console.log(error);
        });
      }
    }, (error)=>{
      alert(error)
        console.log("Ha ocurrido un error.");
       });
  }
  geolocationLocal(){
    return new Promise ((resolve, reject)=>{
         this.diagnostic.isLocationEnabled().then((result)=>{
        if(result==false){
          this.toast.create({
            message: "Porfavor encienda los servicios de Ubicación, y vuelva a intentarlo.",
            duration: 5000,
            position: 'top'
          }).present();
        } 
        else{
          this.geoloca.getCurrentPosition().then((geoposition: Geoposition)=>{
          this.position=geoposition;
          this.lat = geoposition.coords.latitude;
          this.long = geoposition.coords.longitude;
          resolve(geoposition);
          console.log(this.position); 
          document.getElementById("coorconfi").innerHTML=`<span style='color:green;'>Ubicación obtenida correctamente!</span>`;
        },
      
        (error)=>{
            this.toast.create({
              message: "No se ha podido obtener localización",
              duration: 5000,
              position: 'top'
            }).present();
            reject(error);
        });
      }
    }, (error)=>{
        console.log("Ha ocurrido un error.");
        reject(error);
       });
    });
 
  }
//Método de captura de imagen. Este abre la cámara y obtiene la foto capturada por el usuario, a su vez le asigna como nombre,
//la fecha y la hora de la captura, haciéndola única en la base de datos, para evitar sobreposición de datos o remplazo.
  async capturarImagen(){
    try{
      //Asignación de datos a variables.
      this.percentage=0;
      this.image=null;
      this.picname=null;
      
      //Limpia espacio en el html para el nuevo nombre de foto.
      
        document.getElementById("nomFoto").innerHTML=``;
      
      //Opciones de cámara para definir las especificaciones de la imagen nueva imagen que se irá a capturar.
      const options: CameraOptions = {
          quality: 50,
          destinationType : this.camara.DestinationType.DATA_URL,
          encodingType: this.camara.EncodingType.JPEG,
          mediaType: this.camara.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: true,
      };
    //Sentencia asíncrona que evita que la pantalla espere a que se ejecute la captura de la foto, aumentando el rendimiento de la aplicación.
     const result = await this.camara.getPicture(options);
    
     //Se asigna nombre y imagen a las variables respectivas.
     this.image = `data:image/jpeg;base64,${result}`;
     this.picname = `${new Date().getTime()}`;
     console.log(this.picname);
     this.datosFoto = [this.picname, this.image];

     //Se muestra previsualización de datos al usuario.
     document.getElementById("infoselec").innerHTML=`Imagen obtenida: `;
     document.getElementById("nomFoto").innerHTML=`<span>${this.picname}.jpg</span>`;
     document.getElementById("imagen").innerHTML=`<img src="${this.image}" alt="imagencapturada" />`;
     document.getElementById("porcentaje").innerHTML=` `;
    }
    catch(e){
      console.log(e);
    }
  }


  //Método de carga de imágenes
  async cargarImagen(){
    try{
      this.percentage=0;
      this.image=null;
      this.picname=null;
      
      //Limpia espacio en el html para el nuevo nombre de foto.
      
        document.getElementById("nomFoto").innerHTML=``;
    const options: CameraOptions = {
      sourceType: this.camara.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camara.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE,
    }
    const result = await this.camara.getPicture(options);
    this.image = `data:image/jpeg;base64,${result}`; 
    this.picname = `${new Date().getTime()}`;
    this.datosFoto = [this.picname, this.image];
    console.log(this.picname);
   
    document.getElementById("infoselec").innerHTML=`Imagen obtenida: `;
    document.getElementById("nomFoto").innerHTML=`<span>${this.picname}.jpg</span>`;
    document.getElementById("imagen").innerHTML=`<img src="${this.image}" alt="imagencapturada" />`;
    document.getElementById("porcentaje").innerHTML=` `;
    }
    catch(e){
      console.log(e);
    }
    
 }


  //Comprueba si se está capturando o subiendo una imagen.

  //Sube imagen si se está capturando
  subirimagen(){
  try{
    //Variables de subida
     let interim: number = 0; 
     this.pictures = firebase.storage().ref(`${this.picname}`);
     document.getElementById("nomFoto").innerHTML=`${this.picname}.jpg`;
     console.log(this.picname+".jpg");
     let FbPutString = this.pictures.putString(this.image, 'data_url');

     //Porcentajes de Subida
     let mySubscription = Observable.interval(50).subscribe( _ => {
        if (FbPutString.snapshot.totalBytes === FbPutString.snapshot.bytesTransferred) {
          interim = FbPutString.snapshot.bytesTransferred;
          this.percentage = parseInt(((interim / FbPutString.snapshot.totalBytes) * 100).toFixed(0));
          document.getElementById("nomFoto").innerHTML=`<span style='color:green;'>${this.picname}.jpg</span>`;
          document.getElementById("porcentaje").innerHTML=`<span style='color:green;'><ion-icon name="checkmark-circle"></ion-icon>${this.percentage}% - Completado!</span>`;
          document.getElementById("btnsubmit").innerHTML=`Confirmar envío`;
          this.toast.create({
            message: "Presione el botón \"Confirmar envío\" para completar el envío de la información!",
            duration: 5000,
            position: 'top'
          }).present();
          console.log(this.percentage);
          mySubscription.unsubscribe();
        }
        else if (interim === 0 && FbPutString.snapshot.bytesTransferred === 0 && this.percentage < 100) {
          this.percentage = this.percentage + 1;
        }
        else if (interim === 0 && FbPutString.snapshot.bytesTransferred !== 0) {
          interim = FbPutString.snapshot.bytesTransferred;
          (this.percentage < parseInt(((interim / FbPutString.snapshot.totalBytes) * 100).toFixed(0))) ? this.percentage = parseInt(((interim / FbPutString.snapshot.totalBytes) * 100).toFixed(0)) : (this.percentage = this.percentage);
        }
        else if(interim === FbPutString.snapshot.bytesTransferred && this.percentage < 100) {
          this.percentage = this.percentage + 1;
        }
        else {
          interim = FbPutString.snapshot.bytesTransferred;
          (this.percentage < parseInt(((interim / FbPutString.snapshot.totalBytes) * 100).toFixed(0))) ? this.percentage = parseInt(((interim / FbPutString.snapshot.totalBytes) * 100).toFixed(0)) : (this.percentage = this.percentage);
        }
        if(this.percentage<100) {
          document.getElementById("porcentaje").innerHTML=`${this.percentage}%`;
          console.log(this.percentage);
        }
        
        //Porcentajes de Subida
    });
    }
    catch(e){
      console.log(e);
      alert("Ha ocurrido un error con su conexión a internet, se enviarán los datos a la base de datos local.");
      this.conexion=false;
      this.localsubmit();
    }
    

   
  }

  localsubmit(){
    this.geolocationLocal().then((geoposition)=>{
      console.log(geoposition);
      console.log(this.lat);
      console.log(this.long);
      this.database.guardarInforme(this.datosForm[0], this.datosForm[1],this.datosForm[2], this.datosForm[3], this.datosForm[4], this.image, this.picname, this.lat, this.long, this.data, this.fecha).then(data=>{
            this.image=null;
            this.picname=null;
            this.pictures=null;
            this.navCtrl.setRoot(HomePage);
          }, error =>{
            alert(error);
          });
    });
  }


  finalizarInforme(){
    this.comprobarConexion();
    console.log("Status:" + this.conexion);
    if(!this.conexion){
      console.log("Status:" + this.conexion);
      alert("No hay conexión, se informe se almacenará localmente, cuando se encuentre internet será enviado el informe.");
      this.localsubmit();
    }
    else{
      this.submit();
    }
    
  }
  //Método de envío a la base de datos
   submit(){
      this.geolocation();
      this.subirimagen();
      if(this.percentage==100){  
        firebase.storage().ref().child(`${this.picname}`).getDownloadURL().then((url)=>{
          let db = firebase.firestore();
          db.collection("informes").add({
          duracion: this.datosForm[0],
          nomPescador:this.datosForm[1],
          nomEmbarcacion: this.datosForm[2],
          nomCapitan: this.datosForm[3],
          nomLocacion: this.datosForm[4],
          foto: url,
          posicionLatitud: this.lat,
          posicionLongitud: this.long,
          picudocap: this.data,
          timestamp: this.fecha
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          docID=docRef.id;
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
        this.toast.create({
          message: "Su informe se ha enviado correctamente!",
          duration: 5000,
          position: 'top'
        }).present();
        //Alerta de E-MAIL
        let alerta = this.alertCtrl.create({
          title: 'Desea compartir más información con nosotros?', 
          message: 'Nos pondremos en contacto con usted y cuéntenos con más detalle su experiencia en la pesca.',
          inputs: [
            {
              name: 'Email',
              type: 'email',
              placeholder: 'Introduzca su email aquí'
            },
            {
              name: 'Tel',
              type: 'text',
              placeholder: 'Introduzca su teléfono'
            },
          ],
          buttons: [
            {
              text: 'No en este momento',
              handler: () => {
                this.navCtrl.setRoot(HomePage);
              }
            },
            {
              text: 'Enviar email',
              handler: data => {
                if (data.Email != null) {
                  let db = firebase.firestore();
                  db.collection("correos").add({
                  documentoInformesDB: docID,
                  correo: data.Email,
                  telefono: data.Tel,
                  timestamp: this.fecha
              })
              .then(function(docRef) {
                  console.log("Documento escrito como: ", docRef.id);
              })
              .catch(function(error) {
                  console.error("Ha ocurrido un error: ", error);
              });
                } else {
                  alert("Debe colocar su email");
                  return false;
                }
              }
            }
          ]
        });
        alerta.present();
      }, (error)=>{ 
        alert('Error'+error);
      });
      this.image=null;
      this.picname=null;
      this.pictures=null;
      this.navCtrl.setRoot(HomePage);
        
      
      }
 
      
  }

  atras(){
    console.log(this.picname, this.image);
    console.log(this.datosFoto);
    this.navCtrl.setRoot(SeleccionPage, {data:this.data, datosForm: this.datosForm, datosFoto:this.datosFoto, timestamp:this.fecha});
  }
  //Método de salida
  salir(){
    this.navCtrl.setRoot(HomePage);
  }
}
