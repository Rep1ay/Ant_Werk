import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-location-component',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit {
  winOrigin: string;
  winPathname: string;
  edition = false;
  constructor( private _activatedRoute: ActivatedRoute, private _router: Router,private _location: Location) { 
    this.winOrigin = window.location.origin;
    this.winPathname = window.location.pathname;
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
     //  this.winPathname = window.location.pathname;
    // this._activatedRoute.queryParamMap.subscribe(params => {
    //   
    //   localStorage.language = params.get('prefix')
    // });
    // window.location.reload();

    this._activatedRoute.snapshot.root

    
  }

  editPageURL(inputURL: NgForm){
    console.log(inputURL.value);
  }
}
