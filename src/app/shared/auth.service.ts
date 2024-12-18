import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from "@angular/router";
import {error} from "protractor";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private fireauth: AngularFireAuth, private router: Router) {
    }

    login(email: string, password: string) {
        this.fireauth.signInWithEmailAndPassword(email, password).then(() => {
            localStorage.setItem('token', 'true');
            this.router.navigate(['dashboard']);
        }, error => {
            alert("Something went wrong");
            this.router.navigate(['/login']);
        })
    }

    register(email: string, password: string) {
        this.fireauth.createUserWithEmailAndPassword(email, password).then(() => {
            alert("Registration successfully");
            this.router.navigate(['/login']);
        }, error => {
            alert(error.message);
            this.router.navigate(['/login']);
        })
    }

    logout() {
        this.fireauth.signOut().then(() => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
        }, error => {
            alert(error.message);
        })
    }
}
