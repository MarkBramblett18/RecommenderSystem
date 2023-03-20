import { Component, OnInit } from '@angular/core';

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

  constructor(private router: Router) {
    this.signupForm = new FormGroup({
      'displayName': new FormControl('', Validators.required),
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

    this.errorMessage = "disp name: " + this.signupForm.value.displayName +" email: " + this.signupForm.value.email + " pass: " + this.signupForm.value.password
  }


}
