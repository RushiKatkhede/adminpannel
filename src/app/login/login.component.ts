import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';

    protected readonly onsubmit = onsubmit;

    constructor(private router: Router, private auth: AuthService) {
    }

    ngOnInit(): void {
    }

    login() {
        // tslint:disable-next-line:triple-equals
        if (this.email == '') {
            alert('Please enter email');
            return;
        }
        // tslint:disable-next-line:triple-equals
        if (this.password == '') {
            alert('Please enter password');
            return;
        }
        this.auth.login(this.email, this.password);
        this.email = '';
        this.password = '';
    }

    onSubmit() {
        this.router.navigate(['/dashboard']);  // Use router.navigate to '/dashboard'
    }
}
