import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../templates.service';
import { FormBuilder, FormGroup } from '@angular/forms';
// Jquery declaration
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  lastTarget: any;
  title = 'home';
  template: any;
  templateSending = false;
  postText: string = "";
  errorMessage: string;
  postSaved : boolean = false;
  currentElem: any;
  currentTarget: any;
  btnExist = false;
  private _formBuilder: FormBuilder;
  savePostForm: FormGroup;
  activeHoverEvent;
  saveBtnPublic: any;
  event: any;

  constructor(private _templatesService: TemplatesService, formBuilder: FormBuilder) { 
    this._formBuilder = formBuilder;    
    this.savePostForm = this._formBuilder.group({ })
  }

  ngOnInit() {

    this._templatesService._event.subscribe(
      event => this.editInner(event)
    )

    $( document ).ready(()=> {
      this.eventBinder();
    });

    this.activeHoverEvent = false;

    this._templatesService.getTemplate(this.title)
      .subscribe(
        (res) => {
          if(res){this.template = res.template;}
        },
        (err) => {
          console.log(err);
        }
      );
  };

  eventBinder(){

    let blockAddBlock = document.createElement('div');
    let btnAddBlock = document.createElement('button');
    let btnAddTextNode = document.createTextNode('+');
    let areaBeforeBlock = $('.areaBeforeBlock');
    let btnEdit = document.createElement('button');
    let textNodeEdit = document.createTextNode('Edit');
    let btnBlock = document.createElement('div');
    let clientWidth = $(document).width();
    let _self = this;
    this.btnExist = true;
    let position;
    let top;
    let left;
   
    btnEdit.appendChild(textNodeEdit);
    btnBlock.appendChild(btnEdit);
    btnAddBlock.setAttribute('class', 'btnAddBlock');
    btnAddBlock.setAttribute('style', `position:relative; left:${clientWidth/2}px`)
    btnAddBlock.appendChild(btnAddTextNode);
    blockAddBlock.appendChild(btnAddBlock);

    $(blockAddBlock).insertBefore(areaBeforeBlock);
  
    $('.btnAddBlock').off('click').on('click', (event) =>{
      this.addNewBlock(event);
    });
  
    $('.click2edit').hover(function(event){

      if(event.relatedTarget){

        let RTClass = event.relatedTarget.classList;

        if(!RTClass.contains('saveBtn') && !RTClass.contains('editBtn')){

          this.lastTarget = $(this);

          position = $(this).position();
          top = position.top;
          left = position.left;

          btnBlock.setAttribute('style', `position:absolute;left:${left}px;top:${top}px`);
          btnBlock.setAttribute('class', 'btnBlock');
          $(btnBlock).insertBefore($(this));
        }
      }

      $(btnEdit).off('click').on('click', (event) =>{
        let send_body = {
          elem: $(this),
          position: left,
          btnBlock: btnBlock,
          btnEdit: btnEdit
        }
          _self.edit(send_body);
        });
      });
  }

  addNewBlock(event){
    debugger

    let sectionBlock = document.createElement('section');
    let edit2clickBlock = document.createElement('div');
    let editorWidth = $(document).width();
    sectionBlock.setAttribute('class', 'areaBeforeBlock');
    edit2clickBlock.setAttribute('class', 'click2edit');
    edit2clickBlock.setAttribute('style', `width:${editorWidth}`);

    sectionBlock.appendChild(edit2clickBlock);
    $(sectionBlock).insertBefore(event.target);

    let body = {
      elem: $(edit2clickBlock)
    }

    this.eventBinder();
    this.edit(body)

   }

  edit(body){
    let editorWidth = body.elem.width();
    let _self = this;

    let position = $(body.elem).position();
    let top = position.top;

    let context = $(body.elem);
    // let renge = $(body.elem).summernote('saveRange');

    let SaveButton = (context) => {
      let ui = $.summernote.ui;
      let button = ui.button({
        className: 'saveBtn',
        background: '#337ab7',
        contents: '<i class="fa fa-child"/> Save',
        // tooltip: 'Save',
        click: function () {

          let send_body = {
            elem: $(body.elem),
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
            elem: $(body.elem),
            initialText: $(body.elem).summernote('code')
          }

      _self.cancel(send_body);
        }
      });
    
      return button.render();
    }

    $(context).summernote({
      width: editorWidth,
      toolbar: [
        ['style', ['style']],
        ['font-style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['font', ['fontname']],
        ['font-size',['fontsize']],
        ['font-color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['misc', ['fullscreen', 'codeview', 'redo', 'undo', 'help']],
        ['savebutton', ['save']],
        ['cancelbutton', ['cancel']],
      ],
      buttons: {
        save: SaveButton,
        cancel: CancelButton
      }
    });

    $(body.elem).summernote();
  }

  save(body){

    this.currentElem = body.elem;

    let markup = $(body.elem).summernote('code');

    $(body.elem).summernote('destroy');
  }

  cancel(body){
    debugger
    $(body.elem).summernote('reset');
    $(body.elem).summernote('insertCode', body.initialText);
    $(body.elem).summernote('destroy');
  }

  savePost(event) {
    let text = $('#summernote').summernote('code');
    console.log(text);
    if (text != null && text != '') {
      this.postText = text;
      this.postSaved = true;
      setTimeout(() => this.postSaved = false, 2000);
    }
    else {
      console.error("posts empty");
      this.postSaved = false;
    }
  }

  editInner(event){
    // this.save(this.currentElem)
    let body;
    let pageTitle = 'home';
    if(this.template){
      body= document.querySelector('#body');
    }else{
      body= document.querySelector('#default');
    }
   
    this._templatesService.sendTemplate(body.innerHTML, pageTitle).subscribe(
      (res) => {
        setTimeout(() => {
          this.templateSending = false;
        }, 1000)
      },
      (error) => {console.log(error)}
    )
  }
}
