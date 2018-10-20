import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Template } from './template';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Event} from './event'

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
private eventValue = new Subject<Event>();
_event = this.eventValue.asObservable();

template:any;
  
private _templatesUrl = 'http://localhost:3000/api/templates'
  constructor(private _http: HttpClient) { 
   
  }
  // this.http.get('http://localhost:3000/seeResults')
  // .map((res: Response) => res.json())
  // .subscribe((res: any) => {
  //   this.persons = res;
  // });
  editInner(event: Event){
    // debugger
    this.eventValue.next(event)
  }

  getTemplate(title): Observable<Template>{
    let templateBody = {
      pageTitle: title
    }
    let titleId = 'home';
    let headerJson = {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'pageTitle': 'home'
    }
    const headers = new HttpHeaders(headerJson);

    return this._http.get(this._templatesUrl, {headers}).pipe(map((response: any) => response));

  }

  sendTemplate(template, title){
    let  templateBody: Template = {
      pageTitle: title,
      template: template
    } 
    return this._http.put<any>(this._templatesUrl, templateBody);
  
  }

}
