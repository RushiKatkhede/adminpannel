import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-otp-dialog',
    templateUrl: './otp-dialog.component.html',
    styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
    otp: string;

    constructor(public dialogRef: MatDialogRef<OtpDialogComponent>) {
    }

    ngOnInit(): void {

    }

}
