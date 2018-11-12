import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { TemplatesService } from '../templates.service';
import { filter } from 'rxjs/operators';


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
      this._router.events.pipe(
        filter((event:Event) => (event instanceof NavigationEnd))
      ).subscribe((routeData: any) => {
        this.winOrigin = window.location.origin;
        this.winPathname = window.location.pathname;
        // event.target.response.search("career")
        
      })
  }

  ngOnInit() {
     
  }
}
