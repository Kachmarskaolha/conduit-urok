import { Component, OnInit } from '@angular/core';

import { User, UserService } from '../../core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService
  ) {}

  currentUser: User;//export interface User { email: string;token: string; username: string; bio: string; image: string;}

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        console.log('userData' ,userData)
      }
      //userData {id: 141246, email: "kachmarsakolha@gmail.com", createdAt: "2021-02-08T11:57:48.259Z", updatedAt: "2021-02-08T12:22:13.944Z", username: "Olha", …}если не войти, то пустой обьект
    );
  }
  //private currentUserSubject = new BehaviorSubject<User>({} as User);
  //public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

}
