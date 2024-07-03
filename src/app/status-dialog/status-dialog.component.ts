import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {user} from "@angular/fire/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-status-dialog',
    templateUrl: './status-dialog.component.html',
    styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
    form: FormGroup;
    formData = {
        pricePerDay: '',
        pricePerKm: '',
        status: '',
        vehicleType: '',
        site: '',
        accNo: '',
        ifsc: '',
        bank: '',
        // Add other form fields as needed
    };
    userName: string;
    phone: string;
    vehicleTypeOptions: string[] = ["Regular", "Addon"]
    siteOptions: string[] = []; // Replace with your actual site options
    statusOptions: string[] = ['pending', 'approved']; // Replace with your actual status options
    constructor(
        public dialogRef: MatDialogRef<StatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private firestore: AngularFirestore,
        private fb: FormBuilder
    ) {
        if (this.data.user) {
            this.userName = this.data.user.userName;
            this.phone = this.data.user.phone;
        }
        this.form = this.fb.group({
            pricePerDay: ['', Validators.required],
            pricePerKm: ['', Validators.required],
            status: ['', Validators.required],
            vehicleType: ['', Validators.required],
            site: ['', Validators.required],
            accNo: ['', Validators.required],
            ifsc: ['', Validators.required],
            bank: ['', Validators.required],
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    submitForm(): void {
        if (this.form.valid) {
            // Your existing form submission logic
            // Ensure the phone number is set
            if (!this.phone) {
                alert('Phone number is missing. Cannot update data.');
                return;
            }
            // Retrieve the document ID based on the phone number
            this.firestore.collection('users', ref => ref.where('phone', '==', this.phone)).get()
                .subscribe((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        // If a document is found, get its ID
                        const documentId = querySnapshot.docs[0].id;

                        // Create an object with the updated data
                        const updatedData = {
                            status: this.form.value.status,
                            ppd: this.form.value.pricePerDay,
                            ppk: this.form.value.pricePerKm,
                            type: this.form.value.vehicleType,
                            sitename: this.form.value.site,
                            accno: this.form.value.accNo,
                            ifsc: this.form.value.ifsc,
                            bank: this.form.value.bank,
                            // Add other fields as needed
                        };

                        // Update the user's document in the 'users' collection
                        this.firestore.collection('users').doc(documentId).update(updatedData)
                            .then(() => {
                                alert('Data updated successfully!');
                            })
                            .catch((error) => {
                                alert('Error updating data:' + error);
                            });

                        // Close the dialog after form submission
                        this.dialogRef.close();
                    } else {
                        alert('No document found for the provided phone number.');
                    }
                });
        } else {
            alert('Please fill in all the required fields.');
        }
    }


    fetchUserData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.siteOptions = data.map(site => site.siteName);
        });
    }

    ngOnInit(): void {
        this.fetchUserData();
    }
}