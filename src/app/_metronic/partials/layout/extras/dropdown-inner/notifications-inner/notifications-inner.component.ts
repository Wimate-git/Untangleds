import { Component, HostBinding, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { APIService } from 'src/app/API.service';
// import { formatDistanceToNow } from 'date-fns';
import { Router } from '@angular/router';


export type NotificationsTabsType =
  | 'kt_topbar_notifications_1'
  | 'kt_topbar_notifications_2'
  | 'kt_topbar_notifications_3';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  activeTabId: NotificationsTabsType = 'kt_topbar_notifications_1';
  alerts: Array<AlertModel> = []
  login_detail: any;
  loginDetail_string: any;
  client: any;
  user: any;
  app_notification: any[];
  check: number;
  main_table_data: any[] = [];
  id: string;
  // logs: Array<LogModel> = defaultLogs;
  constructor(
    private api: APIService,
    private router : Router
    
  ) {}

  async ngOnInit(): Promise<void> {

    // this.reloadComponentEveryMinute();

    this.login_detail = localStorage.getItem('userAttributes')

      this.loginDetail_string = JSON.parse(this.login_detail)
      console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

      this.client = this.loginDetail_string.clientID
      this.user = this.loginDetail_string.username

      const today = new Date(); // Current date
        const todayepoch = today.getTime();

        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 1); // Subtract 2 years
        const epochTime = fiveYearsAgo.getTime();


      
      const requestBody = {
        "operation": "Between",
        "pk": `${this.client}#app notification#${this.user}#main`,
        "sk1": epochTime,
        "sk2": todayepoch,
        "ascending": false,
        "limit": 100,
        "lastEvaluatedKey": null
      };


      // this.notification(1)

      await this.fetchAllData(requestBody)


      // this.fetchNotification();

  }


  async fetchNotification(){

    const today = new Date(); // Current date
        const todayepoch = today.getTime();

        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 1); // Subtract 2 years
        const epochTime = fiveYearsAgo.getTime();


      
      const requestBody = {
        "operation": "Between",
        "pk": `${this.client}#app notification#${this.user}#main`,
        "sk1": epochTime,
        "sk2": todayepoch,
        "ascending": false,
        "limit": 100,
        "lastEvaluatedKey": null
      };


      // this.notification(1)

      await this.fetchAllData(requestBody)

  
  }

reloadComponentEveryMinute() {
  setTimeout(async () => {
    console.log("AFTER ! MIN")

    // window.location.reload();
       this.main_table_data =[]
    await this.fetchNotification();

    this.reloadComponentEveryMinute();

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([this.router.url]); // Reload the current component
    // });
  }, 60000); // 60,000 ms = 1 minute
}


