import {Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DataService} from "../shared/data.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import * as ChartistTooltip from 'chartist-plugin-tooltip';

interface AttendanceData {
    date: string; // Assuming date is a string in "YYYY-MM-DD" format
    checkInTime?: any; // Define the type of checkInTime according to your data structure
    // Add other properties if needed
}

interface UserData {
    sitename: string; // Assuming date is a string in "YYYY-MM-DD" format
    // Add other properties if needed
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    createLabel(value: number): string {
        return value.toString(); // You can customize the label format if needed
    }

    workAssignData: any[];
    sites: any[] = [];
    usersInAttendanceToday: any = 0;
    siteWiseCounts: { [siteName: string]: number } = {};
    checkInTimeData: any;
    selectedWorkAssignData: string = 'all';

    constructor(
        private firestore: AngularFirestore,
        private data: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {

    }


    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;

        chart.on('draw', (data) => {
            if (data.type === 'point') {
                seq++;
                const label = this.createLabel(data.value.y); // Create label based on data value
                data.group.elem('text', {
                    x: data.x,
                    y: data.y - 10, // Adjust Y position for label
                    style: 'font-size: 12px; fill: #fff;'
                }, 'ct-label').text(label);
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;

        chart.on('draw', (data) => {
            if (data.type === 'bar') {
                seq2++;
                const label = this.createLabel(data.value.y); // Create label based on data value
                data.group.elem('text', {
                    x: data.x2 + 4,
                    y: data.y2 - 8, // Adjust Y position for label
                    style: 'font-size: 12px; fill: #fff;'
                }, 'ct-label').text(label);
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });
    };

    ngOnInit() {
        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
        this.fetchUserDataApproved()
        this.fetchUserDataApprovedGraph()
        const dataDailySalesChart: any = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [this.getSeriesForWeek()]
            ]
        };

        const optionsDailySalesChart: any = {
            // Existing options...
            plugins: [
                ChartistTooltip({
                    appendToBody: true, // Append tooltip to body for positioning
                    transformTooltipTextFnc: function (value) {
                        return 'Count: ' + value; // Customize tooltip text
                    }
                })
            ]
        };

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        // const dataCompletedTasksChart: any = {
        //     labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
        //     series: [
        //         [230, 750, 450, 300, 280, 240, 200, 190]
        //     ]
        // };

        // const optionsCompletedTasksChart: any = {
        //     lineSmooth: Chartist.Interpolation.cardinal({
        //         tension: 0
        //     }),
        //     low: 0,
        //     high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        //     chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        // }

        // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        // this.startAnimationForLineChart(completedTasksChart);


        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        var datawebsiteViewsChart = {
            labels: ['On Time', 'Delay'],
            series: [
                [542, 443, 320, 780, 553, 453]

            ]
        };
        const optionswebsiteViewsChart: any = {
            // Existing options...
            plugins: [
                ChartistTooltip({
                    appendToBody: true, // Append tooltip to body for positioning
                    transformTooltipTextFnc: function (value) {
                        return 'Count: ' + value; // Customize tooltip text
                    }
                })
            ]
        };
        var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

        //start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(websiteViewsChart);
        this.fetchWorkAssignData();
    }

    fetchWorkAssignData() {
        // Get today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = today.getDate().toString().padStart(2, '0');
        const hours = '00';
        const minutes = '00';
        const seconds = '00';
        const milliseconds = '000';

        // Construct the date string in the required format
        const todayISOString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

        // Define the Firestore query with a filter for today's date
        this.firestore.collection('work_assign', ref =>
            ref.where('datetime', '>=', todayISOString)
                .where('datetime', '<', `${year}-${month}-${day}T23:59:59.999Z`)
        ).valueChanges().subscribe((data: any[]) => {
            // Log the retrieved data
            console.log('Work Assign Data for Today:', data);
            // Assign the data to a property for use in the component template
            this.workAssignData = data;
        });
    }

    fetchUserDataApproved() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const todayISOString = `${year}-${month}-${day}`;

        this.firestore.collectionGroup('AttendanceStatus').get().subscribe(querySnapshot => {
            querySnapshot.forEach(attendanceDoc => {
                const attendanceData = attendanceDoc.data() as AttendanceData;
                const userId = attendanceDoc.ref.parent.parent.id;

                this.firestore.collection('users').doc(userId).get().subscribe(userDoc => {
                    if (userDoc.exists) {
                        const userData = userDoc.data() as UserData;
                        const siteName = userData.sitename;

                        // Check if the date matches today's date and checkInTime is present
                        if (attendanceData.date === todayISOString && attendanceData.checkInTime) {
                            // Initialize count for site if not already present
                            if (!this.siteWiseCounts[siteName]) {
                                this.siteWiseCounts[siteName] = 0;
                            }
                            // Increment count for site
                            this.siteWiseCounts[siteName]++;
                            this.checkInTimeData = attendanceData.checkInTime;
                        }
                    } else {
                        console.log("User document not found for ID:", userId);
                    }
                });
            });
        });
    }


    fetchUserDataApprovedGraph() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const startOfWeek = new Date(today); // Create a new date object to avoid modifying the original date
        startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Calculate the start of the week (Monday)
        startOfWeek.setHours(0, 0, 0, 0); // Set time to beginning of the day

        const endOfWeek = new Date(startOfWeek); // Create a new date object for the end of the week
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Calculate the end of the week (Sunday)
        endOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day

        const startOfWeekISOString = startOfWeek.toISOString();
        const endOfWeekISOString = endOfWeek.toISOString();

        // Initialize an array to store attendance counts for each day of the week
        const attendanceCounts: number[] = Array(7).fill(0);
        let onTimeCount = 0;
        let delayCount = 0;

        // Perform the Firestore query
        this.firestore.collection('users').get().subscribe(async userSnapshot => {
            for (const userDoc of userSnapshot.docs) {
                const attendanceRef = userDoc.ref.collection('AttendanceStatus');
                try {
                    const attendanceSnapshot = await attendanceRef.where('date', '>=', startOfWeekISOString)
                        .where('date', '<=', endOfWeekISOString)
                        .get();
                    attendanceSnapshot.forEach(attendanceDoc => {
                        const attendanceData = attendanceDoc.data() as AttendanceData;
                        const date = new Date(attendanceData.date);
                        const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
                        attendanceCounts[dayIndex]++;// Increment count for the corresponding day

                        // Check if check-in time is on time or delayed
                        if (attendanceData.checkInTime) {
                            const checkInTime = new Date(attendanceData.checkInTime);
                            const customCheckInTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 5); // 10:05 AM

                            if (checkInTime <= customCheckInTime) {
                                onTimeCount++;
                            } else {
                                delayCount++;
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error fetching attendance data:', error);
                }
            }

            // Update the line chart with the fetched data
            this.updateLineChart(attendanceCounts);

            // Update the bar chart with categorized data
            this.updateBarChart(onTimeCount, delayCount);
        });
    }

    updateBarChart(onTimeCount: number, delayCount: number) {
        const datawebsiteViewsChart: any = {
            labels: ['On Time', 'Delayed'],
            series: [
                [onTimeCount, delayCount]
            ]
        };

        const optionswebsiteViewsChart: any = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: Math.max(onTimeCount, delayCount) + 10,
            chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
        };

        const responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];

        const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

        // Start animation for the bar chart
        this.startAnimationForBarChart(websiteViewsChart);
    }


    updateLineChart(attendanceCounts: number[]) {
        const dataDailySalesChart: any = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                this.getSeriesForWeek()
            ]
        };

