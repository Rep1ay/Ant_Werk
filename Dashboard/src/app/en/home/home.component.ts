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
          if(res){
            this.template = res.template;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };

  registerEvent(event){
    debugger
  }

  eventBinder(){

    let _self = this;
    this.btnExist = true;

    let btnEdit = document.createElement('button');
    let textNodeEdit = document.createTextNode('Edit');

    
    let btnBlock = document.createElement('div');

    btnEdit.appendChild(textNodeEdit);
   


    btnBlock.appendChild(btnEdit);
    // btnBlock.appendChild(btnSave);

    let position;
    let top;
    let left;
    
    $('.click2edit').hover(function(event){

      if(event.relatedTarget){
         if(!event.relatedTarget.classList.contains('saveBtn') && !event.relatedTarget.classList.contains('editBtn')){
          this.lastTarget = $(this);
          // position = event.target.lastTarget.position();
          
          // left = this.clientWidth - 100;
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

  edit(body){
    let editorWidth = body.elem.width();
    let _self = this;

    let position = $(body.elem).position();
    let top = position.top;

    let context = $(body.elem);

    let SaveButton = function (context) {
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
        ['misc', ['fullscreen', 'codeview', 'help']],
        ['savebutton', ['save']]
      ],
      buttons: {
        save: SaveButton
      }
    });

    $(body.elem).summernote();
  }

  save(body){

    this.currentElem = body.elem;

    let markup = $(body.elem).summernote('code');

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
  
  editElement(event, elem){
    if(!this.activeHoverEvent){
      this.activeHoverEvent = true;
    }

    let target = event.target
    let targetParents = $(target).parents();
    if(event.toElement.classList.contains('click2edit')){
      let classList = event.toElement.classList;
    }
   
    if($(event.fromElement).parents('.click2edit')){

      let classList2 = $(event.fromElement).parents();

    }
    if(!target.classList.contains('body_container')){
      let targContext = $(target).parents('.click2edit');

      if(targContext[0]){
        if(targContext[0].classList.contains('click2edit')){
          // debugger
          if (!this.btnExist){
              this.btnExist = true;
              let btnEdit = document.createElement('button');
              let textNode = document.createTextNode('Edit');
              let parentBlock = targContext[0];
              $(btnEdit).on('click', (event) =>{
                debugger
              })

              btnEdit.appendChild(textNode);

              parentBlock.append(btnEdit)
          
              // let left = parentBlock.width() - 100;
              // let top = parentBlock.height() - 100;
              let left = parentBlock.offsetWidth - 100;
              let top = parentBlock.offsetHeight - 100;
              btnEdit.setAttribute('style', `position:absolute;left:${left}px;top:${top}px`);
            }
          // }
        }
      } else if(targContext["context"].classList.contains('click2edit')){
        // debugger
      }
    }
  }
}
