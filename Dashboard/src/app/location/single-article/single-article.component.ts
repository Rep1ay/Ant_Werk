import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../templates.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
// import { filter } from 'rxjs/operators';
import { Observable, Subject, asapScheduler, pipe, of, from,
  interval, merge, fromEvent } from 'rxjs';
  import { map, filter, scan, finalize } from 'rxjs/operators';
import { NewsCategories } from 'src/app/news_category';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
// Jquery declaration
declare let $: any;

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.css']
})
export class SingleArticleComponent implements OnInit {
  
  loggedIn: boolean;
  lastTarget: any;
  title: string;
  prefix: string;
  template: any;
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
  currentLocation = 'article';
  counterEnter = false;
  articleId: string;
  category: string;
  editingCategory = false;
  news_categories: NewsCategories[];
  uploadingImg = false;
  savingPermalink = false;
  editionPermalink = false;
  edition = false; 

  profileUrl: string;
  file;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  blockElement:any;
  
  constructor(private _templatesService: TemplatesService, 
            formBuilder: FormBuilder,
            private _auth: AuthService,
            private _activeRoute: ActivatedRoute,
            public _router: Router,
            private _location: Location,
            private afStorage: AngularFireStorage,
            private storage: AngularFireStorage,
            ) { 
              this.winOrigin = window.location.origin;
              this.winPathname = window.location.pathname;

              this._router.events.pipe(
                filter((event:Event) => event instanceof NavigationEnd)
              ).subscribe((routeData: any) => {
                this.winOrigin = window.location.origin;
                this.winPathname = window.location.pathname;
                let path = this.winPathname.split('/')[2];

                if(this.currentLocation === localStorage.permalink || this.currentLocation === localStorage.location || this.currentLocation === path){
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
    let id = this.articleId = this._activeRoute.snapshot.params['id'];
    this.loggedIn = this._auth.loggedIn();
    this.showPreloader = true;
    this._templatesService._event.subscribe(
      event => {
        this.editInner(event)
      }
    )
  let _self = this;
 
  // this.getTemplate(id);


  setTimeout(() => {
    _self.showPreloader = false;
}, 1500)

  // this.getTemplate(title);
  };

  changeOfRoutes(url){

    let title = localStorage.location;
    let id = this.articleId = this._activeRoute.snapshot.params['id'];
    this.routeUrl = url;
    this.showPreloader = true;
    this.getTemplate(id);
  }

 getTemplate(id){
   
    let _self = this;
    let prefix = localStorage.language;
    this.currentLang = prefix;
    this._templatesService.getArticleTemplate(id, prefix)
    .subscribe(
      (res) => {
        if(res){
          
          _self.category = res['category'];
          let template = res['template'];
          // _self.permalink = `/${localStorage.permalink}`;
          _self.renderTemplate(template);
        }else{
          if(this.loggedIn) {
            _self.category = 'other';
            setTimeout(() => {
              this.showPreloader = false;
              let template = null;
              _self.renderTemplate(template);
           }, 1000)
          }
          else{
            setTimeout(() => {
              this.showPreloader = false;
              setTimeout(() => {
                this.activateStyles();
              }, 100)
           }, 1000)
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editPermalink(inputURL: NgForm){
    
    this.permalinkEdit = `${localStorage.permalink}`;
    console.log(inputURL.value);
  }

  savePermalink(permalink: NgForm){
    debugger
    let _self = this;
    let permalinkToSend = permalink.value.input;
    this.articleId = `${permalink.value.input}`;
    localStorage.permalink = permalink.value.input;
    // this.articleId = '';
    this.savingPermalink = true;
    this.saveChanges();

  }



  cancelPermalink(){
    this.permalink = `/${localStorage.permalink}`
    this.permalinkEdit = '';
  }

  editCategory(inputValue: NgForm){
  
    console.log(inputValue.value);
  }

  saveCategory (category: NgForm){
    let _self = this;
  
    this.category = category.value.input;

  }

  chooseCategory(event){
    this.category = event.currentTarget.value;
  }
  acceptCategory(){
    this.saveChanges();
  }

  renderTemplate(template){
  let lang = localStorage.language;
   let _self = this;
   if(template){
      this.template = template;
   }
    this.counterEnter = false;
    if(this.loggedIn) {
      setTimeout(() => {
        this.showPreloader = false;

        this._templatesService.getNewsCategory(lang)
        .subscribe(
          (res) => {
            
            _self.news_categories = res
          },
          (err) =>{
            console.log('Error from get news category' + err);
          }
        )

        setTimeout(() => {
          this.addEditButton();
          this.activateStyles();
          this.changeImage();
        }, 100)
     }, 1000)
    }
    else{
      this.activateStyles();
      setTimeout(() => {
        this.showPreloader = false;
     }, 1000)
    }
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
  

  getFile(event, mainBlock) {
    this.file = event.target.files[0];
    this.uploadFile(mainBlock);
  }

  showUploadProgress(mainBlock){
    this.uploadingImg = true;
    let top = mainBlock.position().top + 80;
    $('.progressBlock')[0].style.top = top + 'px';
    $('.progressBlock')[0].style.opacity = 1;
    // $('.progress').
  }

  uploadFile(mainBlock) {
    let _self = this;
    this.blockElement = mainBlock;
    if (this.file) {
      // this.showPreloader = true;
      const filePath = Math.random().toString(13).substring(2) + this.file.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      this.showUploadProgress(mainBlock);
      // get notified when the download URL is available
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL(); // {{ downloadURL | async }}
            this.downloadURL.subscribe(url => {
              this.profileUrl = url; // {{ profileUrl }}
              console.log(this.profileUrl);
              $('.progressBlock')[0].style.opacity = 0;

              setTimeout(() =>{
              _self.blockElement.find('img')[0]['src'] = _self.profileUrl;
              _self.uploadingImg = false;
              _self.saveChanges();
              },100)

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

    $('.editableImage').on('mouseenter', function(){
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
          
          mouseleave: function(){
            $('.imageInput').remove();
          },
        }
      })
      
      $(this).append(fileInput);

    })

    $('.editableImage').on('mouseleave', function(){
      $('.imageInput').remove();
    });

  }

  activateStyles(){
    $(function(){

    $('head').append(`<style>

      img{
      width: 100%;
      }
      
      </style>`);

  });
}

  saveChanges(){
    let _self = this;
    let body;
    let pageTitle = localStorage.location;
    let lang  = localStorage.language;
    let id =  this.articleId;
    let s = new XMLSerializer();
    // let str = s.serializeToString(body);

    if(this.template){
      let doc = document.querySelector('#body');
      body = s.serializeToString(doc);
    }else{
      let doc = document.querySelector('#default');
      body = s.serializeToString(doc);
    }
    let description =  document.querySelector('.description')['innerText'];
    let title = document.querySelector('.articleTitle')['innerText'];
    let permalink = localStorage.permalink
    
    $('.blockForBtnEdit').remove();
    $('.imageInput').remove();


    let image = _self.profileUrl;
    if(!image){
      image = $('img.previewImage')[0]['src']
    }

    let category = this.category;

    let date = new Date().toISOString().slice(0, 10);

     let body_send = {
      'id': id,
      'image': image,
      'prefix': lang,
      'category': category,
      'title': title,
      'description': description,
      'date': date,
      'template': body
    }

    this._templatesService.sendArticle(body_send).subscribe(
      (res) => {
        // _self._router.navigate([`${localStorage.language}/${res['permalink']}`]);
        console.log(res);
        localStorage.removeItem('addNewLang');

        if(_self.savingPermalink){
          setTimeout(() =>{
            _self.savingPermalink = false;
            _self._location.go(`${localStorage.language}/article/${_self.articleId}`)
            window.location.reload();
          },100)
        }
      },
      (err) => {
        console.log('Error from permalink send from navbar' + '</br>' + err);
      }
    )

    // this._templatesService.send_permalink(pageTitle, permalink).subscribe(res => {  localStorage.permalink = res['permalink']});

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
