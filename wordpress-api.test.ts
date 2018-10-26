import { Injectable } from '@angular/core';
import { WordpressApiService } from './wordpress-api.service';

import * as faker from 'faker/locale/en';
import { INVALID_EMAIL } from './wordpress-api.interface';

@Injectable({ providedIn: 'root'})
export class WordpressApiTestService {
    constructor(
        private wp: WordpressApiService
    ) {

    }

    success(...vars) {
        console.log(`[SUCCESS] : `, vars);
    }
    error(...vars) {
        console.log(`===> ERROR : `, vars);
        console.log(`^^^^^^^^^^^^^^^^^^^^^^`);
    }
    run() {

        this.wp.get( this.wp.urlSonubApi + '/wrong-route').subscribe(x => x, e => {
            e.code === 'rest_no_route' ? this.success('Expect error on wrong route') : this.error('Must be error');
        });

        this.wp.version().subscribe( res => {
            this.success(`Version: ${res}`);
        }, e => this.error('Expect success on version: ', e));


        const email = faker.internet.email();
        const password = '12345a,*';
        const username = faker.internet.userName();
        this.wp.register({ email: email, password: password, username }).subscribe(res => {
            this.success('register ok', res);
        }, e => this.error('Expect success on register'));

        this.wp.login('abc@wrong.com', '1345a8az,').subscribe( res => this.error('Expect error on login'), e => {
            this.wp.is(e, INVALID_EMAIL) ?
                this.success('Expect error on invalid email') : this.error('Expect error on login with invalid email');
        });
    }
}
