import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {User} from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private afs: AngularFirestore) {
    }

    // add data
    addUserData(user: User) {
        user.Number = this.afs.createId();
        return this.afs.collection('users').add(user);
    }

    deleteUser(user: User) {
        return this.afs.doc('users' + user.Number).delete();
    }

    getAllUser() {
        return this.afs.collection('users').snapshotChanges();
    }

    updateUser(user: User) {
        this.deleteUser(user);
        this.addUserData(user);
    }
}
