import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';

import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));

      // Для задания GET-параметров get() в качестве второго аргумента передается конфигурационный объект со свойством params.
      // Свойство params принимает экземпляр класса HttpParams, который предварительно импортируется.
// import { HttpParams } from '@angular/common/http'
// Передача значений осуществляется с помощью set(). Для передачи множества параметров используется следующая запись.
// params: new HttpParams()
//   .set(`id`, id)
//   .set(`category`, category)
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
    // Метод put() во всем идентичен методу post(). Разница между ними состоит в том, что post() используется для создания новой записи, а put() - для ее обновления.

  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
     // Метод post() принимает три аргумента. Второй - тело запроса, третьим параметром можно передаваться конфигурация.
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
    // delete() используется для удаления записи. В своем использовании он схож с GET. Оба метода не имеют тела запроса, а данные передают в строке запроса.
  }
}
