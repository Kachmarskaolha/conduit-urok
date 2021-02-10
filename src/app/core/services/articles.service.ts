import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Article, ArticleListConfig } from '../models';
import { map } from 'rxjs/operators';

@Injectable()
export class ArticlesService {
  constructor (
    private apiService: ApiService
  ) {}

  query(config: ArticleListConfig): Observable<{articles: Article[], articlesCount: number}> {
    
    // Преобразование любых фильтров в URLSearchParams Angular
    const params = {}; //{author: "Olha", limit: 10, offset: 0}


    Object.keys(config.filters)
    .forEach((key) => {
      params[key] = config.filters[key]; //olha,10,0
      // console.log(params)
    });

    return this.apiService
    .get(
      '/articles' + ((config.type === 'feed') ? '/feed' : ''),
      new HttpParams({ fromObject: params })

    );
  }

  get(slug): Observable<Article> {//slug lalallla-dtkkh1 название артикля

    return this.apiService.get('/articles/' + slug)
      .pipe(map(data =>  data.article));


  }

  destroy(slug) {
    // console.log(slug)
    return this.apiService.delete('/articles/' + slug);

  }

  save(article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.apiService.put('/articles/' + article.slug, {article: article})
        .pipe(map(data => data.article));

    // Otherwise, create a new article
    } else {
      return this.apiService.post('/articles/', {article: article})
        .pipe(map(data => data.article));
    }
  }

  favorite(slug): Observable<Article> {
    return this.apiService.post('/articles/' + slug + '/favorite');
  }

  unfavorite(slug): Observable<Article> {
    return this.apiService.delete('/articles/' + slug + '/favorite');
  }


}
