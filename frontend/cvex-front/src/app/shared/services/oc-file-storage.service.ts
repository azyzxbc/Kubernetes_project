import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OcFileStorageService {

    //#region Lifecycle methods
    constructor(private httpSvc: HttpClient) {
    }

    //#endregion Lifecycle methods

    //#region Exposed methods

    /**
     * Tries to retrieve base64 file from local storage.
     * If doesn't exist, downloads stores and retrieves the file again.
     * @param key Key to search in storage
     * @param urlIfNotExist Url which will be downloaded if key wasn't found
     * @returns Observable of base64 data url string the file inside
     */
    public getStoredFile(key: string, urlIfNotExist: string): Observable<string> {
        const storedFile = this.getFromStorage(key);
        if (storedFile) {
            return this.objectToObserver<string>(storedFile);
        } else {
            return this.downloadDataAsBase64(urlIfNotExist).pipe(
                map((b64Result: string) => {
                    this.saveToStorage(key, b64Result);
                    return b64Result;
                })
            );
        }
    }

    //#region Exposed methods

    //#region Storage methods

    private saveToStorage(key: string, b64Result: string) {
        localStorage.setItem(key, b64Result);
    }

    private getFromStorage(key: string) {
        return localStorage.getItem(key);
    }

    //#endregion Storage methods

    //#region Downloader methods

    private downloadAsBlob(url: string) {
        return this.httpSvc.get(url, {responseType: 'blob'});
    }

    private downloadDataAsBase64(url: string): Observable<string> {
        return this.downloadAsBlob(url).pipe(
            flatMap(blob => this.blobToBase64(blob).pipe(
                map((b64Result: string) => b64Result)
            ))
        );
    }

    //#endregion Downloader methods

    //#region Util methods

    private blobToBase64(blob: Blob): Observable<{}> {
        const fileReader = new FileReader();
        const observable = new Observable((observer) => {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            fileReader.onloadend = () => {
                observer.next(fileReader.result);
                observer.complete();
            };
        });
        fileReader.readAsDataURL(blob);
        return observable;
    }

    private objectToObserver<T>(storedFile: T): Observable<T> {
        return new Observable<T>(observer => {
            observer.next(storedFile);
            observer.complete();
        });
    }

    //#region Util methods

}
