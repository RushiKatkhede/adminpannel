import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface LocationData {
    Accuracy?: number;
    Altitude?: number;
    Bearing?: number;
    Latitude?: number;
    Longitude?: number;
    Speed?: number;

    // Add other fields as needed
}

interface UserDataWithLocation {
    id: string;
    locationData: LocationData;
    userData?: any; // Define userData property
}

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    approvedData: UserDataWithLocation[] = [];

    constructor(private firestore: AngularFirestore) {
    }

    ngOnInit() {
        // Replace subcollectionId with the actual subcollection name
        const subcollectionId = 'location';

        this.firestore.collectionGroup(subcollectionId).valueChanges()
            .subscribe((data: any[]) => {
                this.approvedData = data.map(item => {
                    const locationData: LocationData = {
                        Accuracy: item.Accuracy,
                        Altitude: item.Altitude,
                        Bearing: item.Bearing,
                        Latitude: item.Latitude,
                        Longitude: item.Longitude,
                        Speed: item.Speed
                    };
                    return {
                        id: item.userId, // Assuming userId is a field in the documents
                        locationData: locationData,
                        userData: null // userData will be fetched later
                    };
                });

                // Fetch user data and combine with location data
                this.fetchUserData();
            }, error => {
                console.error('Error fetching location data:', error);
                // Handle error appropriately
            });
    }

    fetchUserData() {
        this.approvedData.forEach(userDataWithLocation => {
            const userId = userDataWithLocation.id;
            this.firestore.collection('users').doc(userId).valueChanges().subscribe((userData: any) => {
                if (userData) {
                    // Update userData property in approvedData array
                    userDataWithLocation.userData = userData;
                } else {
                    console.error('User data not found for userId:', userId);
                }
            });
        });
    }
}
