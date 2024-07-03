import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {SiteComponent} from "../../site/site.component";
import {PaymentHistoryComponent} from "../../history/payment-history/payment-history.component";
import {WorkHistoryComponent} from "../../history/work-history/work-history.component";
import {FuelHistoryComponent} from "../../history/fuel-history/fuel-history.component";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatTableModule,
        MatCheckboxModule,
    ],
    declarations: [

        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        FuelHistoryComponent,
        PaymentHistoryComponent,
        WorkHistoryComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        SiteComponent,
        NotificationsComponent,
        UpgradeComponent,
    ]
})

export class AdminLayoutModule {
}
