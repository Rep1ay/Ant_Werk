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
  import { map, filter, scan } from 'rxjs/operators';
import { Article } from 'src/app/article';
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

  constructor(private _templatesService: TemplatesService, 
            formBuilder: FormBuilder,
            private _auth: AuthService,
            private _activeRoute: ActivatedRoute,
            public _router: Router,
            private _location: Location
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
    // localStorage.location = this.title = snapshotURL[0].path;
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
    debugger
    this.renderTemplate();
    // this.getTemplate(title);
  }

 getTemplate(title){
   
    let _self = this;
    let prefix = localStorage.language;
   
    this._templatesService.getTemplate(title, prefix)
    .subscribe(
      (res) => {
        if(res){
          let template =  res['data']['template'];         
          _self.permalink = `/${localStorage.permalink}`;
          _self.renderTemplate();
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

  renderTemplate(){
    this.counterEnter = false;
    if(this.loggedIn) {
      setTimeout(() => {
        this.showPreloader = false;
        setTimeout(() => {
          this.addEditButton();
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
    
    let discription = document.querySelector('.discription')['innerText'];

    let body = document.querySelector('#body');
    let title = document.querySelector('.articleTitle')['innerText'];
    let permalink = localStorage.permalink;

    let image = '';
    let category = 'work';
   
    let date = new Date().toISOString().slice(0, 10);

    let body_send = {
      'id': id,
      'image': image,
      'prefix': lang,
      'category': category,
      'title': title,
      'discription': discription,
      'date': date,
      'template': body.innerHTML
    }

    this._templatesService.sendArticle(body_send)
    .subscribe(
      (res) => {
        debugger
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
