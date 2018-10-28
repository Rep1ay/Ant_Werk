import { Component, OnInit } from '@angular/core';
// import {ProductsService} from '../products.service';
import { AuthService } from './../auth.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { faUser, faDeaf  } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplatesService } from 'src/app/templates.service';
import { LangPanel } from '../lang-panel';

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
              private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    // $( document ).ready(()=> {
    //   this.chageLanguage();
    // });
    // this._authService._state.subscribe(
    //   state => this.isLoggedIn(state));

    // this.loggedUser = this._authService.loggedIn();
    this.loggedUser = !!localStorage.getItem('token');
    // this.productService.getProductParams().subscribe(
    //   (res) => this.renderNavBar(res)
    // );
    this.navbarBehavior();

    let lang = {
      prefix: 'EN'
    }
   

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

    let lang = localStorage.language;
    let snapshot = this._activatedRoute.snapshot;
    let routerPath = snapshot.children[0].url[0].path
    this._router.navigate([`/${path}`]);
    routerPath = path;
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
        // }else{
        //   // debugger
        //   let blockForShortcut = document.createElement('div');
        //   let inputForShortcut = document.createElement('input');
        //   let paragraf_for_shortcut = document.createElement('p');
        //   let paragraf_shortcut_text = document.createTextNode('Type shortcut ');

        //   let btnCancelShortcut = document.createElement('button');
        //   let btnCancelShortcutNodeTxt = document.createTextNode('Cancel');
          
        //   let btn_ok_for_shortcut = document.createElement('button');
        //   let btn_shortcut_text = document.createTextNode('OK');

        //   $(paragraf_for_shortcut).css({'padding': '5px','margin': '0px'});

        //   inputForShortcut.setAttribute('class', 'form-control');
        //   btn_ok_for_shortcut.setAttribute('class', 'btn btn-success');
        //   btnCancelShortcut.setAttribute('class','btn btn-warning');

        //   btnCancelShortcut.appendChild(btnCancelShortcutNodeTxt);
        //   paragraf_for_shortcut.appendChild(paragraf_shortcut_text);
        //   blockForShortcut.appendChild(paragraf_for_shortcut);
        //   blockForShortcut.appendChild(inputForShortcut);
        //   blockForShortcut.appendChild(btn_ok_for_shortcut);
        //   blockForShortcut.appendChild(btnCancelShortcut);
        //   btn_ok_for_shortcut.appendChild(btn_shortcut_text);

        //   document.body.appendChild(blockForShortcut);

        //   $(btnCancelShortcut).off().on('click', () => {
        //     $(blockForShortcut).css({ 'right':'-1000px'})
        //   });

        //   $(btn_ok_for_shortcut).off().on('click', (event) => {
           
        //     let lang = inputForShortcut.value;
        //     $(`<li>${lang}</li>`).addClass( "lang_menu_item" ).data('lang', lang)
        //     .on({
        //       'click': ( event ) => {
        //         debugger
        //         let title = localStorage.location;
        //         _self._templatesService.getTemplate(title, lang)
        //         .subscribe(
        //           (res) => {
        //             if(res){
        //               localStorage.language = lang;
        //               // let prefix = localStorage.language;
        //               this.template = res['template'];
        //               window.location.reload();
            
        //             }else{
        //               _self.createNewLanguage(lang);
        //             }
        //               },
        //               (err) => {
        //                 // this.showPreloader = true;
        //                 console.log(err);
        //               }
        //             );
        //       }
        //     })
        //   .appendTo( '#language_panel' );

        //   $('.lang_menu_item').css('cursor', 'pointer');

        //   setTimeout(() => {
        //     $(blockForShortcut).css({ 'right':'-1000px'})
        //   }, 500);

        //   })

        //   $(inputForShortcut).css({
        //     'width': '55px',
        //     'font-size': '25px',
        //     'color': '#222'
        //   })
          
        //   $(blockForShortcut).css({ 'position':'fixed', 
        //                               'top': '220px', 
        //                               'display': 'flex',
        //                               'right': '50px', 
        //                               'background': '#2e8dc5', 
        //                               'font-size': '17px',
        //                               'color': '#fff',
        //                               'padding': '12px'
        //                             });
        

        // // end of else
        // }

        



        // end of lang_menu_item click event 

   

      
    // if(event.target.dataset.disabled === 'false'){
    //   let snapshot = this._activatedRoute.snapshot;
    //   let path = snapshot.children[0].url[0].path;
    //   localStorage.setItem('language', lang);
    //   this._router.navigate([`/${path}`]);

    //   // switch( lang ){
    //   //   case 'ru' :
    //   //     this.home = 'Главная',
    //   //     this.contacts = 'Контакты',
    //   //     this.services = 'Услуги'
    //   //     break;
    //   //   case 'en' : 
    //   //     this.home = 'Home',
    //   //     this.contacts = 'Contacts',
    //   //     this.services = 'Services'
    //   //     break;
    //   // }

    //   // window.location.reload();
    // }else{
    //   // let alertBlock = document.createElement('div');
    //   let alertNodeElem = document.createTextNode('Language does not exist');
    //   let paragraf = document.createElement('p');
     
    //   paragraf.appendChild(alertNodeElem);
    //   // alertBlock.appendChild(paragraf);

    //   document.body.appendChild(paragraf);
    //   $(paragraf).css({ 'position':'absolute', 
    //                     'top': '220px', 
    //                     'right': '-200px', 
    //                     'background': 'yellowgreen', 
    //                     'font-size': '20px',
    //                     'color': '#fff',
    //                     'padding': '12px'});

    //   setTimeout(()=>{
    //     $(paragraf).css({'right': '70px'});
    //   },100);
     
    //   setTimeout(()=>{
    //     $(paragraf).css({'right': '-500px'});
    //   },3000);
    // } 

  
  createNewLanguage(lang){

    console.log('tamplate dosen exist');
    let alertNodeElem = document.createTextNode(` ${(lang).toUpperCase()} language does not exist`);
    let paragraf = document.createElement('p');

    let blockForAddBtn = document.createElement('div')
    let paragrafNewLang = document.createElement('p');
    let paragrafNewLangTaxt = document.createTextNode(`Add ${(lang).toUpperCase()} language for this page?`);
    
    let btnAddNewLang = document.createElement('button');
    let btnAddNodeTxt = document.createTextNode('+ Add');

    let btnCancelNewLang = document.createElement('button');
    let btnCancelNodeTxt = document.createTextNode('Cancel');

    let blockForEditLang = document.createElement('div')
    // let btnSaveChanges = document.createElement('button');
    // let btnSaveChangesText = document.createTextNode('Save');
    let paragrafEditLang = document.createElement('p');
    let paragrafEditLangText = document.createTextNode(`Adding ${(lang).toUpperCase()} language, dont forget save changes`);

    blockForEditLang.setAttribute('class', 'blockForEditLang');
    $(blockForEditLang).on('mouseover', (event) => {
      $(blockForEditLang).css('right', '-1000px');
      setTimeout(()=> {
        $(blockForEditLang).css('right', '0px');
      }, 2000)
    })
    // btnSaveChanges.appendChild(btnSaveChangesText);
    paragrafEditLang.appendChild(paragrafEditLangText);
    blockForEditLang.appendChild(paragrafEditLang);
    // blockForEditLang.appendChild(btnSaveChanges);

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

    paragraf.appendChild(alertNodeElem);
    // alertBlock.appendChild(paragraf);

    document.body.appendChild(paragraf);
    document.body.appendChild(blockForAddBtn);
    document.body.appendChild(blockForEditLang);
    // document.body.appendChild(btnCancelNewLang);
    
    btnAddNewLang.setAttribute('class','btn btn-warning');
    // btnSaveChanges.setAttribute('class','btn btn-primary');


    $(btnAddNewLang).off().on('click', (event) => {
      localStorage.addNewLang = lang;
      $('.navbar_container').addClass('editing');
      $('.rightsidebar_main_block').addClass('editing');
      $(blockForAddBtn).css('right', '-1000px');
      $(blockForEditLang).css('right', '0px');
    });

    $(btnCancelNewLang).off().on('click', (event) => {
      $(blockForAddBtn).css('right', '-1000px');
    });

    btnCancelNewLang.setAttribute('class','btn btn-danger');
    $(btnCancelNewLang).css('margin-left', '10px');

    $(paragraf).css({ 'position':'absolute', 
                      'top': '220px', 
                      'right': '-200px', 
                      'background': 'yellowgreen', 
                      'font-size': '20px',
                      'color': '#fff',
                      'padding': '12px'
                    });

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
  
    setTimeout(()=>{
      $(paragraf).css({'right': '70px'});
    },100);

    setTimeout(()=>{
      $(paragraf).css({'right': '-500px'});
    },3000);
  }

  editInner(event){
    $('.blockForBtnEdit').remove();
    this.templateSending = !this.templateSending;
    setTimeout(() => {
      this.templateSending = !this.templateSending;
      $('.navbar_container ').removeClass('editing');
      $('.blockForEditLang').css('right', '-1000px');
      // $('.rightsidebar_main_block').removeClass('editing');
    }, 2000);
    this._templatesService.editInner(event);
  }

  navbarBehavior() {
    window.addEventListener('scroll', function(e) {

      const scrollY = window.scrollY;
      const navbar = document.querySelector('.navbar_container');
      // const products_collections = document.querySelector('.products_collections ul');

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
      // navbarBehavior.toggle(products_collections, 'fade_out_navbar', 'fade_in_navbar');
  });
  }

  renderNavBar(responce) {
    const res = responce;
  }
  
  showProductsCollection(collection) {
    const scrolled = document.querySelector('.navbar_container').classList.contains('fixed_to_top');
    if (scrolled) {
      collection.setAttribute('style', 'top: 56px');
    } else {
      collection.setAttribute('style', 'top: 76px');
    }
    collection.classList.toggle('fade_in_navbar');
  }

  routeToSearch(input) {
    if (input.value.length >= 2) {
        this._router.navigate(['/search'], {queryParams: {value: input.value}});
        window.location.reload();
    } else {
      input.classList.add('notValid');
      setTimeout(() => {
        input.classList.remove('notValid');
      }, 1000 );
    }
  }

  logoutUser() {
    this.loggedUser = false;
    this._authService.logoutUser();
    // this.loggedUser = this._authService.loggedIn();
    // this.loggedUser = localStorage.getItem('token');
  }

}
