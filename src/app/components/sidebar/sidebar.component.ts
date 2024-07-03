import {Component, OnInit} from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: ''},
    {path: '/user-profile', title: 'User Profile', icon: 'person', class: ''},
    {path: '/table-list', title: 'Approval', icon: 'check', class: ''},
    {
        path: '/history',
        title: 'History',
        icon: 'history',
        class: '',
        children: [
            {path: '/history/fuel-history', title: 'Fuel History', icon: 'history', class: ''},
            {path: '/history/payment-history', title: 'Payment History', icon: 'history', class: ''},
            {path: '/history/work-history', title: 'Work History', icon: 'history', class: ''},
        ],
    },
    {path: '/typography', title: 'Work Assign', icon: 'library_books', class: ''},
    {path: '/icons', title: 'Icons', icon: 'bubble_chart', class: ''},
    {path: '/maps', title: 'Maps', icon: 'location_on', class: ''},
    {path: '/site', title: 'Site', icon: 'house', class: ''},
    // {path: '/notifications', title: 'Notifications', icon: 'notifications', class: ''},
    // {path: '/upgrade', title: 'Upgrade to PRO', icon: 'unarchive', class: 'active-pro'},
];


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

//-------------------------------------------------drop down for history
    showHistoryDropdown: boolean = false;

    showHistoryOptions() {
        this.showHistoryDropdown = !this.showHistoryDropdown;
    }

//-----------------------------------------------------------------------------------------------------
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}
