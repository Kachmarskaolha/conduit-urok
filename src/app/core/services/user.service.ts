import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);//
  // BehaviorSubject (поведенческий сабж)
// const subject = new BehaviorSubject(0);
// subject.subscribe(x => console.log(x)); // в консоли: 0
// subject.next(1); // в консоли: 1
// subject.next(2); // в консоли: 2
// console.log(subject.getValue()) // в консоли: 2
// subject.subscribe(x => console.log(x)); // в консоли: 2
// subject.complete();
// При подписке поведенческий сабж уведомляет своего зрителя о последнем произошедшем в нём событии или, если в сабже ещё не происходило событий, создаёт для зрителя событие с изначальной информацией. Изначальная информация передаётся при создании поведенческого сабжа, в примере выше мы передаём 0 .
// Важно! Поведенческий сабж имеет полезный метод .getValue() , который возвращает информацию, содержавшеюся в последнем произошедшем в сабже событии.
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  // Любой вид сабжа может быть преобразован в зрелище с помощью метода .asObservable() .

//   distinctUntilChanged()
// Результирующая наблюдаемая изменяет своё значение, только если оно отличается от предыдущего значения. Для определения разницы между значениями по умолчанию используется обычное сравнение (то есть «===»). Опционально distinctUntilChanged() принимает функцию сравнения. Эта функция принимает два параметра — предыдущее и текущее значения преобразуемой наблюдаемой — и должна вернуть булевое значение —ложь, если старое значение отличается от нового, и истину, если старое значение не отличается от нового.
// Image for post
// http://rxmarbles.com/#distinctUntilChanged
// В следующих примерах функция of() создаёт наблюдаемую, которая поочерёдно принимает все переданные функции of() значения.
// Простой пример с числами:
// of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
//   .distinctUntilChanged()
//   .subscribe(x => console.log(x));
// В консоли: 1, 2, 1, 2, 3, 4

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
//   ReplaySubject (повторяющий сабж)

// При подписке повторяющий сабж уведомляет своего зрителя о всех произошедшем в нём событиях с момента создания. Для увеличения производительности, мы можем ограничить количество событий, повторяющихся для каждого нового зрителя:
// const subject = new ReplaySubject(2); // будут повторяться только 2 последних события, если не указывать, то все события
// subject.subscribe(x => console.log(x));
// subject.next(1); // в консоли: 1
// subject.next(2); // в консоли: 2
// subject.next(3); // в консоли: 3
// subject.subscribe(x => console.log(x));
// // в консоли:
// // 2
// // 3
// subject.complete();
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

// Проверяем JWT в localstorage с сервером и загружаем информацию о пользователях. // Это выполняется один раз при запуске приложения.
  populate() {
   // Если JWT обнаружен, пытаемся получить и сохранить информацию о пользователе
    if (this.jwtService.getToken()) {
      // console.log(this.jwtService.getToken())
      this.apiService.get('/user')//берет данные из auth.components   submitForm() и записывает в /user
      .subscribe(
        data => this.setAuth(data.user),
        err => this.purgeAuth()

      );
    } else {
      // Удаляем любые потенциальные остатки предыдущих состояний авторизации
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // console.log(user.token)
    // Сохраняем JWT, отправленный с сервера, в localstorage
    this.jwtService.saveToken(user.token);
     // Устанавливаем текущие пользовательские данные в наблюдаемые
    this.currentUserSubject.next(user);
    // Установите для isAuthenticated значение true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
  // Удаляем JWT из локального хранилища
    this.jwtService.destroyToken();
    // Устанавливаем текущего пользователя на пустой объект
    this.currentUserSubject.next({} as User);
     // Установите для isAuthenticated значение false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type, credentials): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post('/users' + route, {user: credentials})
      .pipe(map(
      data => {
        this.setAuth(data.user);
        return data;
      }
    ));
  }

  getCurrentUser(): User {
    // console.log(this.currentUserSubject.value)
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
// console.log(data.user)
      this.currentUserSubject.next(data.user);
      //сабж уведомляет своего зрителя о последнем произошедшем в нём событии, если в сабже ещё не происходило событий, создаёт для зрителя событие с изначальной информацией.data.user
      return data.user;
    }));
  }

}
