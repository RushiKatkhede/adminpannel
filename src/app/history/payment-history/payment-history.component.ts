import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DataService} from "../../shared/data.service";
import {StatusDialogComponent} from "../../status-dialog/status-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentDialogComponent} from "../../payment-dialog/payment-dialog.component";
import * as XLSX from "xlsx";

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
    form: FormGroup;
    userData: any[] = [];
    approvedData: any[] = [];
    userList: User[] = [];
    Number: string = '';
    id: string = '';
    name: string = '';
    isEditing = false;
    selectedUser: any; // Declare this variable in your component class
    selectedRowIndex: number | null = null;
    //variables to upload data
    siteName: string = '';
    siteAddress: string = '';
    siteLink: string = '';
    paymentHistoryData: any[] = [];
    userNameData: any[] = [];
    siteOptions: string[] = [];
    selectedSite: string = '';
    amount: string = '';
    remarkOption: string[] = ['payment', 'fuel', 'other'];

    //variables to pass the data to the database
    userName: string;
    paymentPendingData: any[] = [];
    paymentPendingUserData: any[] = [];
    selectedRemarkFilter: string = 'all';


    constructor(
        private firestore: AngularFirestore,
        private data: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            site: ['', Validators.required],
            amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Add your validators if needed
            remark: ['', Validators.required], // Add your validators if needed// Add more form controls as needed
            name: ['', Validators.required], // Add your validators if needed// Add more form controls as needed
        });


    }

    ngOnInit(): void {
        this.fetchSiteData();
        this.fetchPaymentHistory();
        this.fetchPendingPayment();
    }


    fetchSiteData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.siteOptions = data.map(site => site.siteName);
        });
    }

    onSiteSelectionChange(selectedSite: string) {
        console.log("Selected Site:", selectedSite);

        // Now you can use the selectedSite value as needed
        // For example, you can assign it to a class variable:
        this.selectedSite = selectedSite;

        // You can also call the fetchUserName method here if needed
        this.fetchUserData(selectedSite);
    }

    fetchUserData(selectedSite: string) {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.userNameData = data.filter(user => user.sitename === selectedSite);
        });
    }

// Add this method in your component class

    onSubmit() {
        if (this.form.valid) {
            // Gather data from the form
            const selectedSite = this.form.value.site;
            const amountEnter = this.form.value.amount;
            const remarkGiven = this.form.value.remark; // Assuming you have a form control for the remark
            const selectedName = this.form.value.name; // Assuming you have a form control for the remark

            console.log("Selected Site:", selectedSite);
            console.log("Amount:", amountEnter);
            console.log("Remark:", remarkGiven);
            console.log("Name:", selectedName);


            // Now you have the userData, you can use it to push to the database
            const paymentData = {
                userData: selectedName,
                // userNumber: selectedUserData.phone,jfj
                // userAccNo: selectedUserData.accNo,
                // userBank: selectedUserData.bank,
                // userIFSC: selectedUserData.ifsc,
                site: selectedSite,
                amount: amountEnter,
                remark: remarkGiven,
                submissionTime: new Date(),
            };
            // console.log(paymentData.userBank);
            // Push the data to the pendingPayment collection in Firestore
            this.firestore.collection('pendingPayment').add(paymentData)
                .then(() => {
                    alert('Payment data submitted successfully');
                    // Clear the form fields after submission
                    this.clearForm();
                })
                .catch(error => alert('Error submitting payment data: ' + error));
        } else {
            alert('Please fill in all the required fields.');
        }
    }

    clearForm() {
        this.form.reset();
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

    fetchPaymentHistory() {
        this.firestore.collection('paymentHistory').valueChanges().subscribe((data: any[]) => {
            // Filter data where remark is 'fuel'
            this.paymentHistoryData = data;
        });
    }

    // Add this method in your component class
    // fetchPendingPayment() {
    //     this.firestore.collection('pendingPayment').valueChanges().subscribe((data: any[]) => {
    //         // Iterate through each paymentData
    //         data.forEach(paymentData => {
    //             // Access the direct fields
    //             const amount = paymentData.amount;
    //             const remark = paymentData.remark;
    //             const site = paymentData.site;
    //             const submissionTime = paymentData.submissionTime;
    //
    //             // Access the 'userData' map
    //             const userData = paymentData.userData;
    //
    //             // Access the details within the 'userData' map
    //             const userName = userData.userName;
    //             const bank = userData.bank;
    //             const ifsc = userData.ifsc;
    //
    //             // Now you can use these values as needed
    //             console.log("Amount:", amount);
    //             console.log("Remark:", remark);
    //             console.log("Site:", site);
    //             console.log("Submission Time:", submissionTime);
    //             console.log("User Name:", userName);
    //             console.log("Bank:", bank);
    //             console.log("IFSC:", ifsc);
    //         });
    //     });
    // }

    fetchPendingPayment() {
        this.firestore.collection('pendingPayment').valueChanges().subscribe((data: any[]) => {
            // Assign the data to the property
            this.paymentPendingData = data;
        });
    }

    applyFilter(filter: string) {
        this.selectedRemarkFilter = filter;
    }

    get filteredPaymentHistoryData() {
        if (this.selectedRemarkFilter === 'all') {
            return this.paymentHistoryData;
        } else {
            return this.paymentHistoryData.filter(user => user.remark === this.selectedRemarkFilter);
        }
    }

    openPaymentDialog(user: any): void {
        // Ensure the data structure is consistent
        const userData = user.userData || {}; // Ensure userData exists and initialize as an empty object if it doesn't

        // Combine user data with the top-level properties
        const userDataWithTopLevelProperties = {
            ...user,
            ...userData
        };

        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '500px',
            data: {user: userDataWithTopLevelProperties} // Pass the combined data to the dialog
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The status dialog was closed', result);
        });
    }

    exportToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('paymentHistory'));
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'payment_history.xlsx');
    }
    openStatusDialog(user: any): void {
        console.log(user.userName);
        const dialogRef = this.dialog.open(StatusDialogComponent, {
            width: '500px',
            data: {user}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The status dialog was closed', result);
        });
    }
}
