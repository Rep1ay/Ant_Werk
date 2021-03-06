import { Component, OnInit } from '@angular/core';
// import {ProductsService} from '../products.service';
import { AuthService } from './../auth.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { faUser, faDeaf  } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, UrlSegment, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TemplatesService } from 'src/app/templates.service';
import { LangPanel } from '../lang-panel';
import { Location } from '@angular/common';

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
  loggedUser: boolean;
  templateSending:any;
  constructor(


    
    private _templatesService: TemplatesService,
              private _authService: AuthService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _location : Location,
              )
               { 

              //   _router.events.subscribe((val) => {
              //     // see also 
              //     
              //     console.log(val instanceof NavigationEnd) 
              // });
//               
//               let windPath = window.location.pathname.split('/')[1];
//               _router.config.forEach(rout => {
//                 
//                 let pageRout = rout.path.split('/')[1];
//                 if(pageRout.length > 2){
//                    pageRout 
//                 }
               
//               })

//               let loc =_location.path().replace('/', '');
           
//               let routConf = _router.config[1].path.split('/')[0];
//               let empty = '';
//               if(!localStorage.language){
//                 if(loc !== empty){
//                   localStorage.language = loc.split('/')[0];
//                   _router.config[1].path = loc;
//                 }
//               }else{
//                 _router.config[1].path = `${localStorage.language}/${loc.split('/')[1]}`
//               }

//               // _router.config[0].path = _location.path().replace('/','');
//               // _router.config[0].children[0].path = _location.path().replace('/', '');
// 

//               // window.location.pathname = _router.config[1].path

//             //   if(localStorage.language !== locPath){
//             //     routConf = locPath;
//             //  }
//             // if( _router.config[1].path.split('/')[0] === "undefined"){
             
//             // }
           


//             this._location.go(_router.config[1].path);
            // _router.config[1].path = loc;
            }



  ngOnInit() {



    // $( document ).ready(()=> {
    //   this.chageLanguage();
    // });
    this._authService._state.subscribe(
      state => {debugger;this.isLoggedIn(state)});

    this.loggedUser = this._authService.loggedIn();
    this.loggedUser = !!localStorage.getItem('token');
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
    debugger
    this.loggedUser = state;
  }

  followLink(path){
// 
    let lang = localStorage.language;
    let snapshot = this._activatedRoute.snapshot;
    this._router.navigate([`${lang}/${path}`]);
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
              window.location.reload();
    
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
    this.loggedUser = false;
    this._authService.logoutUser();
    window.location.reload();
    // this.loggedUser = this._authService.loggedIn();
    // this.loggedUser = localStorage.getItem('token');
  }

}
