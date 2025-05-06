import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import axios from 'axios';
import { OwencloudService } from './Owncloud.service';
@Injectable({
    providedIn: 'root'
})
export class Plus_de_details {

    private webDavUrl = "this.owncloudconfig.webDavUrl"
    private username = "this.owncloudconfig.username"
    private password = ""
    results :any[] = [];

    private sharedVariable: any;
    constructor(private http: HttpClient,private owncloudconfig:OwencloudService) { }






//// get the matching cv for   post vacant that i upload it
    async getMatchingFilesInFolder(folderName: string): Promise<string[]> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}postvacante/${folderName}/CV`;

        try {
            const response = await axios({
                method: 'PROPFIND',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader,
                    'Depth': '1'
                }
            });

            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            console.log(response.data)
            const fileNames: string[] = [];
            const entries = xml.getElementsByTagName('d:response');
            console.log(entries)
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const hrefElement = entry.getElementsByTagName('d:href')[0];
                console.log(hrefElement)
                const resourcetypeElement = entry.getElementsByTagName('d:resourcetype')[0];

                if (hrefElement && hrefElement.textContent && resourcetypeElement) {
                    const isCollection = resourcetypeElement.getElementsByTagName('d:collection').length > 0;

                    if (!isCollection) {
                        const href = hrefElement.textContent;
                        const fileName = href.substr(href.lastIndexOf('/') + 1);
                        const decodedFileName = decodeURIComponent(fileName);
                        fileNames.push(decodedFileName);

                    }
                }
            }

            return fileNames;
        } catch (error) {
            throw error;
        }
    }


// add the cv to favourite post vacant

    async addfiletofav(job_name: string, file: string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const sourceUrl = `${this.webDavUrl}postvacante/${job_name}/CV/${file}`;

        const destinationUrl = `${this.webDavUrl}postvacante/${job_name}/Favoris_CV/${file}`;
        try {

            const response = await axios({
                method: 'COPY',
                url: sourceUrl,
                headers: {
                    'Authorization': authHeader,
                    'Destination': destinationUrl,
                },
            });

            // Check if the copy operation was successful.
            if (response.status === 201) {
                // Copy was successful.

            } else {
                // Handle errors or failures.
                throw new Error(`File copy failed: ${response.statusText}`);
            }
        } catch (error) {
            throw error;
        }
    }

    //////////file delete from fav for post vacant
    async deleteFilefromfav(job_name :string,fileName: string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;


        const fileUrl = `${this.webDavUrl}postvacante/${job_name}/Favoris_CV/${(fileName)}`;
        try {
            await axios({
                method: 'DELETE',
                url: fileUrl,
                headers: {
                    'Authorization': authHeader
                }
            });

        } catch (error) {
            throw error;
        }
    }

//get the file from favoris post vacant

    async getthefavfile(folderName: string): Promise<string[]> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}postvacante/${folderName}/Favoris_CV`;

        try {
            const response = await axios({
                method: 'PROPFIND',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader,
                    'Depth': '1'
                }
            });

            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            console.log(response.data)
            const fileNames: string[] = [];
            const entries = xml.getElementsByTagName('d:response');
            console.log(entries)
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const hrefElement = entry.getElementsByTagName('d:href')[0];
                console.log(hrefElement)
                const resourcetypeElement = entry.getElementsByTagName('d:resourcetype')[0];

                if (hrefElement && hrefElement.textContent && resourcetypeElement) {
                    const isCollection = resourcetypeElement.getElementsByTagName('d:collection').length > 0;

                    if (!isCollection) {
                        const href = hrefElement.textContent;
                        const fileName = href.substr(href.lastIndexOf('/') + 1);
                        const decodedFileName = decodeURIComponent(fileName);
                        fileNames.push(decodedFileName);

                    }
                }
            }

            return fileNames;
        } catch (error) {
            throw error;
        }
    }









