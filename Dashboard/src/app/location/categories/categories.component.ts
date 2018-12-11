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
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

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
  currentLocation = 'news-category';
  counterEnter = false;
  allNewsRendered = false;
  newsCollection: NewsCollection[];
  creatingCategory = false;
  category: string;
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
              this.changeOfRoutes(routeData.url);
              this.counterEnter = true;
             

            // }
          }

      })
  }

  ngOnInit() {
  setTimeout(() => {
    this.showPreloader = false;
  }, 1500)
  // if(!this.allNewsRendered){
  //   this.allNewsRendered = true;
    // this.getAllNews();
  // }
    // 
    this.category = this._activeRoute.snapshot.paramMap.get('category');

    this.filterByCategory(this.category);
    localStorage.location = 'news-category';
    localStorage.permalink = 'news-category';
    this.loggedIn = this._auth.loggedIn();

  }

  changeOfRoutes(url){
    let _self = this;
    let lang  = localStorage.language;
   
    if(url.split('/').includes('news-category')){    
        // this.filterByCategory(this.category);
    }
  }
  
  getAllNews(){
    this.showPreloader = true;
    let title;
    localStorage.location = title = 'news';
    let _self = this;
    let lang  = localStorage.language;
    this._templatesService.getNews(lang).subscribe(
      (data) => {
        if(data.length > 0){
          _self.newsCollection = data;
        }else{
          _self.newsCollection = [];
        }
        _self._templatesService.getPermalink(title)
          .subscribe(
            (res) => {
              let permalink;
              let pageTitle  = localStorage.location;

              localStorage.permalink = permalink = res['permalink'];
              _self.permalink = `/${permalink}`;
              _self._router.config[0].path = lang;
              _self._router.config[1].redirectTo = `${lang}/home`;

              let origin = window.location.origin;
              _self.permalinkURL = `${origin}/${lang}/${permalink}`
              _self._router.config[0].children.forEach((route) => {
                if(route.path === pageTitle){
                  // route.path = `${localStorage.language}/${res['permalink']}`;
                  route.path = permalink;
                }
              })

              _self._location.go(`${lang}/${permalink}`);
              _self._router.navigate([`${lang}/${permalink}`]);
              
              _self.getNewsCategory(lang);

              setTimeout(()=> {
                _self.showPreloader = false;
              }, 1500)
            },
            (err) => {
              console.log('Error from getting news permalink' + err);
            }
          )
        },
      (error) => {
        console.log('Error from getting all news' + error)
      }
    )
  }

  getNewsCategory(lang){
    let _self = this;
    this._templatesService.getNewsCategory(lang)
    .subscribe(
      (res) => {
        
        _self.news_categories = res
      },
      (err) =>{
        console.log('Error from get news category' + err);
      }
    )
  }

  filterByCategory(category){
    let _self = this;
    this.showPreloader = true;
    let lang = localStorage.language;
    this._templatesService.getNewsByCategory(category, lang)
    .subscribe(
      (res) => {
        let lang  = localStorage.language;
         _self.getNewsCategory(lang);
        setTimeout(() => {
          _self.showPreloader = false;
        }, 500)
        _self.newsCollection = res
      },
      (err) =>{
        console.log('Error from get news category' + err);
      }
    )
  }

  onSelect(id){
    let lang =localStorage.language;
    localStorage.permalink = id;
    this._router.navigate([`/${lang}/news-article/${id}`])
  }

  createNewArticle(){
    
    let lang = localStorage.language;
    // localStorage.location = 'new-article';
    let id = new Date().toISOString().replace(/[^0-9]/g, '');
    localStorage.permalink = id;
    this._router.config[0].path = lang;
    this._router.config[1].redirectTo = `${lang}/home`;

    this._location.go(`${lang}/news-article/${id}`);
    this._router.navigate([`/${lang}/news-article/${id}`]);

    }
    

    saveCategory(inputValue: NgForm){
      
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


    editPermalink(inputURL: NgForm){
    
      this.permalink = '/';
      this.permalinkEdit = `${localStorage.permalink}`;
      console.log(inputURL.value);
    }
  
    savePermalink(permalink: NgForm){
      let _self = this;
      let permalinkToSend = permalink.value.input;
      this.permalink = `/${permalink.value.input}`;
      localStorage.permalink = permalink.value.input;
      this._templatesService.send_permalink(localStorage.location, permalinkToSend).subscribe(
        (res) => {
          // _self._router.navigate([`${localStorage.language}/${res['permalink']}`]);
          _self._location.go(`${localStorage.language}/${res['permalink']}`)
          window.location.reload();
        },
        (err) => {
          console.log('Error from permalink send from navbar' + '</br>' + err);
        }
      )
  
      this.permalinkEdit = '';
    }


  
    cancelPermalink(){
      this.permalink = `/${localStorage.permalink}`
      this.permalinkEdit = '';
    }

    // cancel
  
}
