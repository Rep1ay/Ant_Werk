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

  formInput: string;
  loggedUser: boolean;
  templateSending:any;
  constructor(
    private _templatesService: TemplatesService,
              private _authService: AuthService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let lang = localStorage.language;

    switch( lang ){
      case 'ru' :
        this.home = 'Главная',
        this.contacts = 'Контакты',
        this.services = 'Услуги'
        break;
      case 'en' : 
        this.home = 'Home',
        this.contacts = 'Contacts',
        this.services = 'Services'
        break;
    }

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
    debugger
    let lang = localStorage.language;
    let snapshot = this._activatedRoute.snapshot;
    let routerPath = snapshot.children[0].url[1].path
    this._router.navigate(['/' + lang + `/${path}`]);
    routerPath = path;
  }

  chageLanguage(event, lang){
    if(event.target.dataset.disabled === 'false'){
      let snapshot = this._activatedRoute.snapshot;
      let path = snapshot.children[0].url[1].path;
      localStorage.setItem('language', lang);
      this._router.navigate(['/' + lang + `/${path}`]);

      switch( lang ){
        case 'ru' :
          this.home = 'Главная',
          this.contacts = 'Контакты',
          this.services = 'Услуги'
          break;
        case 'en' : 
          this.home = 'Home',
          this.contacts = 'Contacts',
          this.services = 'Services'
          break;
      }

      window.location.reload();
    }else{
      // let alertBlock = document.createElement('div');
      let alertNodeElem = document.createTextNode('Language does not exist');
      let paragraf = document.createElement('p');
     
      paragraf.appendChild(alertNodeElem);
      // alertBlock.appendChild(paragraf);

      document.body.appendChild(paragraf);
      $(paragraf).css({ 'position':'absolute', 
                        'top': '220px', 
                        'right': '-200px', 
                        'background': 'yellowgreen', 
                        'font-size': '20px',
                        'color': '#fff',
                        'padding': '12px'});

      setTimeout(()=>{
        $(paragraf).css({'right': '70px'});
      },100);
     
      setTimeout(()=>{
        $(paragraf).css({'right': '-500px'});
      },3000);
    } 
  }

  editInner(event){
    // debugger
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
