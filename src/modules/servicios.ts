import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAUcd25QH9Kk1604nHcWPttPAxw_gaSQ1U",
      authDomain: "pesqueros-5ffbc.firebaseapp.com",
      databaseURL: "https://pesqueros-5ffbc.firebaseio.com",
      projectId: "pesqueros-5ffbc",
      storageBucket: "pesqueros-5ffbc.appspot.com",
      messagingSenderId: "621304532810"
  };
  export default !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

@Injectable()
export class ServiciosFireBase {
 
    constructor() {
        
    }
 
    someFunction(){
        console.log("Esto funciona a la perfección!");
    }
 
}