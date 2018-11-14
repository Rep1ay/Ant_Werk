import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../templates.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
// import { filter } from 'rxjs/operators';
import { Observable, Subject, asapScheduler, pipe, of, from,
  interval, merge, fromEvent } from 'rxjs';
  import { map, filter, scan } from 'rxjs/operators';
import { NewsCollection } from '../../news-collection';
// Jquery declaration
declare let $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

    
  loggedIn: boolean;
  lastTarget: any;
  title: string;
  prefix: string;
  template: any;
  templateSending = false;
  postText: string = "";
  errorMessage: string;
  postSaved : boolean = false;
  currentElem: any;
  currentTarget: any;
  private _formBuilder: FormBuilder;
  savePostForm: FormGroup;
  saveBtnPublic: any;
  event: any;
  savedContent: string;
  showPreloader = true;
  winOrigin:string;
  winPathname:string;
  permalink: string;
  permalinkEdit: string;
  newLanguageAdded = false;
  routeUrl: string;
  showBeforeLogin:any = true;
  showAfterLogin:any
  currentLang: string;
  permalinkURL: string;
  currentLocation = 'news';
  counterEnter = false;
  newsCollection: NewsCollection[];

  constructor(private _templatesService: TemplatesService, 
    formBuilder: FormBuilder,
    private _auth: AuthService,
    private _activeRoute: ActivatedRoute,
    public _router: Router,
    private _location: Location
    ) { 
      this.winOrigin = window.location.origin;
      this.winPathname = window.location.pathname;

      this._router.events.pipe(
        filter((event:Event) => event instanceof NavigationEnd)
      ).subscribe((routeData: any) => {
        this.winOrigin = window.location.origin;
        this.winPathname = window.location.pathname;
// debugger
        if(this.currentLocation === localStorage.permalink || this.currentLocation === localStorage.location){
          if(!this.counterEnter){
              // this.changeOfRoutes(routeData.url);
              this.counterEnter = true;
            }
          }

      })
  }

  ngOnInit() {
    let lang  = localStorage.language;
    this._templatesService.getNews(lang).subscribe(
      (data) => {
        this.newsCollection = data;
        // this.showPreloader = false; 
      },
      (error) => {
        console.log('Error from news page' + error)
      }
    )
  }

  onSelect(id){
    let lang =localStorage.language;
    this._router.navigate([`/${lang}/article/${id}`])
  }

  createNewArticle(){
    let lang = localStorage.language;
    this._router.navigate([`/${lang}/new-article`])
  }
  
}
