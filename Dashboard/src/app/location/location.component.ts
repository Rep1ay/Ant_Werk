import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { TemplatesService } from '../templates.service';


@Component({
  selector: 'app-location-component',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit {
  winOrigin: string;
  winPathname:any;
  edition = false;
  permalink: string;
  permalinkEdit: string;
  constructor( private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _templatesService : TemplatesService
    ) { 
    // this.winOrigin = window.location.origin;
    // this.winPathname = window.location.pathname.split('/');
    //   if(this.winPathname.length <= 2){
    //     let lang = localStorage.language
    //     if(lang){
    //       this.winPathname[0] = `/${lang}/`
    //       _router.config[0].path = lang
    //     }else{
    //       this.winPathname[0] = `/eng/`;
    //       _router.config[0].path = `/eng/`;
    //     }
    //   }

      // let winPath = window.location.pathname;
      // if(this.winPathname.length > 2){
      //   //  localStorage.language = window.location.pathname.split('/')[1];
      //    _router.config[0].path = localStorage.language
      // }

    // 
    // let redirectURL;
    // let lang = localStorage.language;
    // let winPath = window.location.pathname;
    // if(winPath === '/'){
    //   redirectURL = _router.config[0].children[0].path
    // }else{
    //   redirectURL = winPath
    // }

    // let winLoc = winPath.split('/');

    // if(winLoc.length > 2){
    //   window.location.pathname = redirectURL; 
    // }else{
    //   window.location.pathname = `${lang}/${redirectURL}` 
    // }
    // else{
    //    redirectURL = `${winPath}/${lang}/${winLoc[2]}` 
    // }

    // _location.go(redirectURL);
 
    // let redirectURL
    // let lang = localStorage.language;
    // let winPath = window.location.pathname;
    // if(winPath === '/'){
    //   redirectURL = _router.config[0].children[0].path
    // }
    // let winLoc = winPath.split('/');
    // if(winLoc.length <= 2){
    //   winPath = `${lang}/${_router.config[0].children[0].path}` 
    // }


    // let lang = localStorage.language;
    // let winPath = window.location.pathname;
    // let winLoc = winPath.split('/');
    // if(winLoc.length <= 2){
    //   winPath = `${winPath}/${lang}/${winLoc[2]}` 
    // }
    // _router.config[0].children[0].path = winPath
    // _location.go(winPath);
    // 
    
    // let loc =_location.path().replace('/', '');
    // let windPath = window.location.pathname.split('/')[1];
    // let routConf = _router.config[0].path;
    // let empty = '';
    // if(!localStorage.language){
    //   if(loc !== empty){
    //     localStorage.language = loc.split('/')[0];
    //     _router.config[1].path = loc;
    //   }
    // }else{
    //   _router.config[0].path = `${localStorage.language}/${loc.split('/')[1]}`
    // }

  }

  ngOnInit() {
    let _self = this;
    let prefix = localStorage.language;
    let title = localStorage.location;
    
    // this._templatesService.getTemplate(title, prefix)
    // .subscribe(
    //   (res) => {
    //     if(res){
    //       // //
    //       let pageTitle = res['pageTitle'];
    //       // this.permalink = this.permalinkEdit = res['permalink'];
    //       // localStorage.permalink = res['permalink'];

    //       _self._router.config[0].children.forEach((route) => {
    //         if(route.path === pageTitle){
    //           // route.path = `${localStorage.language}/${res['permalink']}`;
             
    //         }
    //       })
    //       //  _self._location.go(`${localStorage.language}/${res['permalink']}`)
    //     }
    //   },
    //   (err) => {
    //     console.log('error from location get Template');
    //     // this.showPreloader = true;
    //     // console.log(err);
    //   }
    // );

    // this._templatesService.getPermalink(title)
    // .subscribe(
    //   (res) => {
    //     if(res){
    //       //
    //       let pageTitle = res['pageTitle'];
    //       this.permalink = this.permalinkEdit = res['permalink'];
    //       localStorage.permalink = res['permalink'];

    //       _self._router.config[0].children.forEach((route) => {
    //         if(route.path === pageTitle){
    //           // route.path = `${localStorage.language}/${res['permalink']}`;
    //                         route.path = `${res['permalink']}`;

             
    //         }
    //       })
    //        _self._location.go(`${localStorage.language}/${res['permalink']}`)
    //     }else{
    //       console.log('empty permalink');

    //     }
    //   },
    //   (err) => {
    //     console.log('Error form getting permalink' + err);
    //   }
    // )
     //  this.winPathname = window.location.pathname;
    // this._activatedRoute.queryParamMap.subscribe(params => {
    //   
    //   localStorage.language = params.get('prefix')
    // });
    // window.location.reload();


    
  }
}
