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
  currentLocation: string;
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
  
                this.changeOfRoutes(routeData.url);

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

  };


  changeOfRoutes(url){

    let title;

    this.routeUrl = url;
    this.showPreloader = true;
    let _self = this;
    let prefix = localStorage.language;
    // let title = localStorage.location;
    if(title){
      title = url.split('/')[2];
      this.getTemplate(title);
    }else{
      title = window.location.pathname.split('/')[2];
      this.getTemplate(title);
    }
  }

 getTemplate(title){
   
    let _self = this;
    let prefix = localStorage.language;
   
    this._templatesService.getTemplate(title, prefix)
    .subscribe(
      (res) => {
        if(res){
          _self.currentLang = localStorage.language = res['prefix']; 
          let template = res['template'];
          localStorage.location = res['pageTitle'];
          _self._templatesService.getPermalink(res['pageTitle'])
          .subscribe(
            (res) => {
            let permalink = res['permalink'];
              let lang = localStorage.language;

              _self.renderTemplate(template);
              
              let origin = window.location.origin;
              _self.permalinkURL = `${origin}/${lang}/${permalink}`

              localStorage.permalink = permalink;
              _self.permalink = `/${permalink}`;
              _self._location.go(`${lang}/${permalink}`);
            },
            (err) => {
              console.log('Error form HomeComp get template' + err);
            }
          )
        }else{
          localStorage.location = this.currentLocation = title;
          _self.getTemplateByPermalink();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTemplateByPermalink(){
    let _self = this;

    let permalink = this.routeUrl.split('/')[2];

    this._templatesService.get_pageTitle(permalink)
    .subscribe(
      (res) => {
        if(res){
          
          // _self.showPreloader = false;
          let pageTitle = localStorage.location = res['pageTitle'];
          _self.permalink = `/${res['permalink']}`;
          _self.getTemplate(pageTitle)

        }else{
          
          let template = undefined;
          localStorage.location = _self.currentLocation;
          _self.renderTemplate(template);

          // let pageTitle = window.location.pathname.split('/')[2];
          // _self.getTemplate(pageTitle);
        }
      },
      (err) => {
        console.log('Error form getting permalink' + err);
      }
    )
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

    if(this.loggedIn) {
      setTimeout(() => {
        this.createAccordion();
        this.showPreloader = false;
        setTimeout(() => {
          this.addEditButton();
        }, 100)
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
            debugger
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

      // this.createAccordion();
     
  }

  createAccordion(){
    let _self = this;
    $(function(){

      let addNewPosition = $("<div/>", {
 
        // PROPERTIES HERE
        // text: '+',
        // id: "addNewVacancy",
        "class": "addNewVacancy",      // ('class' is still better in quotes)
        css: {           
         
        },
        on: {
          click: function() {
         
            _self.createNewVacancy();
            
          }
        },
        append: "<p>+</p>",
        // appendTo: ".positions_list"      // Finally, append to any selector
        
      });

      $(addNewPosition).insertBefore($('.item')[0]);


      let vacant_position = $(this);
     
      $(this).addClass('showed');
      if ($('.vacant_position').hasClass('showed')){
          $('.vacant_position').next().slideUp(500);
      }      
     else if (vacant_position.attr('data-attr') === '1') {
          return;
      }
      vacant_position.attr('data-attr','1').next().stop(true).slideToggle(500,function () {
          vacant_position.attr('data-attr','0');
      });


      $('.vacant_position').on('click', function(){
          let vacant_position = $(this);
          let discription = vacant_position.next('.discription');
          let discription_list = $(discription).find('.discription_list');
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


          let btnExist = $(discription).find('.add_discription_list_btn')

          let send_body = {
            discription: discription,
            discription_list: discription_list
          }

          if(!btnExist.length){
            _self.addDiscriptionList(send_body);

          }
      });

      let context = null;   
      _self.createActionPanel(context);
      _self.activateStyles();

    });
  }

  createActionPanel(context){
    let _self = this;
    if(!context){
      context = '.actionPanel'
    }
    $(function(){

    $("<label/>", {
 
      // text: '+',
      // id: "addNewVacancy",
      "class": "switch",     
      css: {           

      },

      on:{
        click: function(){
          let currentBlock =  $(this).parents('.item');
          if($(this).find('input[type=checkbox]')[0]['checked']){
            currentBlock.toggleClass('active')
          }else{
            currentBlock.toggleClass('inactive')
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
          $(this).parents('.item').remove()
        }
      },

      append: '	<i class="material-icons delete_btn">delete_forever</i>',
      appendTo: context
      
    }); 

    _self.activateStyles();


  });

  }

  createNewVacancy(){

    let _self = this;
    let append_block;
    $(function(){
    
      let addNewPosition = $("<div/>", {
 
        "class": "item",     
        css: {
          'position': 'relative',           
          'margin': '20px 0px',
          'border': '1px solid #d0d0d0',
        },

        append: `<div class="col-md-2 actionPanel row">
        
        </div>`,
        
      }); 

      let new_position = $("<div/>", {
 
        text: 'New Vacancy',
        "class": "vacant_position click2edit col-md-9",
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


      $(addNewPosition).insertAfter($('.addNewVacancy'));

      let vacancy_discription = $("<div/>", {
 
        "class": "discription",
        css: {           
         
        },
        on: {
          click: function() {
         
            
          }
        },
        append: `<p class="click2edit">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptas modi sapiente tempore maxime fuga eos iusto distinctio, nemo vel nam unde ea nostrum aut reprehenderit voluptatibus beatae impedit? Ab explicabo omnis deserunt dicta aperiam deleniti, dignissimos qui consequuntur, modi sed iusto quam minus doloribus at praesentium animi in necessitatibus tempora. Veritatis deleniti aut ratione blanditiis. Aliquid facilis architecto numquam </p>`,
        appendTo:  addNewPosition
        
      });

     let send_body = {
       discription: vacancy_discription
     }
      _self.addDiscriptionList(send_body)
      let context = $(addNewPosition).find('.actionPanel');
      _self.createActionPanel(context);
      _self.addEditButton();


      // end of IIF
    }); 



  }

  addDiscriptionList(body){

    let _self = this;
    let discription_list;
    
    if(!body.discription_list){
      discription_list = $("<div/>", {"class": "discription_list",}); 
      $(discription_list).appendTo($(body.discription));
    }else{
      discription_list = body.discription_list
    }
  
    let add_discription_list_btn = $("<button/>", {
      text: 'Edit list',
      "class": "btn btn-success add_discription_list_btn",
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
                  elem: $(discription_list),
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
                  elem: $(discription_list),
                  initialText: $(discription_list).summernote('code')
                }
      
            _self.cancel(send_body);
              }
            });
          
            return button.render();
          }

          $(discription_list).summernote({
            // width: editorWidth,

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

        }
      }
    
    }); 

    // for only just added vacancy

    $(add_discription_list_btn).appendTo($(body.discription));

    // for multi vacancy
    // $(discription_list).appendTo($('.discription_list'));
    // $(add_discription_list_btn).appendTo($('.discription_list'));

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

    .positions_list .item .discription{
     background: #fff;
      overflow : hidden;
      display: none;
      padding: 0 15px
    }


    .discription p{
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
    debugger
    // if($('.discription_list').text())
    $('.switch').remove();
    // if()
    $('.discription_list').find('p').remove()
    $('.add_discription_list_btn').remove();
    $('.addNewVacancy').remove();
    this._templatesService.sendTemplate(body.innerHTML, pageTitle, lang, permalink).subscribe((error) => {
      console.log(error)
      localStorage.removeItem('addNewLang');
    
    });

    this._templatesService.send_permalink(pageTitle, permalink).subscribe(res => {  localStorage.permalink = res['permalink']});
debugger


let addNewPosition = $("<div/>", {
 
  // PROPERTIES HERE
  // text: '+',
  // id: "addNewVacancy",
  "class": "addNewVacancy",      // ('class' is still better in quotes)
  css: {           
   
  },
  on: {
    click: function() {
   
      _self.createNewVacancy();
      
    }
  },
  append: "<p>+</p>",
  // appendTo: ".positions_list"      // Finally, append to any selector
  
});

$(addNewPosition).insertBefore($('.item')[0]);

    let context = '.actionPanel'
    this.createActionPanel(context)

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
