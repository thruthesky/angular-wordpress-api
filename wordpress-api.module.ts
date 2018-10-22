import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WordpressApiService } from './wordpress-api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [
        FormsModule,
        HttpClientModule
    ],
    providers: [WordpressApiService],
})
export class WordpressApiModule {
    public static forRoot(config): ModuleWithProviders {
        WordpressApiService.config = config;
        return { ngModule: WordpressApiModule, providers: [WordpressApiService] };
    }
}
