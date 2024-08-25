import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {StatusDialogComponent} from '../status-dialog/status-dialog.component';
import {deleteField, doc, getFirestore, updateDoc} from '@angular/fire/firestore';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
    form: FormGroup;
    formData = {
        transactionId: '',
        amount: '',
        remark: '',
        // Add other form fields as needed
    };
    // user data from fuel history-----------------------------------------------------------------------------------
    userName: string;
    phone: string;
    sitename: string;
    bank: string;
    RequestTime: Date;
    statusOptions: string[] = ['payment', 'fuel', 'other']; // Replace with your actual status options
    constructor(
        public dialogRef: MatDialogRef<StatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private firestore: AngularFirestore,
        private fb: FormBuilder
    ) {
        if (this.data.user) {
            this.userName = this.data.user.userName;
            this.phone = this.data.user.phone;
            this.sitename = this.data.user.sitename;
            this.bank = this.data.user.bank;
            // tslint:disable-next-line:max-line-length
            this.RequestTime = this.data.user.fuelrequest ? new Date(this.data.user.fuelrequest) : new Date(this.data.user.submissionTime);
        }
        this.form = this.fb.group({
            transactionID: ['', Validators.required],
            amount: ['', Validators.required],
            remark: ['', Validators.required],
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    submitForm(): void {
        if (this.form.valid) {
            // Ensure the phone number is set
            if (!this.phone) {
                alert('Phone number is missing. Cannot update data.');
                return;
            }

            // Create a history object with user and form data
            const historyData = {
                userName: this.userName,
                phone: this.phone,
                sitename: this.sitename,
                bank: this.bank,
                RequestTime: this.RequestTime,
                submissionTime: new Date(), // Store the current date and time
                transactionID: this.form.value.transactionID,
                amount: this.form.value.amount,
                remark: this.form.value.remark,
                // Add other fields as needed
            };

            // Store the history in the 'fuelHistory' collection
            this.firestore.collection('paymentHistory').add(historyData)
                .then(() => {
                    alert('Data added to payment history successfully!');
                    this.firestore.collection('users', ref => ref.where('phone', '==', this.phone)).get()
                        .subscribe((querySnapshot) => {
                            if (querySnapshot.size > 0) {
                                const documentId = querySnapshot.docs[0].id;

                                const userDocRef = doc(getFirestore(), 'users', documentId);
                                const updateObj = {fuelrequest: deleteField()}; // Use deleteField() to delete the field

                                updateDoc(userDocRef, updateObj)
                                    .then(() => {
                                        alert('fuelrequest field deleted successfully!');
                                    })
                                    .catch((error) => {
                                        alert('Error deleting fuelrequest field: ' + error);
                                    });
                            }
                        });

                    // Close the dialog after form submission
                    this.dialogRef.close();
                })
                .catch((error) => {
                    alert('Error adding data to payment history: ' + error);
                });
        } else {
            alert('Please fill in all the required fields.');
        }
    }


    ngOnInit(): void {
    }
}
