import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;
  
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmitLoginForm(): void {
    console.log("Dados do formulario de login: ", this.loginForm.value)
  }

  onSubmitSignUpForm(): void {
    console.log("Dados do formulario de criação de conta: ", this.signUpForm.value)
  }

}
