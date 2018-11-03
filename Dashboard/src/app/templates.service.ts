import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Template } from './template';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Event} from './event'
import { LangPanel } from './lang-panel';
import { Permalink } from './permalink';

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
// private _templatesUrl = 'http://68.183.30.119/api/templates'

  constructor(private _http: HttpClient) { 
   
  }
  // this.http.get('http://localhost:3000/seeResults')
  // .map((res: Response) => res.json())
  // .subscribe((res: any) => {
  //   this.persons = res;
  // });
  editInner(event: Event){
debugger
    this.eventValue.next(event)
  }

  getTemplate(title, prefix): Observable<Template>{
    let pageTitle = localStorage.location;
    // let titleId = 'home';
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'prefix': (prefix).toUpperCase(),
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
        'prefix': (prefix).toUpperCase(),
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
      prefix: (prefix).toUpperCase()
    }
    return this._http.put<any>(this._lang_panelURL, body)
  }

  get_lang_panel(){
    return this._http.get<any>(this._lang_panelURL);
  }

}
