import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {DataService} from '../shared/data.service';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {WorkAssignDialogComponent} from '../work-assign-dialog/work-assign-dialog.component';

@Component({
    selector: 'app-typography',
    templateUrl: './typography.component.html',
    styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {
    form: FormGroup;
    userData: any[] = [];
    approvedData: any[] = [];
    Number = '';
    id = '';
    name = '';
    // variables to upload data
    siteName = '';
    siteAddress = '';
    siteLink = '';
    paymentHistoryData: any[] = [];
    userNameData: any[] = [];
    siteOptions: { name: any; url: undefined }[] = [];
    selectedSite = '';
    amount = '';

    // variables to pass the data to the database
    userName: string;

    selectedRemarkFilter = 'all';
    displayedColumns: string[] = ['userName'];
    dataSource = new MatTableDataSource<any>();
    @ViewChildren('checkboxes') checkboxes: QueryList<any>;
    @ViewChildren('selectAllCheckbox') selectAllCheckbox: QueryList<any>;
    totalCount = 0;
    checkedCount = 0;
    RcNumbers: string[] = [];
    Name: string[] = [];
    phone: string[] = [];
    count = 0; // Store an array of RC numbers
    workAssignData: any[] = [];
    selectedWorkAssignData = 'all';
    filteredUserData: any[] = [];

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

    ngOnInit() {
        this.fetchSiteData();
        this.dataSource.data = this.userNameData;
        this.fetchWorkAssignData();
    }

    fetchSiteData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.siteOptions = data.map(site => ({name: site.siteName, url: site.siteLink}));
        });
    }

    fetchWorkAssignData() {
        this.firestore.collection('work_assign').valueChanges().subscribe((data: any[]) => {
            // Log the retrieved data
            console.log('Work Assign Data:', data);
            // Assign the data to a property for use in the component template
            this.workAssignData = data;
        });
    }

    onWorkAssignSelected(workAssignSelected: string) {
        this.selectedWorkAssignData = workAssignSelected;
        console.log(this.selectedWorkAssignData);

    }
    //
    // applyFilterWorkAssign(filter: string) {
    //     this.selectedWorkAssignData = filter
    // }

    get filterWorkAssignData() {
        if (this.selectedWorkAssignData === 'all') {
            return this.workAssignData;
        } else {
            return this.workAssignData.filter(data => data.siteName === this.selectedWorkAssignData);
        }
    }

// work assign----------------------------------------------------------------------------
    applyFilter(filter: string) {
        this.selectedRemarkFilter = filter;
    }

    get filterUserData() {
        if (this.selectedRemarkFilter === 'all') {
            return this.userData;
        } else {
            return this.userData.filter(user => user.type === this.selectedRemarkFilter);
        }
    }

    onSiteSelectionChange(selectedSite: string) {
        this.selectedSite = selectedSite;
        this.fetchUserData(selectedSite);
    }

    fetchUserData(selectedSite: string) {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.userData = data.filter(user => user.sitename === selectedSite);
            this.dataSource.data = this.userData;
        });
    }

// work assign --------------------------------------------------------------
    openDialog(): void {
        // Find the URL corresponding to the selected site name
        const selectedSiteUrl = this.siteOptions.find(site => site.name === this.selectedSite)?.url;

        // Log the checked user data for verification
        const rcNumbers = this.RcNumbers;

        const dialogRef = this.dialog.open(WorkAssignDialogComponent, {
            width: '600px',
            height: '400px',
            panelClass: 'custom-dialog-container',
            data: {
                sitename: this.selectedSite,
                siteUrl: selectedSiteUrl,
                RcNo: rcNumbers,
                userName: this.Name,
                phone: this.phone,
                count: this.count
                // Pass the array of RC numbers
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== 'cancel') {
                console.log('Data entered:', result);
                // Do something with the entered data
            }
        });

    }

    clearForm() {
        this.form.reset();
    }

    updateCount(user: any, isChecked: number): void {
        // Log the checked user data if the checkbox is checked
        if (isChecked) {
            console.log('Checked user data:', user);
            // Add the RC number to the array
            this.RcNumbers.push(user['rc number']);
            this.Name.push(user.userName)
            this.phone.push(user.phone)
        } else {
            // Remove the RC number from the array
            const index = this.RcNumbers.indexOf(user['rc number']);
            if (index !== -1) {
                this.RcNumbers.splice(index, 1);
            }
        }

        // Update the counts
        this.totalCount = this.checkboxes.length;
        this.checkedCount = this.checkboxes.filter(checkbox => checkbox.nativeElement.checked).length;
        console.log('Total count:', this.totalCount);
        console.log('Checked count:', this.checkedCount);
        this.count = this.checkedCount;
    }

    selectAll() {
        const isChecked = this.selectAllCheckbox.first.nativeElement.checked;

        if (isChecked) {
            this.checkboxes.forEach(checkbox => {
                checkbox.nativeElement.checked = true;
                this.updateCount(checkbox.nativeElement.value, 1);
            });
        } else {
            this.checkboxes.forEach(checkbox => {
                checkbox.nativeElement.checked = false;
                this.updateCount(checkbox.nativeElement.value, 0);
            });
        }
    }
}
