import {Injectable} from '@angular/core';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import {cloneDeep} from 'lodash-es';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {user as userData} from 'app/mock-api/common/user/data';

@Injectable({
    providedIn: 'root'
})
export class AuthMockApi {
    private readonly _secret: any;
    private _user: any = userData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
      
    }

   
}
