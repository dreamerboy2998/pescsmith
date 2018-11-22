import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

interface Informes {
  duracion: string,
  nomPescador:string,
  nomEmbarcacion: string,
  nomCapitan: string,
  nomLocacion: string,
  foto: string,
  nomfoto: string,
  posicionLatitud: number,
  posicionLongitud: number,
  picudocap: string,
  timestamp: string }

@Injectable()
export class DatabaseProvider {
  public arrayInformes : Array<Informes> = []
  private db : SQLiteObject;
  private isOpen : boolean; 
  private docID : string;

  //Variables de Firebase!
  private nomFoto: string = "";
  private duracion: string= "";
  private nomPescador:string= "";
  private nomEmbarcacion: string= "";
  private nomCapitan: string= "";
  private nomLocacion: string= "";
  private foto: string= "";
  private nomfoto: string= "";
  private posicionLatitud: number= 0;
  private posicionLongitud: number= 0;
  private picudocap: string= "";
  private timestamp: string= "";
  percentage: number=0;
  pictures: firebase.storage.Reference;
  constructor(public http: HttpClient, public storage: SQLite, public toast: ToastController, private alertCtrl: AlertController) {
    if(!this.isOpen){
      this.storage=new SQLite;
      this.storage.create({name: "data.db", location: "1"}).then((db:SQLiteObject)=>{
        this.db=db;
        db.executeSql("CREATE TABLE IF NOT EXISTS informes (id INTEGER PRIMARY KEY AUTOINCREMENT, duracion TEXT, nomPescador TEXT, nomEmbarcacion TEXT, nomCapitan TEXT, nomLocacion TEXT, foto TEXT, nomfoto TEXT, posicionLatitud DOUBLE, posicionLongitud DOUBLE, picudocap TEXT, timestamp TEXT)",[]);
        this.isOpen=true;
      }).catch(error =>{
        alert(error);
      });
    }
  }

  guardarInforme(duracion: string, nomPescador: string, nomEmbarcacion: string, nomCapitan: string, nomLocacion: string, foto: string, nomfoto: string, posicionLatitud: number, posicionLongitud: number, picudocap: string, timestamp: Date){
    return new Promise ((resolve, reject)=>{
      let sql="INSERT INTO informes (duracion, nomPescador, nomEmbarcacion, nomCapitan, nomLocacion, foto, nomfoto,posicionLatitud, posicionLongitud, picudocap, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      this.db.executeSql(sql, [duracion, nomPescador, nomEmbarcacion, nomCapitan, nomLocacion, foto, nomfoto, posicionLatitud, posicionLongitud, picudocap, timestamp]).then(data=>{
        resolve(data);
      }, (error)=>{
        reject(error);
      });
    });
  }

  openSQLiteDatabase(){
    return new Promise((resolve, reject) => {
      if(this.isOpen) {
        console.log("DB IS OPEN");
        resolve(this.isOpen);
      }
      else{
        console.log("DB IS NOT OPEN");
        this.storage.create({name: "data.db", location: "1"}).then(() => {
          this.isOpen = true;
            resolve(this.isOpen);
        }, error =>{
          reject(error);
        });
      }
    }
    );
  }
  
  subirimagen(picname: String, image:string){
    return new Promise((resolve,reject)=>{ 
       this.pictures = firebase.storage().ref(`${picname}`);
       console.log(picname+".jpg");
       this.pictures.putString(image, 'data_url').then(()=>{
        resolve(true)
       }, error =>{
         reject(error)
       });
       //Porcentajes de Subida
    });
  }
enviarInfo(nomFoto:string, foto:string, duracion:string, nomPescador:string, nomEmbarcacion:string, nomCapitan:string, nomLocacion:string, posicionLatitud:number, posicionLongitud:number, picudocap:string, timestamp:string){
  return new Promise((resolve, reject)=>{
              this.subirimagen(nomFoto, foto).then((value)=>{
              console.log(value);
              if(value){
                firebase.storage().ref().child(`${this.nomFoto}`).getDownloadURL().then((url)=>{
                  let db = firebase.firestore();
                  db.collection("informes").add({
                    duracion: duracion,
                    nomPescador: nomPescador,
                    nomEmbarcacion: nomEmbarcacion,
                    nomCapitan: nomCapitan,
                    nomLocacion: nomLocacion,
                    foto: url,
                    posicionLatitud: posicionLatitud,
                    posicionLongitud: posicionLongitud,
                    picudocap: picudocap,
                    timestamp: timestamp
              })
              .then(function(docRef) {
                  console.log("Document written with ID: ", docRef.id);
                  resolve("DONE!")
              })
              .catch(function(error) {
                  console.error("Error adding document: ", error);
              });
                this.toast.create({
                  message: "Su informe se ha enviado correctamente!",
                  duration: 5000,
                  position: 'top'
                }).present();
            this.arrayInformes.push({
              duracion: duracion,
              nomPescador: nomPescador,
              nomEmbarcacion: nomEmbarcacion,
              nomCapitan: nomCapitan,
              nomLocacion: nomLocacion,
              foto: foto,
              nomfoto: nomFoto,
              posicionLatitud: posicionLatitud,
              posicionLongitud: posicionLongitud,
              picudocap: picudocap,
              timestamp: timestamp
            });
              }, (error)=>{ 
                alert('Error'+error);
              });
              }
            }).catch((error)=>{
              console.log("Esto entró al catch");
              alert("ha ocurrido un error" + error);
              console.log(this.nomLocacion);
              reject("ERROR HAPPENTS: " + error)
            });
    this.arrayInformes.forEach(informe =>{
      console.log(informe)
    })
  })
}

  obtenerInformes(){
    return new Promise ((resolve, reject)=>{
      let sql ="SELECT * FROM informes"
      this.db.executeSql(sql, []).then(data=>{
        console.log(data);
        console.log("Entró correctamente: ");
        if(data.rows.length > 0){
          for(var i = 0; i<data.rows.length; i++){
            this.nomFoto = data.rows.item(i).nomfoto;
            this.foto = data.rows.item(i).foto;
            this.duracion = data.rows.item(i).duracion;
            this.nomPescador =data.rows.item(i).nomPescador;
            this.nomEmbarcacion = data.rows.item(i).nomEmbarcacion;
            this.nomCapitan = data.rows.item(i).nomCapitan;
            this.nomLocacion = data.rows.item(i).nomLocacion;
            this.posicionLatitud = data.rows.item(i).posicionLatitud;
            this.posicionLongitud = data.rows.item(i).posicionLongitud;
            this.picudocap = data.rows.item(i).picudocap;
            this.timestamp = data.rows.item(i).timestamp;
            console.log("Valor de nombre de foto es: " + this.nomFoto + " "+ i);
            this.enviarInfo(this.nomFoto,this.foto, this.duracion,this.nomPescador, this.nomEmbarcacion, this.nomCapitan, this.nomLocacion, this.posicionLatitud, this.posicionLongitud, this.picudocap,this.timestamp);

          }
        }
        resolve(this.arrayInformes);
      }, error =>{
        reject(error);
      });
    });
  }

}

