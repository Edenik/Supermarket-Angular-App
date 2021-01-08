import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {this.createForm();}

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';


  createForm() {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryRegister(value) {
    this.authService.doRegister(value)
      .then(res => {
        this.errorMessage = "";
        this.successMessage = "Your account has been created, you will be redirected to user zone.";

        setTimeout(() => {
          this.router.navigate(['/auth/profile']);
        }, 1500);
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  ngOnInit(): void {
  }
}

