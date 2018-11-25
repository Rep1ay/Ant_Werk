import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './location/navbar/navbar.component';
import { RegisterComponent } from './location/register/register.component';
import { LoginComponent } from './location/login/login.component';
import { HomeComponent } from './location/home/home.component';
import { PreloaderComponent } from './location/preloader/preloader.component';
import { ContactsComponent } from './location/contacts/contacts.component';
import { LocationComponent } from './location/location.component';
import { CareerComponent } from './location/career/career.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';
import { NewsComponent } from './location/news/news.component';
import { NewArticleComponent } from './location/new-article/new-article.component';
import { SingleArticleComponent } from './location/single-article/single-article.component';
import { LayoutComponent } from './location/layout/layout.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ContactsComponent,
    LocationComponent,
    PreloaderComponent,
    CareerComponent,
    NewsComponent,
    NewArticleComponent,
      SingleArticleComponent,
      LayoutComponent
    ],
    
    imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MaterialModule,
    //   AngularFireModule.initializeApp({
    //     apiKey: "AIzaSyD_ZpFTEPlOw0-fK8eH9unQdWLS5fu9WBo",
    //     authDomain: "antwerk-2a8e5.firebaseapp.com",
    //     projectId: "antwerk-2a8e5",
    //     storageBucket: "antwerk-2a8e5.appspot.com",
    // }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database
    AngularFireStorageModule
    // NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
