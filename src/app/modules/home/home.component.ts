import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();

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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private cookieService: CookieService,
    private messageService: MessageService, private router: Router) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard'])

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail:`Bem Vindo de volta ${response.name}!`,
              life: 2000
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:`Erro ao fazer login.`,
            life: 2000
          });
          console.log("error: ", err)}
      })
    }
  }

  onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUpUser(this.signUpForm.value as SignUpUserRequest).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response) {
            this.signUpForm.reset();
            this.loginCard = true;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail:`Usuário criado com sucesso!`,
              life: 5000
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:`Erro ao criar usuário.`,
            life: 2000
          });
          console.log("error: ", err)}
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
