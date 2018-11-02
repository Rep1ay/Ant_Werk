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
  services = 'Services';
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
  constructor(


    
    private _templatesService: TemplatesService,
              private _authService: AuthService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _location : Location,
              )
               { 
                this.winOrigin = window.location.origin;
                this.winPathname = window.location.pathname;
                this._router.events.pipe(
                  filter((event:Event) => event instanceof NavigationEnd)
                ).subscribe((routeData: any) => {
                  
                  this.changeOfRoutes(routeData.url);

                })
            }

  ngOnInit() {

    this._authService._state.subscribe(
      state => {;this.isLoggedIn(state)});

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
        
        if(!lang_collect.includes('EN')){
          let en_lang = {
            prefix: 'EN'
          }
          this.lang_items.push(en_lang);
        }
      },
      (err) => {
        console.log('Error from language panel' +'</br>'+ err);
      }
    )

  }
  isLoggedIn(state) {
    
    this.loggedIn = state;
  }

  changeOfRoutes(url){
    this.routeUrl = url;
    
    let _self = this;
    let prefix = localStorage.language;
    let title = localStorage.location;
    this._templatesService.getPermalink(title)
    .subscribe(
      (res) => {
        if(res){
          
          let pageTitle = res['pageTitle'];
          _self.permalink = `/${res['permalink']}`;
          localStorage.permalink = _self.routeUrl.split('/')[2];

          _self._router.config[0].children.forEach((route) => {
            if(route.path === pageTitle){
              route.path = `${res['permalink']}`;
            }
          })
           _self._location.go(`${localStorage.language}/${res['permalink']}`)
        }else{
          console.log('empty permalink');
          localStorage.permalink = title;
          this._router.navigate([`${prefix}/${title}`]);
          console.log('empty permalink');
          
        }
      },
      (err) => {
        console.log('Error form getting permalink' + err);
      }
    )
  }

  followLink(path){
    let lang = localStorage.language;
    let snapshot = this._activatedRoute.snapshot;
    let _self = this;

    this._templatesService.getPermalink(path)
    .subscribe(
      (res) => {
        if(res){
          
          let pageTitle = res['pageTitle'];
          // this.permalink = this.permalinkEdit = res['permalink'];
          // localStorage.permalink = res['permalink'];

          _self._router.config[0].children.forEach((route) => {
            if(route.path === pageTitle){
              // route.path = `${localStorage.language}/${res['permalink']}`;
              route.path = `${res['permalink']}`;
            }
          })
          localStorage.permalink = `${res['permalink']}`;
           _self._location.go(`${localStorage.language}/${res['permalink']}`);
           debugger
           localStorage.location = path;

           this._router.navigate([`${lang}/${res['permalink']}`]);
        }else{
          console.log('empty permalink');
          localStorage.permalink = path;
          this._router.navigate([`${lang}/${path}`]);
          // _self._location.go(`${localStorage.language}/${path}`)
        }
      },
      (err) => {
        console.log('Error form getting permalink' + err);
      }
    )

    // this.showPreloader = true;
   
    // setTimeout(() => {
    // this.showPreloader = false;
    // }, 1000);
    // window.location.reload();
    setTimeout(() => {
      
    }, 1000);


   
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
    debugger
    this.permalink = `/${localStorage.permalink}`
    this.permalinkEdit = '';
  }

  add_new_lang_to_panel(){

    let _self = this;
    let blockForShortcut = document.createElement('div');
    let inputForShortcut = document.createElement('input');
    let paragraf_for_shortcut = document.createElement('p');
    let paragraf_shortcut_text = document.createTextNode('Type shortcut ');

    let btnCancelShortcut = document.createElement('button');
    let btnCancelShortcutNodeTxt = document.createTextNode('Cancel');
    
    let btn_ok_for_shortcut = document.createElement('button');
    let btn_shortcut_text = document.createTextNode('OK');

    $(paragraf_for_shortcut).css({'padding': '5px','margin': '0px'});

    inputForShortcut.setAttribute('class', 'form-control');
    btn_ok_for_shortcut.setAttribute('class', 'btn btn-success');
    btnCancelShortcut.setAttribute('class','btn btn-warning');

    btnCancelShortcut.appendChild(btnCancelShortcutNodeTxt);
    paragraf_for_shortcut.appendChild(paragraf_shortcut_text);
    blockForShortcut.appendChild(paragraf_for_shortcut);
    blockForShortcut.appendChild(inputForShortcut);
    blockForShortcut.appendChild(btn_ok_for_shortcut);
    blockForShortcut.appendChild(btnCancelShortcut);
    btn_ok_for_shortcut.appendChild(btn_shortcut_text);

    document.body.appendChild(blockForShortcut);

    $(btnCancelShortcut).off().on('click', () => {
      $(blockForShortcut).css({ 'right':'-1000px'})
    });

    $(btn_ok_for_shortcut).off().on('click', (event) => {
     
      let lang = {
        prefix: (inputForShortcut.value).toUpperCase()
      }
      this.lang_items.push(lang);

      // this._templatesService.add_new_lang_panel(lang).subscribe(
      //   (res) => {
      //     alert('language has been added');
      //   },
      //   (err) => {
      //     console.log();
      //   }
      // );

    $('.lang_menu_item').css('cursor', 'pointer');

    setTimeout(() => {
      $(blockForShortcut).css({ 'right':'-1000px'})
    }, 500);

    })

    $(inputForShortcut).css({
      'width': '55px',
      'font-size': '25px',
      'color': '#222'
    })
    
    $(blockForShortcut).css({ 'position':'fixed', 
                                'top': '220px', 
                                'display': 'flex',
                                'right': '50px', 
                                'background': '#2e8dc5', 
                                'font-size': '17px',
                                'color': '#fff',
                                'padding': '12px'
                              });
  

  // end of else
  }

  

  changeLanguage(lang){
    let _self = this;

        // let lang = event.target.dataset.lang;
        let title = localStorage.location;
        // let prefix = localStorage.language;
        this._templatesService.getTemplate(title, lang)
        .subscribe(
          (res) => {

            if(res){
              
              localStorage.language = lang;
              // let prefix = localStorage.language;
              this.template = res['template'];
              this._router.config[0].path = lang
              this._router.navigate([`../${lang}/${localStorage.permalink}`])

              // window.location.reload();
    
            }else{
              this.createNewLanguage(lang);
            }
              },
          (err) => {
              // this.showPreloader = true;
              console.log(err);
            }
            )
  }

  createNewLanguage(lang){

    console.log('tamplate dosen exist');
    let alertNodeElem = document.createTextNode(` ${(lang).toUpperCase()} language does not exist`);
    // let paragraf = document.createElement('p');

    let blockForAddBtn = document.createElement('div')
    let paragrafNewLang = document.createElement('p');
    let paragrafNewLangTaxt = document.createTextNode(`Add ${(lang).toUpperCase()} language for this page?`);
    
    let btnAddNewLang = document.createElement('button');
    let btnAddNodeTxt = document.createTextNode('+ Add');

    let btnCancelNewLang = document.createElement('button');
    let btnCancelNodeTxt = document.createTextNode('Cancel');

    let blockForEditLang = document.createElement('div')
    let btGotIt = document.createElement('button');
    let btnGotItText = document.createTextNode(`Ok,I've got it!`);
    let paragrafEditLang = document.createElement('p');
    let paragrafEditLangText = document.createTextNode(`Adding ${(lang).toUpperCase()} language, dont forget save changes`);


    blockForEditLang.setAttribute('class', 'blockForEditLang');

    
    btGotIt.appendChild(btnGotItText);
    paragrafEditLang.appendChild(paragrafEditLangText);
    blockForEditLang.appendChild(paragrafEditLang);
    blockForEditLang.appendChild(btGotIt);
    btGotIt.setAttribute('class','btn btn-primary');
    btGotIt.onclick = function(){
      $(blockForEditLang).css('right', '-1000px');
    }

    blockForAddBtn.appendChild(btnAddNewLang);

    paragrafNewLang.appendChild(paragrafNewLangTaxt);
    blockForAddBtn.appendChild(paragrafNewLang);

    btnAddNewLang.appendChild(btnAddNodeTxt);
    blockForAddBtn.appendChild(paragrafNewLang);
    blockForAddBtn.appendChild(btnAddNewLang);

    btnAddNewLang.appendChild(btnAddNodeTxt);
    blockForAddBtn.appendChild(paragrafNewLang);
    blockForAddBtn.appendChild(btnAddNewLang);

    btnCancelNewLang.appendChild(btnCancelNodeTxt);
    blockForAddBtn.appendChild(btnCancelNewLang);

    // paragraf.appendChild(alertNodeElem);
    // alertBlock.appendChild(paragraf);

    // document.body.appendChild(paragraf);
    document.body.appendChild(blockForAddBtn);
    document.body.appendChild(blockForEditLang);
    // document.body.appendChild(btnCancelNewLang);
    
    btnAddNewLang.setAttribute('class','btn btn-warning');
    // btnSaveChanges.setAttribute('class','btn btn-primary');


    $(btnAddNewLang).off().on('click', (event) => {
      localStorage.addNewLang = lang;
      // $('.navbar_container').addClass('editing');
      // $('.rightsidebar_main_block').addClass('editing');
      $(blockForAddBtn).css('right', '-1000px');
      $(blockForEditLang).css('right', '0px');
    });

    $(btnCancelNewLang).off().on('click', (event) => {
      $(blockForAddBtn).css('right', '-1000px');
    });

    btnCancelNewLang.setAttribute('class','btn btn-danger');
    $(btnCancelNewLang).css('margin-left', '10px');

    // $(paragraf).css({ 'position':'absolute', 
    //                   'top': '220px', 
    //                   'right': '-200px', 
    //                   'background': 'yellowgreen', 
    //                   'font-size': '20px',
    //                   'color': '#fff',
    //                   'padding': '12px'
    //                 });

    $(blockForAddBtn).css({ 'position':'fixed', 
                            'top': '300px', 
                            'right': '-1000px', 
                            'background': 'yellowgreen', 
                            'font-size': '20px',
                            'color': '#fff',
                            'padding': '12px'
                          });

    $(blockForEditLang).css({ 'position':'fixed', 
                            'top': '120px', 
                            'right': '-1000px', 
                            'background': '#f5494978', 
                            'font-size': '20px',
                            'color': '#fff',
                            'padding': '12px'
                          });

    setTimeout(()=>{
      $(blockForAddBtn).css({'right': '70px'});
    },1000);
  
    // setTimeout(()=>{
    //   $(paragraf).css({'right': '70px'});
    // },100);

    // setTimeout(()=>{
    //   $(paragraf).css({'right': '-500px'});
    // },3000);
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
