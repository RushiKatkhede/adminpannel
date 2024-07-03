import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DataService} from "../shared/data.service";
import {User} from "../model/user";
import {deleteUser} from "@angular/fire/auth";

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
    userData: any[] = [];
    approvedData: any[] = [];
    userList: User[] = [];
    Number: string = '';
    id: string = '';
    name: string = '';
    isEditing = false;
    selectedUser: any; // Declare this variable in your component class
    selectedUserNumber: string;
    selectedRowIndex: number | null = null;
    //variables to upload data
    siteName: string = '';
    siteAddress: string = '';
    longitude: string = '';
    latitude: string = '';
    siteLink: string = '';


    constructor(private firestore: AngularFirestore, private data: DataService) {
    }

    ngOnInit(): void {
        this.fetchUserData();
    }

    fetchUserData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.userData = data;
        });
    }

    onSubmit() {
        const formData = {
            siteName: this.siteName,
            siteAddress: this.siteAddress,
            longitude: this.longitude,
            latitude: this.latitude,
            siteLink: this.siteLink
        };

        // Push the data to Firebase
        this.firestore.collection('siteData').add(formData)
            .then(() => {
                alert('Data submitted to Firebase successfully');
                // Clear the form fields after submission
                this.clearForm();
            })
            .catch(error => alert('Error submitting data to Firebase: ' + error));
    }

    clearForm() {
        this.siteName = '';
        this.siteAddress = '';
        this.longitude = '';
        this.latitude = '';
        this.siteLink = '';
    }

    // Add this method in your component class
    deleteSite(siteName: string): void {
        const confirmDelete = window.confirm(`Are you sure you want to delete the site "${siteName}"?`);

        if (confirmDelete) {
            this.firestore.collection('siteData', ref => ref.where('siteName', '==', siteName)).get().subscribe(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const siteId = doc.id;
                    this.firestore.collection('siteData').doc(siteId).delete().then(() => {
                        // Remove the deleted site from the local array
                        const index = this.userData.findIndex((site: any) => site.id === siteId);
                        if (index !== -1) {
                            this.userData.splice(index, 1);
                        }
                        alert('Site deleted successfully!');
                    }).catch((error) => {
                        alert('Error deleting site: ' + error);
                    });
                });
            });
        }
    }


}
