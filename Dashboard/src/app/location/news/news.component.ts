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
import { NewsCategories } from 'src/app/news_category';
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
  creatingCategory = false;
  news_categories: NewsCategories[];
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
// 
        if(this.currentLocation === localStorage.permalink || this.currentLocation === localStorage.location){
          // if(!this.counterEnter){
              this.changeOfRoutes();
              this.counterEnter = true;
              this.showPreloader = true;

            // }
          }

      })
  }

  ngOnInit() {
  
  // setTimeout(() => {
  //   this.showPreloader = false;
  // }, 1500)
    this.loggedIn = this._auth.loggedIn();


  }

  changeOfRoutes(){
    let _self = this;
    let lang  = localStorage.language;
    debugger
    this._templatesService.getNews(lang).subscribe(
      (data) => {
        if(data.length > 0){
          _self.newsCollection = data;
        }else{
          _self.newsCollection = [];
        }
        setTimeout(() => {
          this.showPreloader = false;
        }, 1500)
        localStorage.location = 'news';
        localStorage.permalink = 'news'
        // this.showPreloader = false; 
      },
      (error) => {
        console.log('Error from news page' + error)
      }
    )
    this._templatesService.getNewsCategory(lang)
      .subscribe(
        (res) => {
          debugger
          _self.news_categories = res
        },
        (err) =>{
          console.log('Error from get news category' + err);
        }
      )
  }

  onSelect(id){
    let lang =localStorage.language;
    this._router.navigate([`/${lang}/article/${id}`])
  }

  createNewArticle(){
    debugger
    let lang = localStorage.language;
    localStorage.location = 'new-article';

    this._router.config[0].path = lang;
    this._router.config[1].redirectTo = `${lang}/home`;

    this._location.go(`${lang}/new-article`);
    this._router.navigate([`${lang}/new-article`]);
    }

    saveCategory(inputValue: NgForm){
      debugger
      let _self = this;
      let category = inputValue.value.category;
      let lang = localStorage.language;
      this.creatingCategory = false;
      this._templatesService.saveNewsCategory(category, lang)
        .subscribe(
          (res) => {
            this._templatesService.getNewsCategory(lang)
            .subscribe(
              (res) => {
                debugger
                _self.news_categories = res
              },
              (err) =>{
                console.log('Error from get news category' + err);
              }
            )
            // res = this.news_categories
          },
          (err) => {
            console.log('Error from save category');
          }
        )
    }

    cancel
  
}
