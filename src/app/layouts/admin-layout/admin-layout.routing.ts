import {Routes} from '@angular/router';

import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {LoginComponent} from "../../login/login.component";
import {SiteComponent} from "../../site/site.component";
import {WorkHistoryComponent} from "../../history/work-history/work-history.component";
import {PaymentHistoryComponent} from "../../history/payment-history/payment-history.component";
import {FuelHistoryComponent} from "../../history/fuel-history/fuel-history.component";

export const AdminLayoutRoutes: Routes = [
//     // {
//     //   path: '',
//     //   children: [ {
//     //     path: 'dashboard',
//     //     component: DashboardComponent
//     // }]}, {
//     // path: '',
//     // children: [ {
//     //   path: 'userprofile',
//     //   component: UserProfileComponent
//     // }]
//     // }, {
//     //   path: '',
//     //   children: [ {
//     //     path: 'icons',
//     //     component: IconsComponent
//     //     }]
//     // }, {
//     //     path: '',
//     //     children: [ {
//     //         path: 'notifications',
//     //         component: NotificationsComponent
//     //     }]
//     // }, {
//     //     path: '',
//     //     children: [ {
//     //         path: 'maps',
//     //         component: MapsComponent
//     //     }]
//     // }, {
//     //     path: '',
//     //     children: [ {
//     //         path: 'typography',
//     //         component: TypographyComponent
//     //     }]
//     // }, {
//     //     path: '',
//     //     children: [ {
//     //         path: 'upgrade',
//     //         component: UpgradeComponent
//     //     }]
//     // }

    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'user-profile', component: UserProfileComponent},
    {path: 'table-list', component: TableListComponent},
    {path: 'typography', component: TypographyComponent},
    {
        path: 'history',
        children: [
            {path: 'fuel-history', component: FuelHistoryComponent},
            {path: 'payment-history', component: PaymentHistoryComponent},
            {path: 'work-history', component: WorkHistoryComponent},
        ],
    },
    {path: 'icons', component: IconsComponent},
    {path: 'maps', component: MapsComponent},
    {path: 'site', component: SiteComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'upgrade', component: UpgradeComponent},
];
// export const AdminLayoutRoutes: Routes = [
//     {path: 'dashboard', component: DashboardComponent},
//     {path: 'user-profile', component: UserProfileComponent},
//     {path: 'table-list', component: TableListComponent},
//     {path: 'typography', component: TypographyComponent},
//     {path: 'icons', component: IconsComponent},
//     {path: 'maps', component: MapsComponent},
//     {path: 'notifications', component: NotificationsComponent},
//     {path: 'upgrade', component: UpgradeComponent},
// ];