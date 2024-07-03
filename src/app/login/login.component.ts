import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string = '';
    password: string = '';

    constructor(private router: Router, private auth: AuthService) {
    }

    ngOnInit(): void {
    }

    login() {
        if (this.email == '') {
            alert("Please enter email");
            return;
        }
        if (this.password == '') {
            alert("Please enter password");
            return;
        }
        this.auth.login(this.email, this.password);
        this.email = '';
        this.password = '';
    }

    protected readonly onsubmit = onsubmit;

    onSubmit() {
        this.router.navigate(['/dashboard']);  // Use router.navigate to navigate to '/dashboard'
    }
}
