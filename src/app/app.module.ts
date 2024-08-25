import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';
import {AppComponent} from './app.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './login/login.component';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {StatusDialogComponent} from './status-dialog/status-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {PaymentDialogComponent} from './payment-dialog/payment-dialog.component';
import {OtpDialogComponent} from './otp-dialog/otp-dialog.component'
import {WindowService} from './common/window/window.service';
import { WorkAssignDialogComponent } from './work-assign-dialog/work-assign-dialog.component';

@NgModule({
    imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        MatInputModule,
        MatSelectModule,
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyCdUNAFUfVU6O2qdlRFpQanlJzBW-MPNnc',
            authDomain: 'palhades-3cfcf.firebaseapp.com',
            databaseURL: 'https://palhades-3cfcf-default-rtdb.firebaseio.com',
            projectId: 'palhades-3cfcf',
            storageBucket: 'palhades-3cfcf.appspot.com',
            messagingSenderId: '802569988360',
            appId: '1:802569988360:web:c4b2e2b04d7ed1510de4bd',
            measurementId: 'G-T2DQ4J86SV'
        }),

    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        StatusDialogComponent,
        PaymentDialogComponent,
        OtpDialogComponent,
        WorkAssignDialogComponent,
    ],
    providers: [WindowService],
    bootstrap:
        [AppComponent]
})

export class AppModule {
}
