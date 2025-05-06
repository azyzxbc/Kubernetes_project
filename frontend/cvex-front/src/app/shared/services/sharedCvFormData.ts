import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private fileData: any;

  setFileData(data: any): void {
    this.fileData = data;
  }

  getFileData(): any {
    return this.fileData;
  }
}
