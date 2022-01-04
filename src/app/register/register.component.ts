import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  signUpForm = this.fb.group({
    Email: ['', [Validators.email, Validators.required]],
    Password: ['', [Validators.required, Validators.minLength(6)]],
    ConfPassword: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private _auth: AuthService,
    private fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {}
  tryCreateAccount() {
    let email = this.signUpForm.controls['Email'].value;
    let pwd = this.signUpForm.controls['Password'].value;
    let confPwd = this.signUpForm.controls['ConfPassword'].value;
    if (pwd == confPwd) {
      this._auth
        .signUpFireBase(email, pwd)
        .then((res) => {
          alert('Tạo tài khoản thành công');
          this._router.navigate(['/home/table']);
        })
        .catch((err) => {
          if (err.code == 'auth/email-already-in-use') {
            window.alert('Tài khoản đã tồn tại');
          }
        });
    }
  }
}
