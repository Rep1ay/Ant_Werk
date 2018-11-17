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
// Jquery declaration
declare let $: any;

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  
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
  currentLocation = 'career';
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
                filter((event:Event) => (event instanceof NavigationEnd))
              ).subscribe((routeData: any) => {
                this.winOrigin = window.location.origin;
                this.winPathname = window.location.pathname;
                if(this.currentLocation === localStorage.permalink || this.currentLocation === localStorage.location){
                if(!this.counterEnter){
                    this.changeOfRoutes(routeData.url);
                    this.counterEnter = true;
                    this.showPreloader = true;
                  }
                }
                // event.target.response.search("career")
                

              })
          }

  ngOnInit() {
    // $('.load').remove();
    this._router.routerState
    this.showPreloader = true;
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
  // let title = localStorage.location;
  // $('.preloader').remove();
  // this.routeUrl = url;
  // this.showPreloader = true;

    // this.getTemplate(title);
  };

  changeOfRoutes(url){

    let title = localStorage.location;
    // $('.preloader').remove();
    this.routeUrl = url;
    this.showPreloader = true;

      this.getTemplate(title);

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
          _self.renderTemplate(template);
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
    this.template = template;
    this.activateStyles();
    if(this.loggedIn) {
      setTimeout(() => {
        this.createAccordion();
        this.showPreloader = false;
        setTimeout(() => {
          this.addEditButton();
         $('.addNewVacancy').remove();
             this.createNewVacancy();
        }, 100)

        let preloader =  $('<div/>', {
          'class': 'preloader',
            css: {
              background: 'rgba(255, 255, 255, 0.7)',
              'z-index': '9999',
              position: 'absolute',
              width: '100%',
              height: '100vh'
            }
          })

          $(preloader).insertBefore('body')

        setTimeout(() => {
          $('.preloader').remove();
        }, 500)
     }, 1500)
    }
    else{
      setTimeout(() => {
        this.showPreloader = false;
        this.createAccordion();
         let preloader =  $('<div/>', {
            'class': 'preloader',
              css: {
                background: 'rgba(255, 255, 255, 0.7)',
                'z-index': '9999',
                position: 'absolute',
                width: '100%',
                height: '100vh'
              }
            })

            $(preloader).insertBefore('body')

          setTimeout(() => {
            $('.preloader').remove();
          }, 1000)
     }, 1500)
    }
  }

  addEditButton(){
    let _self = this;

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

  createAccordion(){
    $('.switch ').remove();
    let _self = this;
    this.counterEnter = false;
    $(function(){

      let vacant_position = $(this);

      if(!_self.loggedIn){
        $('.item').css({'background': '#f3f3f3'})
      }else{
        $('.item').css({'background': '#eeeeff'})
      }

      // $(this).addClass('showed');
      // if ($('.vacant_position').hasClass('showed')){
          $('.vacant_position').next().slideUp(500);
      // }      
      // else if (vacant_position.attr('data-attr') === '1') {
      //   return;
      // }

      // vacant_position.attr('data-attr','1').next().stop(true).slideToggle(500,function () {
      //   vacant_position.attr('data-attr','0');
      // });

      $('.vacant_position').off('click').on('click', function(){
        if(!_self.loggedIn){
          $('.item').css({'background': '#f3f3f3'})
        }

        let vacant_position = $(this);
        let description = vacant_position.next('.description');
        let description_list = $(description).find('.description_list');
        $('.vacant_row').css({'flex-direction': 'row',
                              'display': 'flex',
                              'justify-content': 'space-between',
                              'padding': '10px 30px'})
        $('.vacant_position').removeClass('showed');
        $(this).addClass('showed');
        $('.vacant_position').css({'background':'#f3f3f3', 'color': '#333'});
        // $('.showed').css({'background': '#ffaa27','color': '#fff'})
        if ($('.vacant_position').hasClass('showed')){
            $('.vacant_position').next().slideUp(500);
            $('.showed').css({'background': '#ffaa27','color': '#fff'})
            if(!_self.loggedIn){
              $(this).parent('.item').css({'background': '#ffaa27'})
            }
        }      
        else if (vacant_position.attr('data-attr') === '1') {
          return;
        }
        vacant_position.attr('data-attr','1').next().stop(true).slideToggle(500,function () {
          vacant_position.attr('data-attr','0');
        });

        let btnExist = $(description).find('.add_description_list_btn')

        let send_body = {
          description: description,
          description_list: description_list
        }

        if(!btnExist.length){
          _self.addDescriptionList(send_body);
        }
      });

      let context = null;

      if(_self.loggedIn){
          _self.createActionPanel(context);
      }
      // end of IIFE
    });
  }

  createActionPanel(context){
    let _self = this;

    if(!context){
      context = '.actionPanel'
    }

    $(function(){

      let preloader =  $('<div/>', {
        'class': 'preloader',
          css: {
            background: 'rgba(255, 255, 255, 0.7)',
            'z-index': '9999',
            position: 'absolute',
            width: '100%',
            height: '100vh'
          }
        })

      $("<label/>", {
        "class": "switch",
        on:{
          click: function(event){

            let currentBlock =  $(this).parents('.item');
            if($(this).find('input[type=checkbox]')[0]['checked']){
              currentBlock.addClass('active')
              currentBlock.removeClass('inactive')
            }else{
              currentBlock.addClass('inactive')              
              currentBlock.removeClass('active')
            }
            if(event.target.type === "checkbox"){
              $(preloader).insertBefore('body')
                setTimeout(() => {
                _self.saveChanges();
              }, 500);
            }
          }
        },

        append: '<input type="checkbox"><span class="slider round"></span>',
        
        appendTo: context
      
      }); 
    
      let items = $('.item')

      for(let element of items) {
        if($(element).hasClass('active')){
          $(element).find('input[type=checkbox]').attr('checked', true);
        }
      }

    $("<p/>", {

        "class": "switch",     
        css: {           
          'cursor': 'pointer'
        },
        on: {
          click: function(){
            $(this).parents('.item').remove();
            $(preloader).insertBefore('body')
            setTimeout(() => {
            _self.saveChanges();
          }, 500);
          }
        },

        append: '	<i class="material-icons delete_btn">delete_forever</i>',
        appendTo: context
        
      }); 

      _self.activateStyles();
// end of IIFE
    });

  }

  createNewVacancy(){

    let _self = this;
    let append_block;

    let addNewPosition = $("<div/>", {
      "class": "addNewVacancy",
      on: {
        click: function() {
       
          let addNewPosition = $("<div/>", {
 
            "class": "item",     
            css: {
              'position': 'relative',           
              'margin': '20px 0px',
              'border': '1px solid #d0d0d0',
            },
    
            append: `<div class="col-md-2 actionPanel row"></div>`,
            
          }); 
    
          let new_position = $("<div/>", {
     
            text: 'New Vacancy',
            "class": "vacant_position new_position click2edit col-md-9",
            css: {           
              'font-size': '30px',
              'cursor': 'pointer', 
              'padding': '10px',
              'background': '#f3f3f3'
            },
            on: {
              click: function() {
             
                let vacant_position = append_block = $(this);
              $('.vacant_row').css({'flex-direction': 'row',
                                    'display': 'flex',
                                    'justify-content': 'space-between',
                                    'padding': '10px 30px'})
              $('.vacant_position').removeClass('showed');
              $(this).addClass('showed');
              $('.vacant_position').css({'background':'#f3f3f3', 'color': '#333'});
              // $('.showed').css({'background': '#ffaa27','color': '#fff'})
              if ($('.vacant_position').hasClass('showed')){
                  $('.vacant_position').next().slideUp(500);
                  $('.showed').css({'background': '#ffaa27','color': '#fff'})
              }      
             else if (vacant_position.attr('data-attr') === '1') {
                  return;
              }
              vacant_position.attr('data-attr','1').next().stop(true).slideToggle(500,function () {
                  vacant_position.attr('data-attr','0');
              });
              }
            },
    
            appendTo: addNewPosition
            
          }); 
          setTimeout(() => {
            $('.new_position').css('background', '#c1ffc3');
          }, 100)

          setTimeout(() => {
            $('.vacant_position').removeClass('new_position')
          },2000)
    
          $(addNewPosition).insertAfter($('.addNewVacancy'));
    
          let vacancy_description = $("<div/>", {
     
            "class": "description",

            append: `<p class="click2edit">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptas modi sapiente tempore maxime fuga eos iusto distinctio, nemo vel nam unde ea nostrum aut reprehenderit voluptatibus beatae impedit? Ab explicabo omnis deserunt dicta aperiam deleniti, dignissimos qui consequuntur, modi sed iusto quam minus doloribus at praesentium animi in necessitatibus tempora. Veritatis deleniti aut ratione blanditiis. Aliquid facilis architecto numquam </p>`,
            appendTo:  addNewPosition
            
          });
    
         let send_body = {
           description: vacancy_description
         }
          _self.addDescriptionList(send_body)
          let context = $(addNewPosition).find('.actionPanel');
          _self.createActionPanel(context);
          _self.addEditButton();
          
        }
      },
      append: "<p>+</p>",
      
    });

    $(addNewPosition).insertBefore($('.item')[0]);
 
  }

  addDescriptionList(body){

    let _self = this;
    let description_list;
    
    if(!body.description_list){
      description_list = $("<div/>", {"class": "description_list",}); 
      $(description_list).appendTo($(body.description));
    }else{
      description_list = body.description_list
    }
  
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
      $(add_description_list_btn).appendTo($(body.description));
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
  
  saveChanges(){
    let _self = this;
    let body;
    let pageTitle = localStorage.location;
    let lang  = localStorage.language;

    if(this.template){
      body= document.querySelector('#body');
    }else{
      body= document.querySelector('#default');
    }
    let permalink = localStorage.permalink
    let originBody = body;
    // if($('.description_list').text())
    $('.switch').remove();
    $('.description_list').find('p').remove()
    $('.add_description_list_btn').remove();
    $('.addNewVacancy').remove();
     $('.blockForBtnEdit').remove();
    this._templatesService.sendTemplate(body.innerHTML, pageTitle, lang, permalink).subscribe((error) => {
      console.log(error)
      localStorage.removeItem('addNewLang');
    });

    this._templatesService.send_permalink(pageTitle, permalink).subscribe(res => {  localStorage.permalink = res['permalink']});

    setTimeout(() => {
      this.createAccordion();
      this.createNewVacancy();
      setTimeout(() => {
        $('.preloader').remove();
      }, 100)
     
    }, 100)

  }

  activateStyles(){
    $(function(){
      

  $('head').append(`<style>


    .actionPanel{
      display: flex;
      flex-direction: row;
      justify-content: space-between
    }

    .positions_list{
      padding: 30px;
      width: 100%
    }

    .positions_list .item{
      margin: 20px 0px;
      border: 1px solid #d0d0d0
    }

    .vacant_row{
      flex-direction: row;
      display: flex;
      justify-content: space-between;
      padding: 10px 30px
    }

    .positions_list .item .vacant_position{
      font-size: 30px;
      cursor: pointer; 
      padding: 10px;
      background: #f3f3f3
    }

    .positions_list .item .description{
     background: #fff;
      overflow : hidden;
      display: none;
      padding: 0 15px
    }


    .description p{
      margin-top: 0px;
      margin-bottom: 0px;
      padding: 10px;
    }


    .addNewVacancy{
      fontSize: 3em;
      cursor: pointer;
      color: #52ff52;
      font-size: 3em;
      display: flex;
      cursor: pointer;
      border: 2px solid #52ff52;
      justify-content: center;
    }
      .item  {
        position: relative;
      }
      label.switch {
        top: 4px;
      }
      .actionPanel{
        position: absolute;
        right: 70px;
        top: 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        z-index: 100;
      }

      .delete_btn{
        font-size: 28px;
        padding: 5px 5px;
        color: #ff6868;
        position: absolute;
        background: #fff;
        border-radius: 50%;
        box-shadow: 1px 1px 3px 1px #bdbdbd;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        
      }
      
      .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: #41ff34;
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px #41ff34;
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }</style>`);

    });
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
