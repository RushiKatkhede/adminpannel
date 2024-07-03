import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DataService } from "../../shared/data.service";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import * as XLSX from 'xlsx';

interface User {
    userName: string;
    phone: string;
    status: string;
    rc_no: string;
    sitename: string;
    type: string;
    VehicleModel: string;
    ppd: string;
    ppk: string;
    // Add more fields from the users collection if necessary
}

interface AttendanceData {
    checkInImageUrl: string;
    checkInTime: { seconds: number; nanoseconds: number };
    checkInKm: string;
    checkOutImageUrl: string;
    checkOutKm: string;
    date: string;
    attendanceStatus: string;
    checkOutTime: { seconds: number; nanoseconds: number };
}

@Component({
    selector: 'app-work-history',
    templateUrl: './work-history.component.html',
    styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit {
    approvedData: any[] = [];
    filteredData: any[] = [];
    userData: any[] = [];
    users$: Observable<User[]>;
    AttendanceData: any[] = [];
    attendanceData: AttendanceData;
    siteOptions: string[] = [];
    selectedSite: string = '';
    selectedUserName: string = '';
    userNameData: any[] = [];

    constructor(private firestore: AngularFirestore, private data: DataService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.fetchSiteData();
        this.fetchUserDataApproved();
    }

    fetchSiteData() {
        this.firestore.collection('siteData').valueChanges().subscribe((data: any[]) => {
            this.siteOptions = data.map(site => site.siteName);
        });
    }

    onSiteSelectionChange(selectedSite: string) {
        console.log("Selected Site:", selectedSite);
        this.selectedSite = selectedSite;
        this.fetchUserData(selectedSite);
        this.applyFilters();
    }

    onUserNameSelectionChange(selectedUserName: string) {
        console.log("Selected User Name:", selectedUserName);
        this.selectedUserName = selectedUserName;
        this.applyFilters();
    }

    fetchUserData(selectedSite: string) {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.userNameData = data.filter(user => user.sitename === selectedSite);
        });
    }

    fetchUserDataApproved() {
        this.firestore.collectionGroup('AttendanceStatus').get().subscribe(querySnapshot => {
            const usersAttendance: { [userId: string]: any[] } = {};

            // Group attendance data by user ID
            querySnapshot.forEach(attendanceDoc => {
                const attendanceData: any = attendanceDoc.data(); // Attendance data
                const userId = attendanceDoc.ref.parent.parent!.id; // Parent user ID

                if (!usersAttendance[userId]) {
                    usersAttendance[userId] = [];
                }
                usersAttendance[userId].push(attendanceData);
            });

            // Fetch user information and combine with attendance data
            const userFetchPromises = Object.keys(usersAttendance).map(userId =>
                this.firestore.collection('users').doc(userId).get().toPromise().then(userDoc => ({
                    userId,
                    userDoc,
                    attendanceRecords: usersAttendance[userId]
                }))
            );

            Promise.all(userFetchPromises).then(results => {
                results.forEach(({ userId, userDoc, attendanceRecords }) => {
                    if (userDoc.exists) {
                        const userData = userDoc.data() as User;

                        attendanceRecords.forEach(attendanceData => {
                            // Check if both check-in and check-out times are present
                            if (attendanceData.checkInTime && attendanceData.checkOutTime) {
                                const combinedData = {
                                    userName: userData.userName,
                                    phone: userData.phone,
                                    status: userData.status,
                                    type: userData.type,
                                    rc_no: userData['rc number'],
                                    site: userData.sitename,
                                    vehicle_model: userData.VehicleModel,
                                    ppd: userData.ppd,
                                    ppk: userData.ppk,
                                    attendanceStatus: attendanceData.attendanceStatus,
                                    checkInImageUrl: attendanceData.checkInImageUrl,
                                    checkInTime: attendanceData.checkInTime,
                                    checkInKm: attendanceData.checkInKm,
                                    checkOutImageUrl: attendanceData.checkOutImageUrl,
                                    checkOutKm: attendanceData.checkOutKm,
                                    Attednacedate: attendanceData.date,
                                    checkOutTime: attendanceData.checkOutTime
                                };
                                this.approvedData.push(combinedData);
                            }
                        });
                    } else {
                        console.log("User document not found for ID:", userId);
                    }
                });
                this.approvedData.sort((a, b) => {
                    const dateA = new Date(a.Attednacedate);
                    const dateB = new Date(b.Attednacedate);
                    return dateA.getTime() - dateB.getTime();
                });
                console.log("Approved Data:", this.approvedData);
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        this.filteredData = this.approvedData.filter(data => {
            const matchesSite = this.selectedSite ? data.site === this.selectedSite : true;
            const matchesUserName = this.selectedUserName ? data.userName === this.selectedUserName : true;
            return matchesSite && matchesUserName;
        });
        console.log("Filtered Data:", this.filteredData);
    }

    calculateTotalTime(checkIn: Date, checkOut: Date): string {
        if (!checkIn || !checkOut) {
            return 'N/A';
        }
        const diff = Math.abs(checkOut.getTime() - checkIn.getTime());
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${hours} hours ${minutes} minutes`;
    }

    exportToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('workHistoryTable'));
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'work_history.xlsx');
    }

    calculateTotalKm(startKm: number, endKm: number): number {
        if (!startKm || !endKm) {
            return 0;
        }
        return endKm - startKm;
    }

    calculatePrice(checkInKm, checkOutKm, userData: any): number {
        const pricePerKm = parseInt(userData.ppk);
        const pricePerDay = parseInt(userData.ppd);
        const totalKm = checkOutKm - checkInKm;
        const priceForKm = totalKm * pricePerKm;
        const finalPrice = priceForKm + pricePerDay;
        return finalPrice;
    }

    protected readonly parseInt = parseInt;
}
