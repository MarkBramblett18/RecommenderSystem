import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    });

    this.errorMessage = '';
  }

  ngOnInit(): void {

  }

  //login the user
  loginUser() {
    if (this.loginForm.invalid)
      return;
    this.http.post('http://localhost:8000/login', this.loginForm.getRawValue(), {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['/dashboard']));
    this.errorMessage = "Incorrect email or password.";
  }
}
