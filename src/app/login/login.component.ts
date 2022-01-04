import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myStorage = window.localStorage;
  loginForm = this.fb.group({
    Email: ['', [Validators.email, Validators.required]],
    Password: ['', [Validators.required, Validators.minLength(0)]],
  });
  constructor(
    private _auth: AuthService,
    private fb: FormBuilder,
    private _router: Router
  ) {}
  ngOnInit(): void {
    let isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this._router.navigate(['/home/table']);
    }
  }

  async tryGoogleLogin() {
    this._auth
      .signInGmail()
      .then((res) => {
        localStorage.setItem('isLoggedIn', 'true');
        this._router.navigate(['/home/table']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  tryCredentialsLogin() {
    let email = this.loginForm.controls['Email'].value;
    let pwd = this.loginForm.controls['Password'].value;
    this._auth
      .signInFirebase(email, pwd)
      .then((res) => {
        localStorage.setItem('isLoggedIn', 'true');
        this._router.navigate(['/home/table']);
      })
      .catch((err) => {
        window.alert('Sai thông tin đăng nhập');
      });
  }
}
