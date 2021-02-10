import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
     // Получаем последнюю часть URL-адреса (это либо логин, либо регистрация)
      this.authType = data[data.length - 1].path;//register or login

     // Устанавливаем заголовок для страницы соответственно
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
   // добавляем элемент управления формой для имени пользователя, если это страница регистрации
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {errors: {}};
console.log(this.authForm.value)
    const credentials = this.authForm.value;// {email: "kachmarsakolha@gmail.com", password: "19kiki03"}отправляет в userData в /user
    this.userService
    .attemptAuth(this.authType, credentials)
    .subscribe(
      data => this.router.navigateByUrl('/'),//перенапрапляет на home
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }

}

