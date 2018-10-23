import { Component, OnInit } from '@angular/core';
// import {ProductsService} from '../products.service';
import { AuthService } from './../auth.service';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { faUser, faDeaf  } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TemplatesService } from 'src/app/templates.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  productCollection: any;
  // faUser  = faUser;
  formInput: string;
  loggedUser: boolean;
  constructor(
    private _templatesService: TemplatesService,
              private _authService: AuthService,
              private route: Router) { }

  ngOnInit() {
    // debugger
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

  editInner(event){
    // debugger
    this._templatesService.editInner(event);
  }

  navbarBehavior() {
    window.addEventListener('scroll', function(e) {

      const scrollY = window.scrollY;
      const navbar = document.querySelector('.navbar_container');
      const products_collections = document.querySelector('.products_collections ul');

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
      navbarBehavior.toggle(products_collections, 'fade_out_navbar', 'fade_in_navbar');
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
        this.route.navigate(['/search'], {queryParams: {value: input.value}});
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