formatDate(timestamp: number): string {
  const now = new Date().getTime();
  const diff = Math.floor((now - timestamp) / 1000);
  const days = Math.floor(diff / 86400);
  const months = Math.floor(days / 30); // Assuming an average of 30 days in a month
  const years = Math.floor(days / 365); // More accurate for years
  
  if (diff < 60) {
    return `${diff} second${diff !== 1 ? 's' : ''} ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
  } else if (days < 30) { 
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

  async fetchAllData(requestBody:any) {

    fetch('https://gx2xgbmus8.execute-api.ap-south-1.amazonaws.com/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-api-key': 'zVXYfTmcru1xXMnUQaqU697Cqux1gaCDZOriwJe5'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {

          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("DATA:", JSON.parse(data.body));

        const main_data = JSON.parse(data.body);
        console.log("MAIN DATA:", main_data);


        this.main_table_data = [...this.main_table_data, ...main_data.body.items]; // Append new data to the existing data

        console.log("MAIN TABLE DATA:", this.main_table_data);



        if (main_data.body.lastEvaluatedKey) {
          console.log("Fetching more data with lastEvaluatedKey:", main_data.body.lastEvaluatedKey);
          requestBody.lastEvaluatedKey = main_data.body.lastEvaluatedKey;
          this.fetchAllData(requestBody); // Recursive call with updated lastEvaluatedKey
        } else {
          // All data has been fetched, process or display it
          this.processData(this.main_table_data); // A function to process/display the data
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  processData(notification_data: any[]) {

    console.log("DATA:", notification_data)

    this.app_notification = notification_data

    if (this.app_notification.length == 0) {
      this.check = 1
    }

    this.alerts = this.app_notification.map(item => ({
      title: item.metadata.ID,
      description: item.metadata.message,
      // time: formatDistanceToNow(new Date(item.metadata.createdTime), { addSuffix: true }),  // Converts timestamp to readable date
      time: this.formatDate(item.metadata.createdTime),
      // icon: 'icons/duotune/technology/teh008.svg', // Example icon, you might want to vary it
      state: 'primary', // Example state, this might also be dynamic based on your conditions
      isSelected:item.metadata.seen_flag,
      formID:item.metadata.formID,
      uniqueID:item.metadata.uniqueID
    }));


    console.log("THIS ALERTS:",this.alerts.length)
  }
  

  setActiveTabId(tabId: NotificationsTabsType) {
    this.activeTabId = tabId;
  }

  toggleSelection(alert: any) {

    // console.log((alert.title).split('#')[1])

    let epohc = this.extractEpochTime(alert.title)
    console.log(epohc)

    let recordId = {
      "type": "view",  //  "view", "create"
      "fields":{
      "wfnl.single-select-1732769559973": "Closed",
      "ewfefw.single-select-1732770321368": "Repair",
      "ewfm.single-select-1732780036906": "15122",  // Customer ID 
      "webfkh.single-select-1732780036907": "32061259",  //  Equipment ID 
      "wfegiy.single-select-1732780036908": "1000747",  //   Contract ID 
      },
      "mainTableKey": alert.uniqueID, // web_1736503505722
    }

    console.log(recordId)

    this.id = 'Forms'
    this.router.navigate([`view-dreamboard/${this.id}/${alert.formID}&recordId=${JSON.stringify(JSON.stringify(recordId))}`]);


    alert.isSelected = !alert.isSelected;

    console.log(alert)


  }

  extractEpochTime(data: string) {
    const match = data.match(/(\d+)/);
    return match ? match[1] : null;
}
}

interface AlertModel {
  title: string;
  description: string;
  time: string;
  // icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
  isSelected:boolean,
  formID:string,
  uniqueID:string,
}

// const defaultAlerts: Array<AlertModel> = [
//   {
//     title: 'Project Alice',
//     description: 'Phase 1 development',
//     time: '1 hr',
//     icon: 'icons/duotune/technology/teh008.svg',
//     state: 'primary',
//   },
//   {
//     title: 'HR Confidential',
//     description: 'Confidential staff documents',
//     time: '2 hrs',
//     icon: 'icons/duotune/general/gen044.svg',
//     state: 'danger',
//   },
//   {
//     title: 'Company HR',
//     description: 'Corporeate staff profiles',
//     time: '5 hrs',
//     icon: 'icons/duotune/finance/fin006.svg',
//     state: 'warning',
//   },
//   {
//     title: 'Project Redux',
//     description: 'New frontend admin theme',
//     time: '2 days',
//     icon: 'icons/duotune/files/fil023.svg',
//     state: 'success',
//   },
//   {
//     title: 'Project Breafing',
//     description: 'Product launch status update',
//     time: '21 Jan',
//     icon: 'icons/duotune/maps/map001.svg',
//     state: 'primary',
//   },
//   {
//     title: 'Banner Assets',
//     description: 'Collection of banner images',
//     time: '21 Jan',
//     icon: 'icons/duotune/general/gen006.svg',
//     state: 'info',
//   },
//   {
//     title: 'Icon Assets',
//     description: 'Collection of SVG icons',
//     time: '20 March',
//     icon: 'icons/duotune/art/art002.svg',
//     state: 'warning',
//   },
// ];

// interface LogModel {
//   code: string;
//   state: 'success' | 'danger' | 'warning';
//   message: string;
//   time: string;
// }

// const defaultLogs: Array<LogModel> = [
//   { code: '200 OK', state: 'success', message: 'New order', time: 'Just now' },
//   { code: '500 ERR', state: 'danger', message: 'New customer', time: '2 hrs' },
//   {
//     code: '200 OK',
//     state: 'success',
//     message: 'Payment process',
//     time: '5 hrs',
//   },
//   {
//     code: '300 WRN',
//     state: 'warning',
//     message: 'Search query',
//     time: '2 days',
//   },
//   {
//     code: '200 OK',
//     state: 'success',
//     message: 'API connection',
//     time: '1 week',
//   },
//   {
//     code: '200 OK',
//     state: 'success',
//     message: 'Database restore',
//     time: 'Mar 5',
//   },
//   {
//     code: '300 WRN',
//     state: 'warning',
//     message: 'System update',
//     time: 'May 15',
//   },
//   {
//     code: '300 WRN',
//     state: 'warning',
//     message: 'Server OS update',
//     time: 'Apr 3',
//   },
//   {
//     code: '300 WRN',
//     state: 'warning',
//     message: 'API rollback',
//     time: 'Jun 30',
//   },
//   {
//     code: '500 ERR',
//     state: 'danger',
//     message: 'Refund process',
//     time: 'Jul 10',
//   },
//   {
//     code: '500 ERR',
//     state: 'danger',
//     message: 'Withdrawal process',
//     time: 'Sep 10',
//   },
//   { code: '500 ERR', state: 'danger', message: 'Mail tasks', time: 'Dec 10' },
// ];
