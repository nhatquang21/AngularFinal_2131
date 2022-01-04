import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async signInGmail() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return await this.afAuth.signInWithPopup(provider).then((res) => {
      console.log(' login succesfully');
    });
  }

  signInFirebase(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  signUpFireBase(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, password).then(
        (res) => {
          var email = res.user?.email;
          resolve(email);
        },
        (err) => reject(err)
      );
    });
  }
  logOut() {
    this.afAuth.currentUser.then((res) => {
      this.afAuth.signOut();
    });
  }
}
