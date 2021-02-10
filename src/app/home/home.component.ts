import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ArticleListConfig, TagsService, UserService } from '../core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService
  ) {}

  isAuthenticated: boolean;
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  tags: Array<string> = [];
  tagsLoaded = false;

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;

        // соответственно устанавливаем список статей
        if (authenticated) {
          this.setListTo('feed');
        } else {
          this.setListTo('all');
        }
      }
    );

    this.tagsService.getAll()//getAll(): Observable<[string]> {   return this.apiService.get('/tags') .pipe(map(data => data.tags));
    // }
    .subscribe(tags => {
      this.tags = tags;
      this.tagsLoaded = true;
    });
  }

  setListTo(type: string = '', filters: Object = {}) {
 // Если канал запрашивается, но пользователь не аутентифицирован, перенаправляем на логин
    if (type === 'feed' && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }

   // В противном случае устанавливаем объект списка
    this.listConfig = {type: type, filters: filters};

  }
}
