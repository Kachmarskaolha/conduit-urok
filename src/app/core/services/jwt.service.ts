import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

}

// Зачем мне нужен localStorage?
// LocalStorage нужен только для одного — хранить определенные данные между сессиями пользователя. Можно придумать тысячу и одну вещь, которую можно хранить в локальном хранилище браузера. Например, браузерные игры, которые используют его как сохраненку, или записать момент, на котором пользователь остановился при просмотре видео, различные данные для форм и т.д.
// localStorage.setItem('myKey', 'myValue'); //теперь у вас в localStorage хранится ключ "myKey" cо значением "myValue"

// //Выводим его в консоль:
// var localValue = localStorage.getItem('myKey');
// console.log(localValue); //"myValue"

// //удаляем:
// localStorage.removeItem("myKey");

// //очищаем все хранилище
// localStorage.clear()

// То же самое, только с квадратными скобками:

// localStorage["Ключ"] = "Значение" //установка значения
// localStorage["Ключ"] // Получение значения
// delete localStorage["Ключ"] // Удаление значения