        const optionsDailySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: Math.max(...attendanceCounts) + 10, // Adjust the high value based on the maximum attendance count
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
            plugins: [
                ChartistTooltip({
                    appendToBody: true, // Append tooltip to body for positioning
                    transformTooltipTextFnc: function (value) {
                        return 'Count: ' + value; // Customize tooltip text
                    }
                })
            ]
        };

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);
    }

    getSeriesForWeek(): number[] {
        const dayOfWeek = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const siteCounts = Object.values(this.siteWiseCounts);
        const series = [];

        for (let i = 1; i <= 7; i++) {
            const index = (dayOfWeek + i) % 7; // Calculate the index for the current day
            series.push(siteCounts[index] || 0); // Push the count for the current day, or 0 if not available
        }

        return series;
    }

    get filterWorkAssignData() {
        if (this.selectedWorkAssignData === 'all') {
            return this.workAssignData;
        } else {
            return this.workAssignData.filter(data => data.siteName === this.selectedWorkAssignData);
        }
    }

    getTotalCount() {
        // Calculate the total sitewise count
        let totalSitewiseCount = 0;
        for (const siteCount of Object.values(this.siteWiseCounts)) {
            totalSitewiseCount += siteCount;
        }

        // Calculate the total work assign count
        const totalWorkAssignCount = this.workAssignData.length;

        // Return the total counts in the desired format
        return `${totalSitewiseCount} / ${totalWorkAssignCount}`;
    }


    getCardColor(index: number) {
        const colors = ['card-header-warning', 'card-header-success', 'card-header-danger', 'card-header-info'];
        return colors[index % colors.length];
    }

    getSiteWiseCount(siteName: string): number {
        return this.siteWiseCounts[siteName] || 0;
    }
}
