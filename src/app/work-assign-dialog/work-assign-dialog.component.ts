// work-assign-dialog.component.ts
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {from} from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
    selector: 'app-work-assign-dialog',
    templateUrl: './work-assign-dialog.component.html',
    styleUrls: ['./work-assign-dialog.component.scss']
})
export class WorkAssignDialogComponent implements OnInit {
    message = '';
    form: FormGroup;
    dialogData: any;



    // } else {
    //     // Handle form validation errors
    //     alert('Form is invalid. Please fill in all required fields.');
    // }

    protected readonly from = from;

    // tslint:disable-next-line:max-line-length
    constructor(public dialogRef: MatDialogRef<WorkAssignDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private firestore: AngularFirestore) {
        this.dialogData = data;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            dateAndTime: ['', Validators.required],
            msg: ['', Validators.required],
            // If you want to add more form controls, you can do it here
        });
    }


    submitForm(): void {
        if (this.form.valid) {
             const formData = this.form.value;

            // Convert the datetime value to Firebase Timestamp
            const timestamp = new Date(formData.dateAndTime);

            const data = {
                datetime: firebase.firestore.Timestamp.fromDate(<Date>timestamp),
                message: formData.msg,
                siteName: this.dialogData.sitename,
                url: this.dialogData.siteUrl,
                RcNo: this.dialogData.RcNo,
                userName: this.dialogData.userName,
                phone: this.dialogData.phone,
                count: this.dialogData.count,
            };

            this.firestore.collection('work_assign').add(data)
                .then(() => {
                    alert('Data submitted successfully');
                    this.dialogRef.close();
                })
                .catch(error => {
                    alert('Error submitting data: ' + error);
                });
        } else {
            alert('Please fill in all the required fields.');
        }
    }
}
