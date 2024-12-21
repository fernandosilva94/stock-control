import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private cookieService: CookieService) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
          }
        },
        error: (err) => console.log("error: ", err)
      })
    }
  }

  onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUpUser(this.signUpForm.value as SignUpUserRequest).subscribe({
        next: (response) => {
          if (response) {
            alert('Usuário criado com sucesso.');
            this.signUpForm.reset();
            this.loginCard = true;
          }
        },
        error: (err) => console.log("error: ", err)
      })
    }
  }

}
