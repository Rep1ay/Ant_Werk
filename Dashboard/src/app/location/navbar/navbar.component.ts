import { Component, OnInit } from '@angular/core';
// import {ProductsService} from '../products.service';
import { AuthService } from './../../auth.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { faUser, faDeaf  } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, UrlSegment, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TemplatesService } from 'src/app/templates.service';
import { LangPanel } from '../../lang-panel';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable, Subject, asapScheduler, pipe, of, from,
  interval, merge, fromEvent } from 'rxjs';
  import { map, filter, scan } from 'rxjs/operators';
import { LangList } from 'src/app/lang-list';
import { Navbar } from 'src/app/navbar';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  productCollection: any;
  // faUser  = faUser;

  // layout: string;
  // logout: string;
  // home: string;
  // contacts: string;
  // career: string;
  // news: string;
  // register: string;
  // login: string;

  // telephone: string;
  // adress: string;
  // social: string;

  editionHome = false;
  editionContacts = false;
  editionCareer = false;
  editionNews = false;
  editionRegister = false;
  editionLogin = false;
  editionLogout = false;

  editionInfo = false;
  editionSocial = false;
  editionMail = false;
  editionLocation = false;
  editionLocation_attachment = false;
  editionTelephone = false;
  editionСontact = false;
  editionContactInfo = false;

  edition = false;

  layout = 'Вид';
  logout = 'Logout';
  home = 'Главная';
  contacts = 'Контакты';
  career = 'Карьера';
  news = 'Новости';
  register = 'Регистрация';
  login = 'Login';

  contactInfo = 'Контакты'
  telephone = 'Телефон: 1-800-123-1234';
  location = 'Россия, Москва';
  location_attachment = 'Ул. Строителей 327, оф. 57';
  email = 'example@logistic.com';
  social = 'Мы в соцсетях';

  lang_items: LangPanel[] = [];
  template: any;
  formInput: string;
  loggedIn: boolean;
  templateSending:any;
  showPreloader = false;
  routeUrl: string;
  permalink: string;
  permalinkEdit: string;
  winOrigin: string;
  winPathname: string;
  lang_list: LangList[] = [];
  lang_collection: any;
  addingNewLan = false;
  addingLang: any;
  acceptAddingNewLang = false;
  alertAddingLang = false;
  addingLangBody: string;
  currentLang: string;
  permalinkURL: string;
  currentLocation: string;
  enterCounter = 0;
  currentTitle: string;
  currentPrefix: string;
  langChanging = false;
  templateRendered = false;
  title: string;
  tryDefaultEng = false;
  allowAddingLang = true;
  activeNavbarItem: any;
  navbarItemsRendered = false;

  lastEditItemLable = ''

  constructor(

    private _templatesService: TemplatesService,
              private _authService: AuthService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _location : Location,
              )
               { 
              
                this._router.events.pipe(
                  filter((event:Event) => event instanceof NavigationEnd)
                ).subscribe((routeData: any) => {
                  
                  this.winOrigin = window.location.origin;
                  this.winPathname = window.location.pathname;
                  this.changeOfRoutes(routeData.url);
                  // this.permalink = `/${localStorage.permalink}`;
                  // this.changeOfRoutes(routeData.url);

                })
            }

  ngOnInit() {
    this.navbarItemsRendered = false;
    let lang = localStorage.langauge;
    let _self = this;
    this.getLanguagesList();
    this.getLanguagePanel();

    this.activateMenu();
    this.getNavbarItems(lang);

    this._authService._state.subscribe(
      state => {this.isLoggedIn(state)});

    this.loggedIn = this._authService.loggedIn();
    this.loggedIn = !!localStorage.getItem('token');
    // this.navbarBehavior();

    setTimeout(() => {
      // _self.showPreloader = false;
  }, 1500)
  }
  isLoggedIn(state) {
    
    this.loggedIn = state;
  }

  getNavbarItems(lang){

    if(!lang){
      lang = localStorage.language;
    }
    let _self = this;
    if(!this.navbarItemsRendered){
      this._templatesService.get_navbar_items(lang).subscribe(
        (res) => {
          // debugger
          res.forEach((item) => {
            _self[item.navBarItem] = item.navBarItemLabel
          })
          _self.navbarItemsRendered = true;
        },
         (err) => {
          _self.navbarItemsRendered = false;
           console.log('Error ffrom get navbar items' + err);
         }
      )
    }

    // this.addEditButton();

  }

  editContent(event){
    let _self = this;
    $('head').append(`<style>
    .click2edit_nav:focus{
      border: 1px solid #96c7f1;
      box-shadow: 0px 0 10px 1px #719ECE;
    }
    </style>`);

    let target = $(event.target).parent().find('.click2edit_nav')[0];
    // debugger

    // event.target.setAttribute('contenteditable', 'true');
    target.setAttribute('contenteditable', 'true');
    this.lastEditItemLable = target.innerText;
    target.focus();

    $(target).keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        $('head').append(`<style>
        .click2edit_nav:focus{
          border: none;
          box-shadow: none;
        }
        </style>`);

        $('.click2edit_nav').focusout();
        _self.exitEditing();
        _self.exitInfoEditing();
        event.preventDefault();
      }
  });
  }

  exitEditing(){
    this.editionHome = false;
    this.editionContacts = false;
    this.editionCareer = false;
    this.editionNews = false;
    this.editionRegister = false;
    this.editionLogin = false;
    this.editionLogout = false;
    $('.click2edit_nav').attr('contenteditable', false);

  }

  cancelEditing(event){
    this.exitEditing();
    let target = $(event.target).parent().parent().find('.click2edit_nav')[0]

    target.innerText = this.lastEditItemLable;

  }



  exitInfoEditing(){
    this.editionSocial = false;
    this.editionMail = false;
    this.editionLocation = false;
    this.editionLocation_attachment = false;
    this.editionTelephone = false;
    this.editionСontact = false;
    this.editionContactInfo = false;
    $('.click2edit_nav').attr('contenteditable', false);
    $('head').append(`<style>
    .click2edit_nav:focus{
      border: none;
      box-shadow: none;
    }
    </style>`);
  }

  cancelEditingInfo(event){
    this.exitInfoEditing();

    let target = $(event.target).parent().parent().find('.click2edit_nav')[0]

    target.innerText = this.lastEditItemLable;
  }

  sendNavbarItems(event){

    // this.activeNavbarItem.innerText
    let navItemLabel = $(event.target).parent().parent().find('.click2edit_nav')[0].innerText
    let lang = localStorage.language;
    let navItem = $(event.target).parent().parent().data('page')
    $('.click2edit_nav').attr('contenteditable', false);

    let send_body = {
      navBarItem: navItem,
      navBarItemLabel: navItemLabel,
      prefix: lang
      // layout: this.layout,
      // logout: this.logout,
      // home: this.home,
      // contacts: this.contacts,
      // career: this.career,
      // news: this.news,
      // register: this.register,
      // login: this.login,
    
      // telephone: this.telephone,
      // adress: this.adress,
      // social: this.social
    }
    this._templatesService.send_navbar_items(send_body)
    .subscribe(
      (res) => {
        // debugger
      },
      (err) => {
        console.log('Error from send navbar items' + err);
      }
    );
  }

  activateMenu(){
    $(document).ready(function ($) {

      $('#menu-open').on('click', function(){
        $('.main-menu-wrapper').fadeIn();
      });
      $('#menu-close').on('click', function(){
        $('.main-menu-wrapper').fadeOut();
      });

      //Button switch (should place buttons in one place)

      $(window).scroll(function(){
        if($(this).scrollTop() >= 500){
          $('.back').css('display','block');
          $('.next').css('display','none');
        } else {
          $('.back').css('display','none');
          $('.next').css('display','block');
        } 
      });

      function appendLang(){
        if($(window).width() < 769){
          $('.lang-switch').appendTo('.contacts-header-wrapper .social-bar-footer');
        }
        else
        if($(window).width() > 769){
          $('.lang-switch').appendTo('.side-fixed-block');
        }
      }
      appendLang();
      $(window).resize(function(){appendLang();});
    
      $('.menu-list > li').hover(
        function(){
          $(this).addClass('current-li');
          $(this).find('.submenu').fadeIn();
          $('.menu-list > li').addClass('font-opacity')
        }, function(){
          $(this).find('.submenu').fadeOut();
          $(this).removeClass('current-li');
          $('.menu-list > li').removeClass('font-opacity')
        });
    
      //Scroll to anchor(section)
    
      $('.next').on('click',function(event){
        event.preventDefault();
        var full_url = this.href;
        var parts = full_url.split("#");
        var trgt = parts[1];
        var target_offset = $("#"+trgt).offset();
        var target_top = target_offset.top;
        $('html, body').animate({scrollTop:target_top}, 500);
      })
    
      //Scroll to top
    
      $('.back').on('click',function(event){
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 500);
      })

    });
  }

  getLanguagePanel(){
    this._templatesService.get_lang_panel().subscribe(
      (res) => {
        this.lang_items = res;
        let lang_collect = [];
        res.forEach(lang => {
          lang_collect.push(lang.prefix); 
        });
        
        if(!lang_collect.includes('en')){
          let en_lang = {
            prefix: 'en'
          }
          this.lang_items.push(en_lang);
        }
      },
      (err) => {
        console.log('Error from language panel' +'</br>'+ err);
      }
    )
  }

  getLanguagesList(){

    let _self = this;
    this._templatesService.getLangList().subscribe(
      (res) => {
        _self.lang_collection = res;
        for(let lang in res[0]){
          
          let lang_collect = [];
          if(lang !== '_id'){
            lang_collect.push(lang);
         }

         lang_collect.forEach((lang) => {
          let lang_coll = _self.lang_collection[0];
           let lang_add = {
             'short': lang_coll[lang]['639-1'],
             'long': lang_coll[lang]['639-2'],
             'name': lang_coll[lang]['name'],
             'nativeName': lang_coll[lang]['nativeName']
           }

           _self.lang_list.push(lang_add);
         })
        }
      },
      (err) => {
        console.log('Error from get LAng_list ' + err);
      }
    )
  }

  changeOfRoutes(url){
  
    this.routeUrl = url;
    // this.showPreloader = false;
    this.tryDefaultEng = false;
    this.navbarItemsRendered = false;
    let _self = this;
    this.currentPrefix = url.split('/')[1];
    // let title = localStorage.location;
    // if(title){
      this.langChanging = false;
      this.currentTitle = url.split('/')[2];

      if(this.currentTitle === 'news-article' || this.currentTitle === 'news-category'){
        this.allowAddingLang = false;
      }else{
        this.allowAddingLang = true;
      }

      if(!this.templateRendered && this.currentTitle !== 'news-article' && this.currentTitle !== 'news-category'){
        // this.allowAddingLang = true;
        this.getTemplate(this.currentTitle, this.currentPrefix);
        this.templateRendered = false;

      }else if(this.currentTitle === 'news'){
        this.allowAddingLang = false;
        let title;
        localStorage.location = title = 'news';
      
        
        let lang = localStorage.language;
        this._templatesService.getNews(lang).subscribe(
          (res) => {
            if(res.length === 0){
              _self.acceptAddingNewLang = false;
            }
            _self._templatesService.getPermalink(title)
            .subscribe(
              (res) => {
                
                let permalink;
                let pageTitle = localStorage.location;
  
                localStorage.permalink = permalink = res['permalink'];
                _self._router.config[0].path = lang;
                // _self._router.config[1].redirectTo = `${lang}/home`;
  
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
              },
              (err) => {
  
              }
            )
          
          },
          (error) => {
            console.log('Error from news page' + error)
          }
        )
      }else{
          
      }
      // else if(this.currentTitle === 'new-article'){
      //   let lang = localStorage.language;
      //   _self._router.config[0].path = lang;
      //   _self._router.config[1].redirectTo = `${lang}/home`;

      //   _self._location.go(`${lang}/news`);
      //   _self._router.navigate([`${lang}/news`]);
      // }
          
          (error) => {
            console.log('Error from news page' + error)
          }
    // }else{
      // title = window.location.pathname.split('/')[2];
      // this.getTemplate(this.currentTitle);
    // }
  }

 getTemplate(title, lang){
  this.getNavbarItems(lang);
    let _self = this;
    // let prefix = localStorage.language;
    this.title = title;
    if(title !== 'news'){
      this.allowAddingLang = true;
      this.currentLang = lang;
      this._templatesService.getTemplate(title, lang)
      .subscribe(
        (res) => {
          if(res){

            if(res['data']['prefix']){
              _self.currentLang = localStorage.language = res['data']['prefix']; 
            }else{
              localStorage.language = _self.currentLang;
            }
            
            if(!res['data']['template']){
              _self.acceptAddingNewLang = true;
              _self.addingLangBody = _self.currentLang;
            }
            let pageTitle;
              
            localStorage.location = pageTitle = res['data']['pageTitle'];
            _self.currentLocation = pageTitle;
            let permalink;
            if(res['permalink']){
              permalink = res['permalink'];
            }else if(res['data']['permalink']){
              permalink = res['data']['permalink'];
            }else{
                permalink = res['data']['pageTitle'];
            }
            
            let lang = localStorage.language;

            let origin = window.location.origin;
            _self.permalinkURL = `${origin}/${lang}/${permalink}`
            _self._router.config[0].children.forEach((route) => {
              if(route.path === pageTitle){
                // route.path = `${localStorage.language}/${res['permalink']}`;
                route.path = permalink;
              }
            })

            _self._router.config[0].path = lang;
            // _self._router.config[1].redirectTo = `/${lang}/home`

            localStorage.permalink = permalink;
            _self.permalink = `/${permalink}`;
            _self.templateRendered = true;
            _self._router.navigate([`${localStorage.language}/${localStorage.permalink}`])
            
            }else{
              if(_self.langChanging){
                let lang = localStorage.language;

                if(title === 'news'){
                  _self.acceptAddingNewLang = false;
                }else{
                  _self.acceptAddingNewLang = true;
                }
                _self.langChanging = false;
              }else{
                if(!_self.tryDefaultEng){
                  _self.tryDefaultEng = true;
                  let langDefault = 'en';
                _self.langChanging = false;
              
                _self.getTemplate(title, langDefault);  
                }
                else{
                  localStorage.location = 'home';
                  _self._router.navigate([`${localStorage.language}/home`])
                }
                }
            }
      },
        (err) => {
          console.log('Error from get template' + err);
        }
      );
    }
    else{
      this.allowAddingLang = false;
      _self.currentLang = localStorage.language;
    }
  }


  changeLanguage(lang){
    this.getNavbarItems(lang);
    let title = localStorage.location;
    
    if(!title){
      title = this._router.config[1].redirectTo.split('/')[2];
    }
    this.acceptAddingNewLang = false;
    let _self = this;
    this.langChanging = true;
    this.addingLangBody = lang;

    if(title.includes('news')){
      // let title;
        // localStorage.location = title = 'news';
             
        this._templatesService.getNews(lang).subscribe(
          (res) => {
            if(res.length === 0){
              _self.acceptAddingNewLang = false;
            }
            _self._templatesService.getPermalink(title)
              .subscribe(
                (res) => {
                  if(res){
                    localStorage.language = lang;
                    let permalink;
                    localStorage.permalink = permalink = res['permalink'];
                    _self._router.config[0].path = lang;
                    // _self._router.config[1].redirectTo = `${lang}/home`;

                    _self._location.go(`${lang}/${permalink}`);
                    _self._router.navigate([`${lang}/${permalink}`]);
                  }else{
                    localStorage.location = 'news';
                    _self._location.go(`${lang}/news`);
                    _self._router.navigate([`${lang}/news`]);
                  }

                },
                (err) => {
                  console.log('Error from get permalink ' + err);
                }
              )
          },
          (error) => {
            console.log('Error from news page' + error)
          }
        )
    }
    else{
      this.getTemplate(title, lang);
    }

  }

  followLink(path){
    if(!this.edition){

    this.langChanging = false;

     $('.main-menu-wrapper').fadeOut();

      let lang = localStorage.language;
      let snapshot = this._activatedRoute.snapshot;
      let _self = this;
    if(path !== 'news'){
      // this._location.go(`${lang}/${path}`);
      this.getTemplate(path, this.currentPrefix);
    }
    else{
      let title;
      localStorage.location = title = 'news';
      this.allowAddingLang = false;
      
      let lang = localStorage.language;
      this._templatesService.getNews(lang).subscribe(
        (res) => {
          if(res.length === 0){
            _self.acceptAddingNewLang = false;
          }
          _self._templatesService.getPermalink(title)
            .subscribe(
              (res) => {
                
                let permalink;
                localStorage.permalink = permalink = res['permalink'];
                _self._router.config[0].path = lang;
                // _self._router.config[1].redirectTo = `${lang}/home`;

                _self._location.go(`${lang}/${permalink}`);
                _self._router.navigate([`${lang}/${permalink}`]);
              },
              (err) => {

              }
            )
        },
        (error) => {
          console.log('Error from news page' + error)
        }
      )
      }
    }
  }

  chooseLanguage(event){
    let lang = event.currentTarget.value
    this.addingLangBody = lang
    this.addingLang = lang;
  }

  languageAdding(){
    let _self = this;
    this.acceptAddingNewLang = !this.acceptAddingNewLang;
    this.addingNewLan = !this.addingNewLan;
    // this.lang_items.push(this.addingLang);
    this._templatesService.add_new_lang_panel(this.addingLang)
    .subscribe(
      (res) => {
        _self.getLanguagePanel();
      },
      (err) => {
        console.log('Error language adding to panel' + err);
      }
    )
  }

  acceptLangBlock(){
    localStorage.language = this.addingLangBody;
    let _self = this;
    this.alertAddingLang = !this.alertAddingLang;
    this.acceptAddingNewLang = false;

    setTimeout(() => {
      this.alertAddingLang = false;
    }, 10000)

    let lang = this.addingLangBody;
    this._templatesService.add_new_lang_panel(lang)
    
    .subscribe(
      (res) => {
        let lang = res['prefix'];
        let permalink = localStorage.permalink;
        localStorage.language = lang;
        this._router.config[0].path = lang;

        
        _self._location.go(`${lang}/${permalink}`);

        if(localStorage.location === 'news'){
           _self._router.config[0].path = lang;
                let pageTitle  = localStorage.location;

                let origin = window.location.origin;
                _self.permalinkURL = `${origin}/${lang}/${permalink}`
                _self._router.config[0].children.forEach((route) => {
                  if(route.path === pageTitle){
                    route.path = permalink;
                  }
                })

                _self._router.navigate([`${lang}/${permalink}`]);
        }
      

        setTimeout(() => {
        }, 1500)
      },
      (err) => {
        console.log('Error from adding new lang');
      }
    )
  }

  cancelLangBlock(){
    this.acceptAddingNewLang = false;
  }
  
  editPageURL(inputURL: NgForm){
    
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

  

  // navbarBehavior() {
  //   window.addEventListener('scroll', function(e) {

  //     const scrollY = window.scrollY;
  //     const navbar = document.querySelector('.navbar_container');

  //     class NavbarBehavior {
  //       constructor() {}
  //       fade(elem) {
  //         elem.setAttribute('style', 'padding: 0px');
  //         elem.classList.add('fixed_to_top');
  //       }
  //       show(elem) {
  //         elem.setAttribute('style', 'padding: 10px 0px');
  //         elem.classList.remove('fixed_to_top');
  //       }
  //       toggle(elem, addClass, deleteClass) {
  //         elem.classList.add(addClass);
  //         elem.classList.remove(deleteClass);
  //       }
  //     }

  //     const navbarBehavior = new NavbarBehavior();

  //     if ( scrollY > 50 ) {
  //       navbarBehavior.fade(navbar);
  //     } else {
  //       navbarBehavior.show(navbar);
  //     }
  // });
  // }

  logoutUser() {
    setTimeout(() => {
      this.loggedIn = false;
    }, 500);
    
    this._authService.logoutUser();
    window.location.reload();
  }



  // getTemplateByPermalink(){
    //     let _self = this;
    // 
    //     let permalink = this.routeUrl.split('/')[2];
    
    //     this._templatesService.get_pageTitle(permalink)
    //     .subscribe(
    //       (res) => {
    //         if(res){
    //           setTimeout(() => {
    //             _self.showPreloader = false;
    //           }, 1500);
    
    //           let pageTitle = localStorage.location = res['pageTitle'];
    //           _self.permalink = `/${res['permalink']}`;
    //           if(_self.langChanging){
    //             let permalink =  _self.permalink.replace('/', '');
    //             _self.getTemplate( permalink, _self.addingLangBody)
    //             _self.langChanging = false;
    //           }else{
    //             _self.getTemplate(pageTitle, _self.currentPrefix)
    //             _self.langChanging = false;
    //           }
    //         }else{
    //           let template = undefined;
    //           if( _self.currentLocation){
    //             localStorage.location = _self.currentLocation;
    //           }
    //           // _self.renderTemplate(template);
    
    //           // let pageTitle = window.location.pathname.split('/')[2];
    //           // _self.getTemplate(pageTitle);
    //         }
    //       },
    //       (err) => {
    //         console.log('Error form getting permalink' + err);
    //       }
    //     )
    //   }
}
