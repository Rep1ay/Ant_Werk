import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../templates.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
// import Swiper from '
// import { filter } from 'rxjs/operators';
import { Observable, Subject, asapScheduler, pipe, of, from,
  interval, merge, fromEvent } from 'rxjs';
  import { map, filter, scan, finalize } from 'rxjs/operators';

  import { AngularFireDatabase } from 'angularfire2/database';
  import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { NewsCollection } from 'src/app/news-collection';
import { marker } from 'src/app/marker';

// Jquery declaration
declare let $: any;
declare let Swiper: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  latitude = 52.2330653;
  longitude = 20.9211105;
  
  newsCollection: NewsCollection[] = [];
  itemValue = '';
  items: Observable<any[]>;
  blockElement:any;
  loggedIn: boolean;
  lastTarget: any;
  title: string;
  prefix: string;
  template: any;
  newTemplate: string;
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
  currentLocation = 'home';
  counterEnter = false;
  rendered = false;

  profileUrl: string;
  file;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  zoom: number = 4;
  
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  markers: marker[] = [
	  {
		  lat: 52.2330653,
		  lng: 20.9211105,
      label: 'Poland',
      iconUrl: 'https://firebasestorage.googleapis.com/v0/b/antwerk-2a8e5.appspot.com/o/pin.png?alt=media&token=4500a020-2792-4363-8f3a-1702caaf4bd7',
		  draggable: false
	  },
	  {
		  lat:52.5069312,
		  lng: 13.1445495,
      label: 'Germany',
      iconUrl: 'https://firebasestorage.googleapis.com/v0/b/antwerk-2a8e5.appspot.com/o/pin.png?alt=media&token=4500a020-2792-4363-8f3a-1702caaf4bd7',
		  draggable: false
	  },
	  {
		  lat: 48.8589507,
      lng: 2.2770199,
      iconUrl: 'https://firebasestorage.googleapis.com/v0/b/antwerk-2a8e5.appspot.com/o/pin.png?alt=media&token=4500a020-2792-4363-8f3a-1702caaf4bd7',
		  label: 'France',
		  draggable: false
	  }
  ]


  constructor(private _templatesService: TemplatesService, 
            formBuilder: FormBuilder,
            private _auth: AuthService,
            private _activeRoute: ActivatedRoute,
            public _router: Router,
            private _location: Location,
            public db: AngularFireDatabase,
            private afStorage: AngularFireStorage,
            private storage: AngularFireStorage,
            ) { 


              
              this.items = db.list('items').valueChanges();

              this.winOrigin = window.location.origin;
              this.winPathname = window.location.pathname;

              this._router.events.pipe(
                filter((event:Event) => event instanceof NavigationEnd)
              ).subscribe((routeData: any) => {
                this.winOrigin = window.location.origin;
                this.winPathname = window.location.pathname;

                if(this.currentLocation === localStorage.permalink || this.currentLocation === localStorage.location){
                  if(!this.counterEnter){
                      this.changeOfRoutes(routeData.url);
                      this.counterEnter = true;
                    }
                  }

              })
          }

  ngOnInit() {

    this._router.routerState
    
    let snapshotURL = this._activeRoute.snapshot.url;
    // localStorage.location = this.title = snapshotURL[0].path;
    // let title = localStorage.location;
    let location = window.location.pathname.split('/')[2];
    this.loggedIn = this._auth.loggedIn();
    let lang = localStorage.language;

    this._templatesService._event.subscribe(
      event => {
        this.editInner(event)
      }
    )

    // if(this.currentLocation !== 'home' && !this.rendered){
    //   localStorage.location = location;
    //   this.getTemplate(location);
    //   this.getLastNews(lang);
    // }
    this.showPreloader = true;
    if(this.currentLocation !== 'home'){
      localStorage.location = location;
    }
    if(!this.rendered){
      this.getTemplate(location);
      this.getLastNews(lang);
    }
    
   
 };
  
  mapClicked(event) {
    this.markers.push({
      lat: event.coords.lat,
      lng: event.coords.lng,
      iconUrl: '',
      draggable: true
    });
  }
  
  changeOfRoutes(url){
    let lang = localStorage.language;
    let title = localStorage.location;
    this.routeUrl = url;
    this.showPreloader = true;

    if(!this.rendered){
      this.getTemplate(title);
      this.getLastNews(lang);
    }
  }

 getTemplate(title){
  this.rendered = true;
    let _self = this;
    let prefix = localStorage.language;
    if(!prefix || prefix === ''){
      // if(prefix = window.location.pathname.split('/')[1] !== ''){
        prefix ='en'
      // }
    }
    this._templatesService.getTemplate(title, prefix)
    .subscribe(
      (res) => {
        if(res){
          let template;
          let permalink;
          let lang = localStorage.language;
         
          if(!res['data']['template']){
            template = false;
          }else{
            template = res['data']['template'];
          }
          
          _self.permalink = permalink = `/${localStorage.permalink}`;
          let origin = window.location.origin;

          _self.permalinkURL = `${origin}/${lang}${permalink}`

          _self.renderTemplate(template);
        }else{
          // added to test loading witout layout in DB
          let template = null;
          _self.renderTemplate(template)
        }

      },
      (err) => {
        console.log(err);
      }
    );
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

  renderTemplate(template){
    let _self = this;
    this.newTemplate = template;
    this.template = template;
    this.rendered = true;
    this.counterEnter = false;

    if(this.loggedIn) {
      
      setTimeout(() => {
        this.showPreloader = false;
        if(_self.template){

          setTimeout(() => {
            let body = document.getElementById('body');
            if(body){
              body.insertAdjacentHTML('beforeend', _self.newTemplate);
            }
            setTimeout(() => {
              this.addEditButton();
              this.editServiceDescription();
              _self.renderLayout();
              // this.changeImage();
              this.renderNews();
            
            }, 100)

          }, 100)

        }else{
          _self.template = false;
        setTimeout(() => {
          this.addEditButton();
          this.editServiceDescription();
            // this.changeImage();
          this.renderLayout();
          this.renderNews();
        }, 100)
        }

     }, 1000)

    }else{
      setTimeout(() => {
        let body = document.getElementById('body');
        if(body){
          body.insertAdjacentHTML('beforeend', _self.newTemplate);
        }
      }, 100)
      
      
      setTimeout(() => {
        this.showPreloader = false;

        setTimeout(() => {
          this.renderLayout();
          this.renderNews();
        }, 100)
      }, 1000)
    }
  }

  renderLayout(){
    let _self = this;
    $(document).ready(function ($) {

      // if(_self.loggedIn){
      //   $('.service-overview-content').addClass('show-more');
      //   $('.type-weight-content').addClass('show-type');
      // }else{
        $('.service-overview').hover(
          function() {
            $(this).find('.service-overview-content').addClass('show-more');
          }, function() {
            $(this).find('.service-overview-content').removeClass('show-more');
          }
        );
    
      $('.type-weight-service-img').hover(
          function() {
            $(this).find('.type-weight-content').addClass('show-type');
          }, function() {
            $(this).find('.type-weight-content').removeClass('show-type');
          }
        );
    
      $('.solution-overview').hover(
          function() {
            $(this).addClass('hover-style');
          }, function() {
            $(this).removeClass('hover-style');
          }
        );
      

      var swiper = new Swiper('.main-slider-container', {
          pagination: {
            el: '.main-slider-progress',
            type: 'progressbar',
          },
          navigation: {
            nextEl: '.main-slider-next-btn',
            prevEl: '.main-slider-prev-btn',
          },
        });
    
      if(swiper.slides){
        $('.slider-count').text(swiper.slides.length);
          swiper.on('slideChange', function () {
          $('.slider-current').text(swiper.activeIndex + 1);
        });
      }



      // on paste event
      $('body').on('paste', '.click2edit', function (e) {
        setTimeout(() =>{
          $(e.currentTarget)[0].innerHTML = $(e.currentTarget)[0].innerText
        },0);
      });

    });
  }

  getLastNews(lang){
    this.newsCollection = []; 
    let _self = this;
    this._templatesService.get_3_articles(lang)
    .subscribe(
      (res) => {
        if(res.length > 0){
          for(let i = 0; i < 3; i++ ){
            _self.newsCollection.push(res[i])
          }
        }
      },
    (err) => {
      console.log('Error from get 3 articles' + err);
    })
  }

  renderNews(){
    let _self = this;
    setTimeout(()=>{
      $('.aticle').remove();
      let newsBlock = $('.news-overview-wrapper');
      this.currentLang = localStorage.language;
      this.newsCollection.forEach(article => {
        if(article){
        let articleDescription = article.description.slice(0, 150)
          $('<div/>', {
            'class': 'col-md-4 article',
                append: `
                  <div class="news-overview">
                    <a href="${_self.currentLang}/news-article/${article.id}" class="news-img full">
                      <img class="" src="${article.image}" alt="" title="">
                    </a>
                    <div class="news-description">
                      <span class="news-time">${article.date}</span>
                      <a href="${_self.currentLang}/news-article/${article.id}" class="title-like-link">${article.title}</a>
                      <p>${articleDescription}...</p>
                    </div>
                  </div>`,
            appendTo: newsBlock
          })
       
        $('.newsLink').off('click').on('click', function(event) {
          _self.routeToNews();
        })
          }
        });
    }, 1000)
   
  }

  routeToNews(){
    let lang = localStorage.language;

    this._router.navigate([`${lang}/news`])
  }

  editServiceDescription(){
    let _self = this;
    $('.description_list').on('mouseover', function(){
      // let description_list = $(this).find('.description_list');
      $('.add_description_list_btn').remove();
      // let btnExist = $(description).find('.add_description_list_btn')

      let send_body = {
        // description: description,
        description_list: $(this)
      }
      let btnExist = $(this).parent().find('.add_description_list_btn')

      if(!btnExist.length){
        _self.addDescriptionList(send_body);
      }
      // _self.addDescriptionList(send_body);

    })
  }

  addDescriptionList(body){

    let _self = this;
    let description_list;
    
      description_list = body.description_list
  
    let add_description_list_btn = $("<button/>", {
      text: 'Edit list',
      "class": "btn btn-success add_description_list_btn",
    css: {
      'margin': '15px'
    },
      on:{
        click: function(){
          
          let SaveButton = (context) => {
            let ui = $.summernote.ui;
            let button = ui.button({
              className: 'saveBtn',
              background: '#337ab7',
              contents: '<i class="fa fa-child"/> Save',
              // tooltip: 'Save',
              click: function () {
      
                let send_body = {
                  elem: $(description_list),
                }
      
            _self.save(send_body);
              }
            });
          
            return button.render();
          }
           // let initialText = $(body.elem).summernote('code');
      
          let CancelButton = (context) => {
            let ui = $.summernote.ui;
            let button = ui.button({
              className: 'cancelBtn',
              backgroundColor: '#337ab7',
              contents: '<i class="fa fa-child"/> Cancel',
              // tooltip: 'Save',
              click: function () {
      
                let send_body = {
                  elem: $(description_list),
                  initialText: $(description_list).summernote('code')
                }
                $(add_description_list_btn).toggle();
                _self.cancel(send_body);
              }
            });
          
            return button.render();
          }

          $(description_list).summernote({
            // width: editorWidth,
            popover: {
              image: [],
              link: [],
              air: []
            },
            toolbar: [
              ['font-style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
              ['para', ['ul', 'ol']],
              ['misc', ['undo', 'redo']],
              ['savebutton', ['save']],
              ['cancelbutton', ['cancel']],
            ],
            buttons: {
              save: SaveButton,
              cancel: CancelButton
            }
          });

          $('.cancelBtn').css({'background': '#ff3131','color': '#fff'})
          $('.saveBtn').css({'background': '#10b510','color': '#fff'})

          $(add_description_list_btn).toggle();
        }
      }
    
    }); 

    // for only just added vacancy

    if(this.loggedIn){
      $(add_description_list_btn).appendTo(description_list.parent());
    }

    // for multi vacancy
    // $(description_list).appendTo($('.description_list'));
    // $(add_description_list_btn).appendTo($('.description_list'));

  }

  save(body){

    this.currentElem = body.elem;

    let markup = $(body.elem).summernote('code');

    $(body.elem).summernote('destroy');

    this.saveChanges();

  }

  cancel(body){
    let markup = $(body.elem).summernote('code');
    // if(markup === "<p><br></p>"){
    //   body.elem.context.parentElement.remove();
    // }
    $(body.elem).summernote('reset');
    $(body.elem).summernote('insertCode', body.initialText);
    $(body.elem).summernote('destroy');
  }

  addEditButton(){
    let _self = this;
      setTimeout(() => {
        // this.showPreloader = false;
      }, 1500);

      $('.click2edit').off('mouseover').on('mouseover', function(event){
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
     
      $(blockForBtnEdit).css({'left': `${left}px`, 
                          'top': `${top - 75}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '10'
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

          _self.saveChanges();
        }

        $(blockForBtnSave).insertBefore(target)
        $(blockForBtnSave).css({'left': `${left}px`, 
                          'top': `${top - 75}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '1000'
                          });
        blockForBtnSave.setAttribute('class', 'blockForBtnSave');

        // cancel button

        blockForBtnCancel.appendChild(btnCancel);
        $(blockForBtnCancel).insertBefore(target)
        $(blockForBtnCancel).css({'left': `${left + 70}px`, 
                          'top': `${top - 75}px`, 
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

        if(target.textContent === ''){
          target.textContent = this.savedContent;
        }

        if(event.relatedTarget){
          if(event.relatedTarget.classList.contains('btnCancel')){
            target.innerText = this.savedContent;
          }
        }
      })
      });
     
  }
  
  saveChanges(){
    let _self = this;
    let body;
    let pageTitle = localStorage.location;
    let lang  = localStorage.language;

    let s = new XMLSerializer();
    // let str = s.serializeToString(body);

    if(this.template){
      let doc = document.querySelector('#body');
      body = s.serializeToString(doc);
    }else{
      let doc = document.querySelector('#default');
      body = s.serializeToString(doc);
    }

    let permalink = localStorage.permalink
     $('.blockForBtnEdit').remove();
     $('.imageInput').remove();
    this._templatesService.sendTemplate(body, pageTitle, lang, permalink).subscribe((error) => {
      console.log(error)
      localStorage.removeItem('addNewLang');
    });

    this._templatesService.send_permalink(pageTitle, permalink)
      .subscribe(res => 
        {
          localStorage.permalink = res['permalink']
        }
      );
  }

  editInner(event){

    let body;
    let pageTitle = localStorage.location;
    if(this.template){
      body= document.querySelector('#body');
    }else{
      body= document.querySelector('#default');
    }
    let permalink = localStorage.permalink
    let send_prefix;
    if(localStorage.addNewLang){
      send_prefix = localStorage.addNewLang;
    }else{
      send_prefix = this.prefix;
    }
    this._templatesService.sendTemplate(body.innerHTML, pageTitle, send_prefix, permalink).subscribe(
      (res) => {
        this._templatesService.add_new_lang_panel(send_prefix).subscribe(
          (res) => {
            //
            alert('added new lang');
          },
          (err) => {
            console.log(err);
          }
        );
        setTimeout(() => {
          localStorage.removeItem('addNewLang');
          this.templateSending = false;
        }, 1000)
      },
      (error) => {console.log(error)}
    )
  }
}
