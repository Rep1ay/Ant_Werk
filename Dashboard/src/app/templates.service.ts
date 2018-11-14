import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Template } from './template';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Event} from './event'
import { LangPanel } from './lang-panel';
import { Permalink } from './permalink';
import { LangList } from './lang-list';
import { Article } from './article';
import { NewsCollection } from './news-collection';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
private eventValue = new Subject<Event>();
_event = this.eventValue.asObservable();

template:any;
  
private _templatesUrl = 'http://localhost:3000/api/templates'
private _lang_panelURL = 'http://localhost:3000/api/lang_panel'
private _permalinkUrl = 'http://localhost:3000/api/permalink'
private _pageTitleUrl = 'http://localhost:3000/api/pageTitle'
private _langListURL = 'http://localhost:3000/api/lang_list'
private _navbarURL = 'http://localhost:3000/api/navbar'
private _newsURL = 'http://localhost:3000/api/news'
private _articleURL = 'http://localhost:3000/api/article'

// private _templatesUrl = 'http://68.183.30.119/api/templates'

  constructor(private _http: HttpClient) { 
   
  }
  // this.http.get('http://localhost:3000/seeResults')
  // .map((res: Response) => res.json())
  // .subscribe((res: any) => {
  //   this.persons = res;
  // });

  get_navbar(lang){
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'lang': lang,
    }

    const headers = new HttpHeaders(headerJson);

    return this._http.get(this._navbarURL, {headers}).pipe(map((responce:any) => responce));
  }

  editInner(event: Event){

    this.eventValue.next(event)
  }

  getLangList(){
    return this._http.get<LangList[]>(this._langListURL)
  }

  getNews(prefix){
    debugger
    // return this._http.get<NewsCollection[]>(this._newsURL, lang);

    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'prefix': prefix
    }
    const headers = new HttpHeaders(headerJson);

    return this._http.get<NewsCollection[]>(this._newsURL, {headers}).pipe(map((response: any) => response)); 
  }

  getArticleTemplate(id, prefix){
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'prefix': prefix,
      'id': id
    }
    const headers = new HttpHeaders(headerJson);

    return this._http.get(this._articleURL, {headers}).pipe(map((response: any) => response)); 
  }

  sendArticle(template, id, prefix){
debugger
    // this.add_new_lang_panel(prefix);
    let  templateBody: Article = {
      body: {
        'id': id,
        'prefix': prefix,
        'template': template
      }
    } 
   
    return this._http.put<any>(this._articleURL, templateBody);  
  }

  getTemplate(title, prefix): Observable<Template>{
    // let pageTitle = localStorage.location;
    // let titleId = 'home';
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'prefix': prefix,
      'pageTitle': title
    }
    const headers = new HttpHeaders(headerJson);
// //
    return this._http.get(this._templatesUrl, {headers}).pipe(map((response: any) => response));

  }

  sendTemplate(template, title, prefix, permalink){

    // this.add_new_lang_panel(prefix);
    let  templateBody: Template = {
      body: {
        'prefix': prefix,
        'permalink': permalink,
        'pageTitle': title,
        'template': template
      }
    
    } 
   
    return this._http.put<any>(this._templatesUrl, templateBody);  
  }

  getPermalink(title){
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'pageTitle': title
    }

    const headers = new HttpHeaders(headerJson);

    return this._http.get(this._permalinkUrl, {headers}).pipe(map((responce:any) => responce))
  }

  get_pageTitle(permalink){

    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'permalink': permalink
    }

    const headers = new HttpHeaders(headerJson);
    
   return this._http.get(this._pageTitleUrl, {headers}).pipe(map((responce: any) => responce))

  }

  send_permalink(title, permalink){
    let permalinkBody : Permalink = {
      pageTitle: title,
      permalink: permalink
    }

    return this._http.put<any>(this._permalinkUrl, permalinkBody)
  }

  add_new_lang_panel(prefix){
    
    let body: LangPanel = {
      prefix: prefix
    }
    return this._http.put<any>(this._lang_panelURL, body)
  }

  get_lang_panel(){
    return this._http.get<any>(this._lang_panelURL);
  }

}
