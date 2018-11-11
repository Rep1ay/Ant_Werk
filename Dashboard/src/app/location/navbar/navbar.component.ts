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
  showPreloader = true;
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

    this.showPreloader = false;

  }
  isLoggedIn(state) {
    
    this.loggedIn = state;
  }

  changeOfRoutes(url){

    let title;

    this.routeUrl = url;
    this.showPreloader = false;
    let _self = this;
    let prefix = localStorage.language;
    // let title = localStorage.location;
    if(title){
      title = url.split('/')[2];
      this.getTemplate(title);
    }else{
      title = window.location.pathname.split('/')[2];
      this.getTemplate(title);
    }
  }

 getTemplate(title){
    let _self = this;
    let prefix = localStorage.language;
    _self.showPreloader = false;
    this._templatesService.getTemplate(title, prefix)
    .subscribe(
      (res) => {
        if(res){
          
          _self.showPreloader = false;
          localStorage.location = res['pageTitle'];

          // _self.permalink = `/${res['permalink']}`;
          _self._templatesService.getPermalink(res['pageTitle'])
          .subscribe(
            (res) => {
              _self.permalink = `${res['permalink']}`;
            },
            (err) => {
              console.log('Error form HomeComp get template' + err);
            }
          )
        }else{
          
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

    let title = this.routeUrl.split('/')[2];

    this._templatesService.getPermalink(title)
    .subscribe(
      (res) => {
        if(res){
          
          _self.showPreloader = false;
          let pageTitle = localStorage.location = res['pageTitle'];
          _self.permalink = `/${res['permalink']}`;
          _self.getTemplate(pageTitle)
        }else{
          // let pageTitle = window.location.pathname.split('/')[2];
          // _self.getTemplate(pageTitle);
        }
      },
      (err) => {
        console.log('Error form getting permalink' + err);
      }
    )
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
           
           localStorage.location = path;
          _self.permalink = `/${res['permalink']}`;
          _self._router.navigate([`${lang}/${res['permalink']}`]);
        }else{
          console.log('empty permalink');
          localStorage.permalink = path;
          setTimeout(() => {
            _self._router.navigate([`${lang}/${path}`]);
            setTimeout(() => {
              _self._location.go(`${lang}/${path}`)
            }, 100);
          }, 100);
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
    this.permalink = `/${localStorage.permalink}`
    this.permalinkEdit = '';
  }

  add_new_lang_to_panel(){

    // let _self = this;
    // let blockForShortcut = document.createElement('div');
    // let inputForShortcut = document.createElement('input');
    // let paragraf_for_shortcut = document.createElement('p');
    // let paragraf_shortcut_text = document.createTextNode('Type shortcut ');

    // let btnCancelShortcut = document.createElement('button');
    // let btnCancelShortcutNodeTxt = document.createTextNode('Cancel');
    
    // let btn_ok_for_shortcut = document.createElement('button');
    // let btn_shortcut_text = document.createTextNode('OK');

    // $(paragraf_for_shortcut).css({'padding': '5px','margin': '0px'});

    // inputForShortcut.setAttribute('class', 'form-control');
    // btn_ok_for_shortcut.setAttribute('class', 'btn btn-success');
    // btnCancelShortcut.setAttribute('class','btn btn-warning');

    // btnCancelShortcut.appendChild(btnCancelShortcutNodeTxt);
    // paragraf_for_shortcut.appendChild(paragraf_shortcut_text);
    // blockForShortcut.appendChild(paragraf_for_shortcut);
    // blockForShortcut.appendChild(inputForShortcut);
    // blockForShortcut.appendChild(btn_ok_for_shortcut);
    // blockForShortcut.appendChild(btnCancelShortcut);
    // btn_ok_for_shortcut.appendChild(btn_shortcut_text);

    // document.body.appendChild(blockForShortcut);

    // $(btnCancelShortcut).off().on('click', () => {
    //   $(blockForShortcut).css({ 'right':'-1000px'})
    // });

    // $(btn_ok_for_shortcut).off().on('click', (event) => {
     
    //   let lang = {
    //     prefix: (inputForShortcut.value).toUpperCase()
    //   }
    //   this.lang_items.push(lang);

    //   // this._templatesService.add_new_lang_panel(lang).subscribe(
    //   //   (res) => {
    //   //     alert('language has been added');
    //   //   },
    //   //   (err) => {
    //   //     console.log();
    //   //   }
    //   // );

    // $('.lang_menu_item').css('cursor', 'pointer');

    // setTimeout(() => {
    //   $(blockForShortcut).css({ 'right':'-1000px'})
    // }, 500);

    // })

    // $(inputForShortcut).css({
    //   'width': '55px',
    //   'font-size': '25px',
    //   'color': '#222'
    // })
    
    // $(blockForShortcut).css({ 'position':'fixed', 
    //                             'top': '220px', 
    //                             'display': 'flex',
    //                             'right': '50px', 
    //                             'background': '#2e8dc5', 
    //                             'font-size': '17px',
    //                             'color': '#fff',
    //                             'padding': '12px'
    //                           });
  

  // end of else
  }

  

  changeLanguage(lang){
    let _self = this;
    this.addingLangBody = lang;
        // let lang = event.target.dataset.lang;
        let title = localStorage.location;
        // let prefix = localStorage.language;
        this._templatesService.getTemplate(title, lang)
        .subscribe(
          (res) => {

            if(res){

              localStorage.language = res['prefix'];
              // let prefix = localStorage.language;
              this.template = res['template'];
              this._router.config[0].path = lang


              _self._templatesService.getPermalink(res['pageTitle'])
              .subscribe(
                (res) => {
                  _self.permalink = `${res['permalink']}`;
                  let title = res['pageTitle'];
                  let permalink = res['permalink']
                  _self._router.config[0].children.forEach((route) => {
                    if(route.path === title){
                      // route.path = `${localStorage.language}/${res['permalink']}`;
                      route.path = `${permalink}`;
                    }
                  })

                  _self._location.go(`${lang}/${permalink}`);
                  _self._router.navigate([`../${lang}/${permalink}`]);
                  // _self.showPreloader = true;


                  setTimeout(() => {
                      // _self.showPreloader = false;
                  }, 1500)
                  // window.location.reload();
                },
                (err) => {
                  console.log('Error form HomeComp get template' + err);
                }
              )
    
            }else{
               this.acceptAddingNewLang = true;
            }
              },
          (err) => {
              // this.showPreloader = true;
              console.log(err);
            }
            )
  }


  // createNewLanguage(lang){

  //   console.log('tamplate dosen exist');
  //   let alertNodeElem = document.createTextNode(` ${(lang).toUpperCase()} language does not exist`);
  //   // let paragraf = document.createElement('p');

  //   let blockForAddBtn = document.createElement('div')
  //   let paragrafNewLang = document.createElement('p');
  //   let paragrafNewLangTaxt = document.createTextNode(`Add ${(lang).toUpperCase()} language for this page?`);
    
  //   let btnAddNewLang = document.createElement('button');
  //   let btnAddNodeTxt = document.createTextNode('+ Add');

  //   let btnCancelNewLang = document.createElement('button');
  //   let btnCancelNodeTxt = document.createTextNode('Cancel');

  //   let blockForEditLang = document.createElement('div')
  //   let btGotIt = document.createElement('button');
  //   let btnGotItText = document.createTextNode(`Ok,I've got it!`);
  //   let paragrafEditLang = document.createElement('p');
  //   let paragrafEditLangText = document.createTextNode(`Adding ${(lang).toUpperCase()} language, dont forget save changes`);


  //   blockForEditLang.setAttribute('class', 'blockForEditLang');

    
  //   btGotIt.appendChild(btnGotItText);
  //   paragrafEditLang.appendChild(paragrafEditLangText);
  //   blockForEditLang.appendChild(paragrafEditLang);
  //   blockForEditLang.appendChild(btGotIt);
  //   btGotIt.setAttribute('class','btn btn-primary');
  //   btGotIt.onclick = function(){
  //     $(blockForEditLang).css('right', '-1000px');
  //   }

  //   blockForAddBtn.appendChild(btnAddNewLang);

  //   paragrafNewLang.appendChild(paragrafNewLangTaxt);
  //   blockForAddBtn.appendChild(paragrafNewLang);

  //   btnAddNewLang.appendChild(btnAddNodeTxt);
  //   blockForAddBtn.appendChild(paragrafNewLang);
  //   blockForAddBtn.appendChild(btnAddNewLang);

  //   btnAddNewLang.appendChild(btnAddNodeTxt);
  //   blockForAddBtn.appendChild(paragrafNewLang);
  //   blockForAddBtn.appendChild(btnAddNewLang);

  //   btnCancelNewLang.appendChild(btnCancelNodeTxt);
  //   blockForAddBtn.appendChild(btnCancelNewLang);

  //   // paragraf.appendChild(alertNodeElem);
  //   // alertBlock.appendChild(paragraf);

  //   // document.body.appendChild(paragraf);
  //   document.body.appendChild(blockForAddBtn);
  //   document.body.appendChild(blockForEditLang);
  //   // document.body.appendChild(btnCancelNewLang);
    
  //   btnAddNewLang.setAttribute('class','btn btn-warning');
  //   // btnSaveChanges.setAttribute('class','btn btn-primary');


  //   $(btnAddNewLang).off().on('click', (event) => {
  //     localStorage.addNewLang = lang;
  //     // $('.navbar_container').addClass('editing');
  //     // $('.rightsidebar_main_block').addClass('editing');
  //     $(blockForAddBtn).css('right', '-1000px');
  //     $(blockForEditLang).css('right', '0px');
  //   });

  //   $(btnCancelNewLang).off().on('click', (event) => {
  //     $(blockForAddBtn).css('right', '-1000px');
  //   });

  //   btnCancelNewLang.setAttribute('class','btn btn-danger');
  //   $(btnCancelNewLang).css('margin-left', '10px');

  //   // $(paragraf).css({ 'position':'absolute', 
  //   //                   'top': '220px', 
  //   //                   'right': '-200px', 
  //   //                   'background': 'yellowgreen', 
  //   //                   'font-size': '20px',
  //   //                   'color': '#fff',
  //   //                   'padding': '12px'
  //   //                 });

  //   $(blockForAddBtn).css({ 'position':'fixed', 
  //                           'top': '300px', 
  //                           'right': '-1000px', 
  //                           'background': 'yellowgreen', 
  //                           'font-size': '20px',
  //                           'color': '#fff',
  //                           'padding': '12px'
  //                         });

  //   $(blockForEditLang).css({ 'position':'fixed', 
  //                           'top': '120px', 
  //                           'right': '-1000px', 
  //                           'background': '#f5494978', 
  //                           'font-size': '20px',
  //                           'color': '#fff',
  //                           'padding': '12px'
  //                         });

  //   setTimeout(()=>{
  //     $(blockForAddBtn).css({'right': '70px'});
  //   },1000);
  
  //   // setTimeout(()=>{
  //   //   $(paragraf).css({'right': '70px'});
  //   // },100);

  //   // setTimeout(()=>{
  //   //   $(paragraf).css({'right': '-500px'});
  //   // },3000);
  // }

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
