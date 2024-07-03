import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DataService} from "../../shared/data.service";
import {MatDialog} from "@angular/material/dialog";
import {PaymentDialogComponent} from "../../payment-dialog/payment-dialog.component";
import * as XLSX from "xlsx";

@Component({
    selector: 'app-fuel-history',
    templateUrl: './fuel-history.component.html',
    styleUrls: ['./fuel-history.component.scss']
})
export class FuelHistoryComponent implements OnInit {
    fuelHistoryData: any[] = [];
    approvedData: any[] = [];
    Number: string = '';
    id: string = '';
    name: string = '';
    selectedUser: any; // Declare this variable in your component class
    selectedUserNumber: string;

    userName: string = '';


    constructor(private firestore: AngularFirestore, private data: DataService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.fetchFuelHistory();
        this.fetchUserDataApproved();
    }


    fetchFuelHistory() {
        this.firestore.collection('paymentHistory').valueChanges().subscribe((data: any[]) => {
            // Filter data where remark is 'fuel'
            this.fuelHistoryData = data.filter(entry => entry.remark === 'fuel');
        });
    }


    fetchUserDataApproved() {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.approvedData = data.filter(user => user.status === 'approved' && user.fuelrequest);
        });
    }



    exportToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('fuelHistory'));
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'fuel_history.xlsx');
    }

    openPaymentDialog(user: any): void {
        console.log(user.userName);
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '500px',
            data: {user}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The status dialog was closed', result);
        });
    }


}
