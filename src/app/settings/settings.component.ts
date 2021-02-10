import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { User, UserService } from '../core';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  user: User = {} as User;
  settingsForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // create form group using the form builder
    this.settingsForm = this.fb.group({
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    });
    // Optional: subscribe to changes on the form
    // this.settingsForm.valueChanges.subscribe(values => this.updateUser(values));
  }

  ngOnInit() {
   // Создаем новую копию объекта текущего пользователя для размещения в редактируемых полях формы
    Object.assign(this.user, this.userService.getCurrentUser());//данные из user.service
    // Заполните форму
    console.log(this.user)
    this.settingsForm.patchValue(this.user);

  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  submitForm() {
    this.isSubmitting = true;
// update the model
    this.updateUser(this.settingsForm.value);



    this.userService.update(this.user)//Update the user on the server (email, pass, etc)
    .subscribe(
      updatedUser => this.router.navigateByUrl('/profile/' + updatedUser.username),//меняем название в линк
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }

  updateUser(values: Object) {

    Object.assign(this.user, values);//values: this.settingsForm.value
  }

}
