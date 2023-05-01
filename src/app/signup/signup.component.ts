import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {
    this.signupForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    });
    this.errorMessage = '';
  }

  ngOnInit(): void {

  }

  //signup functionality
  signup() {
    if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
      return;
    this.http.post('http://localhost:8000/register', this.signupForm.getRawValue())
      .subscribe(() => this.router.navigate(['/login']));

    this.errorMessage = "Email already in use.";
  }


}
