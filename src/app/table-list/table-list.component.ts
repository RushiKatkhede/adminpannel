import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {User} from '../model/user';
import {DataService} from '../shared/data.service';
import {MatDialog} from '@angular/material/dialog';
import {StatusDialogComponent} from '../status-dialog/status-dialog.component';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',

    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
    userData: any[] = [];
    approvedData: any[] = [];
    userList: User[] = [];
    Number = '';
    id = '';
    name = '';
    isEditing = false;
    selectedUser: any; // Declare this variable in your component class
    selectedUserNumber: string;
    selectedRowIndex: number | null = null;
    // creating varibles to store edited user data
    userName = '';

// ------------------==================================================
    toggleEdit(user: any): void {
        // Toggle the edit mode
        this.isEditing = !this.isEditing;
    }

    setSelectedUser(user: any): void {
        this.selectedUser = {...user}; // Copy the selected user to avoid two-way binding issues
        this.selectedUserNumber = user.phone;
    }


    constructor(private firestore: AngularFirestore, private data: DataService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.fetchUserData();
        this.fetchUserDataApproved();

    }

// storing edited user data---------------------------------------------------


    fetchUserData() {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.userData = data.filter(user => user.status === 'pending');
        });
    }

    fetchUserDataApproved() {
        this.firestore.collection('users').valueChanges().subscribe((data: any[]) => {
            this.approvedData = data.filter(user => user.status === 'approved');
        });
    }

    deleteUser(user: any): void {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            alert('Deleting user with Phone Number: ' + user.phone);

            if (user && user.status === 'approved') {
                this.firestore.collection('users', ref => ref.where('phone', '==', user.phone)).get().subscribe(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const userId = doc.id;
                        this.firestore.collection('users').doc(userId).delete().then(() => {
                            // Remove the deleted user from the local array
                            const index = this.approvedData.findIndex((u: any) => u.id === userId);
                            if (index !== -1) {
                                this.approvedData.splice(index, 1);
                            }
                            alert('Approved user deleted successfully!');
                        }).catch((error) => {
                            alert('Error deleting approved user: ' + error);
                            // Handle error, maybe show a user-friendly message
                        });
                    });
                });
            } else {
                alert('Cannot delete pending user or user not found.');
                // Provide feedback to the user, maybe show a message
            }
        }
    }

    update(user: any): void {
        console.log(this.selectedUser);
        const newData = this.selectedUser

        if (this.selectedUser) {
            this.firestore.collection('users', ref => ref.where('phone', '==', this.selectedUser.phone)).get()
                .subscribe((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        const documentId = querySnapshot.docs[0].id;

                        this.firestore.collection('users').doc(documentId).update(newData)
                            .then(() => {
                                alert('Data updated successfully! ' + this.selectedUser.userName);

                                this.fetchUserData()
                                this.refreshUpdateUser(documentId)
                            })
                            .catch((error) => {
                                alert('Error updating data: ' + error);
                            });
                    } else {
                        alert('No document found for the provided phone number.');
                    }
                });
        } else {
            alert('No data to update. Please ensure you have edited the user details.');
        }
    }

    refreshUpdateUser(docId: string) {
        this.firestore.collection('users').doc(docId).get().subscribe(
            (docSnapshots) => {
                if (docSnapshots.exists) {
                    const updateData = docSnapshots.data()
                    console.log('fecthed updated data', JSON.stringify(updateData));
                    this.selectedUser = updateData
                    this.cdr.detectChanges()
                } else {
                    console.error('Document not found after update')
                }
            },
            (error) => {
                alert('Error fetching document ' + error)
            }
        )
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
