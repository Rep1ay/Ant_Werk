import { Component, OnInit } from '@angular/core';
// import {ProductsService} from '../products.service';
import { AuthService } from './../auth.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { faUser, faDeaf  } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplatesService } from 'src/app/templates.service';

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


    // this._authService._state.subscribe(
    //   state => this.isLoggedIn(state));

    // this.loggedUser = this._authService.loggedIn();
    this.loggedUser = !!localStorage.getItem('token');
    // this.productService.getProductParams().subscribe(
    //   (res) => this.renderNavBar(res)
    // );
    this.navbarBehavior();

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

  chageLanguage(event, lang){
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


          paragrafNewLang.appendChild(paragrafNewLangTaxt);
          blockForAddBtn.appendChild(paragrafNewLang);

          btnAddNewLang.appendChild(btnAddNodeTxt);
          blockForAddBtn.appendChild(paragrafNewLang);
          blockForAddBtn.appendChild(btnAddNewLang);
     
          btnCancelNewLang.appendChild(btnCancelNodeTxt);
          blockForAddBtn.appendChild(btnCancelNewLang);

          paragraf.appendChild(alertNodeElem);
          // alertBlock.appendChild(paragraf);

          document.body.appendChild(paragraf);
          document.body.appendChild(blockForAddBtn);
          // document.body.appendChild(btnCancelNewLang);
          
          btnAddNewLang.setAttribute('class','btn btn-warning');

          $(btnAddNewLang).off().on('click', (event) => {
            localStorage.addNewLang = lang;
            $('.navbar_container').addClass('editing');
            $('.rightsidebar_main_block').addClass('editing');

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
          },
          (err) => {
            // this.showPreloader = true;
            console.log(err);
          }
        );

      
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
  }

  editInner(event){
    $('.blockForBtnEdit').remove();
    this.templateSending = !this.templateSending;
    setTimeout(() => {
      this.templateSending = !this.templateSending;
      $('.main_navbar').removeClass('editing');
      $('.rightsidebar_main_block').removeClass('editing');
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