//// get the matching cv for placment
    async get_matching_cv_in_placment(folderName: string): Promise<string[]> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}Placement/${folderName}/CV`;

        try {
            const response = await axios({
                method: 'PROPFIND',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader,
                    'Depth': '1'
                }
            });

            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            console.log(response.data)
            const fileNames: string[] = [];
            const entries = xml.getElementsByTagName('d:response');
            console.log(entries)
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const hrefElement = entry.getElementsByTagName('d:href')[0];
                console.log(hrefElement)
                const resourcetypeElement = entry.getElementsByTagName('d:resourcetype')[0];

                if (hrefElement && hrefElement.textContent && resourcetypeElement) {
                    const isCollection = resourcetypeElement.getElementsByTagName('d:collection').length > 0;

                    if (!isCollection) {
                        const href = hrefElement.textContent;
                        const fileName = href.substr(href.lastIndexOf('/') + 1);
                        const decodedFileName = decodeURIComponent(fileName);
                        fileNames.push(decodedFileName);

                    }
                }
            }

            return fileNames;
        } catch (error) {
            throw error;
        }
    }



// add the cv to favourite placment

    async addfiletofav_placment(job_name: string, file: string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const sourceUrl = `${this.webDavUrl}Placement/${job_name}/CV/${file}`;

        const destinationUrl = `${this.webDavUrl}Placement/${job_name}/Favoris_CV/${file}`;
        try {

            const response = await axios({
                method: 'COPY',
                url: sourceUrl,
                headers: {
                    'Authorization': authHeader,
                    'Destination': destinationUrl,
                },
            });

            // Check if the copy operation was successful.
            if (response.status === 201) {
                // Copy was successful.

            } else {
                // Handle errors or failures.
                throw new Error(`File copy failed: ${response.statusText}`);
            }
        } catch (error) {
            throw error;
        }
    }



    //////////file delete from fav for placment
    async deleteFilefromfav_placment(job_name :string,fileName: string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;


        const fileUrl = `${this.webDavUrl}Placement/${job_name}/Favoris_CV/${(fileName)}`;
        try {
            await axios({
                method: 'DELETE',
                url: fileUrl,
                headers: {
                    'Authorization': authHeader
                }
            });

        } catch (error) {
            throw error;
        }
    }


// get  the file from placemnt favoris
    async getthefavfile_placemnt(folderName: string): Promise<string[]> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}Placement/${folderName}/Favoris_CV`;

        try {
            const response = await axios({
                method: 'PROPFIND',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader,
                    'Depth': '1'
                }
            });

            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');
            console.log(response.data)
            const fileNames: string[] = [];
            const entries = xml.getElementsByTagName('d:response');
            console.log(entries)
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const hrefElement = entry.getElementsByTagName('d:href')[0];
                console.log(hrefElement)
                const resourcetypeElement = entry.getElementsByTagName('d:resourcetype')[0];

                if (hrefElement && hrefElement.textContent && resourcetypeElement) {
                    const isCollection = resourcetypeElement.getElementsByTagName('d:collection').length > 0;

                    if (!isCollection) {
                        const href = hrefElement.textContent;
                        const fileName = href.substr(href.lastIndexOf('/') + 1);
                        const decodedFileName = decodeURIComponent(fileName);
                        fileNames.push(decodedFileName);

                    }
                }
            }

            return fileNames;
        } catch (error) {
            throw error;
        }
    }




////// generatea a json file in the owncloud to put the notes in it
    async uploadJSONToOwnCloud(fileName: string, jsonData: string,cardname:string,Placementorjob:string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const fileUrl = `${this.webDavUrl}${Placementorjob}/${cardname}/Favoris_Json/${fileName}.json`; // Set the file extension to .json

        try {
            await axios({
                method: 'PUT', // Use PUT to upload the file
                url: fileUrl,
                data: jsonData, // The JSON data to be uploaded
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json' // Set the content type as JSON
                }
            });
        } catch (error) {
            throw error;
        }
    }





/////// retrive  the json file if exist from placemnt
    async getJSONFromOwnCloud(job_name:string,cvname: string): Promise<string | null> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;

        const fileUrl = `${this.webDavUrl}Placement/${job_name}/Favoris_Json/${cvname}.json`;

        try {

            const response = await axios({
                method: 'GET', // Use GET to retrieve the file content
                url: fileUrl,
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json' // Set the content type as JSON (optional)
                }
            });


            // Check if the response status is successful
            if (response.status === 200) {

                const jsonData = response.data;


                return jsonData; // Return the JSON content
            } else {

                return null; // Return null if the file couldn't be retrieved
            }
        } catch (error) {

            throw error; // You can handle the error as needed
        }
    }


/////// retrive  the json file if exist from postvacant
    async getJSONFromOwnCloudforpostvacant(job_name:string,cvname: string): Promise<string | null> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;

        const fileUrl = `${this.webDavUrl}postvacante/${job_name}/Favoris_Json/${cvname}.json`;

        try {

            const response = await axios({
                method: 'GET', // Use GET to retrieve the file content
                url: fileUrl,
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json' // Set the content type as JSON (optional)
                }
            });


            // Check if the response status is successful
            if (response.status === 200) {

                const jsonData = response.data;


                return jsonData; // Return the JSON content
            } else {

                return null; // Return null if the file couldn't be retrieved
            }
        } catch (error) {

            throw error; // You can handle the error as needed
        }
    }












//// creat folder for placment
    async createFolderIfNotExists(folderName: string,job_name:string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}Placement/${job_name}/${folderName}/`;

        try {
            await axios({
                method: 'MKCOL',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader
                }
            });
        } catch (error) {
            if (error.response?.status !== 405) {
                throw error;
            }
        }
    }


//// creat folder for post vacant
    async createFolderIfNotExistspostvacant(folderName: string,job_name:string): Promise<void> {
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const folderUrl = `${this.webDavUrl}postvacante/${job_name}/${folderName}/`;

        try {
            await axios({
                method: 'MKCOL',
                url: folderUrl,
                headers: {
                    'Authorization': authHeader
                }
            });
        } catch (error) {
            if (error.response?.status !== 405) {
                throw error;
            }
        }
    }



    match(): Observable<any> {
        return this.http.get<any>(`${environment.base_url}/api/`);
    }

}




