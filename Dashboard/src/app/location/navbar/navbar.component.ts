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
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  productCollection: any;
  // faUser  = faUser;
  home = 'Home';
  contacts = 'Contacts';
  career = 'Career';
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
          // this.lang_list = res;
        //  res.forEach(lang => {
        //    this.lang_list.push(lang);
        //    
          
        //  })


        },
        (err) => {
          console.log('Error from get LAng_list ' + err);
        }
      )

    this._authService._state.subscribe(
      state => {this.isLoggedIn(state)});

    this.loggedIn = this._authService.loggedIn();
    this.loggedIn = !!localStorage.getItem('token');
    this.navbarBehavior();   

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

    setTimeout(() => {
      _self.showPreloader = false;
  }, 1500)
  }
  isLoggedIn(state) {
    
    this.loggedIn = state;
  }

  changeOfRoutes(url){
    
    this.routeUrl = url;
    this.showPreloader = false;
    
    let _self = this;
    this.currentPrefix = localStorage.language =  url.split('/')[1];
    // let title = localStorage.location;
    // if(title){
      
      this.currentTitle = url.split('/')[2];
      this.getTemplate(this.currentTitle, this.currentPrefix);
    // }else{
      // title = window.location.pathname.split('/')[2];
      // this.getTemplate(this.currentTitle);
    // }
  }

 getTemplate(title, lang){
   
    let _self = this;
    // let prefix = localStorage.language;
   
    this._templatesService.getTemplate(title, lang)
    .subscribe(
      (res) => {
        if(res){
          let pageTitle;
          
          _self.currentLang = localStorage.language = res['prefix']; 
          let template = res['template'];
          localStorage.location = pageTitle = res['pageTitle'];
          _self._templatesService.getPermalink(res['pageTitle'])
          .subscribe(
            (res) => {
              // if(res){
                _self.enterCounter = 0;
              let permalink;
              if(res){
                permalink = res['permalink'];
              }else{
                permalink = localStorage.location; 
              }
              let lang = localStorage.language;

              // _self.renderTemplate(template);
              
              let origin = window.location.origin;
              _self.permalinkURL = `${origin}/${lang}/${permalink}`


                    _self._router.config[0].children.forEach((route) => {
                      if(route.path === pageTitle){
                        // route.path = `${localStorage.language}/${res['permalink']}`;
                        route.path = `${res['permalink']}`;
                      }
                    })

                    _self._router.config[0].path = lang;

                    localStorage.permalink = permalink;
                    _self.permalink = `/${permalink}`;
                    
                    _self._router.navigate([`${lang}/${res['permalink']}`]);
                    _self._location.go(`${lang}/${permalink}`);

                    // window.location.reload();

            },
            (err) => {
              console.log('Error form HomeComp get template' + err);
            }
          )
        }else{
          localStorage.location = this.currentLocation = title;
          _self.enterCounter++;
          if(_self.enterCounter > 2){
            localStorage.language = _self.currentPrefix =  'en'
            _self.enterCounter = 0;
          }
          _self.getTemplateByPermalink();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTemplateByPermalink(){
    let _self = this;

    let permalink = this.routeUrl.split('/')[2];

    this._templatesService.get_pageTitle(permalink)
    .subscribe(
      (res) => {
        if(res){
          setTimeout(() => {
            _self.showPreloader = false;
          }, 1500);

          let pageTitle = localStorage.location = res['pageTitle'];
          _self.permalink = `/${res['permalink']}`;
          _self.getTemplate(pageTitle, _self.currentPrefix)

        }else{
          
          let template = undefined;
          localStorage.location = _self.currentLocation;
          // _self.renderTemplate(template);

          // let pageTitle = window.location.pathname.split('/')[2];
          // _self.getTemplate(pageTitle);
        }
      },
      (err) => {
        console.log('Error form getting permalink' + err);
      }
    )
  }

  changeLanguage(lang){
    this.acceptAddingNewLang = false;
    let _self = this;
    this.addingLangBody = lang;
    // this.showPreloader = true;
        // let lang = event.target.dataset.lang;
        let title = localStorage.location;
        // let prefix = localStorage.language;
    this.getTemplate(title, lang);

  }

  followLink(path){
    let lang = localStorage.language;
    let snapshot = this._activatedRoute.snapshot;
    let _self = this;
    this._location.go(`${lang}/${path}`);
    this.getTemplate(path, this.currentPrefix);
  }

  addEditButton(){
    let _self = this;
      setTimeout(() => {
        // this.showPreloader = false;
      }, 1500);

      $('.editNavbar').off('mouseover').on('mouseover', function(event){
      // let savedContent;
      let target = event.target;
      $('.blockForBtnEdit').remove();

      // Edit button

      let btnEdit = document.createElement('button');
      let textNodeEdit = document.createTextNode('Edit');
      btnEdit.setAttribute('class', 'btn btn-info btn-large btnEdit');
      let blockForBtnEdit = document.createElement('div');

      // Save button

      let btnSave = document.createElement('button');
      let textNodeSave = document.createTextNode('Save');
      btnSave.setAttribute('class', 'btn btn-success btn-large btnSave');
      let blockForBtnSave = document.createElement('div');
      btnSave.appendChild(textNodeSave);

      // Cancel button
      
      let btnCancel = document.createElement('button');
      let textNodeCancel = document.createTextNode('Cancel');
      btnCancel.setAttribute('class', 'btn btn-danger btn-large btnCancel');
      let blockForBtnCancel = document.createElement('div');
      btnCancel.appendChild(textNodeCancel);

      btnCancel.onclick = function(){
        $('.blockForBtnSave').remove();
        $('.blockForBtnCancel').remove();
        // target.innerText = _self.savedContent;
      }


      btnEdit.appendChild(textNodeEdit);
      blockForBtnEdit.appendChild(btnEdit);
      $(blockForBtnEdit).insertBefore(event.target)

      let position = $(event.target).position();
      let marginTop = +$(event.target).css('margin-top').replace('px', '');
      // if(this.headers.contains(target.tagName)){

      // }
      let left = position.left;
      let top =  position.top + marginTop;

      blockForBtnEdit.setAttribute('class', 'blockForBtnEdit');
      let width = $(target).width()
      $(blockForBtnEdit).css({'left': `${left - width}px`, 
                          'top': `${top + 60}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          });

      $(btnEdit).off('click').on('click', (event) =>{


        $(target).keypress(function(event) {
          var keycode = (event.keyCode ? event.keyCode : event.which);
          if (keycode == '13') {
            
            event.preventDefault();
            $(this).focusout();
            $(this).attr('contenteditable','false');
            $('.blockForBtnEdit').remove();
            $('.blockForBtnSave').remove();
            $('.blockForBtnCancel').remove();
            // event.preventDefault();
          }
      });

        this.savedContent = target.innerText;
        target.setAttribute('contenteditable', 'true');
        target.focus();
        $(btnEdit).remove();

        $('.blockForBtnSave').remove();
        $('.blockForBtnCancel').remove();

        blockForBtnSave.appendChild(btnSave);


        btnSave.onclick = function(){
          $('.blockForBtnEdit').remove();
          $('.blockForBtnSave').remove();
          $('.blockForBtnCancel').remove();

//========================   Save Method ======================

          // _self.saveChanges();
        }

        $(blockForBtnSave).insertBefore(target)
        $(blockForBtnSave).css({'left': `${left}px`, 
                          'top': `${top + 60}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '1000'
                          });
        blockForBtnSave.setAttribute('class', 'blockForBtnSave');

        // cancel button

        blockForBtnCancel.appendChild(btnCancel);
        $(blockForBtnCancel).insertBefore(target)
        $(blockForBtnCancel).css({'left': `${left + 70}px`, 
                          'top': `${top + 60}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '1000'
                          });
        blockForBtnCancel.setAttribute('class', 'blockForBtnCancel');
       

      });

      $(event.target).off('blur').on('blur', (event) => {
        
        target.setAttribute('contenteditable', 'false');
        setTimeout(() =>{
          $('.blockForBtnSave').remove();
          $('.blockForBtnCancel').remove();
        }, 100)

        if(event.relatedTarget){
          if(event.relatedTarget.classList.contains('btnCancel')){
            target.innerText = this.savedContent;
          }
        }
      })
    });
  }

  chooseLanguage(event){
    let lang = event.currentTarget.value
    this.addingLangBody = lang
    this.addingLang = {
      prefix: lang
    }
  }

  languageAdding(){
    this.acceptAddingNewLang = !this.acceptAddingNewLang;
    this.addingNewLan = !this.addingNewLan;
    this.lang_items.push(this.addingLang);
  }

  acceptLangBlock(){
    let _self = this;
    this.alertAddingLang = !this.alertAddingLang;
    this.acceptAddingNewLang = !this.acceptAddingNewLang;
    this.showPreloader = true;
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

        setTimeout(() => {
          _self.showPreloader = false;
        }, 1500)
      },
      (err) => {
        console.log('Error from adding new lang');
      }
    )
  }

  cancelLangBlock(){
    this.acceptAddingNewLang = !this.acceptAddingNewLang;
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

  

  navbarBehavior() {
    window.addEventListener('scroll', function(e) {

      const scrollY = window.scrollY;
      const navbar = document.querySelector('.navbar_container');

      class NavbarBehavior {
        constructor() {}
        fade(elem) {
          elem.setAttribute('style', 'padding: 0px');
          elem.classList.add('fixed_to_top');
        }
        show(elem) {
          elem.setAttribute('style', 'padding: 10px 0px');
          elem.classList.remove('fixed_to_top');
        }
        toggle(elem, addClass, deleteClass) {
          elem.classList.add(addClass);
          elem.classList.remove(deleteClass);
        }
      }

      const navbarBehavior = new NavbarBehavior();

      if ( scrollY > 50 ) {
        navbarBehavior.fade(navbar);
      } else {
        navbarBehavior.show(navbar);
      }
  });
  }

  logoutUser() {
    setTimeout(() => {
      this.loggedIn = false;
    }, 500);
    
    this._authService.logoutUser();
    window.location.reload();
    // this.loggedIn = this._authService.loggedIn();
    // this.loggedIn = localStorage.getItem('token');
  }

}
