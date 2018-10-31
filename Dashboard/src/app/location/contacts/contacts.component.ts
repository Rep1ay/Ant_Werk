import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../templates.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
// Jquery declaration
declare var $: any;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

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
  constructor(private _templatesService: TemplatesService, 
            formBuilder: FormBuilder,
            private _auth: AuthService,
            private _activeRoute: ActivatedRoute,
            private _router: Router,
            private _location: Location
            ) { 
              this.winOrigin = window.location.origin;
              this.winPathname = window.location.pathname;
            //   _router.events.subscribe((val) => {
            //     // see also 
            //     
            //     console.log(val instanceof NavigationEnd) 
            // });
            // let loc =_location.path().replace('/', '');
            // let windPath = window.location.pathname.split('/')[1];
            // let routConf = _router.config[1].path.split('/')[0];
            // let empty = '';
            // if(!localStorage.language){
            //   if(loc !== empty){
            //     localStorage.language = loc.split('/')[0];
            //     _router.config[1].path = loc;
            //   }
            // }else{
            //   _router.config[1].path = `${localStorage.language}/${loc.split('/')[1]}`
            // }


            // window.location.pathname = _router.config[1].path

          //   if(localStorage.language !== locPath){
          //     routConf = locPath;
          //  }
          // if( _router.config[1].path.split('/')[0] === "undefined"){
            // _router.config[1].path = loc;
          // }
         


          // this._location.go(_router.config[1].path);
            // window.location.pathname = _router.config[1].path
          //   if(localStorage.language !== locPath){
          //     routConf = locPath;
          //  }

          //  this._location.go(_router.config[1].path);
          }

  ngOnInit() {

    // let urlCollect = this._activeRoute.snapshot.url;
    // urlCollect.forEach( url => {
    //   //
    // });
    
    if(!localStorage.language){
      
      localStorage.language = 'EN';
      this.prefix = localStorage.language;
    }else{
      this.prefix = localStorage.language;
    }

    let snapshotURL = this._activeRoute.snapshot.url;
    localStorage.location = this.title = snapshotURL[0].path;




    this.loggedIn = this._auth.loggedIn();

    this._templatesService._event.subscribe(
      event => this.editInner(event)
    )

  if(this.loggedIn){
    $( document ).ready(()=> {

      let event, body = null;
    
    });
  }

   this._templatesService.getTemplate(this.title, this.prefix)
    .subscribe(
      (res) => {
        if(res){
          
          let prefix = this.prefix;
          this.permalink = res['permalink'];
          this.template = res['template'];
          setTimeout(() => {
            this.showPreloader = false;

            if(this.loggedIn){   
              setTimeout(() => {      
                this.addEditButton();
              }, 100);
            }

          }, 2000);
        }else{
          let lang;
          setTimeout(() => {
            this.showPreloader = false;

             if(this.loggedIn){   
              setTimeout(() => {      
                this.addEditButton();
              }, 100);
            }

          }, 2000);
          console.log('this language does not exist in the database');
          this.permalink = localStorage.location;
          localStorage.language = lang = 'EN'
          this.template = null;
          this._router.config[0].path = lang
          this._router.navigate([`../${lang}/${localStorage.location}`])
        }
      },
      (err) => {
        // this.showPreloader = true;
        // console.log(err);
      }
    );

    // const headers = ['H1', 'H2', 'H3', 'H4',]

  };

  editPageURL(inputURL: NgForm){
    console.log(inputURL.value);
  }

  addEditButton(){
    let _self = this;
      setTimeout(() => {
        this.showPreloader = false;
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
                          'top': `${top - 70}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          });

      $(btnEdit).off('click').on('click', (event) =>{

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
          _self.saveChanges();
        }
        

        $(blockForBtnSave).insertBefore(target)
        $(blockForBtnSave).css({'left': `${left}px`, 
                          'top': `${top - 70}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '1'
                          });
        blockForBtnSave.setAttribute('class', 'blockForBtnSave');

        // cancel button

        blockForBtnCancel.appendChild(btnCancel);
        $(blockForBtnCancel).insertBefore(target)
        $(blockForBtnCancel).css({'left': `${left + 70}px`, 
                          'top': `${top - 70}px`, 
                          'position': 'absolute',
                          'font-size':'16px',
                          'z-index': '1'
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
    let body;
    let pageTitle = localStorage.location;

    let send_prefix;
    if(localStorage.addNewLang){
      send_prefix = localStorage.addNewLang;
    }else{
      send_prefix = this.prefix;
    }

    if(this.template){
      body= document.querySelector('#body');
    }else{
      body= document.querySelector('#default');
    }
    this._templatesService.sendTemplate(body.innerHTML, pageTitle, send_prefix, this.permalink).subscribe((error) => {console.log(error)}
    )
    this._templatesService.add_new_lang_panel(send_prefix).subscribe(
      (res) => {
        //
        alert('added new lang');
      },
      (err) => {
        console.log(err);
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
    let send_prefix;
    if(localStorage.addNewLang){
      send_prefix = localStorage.addNewLang;
    }else{
      send_prefix = this.prefix;
    }
    this._templatesService.sendTemplate(body.innerHTML, pageTitle, send_prefix, this.permalink).subscribe(
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
