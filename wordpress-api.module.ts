import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WordpressApiService } from './wordpress-api.service';
import { HttpClientModule } from '@angular/common/http';
import { WordpressApiConfig } from './wordpress-api.interface';
import { ConfigToken } from './wordpress-api.config';
import { CookieModule } from 'ngx-cookie';

@NgModule({
    imports: [
        HttpClientModule,
        CookieModule.forChild()
    ],
    exports: [
        FormsModule,
        HttpClientModule
    ],
    providers: [WordpressApiService],
})
export class WordpressApiModule {
    public static forRoot(config: WordpressApiConfig): ModuleWithProviders {
        return {
            ngModule: WordpressApiModule,
            providers: [
                WordpressApiService,
                { provide: ConfigToken, useValue: config }
            ]
        };
    }
}

