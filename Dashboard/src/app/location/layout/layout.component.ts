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


// Jquery declaration
declare let $: any;
declare let Swiper: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

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
  currentLocation = 'layout';
  counterEnter = false;
  rendered = false;

  profileUrl: string;
  file;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

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
    let title = localStorage.location;

    this.loggedIn = this._auth.loggedIn();

    this._templatesService._event.subscribe(
      event => {
        this.editInner(event)
      }
    )
  let _self = this;
  this.showPreloader = true;

  // this.getTemplate(title);
  };

  getFile(event, mainBlock) {
    this.file = event.target.files[0];
    this.uploadFile(mainBlock);
  }

  uploadFile(mainBlock) {
    let _self = this;
    this.blockElement = mainBlock;
    if (this.file) {
      const filePath = Math.random().toString(13).substring(2) + this.file.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL(); // {{ downloadURL | async }}
            this.downloadURL.subscribe(url => {
              this.profileUrl = url; // {{ profileUrl }}
              console.log(this.profileUrl);
              _self.blockElement.find('img')[0]['src'] = _self.profileUrl;
            });
          })
        )
        .subscribe();
    } else {
      console.log('Ooppsss');
    }
  }

  changeImage(){
    
    let _self = this;
    // let actualEvent = event;

    $('.full').on('mouseenter', function(){
      $('.imageInput').remove();
      let mainBlock =  $(this);
      let leftPosition = ($(this).width())/2;
      let topPosition = ($(this).height())/2;

      let fileInput = $("<input/>", {
        'class': 'imageInput',
        css: {
          display:'block',
          left: `20px`,
          top: `0px`,
          position: 'absolute',
          'z-index': '9999',
        },
        type: 'file',
        on: {
          change: function(event){
            _self.getFile(event, mainBlock);
          },
          // click: function(){
          //   let submitButton = $('<button/>', {
          //     text: "submit",
          //     'class': 'submitImgBtn',
          //     css: {
          //       display:'block',
          //       left: `${leftPosition}px`,
          //       top: `30px`,
          //       position: 'relative',
          //       'z-index': '9999',
          //     },
          //     type: 'button',
          //     on: {
          //       click: function(){
          //         _self.uploadFile(mainBlock)
          //       }
          //     }
          //   })

          //   mainBlock.append(submitButton);
          // },
        }
      })
      
      $(this).append(fileInput);
     

    })
  }

  changeOfRoutes(url){

    let title = localStorage.location;

    this.routeUrl = url;
    this.showPreloader = true;
    // let _self = this;
    // let prefix = localStorage.language;

    //   // title = window.location.pathname.split('/')[2];
      this.getTemplate(title);

  }

  getTemplate(title){
   
    let _self = this;
    let prefix = localStorage.language;
    // if(!this.rendered){
    //   this.rendered = true;
      this._templatesService.getTemplate(title, prefix)
      .subscribe(
        (res) => {
          let template;
          
          if(!res['data']['template']){
            template = false;
          }else{
            template = res['data']['template'];
          }
  
          _self.permalink = `/${localStorage.permalink}`;
          _self.renderTemplate(template);
        },
        (err) => {
          console.log(err);
        }
      );
    // }

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
    // let find = "\"/";
    // let regex = new RegExp(find, "g");

    // alert(template.replace(regex, "'"));
   
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
            _self.renderLayout();
            setTimeout(() => {
              this.addEditButton();
              this.changeImage();
            }, 100)

          }, 100)

        }else{
          _self.renderLayout();
          _self.template = false;

          setTimeout(() => {
            this.addEditButton();
            this.changeImage();
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
      }, 1000)
    }
  }

  renderLayout(){
    $(document).ready(function ($) {

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
    
      $('#menu-open').on('click', function(){
        $('.main-menu-wrapper').fadeIn();
      });
      $('#menu-close').on('click', function(){
        $('.main-menu-wrapper').fadeOut();
      });
    
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
    
      $('.slider-count').text(swiper.slides.length);
      swiper.on('slideChange', function () {
        $('.slider-current').text(swiper.activeIndex + 1);
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
