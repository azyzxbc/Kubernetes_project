import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MarkdownModule } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './modules/components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileComponent } from './modules/components/admin/user-profile/user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthModule } from '@auth0/auth0-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};
import { MatCardModule } from '@angular/material/card';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        UserProfileComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        AuthModule.forRoot({
            domain: 'matchnhire.eu.auth0.com',
            clientId: 'HPdN8iAzJQ4bpc5na8XfpMEb25zNdXvk',
            authorizationParams: {
                redirect_uri: window.location.origin,
                audience: 'https://app.matchnhire.com/api/v3',
                scope: 'openid profile email',
            },
        }),
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,
        MarkdownModule.forRoot({}),
        PdfViewerModule,
        MatStepperModule,
        MatDialogModule,
        MatRadioModule,
        MatButtonModule,
        MatTabsModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    providers: [
        NgxNavigationWithDataComponent,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
