import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from '../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WindowService } from '../common/window/window.service';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';

const config = {
    apiKey: 'AIzaSyCdUNAFUfVU6O2qdlRFpQanlJzBW-MPNnc',
    authDomain: 'palhades-3cfcf.firebaseapp.com',
    databaseURL: 'https://palhades-3cfcf-default-rtdb.firebaseio.com',
    projectId: 'palhades-3cfcf',
    storageBucket: 'palhades-3cfcf.appspot.com',
    messagingSenderId: '802569988360',
    appId: '1:802569988360:web:c4b2e2b04d7ed1510de4bd',
    measurementId: 'G-T2DQ4J86SV'
};

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit, AfterViewInit {
    siteOptions: string[] = [];
    selectedSite = '';
    form: FormGroup;
    mobileNumber = '+917057577122';
    otpVerified = false;
    reCaptchaVerifier: any;
    otp: string;
    phoneSignIn = true;
    windowRef: any;
    adminList: any[] = [];
    selectedUserEmail: string;
    selectedUser: any;
    docId: any;

    constructor(
        private firestore: AngularFirestore,
        private data: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        public afAuth: AngularFireAuth,
        private windowService: WindowService,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            email: ['', Validators.required],
            name: ['', Validators.required],
            site: ['', Validators.required],
            designation: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    ngOnInit() {
        if (!firebase.app.length) {
            firebase.initializeApp(config)
        }
        firebase.initializeApp(config);
        this.fetchSiteData();
        this.fetchAdminData();
    }

    ngAfterViewInit() {
        this.windowRef = this.windowService;
        if (this.windowRef) {
            this.windowRef.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    //
                }
            });
            this.windowRef.reCaptchaVerifier.render();
        } else {
            console.error('Window reference is undefined.');
        }
    }

    fetchSiteData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.siteOptions = data.map(site => site.siteName);
        });
    }

    togglePhoneSignIn() {
        this.phoneSignIn = !this.phoneSignIn;
    }

    onSiteSelectionChange(selectedSite: string) {
        console.log('Selected Site:', selectedSite);
        this.selectedSite = selectedSite;
    }

    onSubmit() {
        this.afAuth.signInWithPhoneNumber(this.mobileNumber, this.windowRef.reCaptchaVerifier)
            .then((confirmationResult) => {
                this.windowRef.confirmationResult = confirmationResult;
                this.openOtpDialog(() => {
                    console.log('OTP verified for onSubmit');
                    // Additional logic for onSubmit after OTP verification
                });
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
                alert('Error sending OTP: ' + error.message);
            });
    }

    openOtpDialog(callback: () => void) {
        const dialogRef = this.dialog.open(OtpDialogComponent, {
            width: '400px',
            position: { top: '50px' },
            data: {}
        });

        dialogRef.afterClosed().subscribe((otp) => {
            if (otp) {
                this.verifyOTP(otp, callback);
            } else {
                console.log('OTP dialog closed without entering OTP');
            }
        });
    }

    verifyOTP(otp: string, callback: () => void) {
        this.windowRef.confirmationResult.confirm(otp)
            .then((userCredentials) => {
                console.log('OTP verification successful:', userCredentials);
                callback(); // Execute the callback function after successful OTP verification
            })
            .catch((error) => {
                console.error('Error verifying OTP:', error);
                alert('Error verifying OTP: ' + error.message);
            });
    }

    setSelectedUser(user: any): void {
        this.selectedUser = { ...user };
        this.selectedUserEmail = user.email;
    }

    saveUserData(userData: any) {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
            alert('Please fill out all required fields correctly.');
            return;
        }

        this.firestore.collection('adminAccounts').add(userData)
            .then(() => {
                console.log('Admin data saved successfully.');
                alert('Admin data saved successfully.');
                this.form.reset();
                this.fetchAdminData();
            })
            .catch((error) => {
                console.error('Error saving user data:', error);
                alert('Error saving admin data: ' + error.message);
            });
    }

    fetchAdminData() {
        this.firestore.collection('adminAccounts').snapshotChanges().subscribe((data: any[]) => {
            this.adminList = data.map(e => {
                return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data()
                };
            });
        });
    }

    deleteUser(user: any) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.firestore.collection('adminAccounts').doc(user.id).delete()
                .then(() => {
                    console.log('User deleted successfully.');
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                });
        }
    }

    update(user: any): void {
        if (this.selectedUser) {
            console.log('Initial selectedUser data:', JSON.stringify(this.selectedUser));
            const newData = this.selectedUser;

            this.openOtpDialog(() => {
                // After OTP verification, proceed with the update
                console.log('OTP verified for update');
                this.updateUserData(newData);
            });
        } else {
            console.log('No user selected for updating.');
        }
    }

    updateUserData(newData: any): void {
        // Find the document ID based on the user's email
        this.firestore.collection('adminAccounts', ref => ref.where('email', '==', newData.email)).get().subscribe(
            (querySnapshot) => {
                if (querySnapshot.size > 0) {
                    const docId = querySnapshot.docs[0].id;
                    console.log('Document ID found:', docId); // Log the found document ID

                    // Log the data just before making Firestore update
                    console.log('Data before Firestore update:', JSON.stringify(this.selectedUser));

                    this.firestore.collection('adminAccounts').doc(docId).update(newData)
                        .then(() => {
                            console.log('Data updated successfully!');
                            alert('Data updated successfully: ' + this.selectedUser.name);
                            this.fetchAdminData(); // Refresh the admin list after updating

                            // Optionally fetch and verify the updated data
                            this.refreshUpdatedUser(docId); // Fetch the updated data and update the state
                        })
                        .catch((error) => {
                            console.error('Error updating data:', error);
                            alert('Error updating data: ' + error);
                        });
                } else {
                    alert('No document found for the provided email.');
                }
            },
            (error) => {
                console.error('Error fetching document:', error);
                alert('Error fetching document: ' + error);
            }
        );
    }

    refreshUpdatedUser(docId: string): void {
        this.firestore.collection('adminAccounts').doc(docId).get().subscribe(
            (docSnapshot) => {
                if (docSnapshot.exists) {
                    const updatedData = docSnapshot.data();
                    console.log('Fetched updated data:', JSON.stringify(updatedData)); // Log to verify fetched data
                    this.selectedUser = updatedData; // Update the component state

                    // Manually trigger change detection
                    this.cdr.detectChanges();
                } else {
                    console.error('Document not found after update.');
                }
            },
            (error) => {
                console.error('Error fetching updated document:', error);
                alert('Error fetching updated document: ' + error);
            }
        );
    }
}
