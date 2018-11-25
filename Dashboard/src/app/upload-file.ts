import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FileUpload } from './fileupload';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {



// private _templatesUrl = 'http://68.183.30.119/api/templates'

constructor(private db: AngularFireDatabase) {}

private saveFileData(fileUpload: FileUpload) {
  this.db.list(`uploads`).push(fileUpload);
}



}
