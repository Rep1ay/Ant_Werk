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
import { Article } from 'src/app/article';
import { NewsCategories } from 'src/app/news_category';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
// Jquery declaration
declare let $: any;


@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit {

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
  currentLocation = 'new-article';
  counterEnter = false;

  category = 'Other';
  editingCategory = false;
  news_categories: NewsCategories[];

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
                
                let location = window.location.pathname.split('/')[2];

                if(this.currentLocation === location){
                  if(!this.counterEnter){
                      this.changeOfRoutes(routeData.url);
                      this.counterEnter = true;
                      this.showPreloader = true;
                    }
                  }

              })
          }

  ngOnInit() {

    this._router.routerState
    
    let snapshotURL = this._activeRoute.snapshot.url;
    let title = localStorage.location;

    this.loggedIn = this._auth.loggedIn();
    this.showPreloader = true;

    let _self = this;

    this.renderTemplate();


  // this.getTemplate(title);
  };

  changeOfRoutes(url){

    let title = localStorage.location;
    let template = null
    this.routeUrl = url;
    this.showPreloader = true;
    
    this.renderTemplate();
    // this.getTemplate(title);
  }

  editCategory(){
  
  }

  getFile(event, mainBlock) {
    this.file = event.target.files[0];
    this.uploadFile(mainBlock);
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
      // get notified when the download URL is available
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL(); // {{ downloadURL | async }}
            this.downloadURL.subscribe(url => {
              this.profileUrl = url; // {{ profileUrl }}
              console.log(this.profileUrl);
              _self.showPreloader = false;

              setTimeout(() =>{
              _self.blockElement.find('img')[0]['src'] = _self.profileUrl;
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
          // 'z-index': '9999',
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
  renderTemplate(){
    let _self = this;
    let lang = localStorage.language;
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
          this.changeImage();

        }, 100)
     }, 1000)
    }
    else{
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
  
  saveChanges(){
    let _self = this;
    let pageTitle = localStorage.location;
    let lang  = localStorage.language;

    let id = new Date().toISOString().replace(/[^0-9]/g, '');
    
    let description = document.querySelector('.description')['innerText'];

    let body = document.querySelector('#body');
    let title = document.querySelector('.articleTitle')['innerText'];
    let permalink = localStorage.permalink;

    let image = '';
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
      'template': body.innerHTML
    }

    this._templatesService.sendArticle(body_send)
    .subscribe(
      (res) => {
        
      },
      (err) => {
        console.log('Error from send article' + err);
      }
    )




    //  $('.blockForBtnEdit').remove();
    // this._templatesService.sendTemplate(body.innerHTML, pageTitle, lang, permalink).subscribe((error) => {
    //   console.log(error)
    //   localStorage.removeItem('addNewLang');
    // });

    // this._templatesService.send_permalink(pageTitle, permalink).subscribe(res => {  localStorage.permalink = res['permalink']});

    
  }
}
