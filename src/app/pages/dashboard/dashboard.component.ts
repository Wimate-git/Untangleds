import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuditTrailService } from '../services/auditTrail.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
    P5: any;
    P6: any;
    P7: any;
    P8: any;
    P9: any;
    P10: any;
    P11: any;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal')

  noticeSwal: SwalComponent;


  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  login_detail: any;
  loginDetail_string: any;
  client: any;
  user: any;
  formList: any[] = [];
  cards_2: any[] = []
  formgroup: any[] = [];
  showCards2 = true;
  permission_data: any;
  helpherObj: any;
  permissionForm: any;
  permissionFormgroup: any;
  response: any
  image: any;
  url: any;
  loading = true;
  icon: any;
  iconData: { class1: string; class2: string; label: string; value: string; };
  Item: { P1: any; P2: any; P3: any; P4: string; P5: any; P6: any; P7: any; P8: any; P9: number; };
  permission_id: any;
  permissionList: any;
  dashboard: boolean = false
  isCardMoved: boolean = false;





  constructor(
    private api: APIService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private auditTrail: AuditTrailService

  ) {

  }


  async ngOnInit(): Promise<void> {
    this.spinner.show()



    setTimeout(async () => {
      this.login_detail = localStorage.getItem('userAttributes')

      this.loginDetail_string = JSON.parse(this.login_detail)
      console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

      this.client = this.loginDetail_string.clientID
      this.user = this.loginDetail_string.username
      this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.client)
      const test = await this.api.GetMaster(this.user + '#user#main', 1);
      this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))


      if (this.permission_data.permission_ID !== 'All') {

        const permisson_response = await this.api.GetMaster(this.client + '#permission#' + this.permission_data.permission_ID + '#main', 1);

        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

        console.log("PERMISSION:",this.permission_data)

        this.permissionFormgroup = this.permission_data.formgroup

      this.permissionList = this.permission_data.permissionsList

      console.log("PERMISSION LIST:",this.permissionList[12].view)

      // console.log("PERMISSION DATA:", this.permissionList[12].view)

      if(this.permissionList[12].view === true && this.permissionList[12].update=== true){
        this.dashboard = true;
      }
      else{
        this.dashboard = false;
      }

        console.log("Permission Table Formgroup Selected:", this.permissionFormgroup)

        var result = this.permissionFormgroup.map((item: string) => item.split('-')[0]);

        console.log(result);


        await this.api.GetMaster(this.client + "#formgroup#lookup", 1).then((result: any) => {
          if (result) {
            const helpherObj = JSON.parse(result.options)

            this.formgroup = helpherObj.map((item: any) => item)

            console.log("FORMS LIST:", this.formgroup)

          }
        }).catch((error) => {
          console.log("FORMGROUP:", error)
        })

        if (this.permissionFormgroup.includes('All')) {

          this.cards_2 = await Promise.all(
            this.formgroup.map(async data => {
              const key = Object.keys(data)[0];
              const item = data[key]; // Extract the actual data using the key
              this.iconData = { class1: '', class2: '', label: '', value: '' };
              if (item.P4) {


                try {
                  this.iconData = JSON.parse(item.P4);


                }
                catch (error) {

                  console.log("FORMGROUP S3 bucket icon:", error)
                }
              }
              return {
                icon: this.iconData || ' ',
                name: item.P2 || ' ',  // Fallback in case P1 is empty
                job: item.P3 || ' ',   // Fallback in case P3 is empty
                avgEarnings: new Date(item.P7 * 1000).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }),  // Convert timestamp to a readable date format
                totalEarnings: item.P1 || '',  // Fallback in case P5 is empty
                online: item.P8, // Placeholder for 'online' status
                updateUser: item.P5,
                TileColor: item.P6,
                Index: item.P9,
                updatedTime: item.P7

              };
            })
          );

          this.cards_2.sort((a, b) => a.Index - b.Index);
          const UserDetails = {
            "User Name": this.user,
            "Action": "View",
            "Module Name": "Dashboard",
            "Form Name": "Dashboard Group",
            "Description": "Record is View",
            "User Id": this.user,
            "Client Id": this.client,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }

          this.auditTrail.mappingAuditTrailData(UserDetails, this.client)


        }
        else {

          const UserDetails = {
            "User Name": this.user,
            "Action": "View",
            "Module Name": "Dashboard",
            "Form Name": "Dashboard Group",
            "Description": "Record is View",
            "User Id": this.user,
            "Client Id": this.client,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }

          this.auditTrail.mappingAuditTrailData(UserDetails, this.client)

          const filteredData = this.formgroup.filter(data => {      // this.formgroup getting form permission table
            const key = Object.keys(data)[0];
            const item = data[key];
            // Check if the P1 value exists in the permissionFormgroup array
            return result.includes(item.P1);
          });

          console.log("Filtered Data:", filteredData)

          // Process the filtered data with async/await and map
          this.cards_2 = await Promise.all(
            filteredData.map(async data => {
              const key = Object.keys(data)[0];
              const item = data[key]; // Extract the actual data using the key
              this.iconData = { class1: '', class2: '', label: '', value: '' };
              if (item.P4) {

                try {
                  this.iconData = JSON.parse(item.P4);

                }
                catch (error) {

                  this.spinner.hide();

                  console.log("FORMGROUP S3 bucket icon:", error)
                }
              }
              return {
                icon: this.iconData || ' ',
                name: item.P2 || ' ',  // Fallback in case P1 is empty
                job: item.P3 || ' ',   // Fallback in case P3 is empty
                avgEarnings: new Date(item.P7 * 1000).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }),  // Convert timestamp to a readable date format
                totalEarnings: item.P1 || '',  // Fallback in case P5 is empty
                online: item.P8, // Placeholder for 'online' status
                updateUser: item.P5,
                TileColor: item.P6,
                Index: item.P9,
                updatedTime: item.P7

              };
            })
          );
          this.cards_2.sort((a, b) => a.Index - b.Index);
        }

      }
      else {

        this.dashboard = true

        const UserDetails = {
          "User Name": this.user,
          "Action": "View",
          "Module Name": "Dashboard",
          "Form Name": "Dashboard Group",
          "Description": "Record is View",
          "User Id": this.user,
          "Client Id": this.client,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }

        this.auditTrail.mappingAuditTrailData(UserDetails, this.client)
        await this.api.GetMaster(this.client + "#formgroup#lookup", 1).then((result: any) => {
          if (result) {
            const helpherObj = JSON.parse(result.options)

            this.formgroup = helpherObj.map((item: any) => item)

            console.log("FORMS LIST:", this.formgroup)

          }
        }).catch((error) => {
          console.log("FORMGROUP:", error)
        })
        this.cards_2 = await Promise.all(
          this.formgroup.map(async data => {
            const key = Object.keys(data)[0];
            const item = data[key]; // Extract the actual data using the key
            this.iconData = { class1: '', class2: '', label: '', value: '' };
            if (item.P4) {

              try {
                this.iconData = JSON.parse(item.P4);

                // console.log("ICON DATA:", this.iconData)
              }
              catch (error) {

                console.log("FORMGROUP S3 bucket icon:", error)
              }
            }
            return {
              icon: this.iconData || ' ',
              name: item.P2 || ' ',  // Fallback in case P1 is empty
              job: item.P3 || ' ',   // Fallback in case P3 is empty
              avgEarnings: new Date(item.P7 * 1000).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }),  // Convert timestamp to a readable date format
              totalEarnings: item.P1 || '',  // Fallback in case P5 is empty
              online: item.P8, // Placeholder for 'online' status
              updateUser: item.P5,
              TileColor: item.P6,
              Index: item.P9,
              updatedTime: item.P7

            };
          })
        );
        this.cards_2.sort((a, b) => a.Index - b.Index);
        this.loading = false;
        this.spinner.hide();
      }

      console.log("CARDS ON FORMGROUP:", this.cards_2)
      this.loading = false;
      this.spinner.hide();



      if (this.cards_2.length === 0) {

        Swal.fire({
          toast: true,
          position: 'bottom',
          icon: 'success', // or another icon like 'info', 'error', etc.
          title: 'No Form Group data available',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        const errorAlert_icon: SweetAlertOptions = {
          icon: 'error',
          title: 'No Form Group data available.',
          text: '',
        };

        this.showAlert(errorAlert_icon)
      }


      this.cdr.detectChanges();

    }, 1000);

  }

  async drop(event: CdkDragDrop<string[]>) {
    // const previousIndex = this.filteredCards.findIndex(card => card === event.previousIndex);

    this.isCardMoved = true;

    if(this.dashboard == false){

      // Swal.fire({
      //   toast: true,
      //   position: 'bottom',
      //   icon: 'success', // or another icon like 'info', 'error', etc.
      //   title: 'No Form Group data available',
      //   showConfirmButton: false,
      //   timer: 2000,
      //   timerProgressBar: true
      // });

      const errorAlert_dashboard: SweetAlertOptions = {
        icon: 'error',
        title: 'You do not have permission to update tile positions.',
        text: '',
      };

      this.showAlert(errorAlert_dashboard)
      return;
    }

    console.log("before", event)
    console.log('this.cards_2 before:>> ', this.cards_2);
    console.log('Moving card:', event.previousIndex, event.currentIndex);
    moveItemInArray(this.cards_2, event.previousIndex, event.currentIndex);
    console.log('this.cards_2 after:>> ', this.cards_2);
    console.log("After", event)

    //     this.Item = [{
    //       P1: this.cards_2[event.previousIndex].totalEarnings,
    //       P2: this.cards_2[event.previousIndex].name,
    //       P3: this.cards_2[event.previousIndex].job,
    //       P4: JSON.stringify(this.cards_2[event.previousIndex].icon),
    //       P5: this.cards_2[event.previousIndex].updateUser,
    //       P6: this.cards_2[event.previousIndex].TileColor,
    //       P7: this.cards_2[event.previousIndex].updatedTime,
    //       P8: this.cards_2[event.previousIndex].online,
    //       P9: event.previousIndex,

    //     },
    //     {
    //       P1: this.cards_2[event.currentIndex].totalEarnings,
    //       P2: this.cards_2[event.currentIndex].name,
    //       P3: this.cards_2[event.currentIndex].job,
    //       P4: JSON.stringify(this.cards_2[event.currentIndex].icon),
    //       P5: this.cards_2[event.currentIndex].updateUser,
    //       P6: this.cards_2[event.currentIndex].TileColor,
    //       P7: this.cards_2[event.previousIndex].updatedTime,
    //       P8: this.cards_2[event.currentIndex].online,
    //       P9: event.currentIndex,

    //     }
    // ]

    // for (let i = 0; i < this.cards_2.length; i++) {

    //   this.Item = {
    //     P1: this.cards_2[i].totalEarnings,
    //     P2: this.cards_2[i].name,
    //     P3: this.cards_2[i].job,
    //     P4: JSON.stringify(this.cards_2[i].icon),
    //     P5: this.cards_2[i].updateUser,
    //     P6: this.cards_2[i].TileColor,
    //     P7: this.cards_2[i].updatedTime,
    //     P8: this.cards_2[i].online,
    //     P9: i

    //   }

    //   await this.updatedreamboardlookup(1, this.Item.P1, 'update', this.Item)
    // }


  }

  async onFabClick() {

    try {

      const errorAlert_dashboard: SweetAlertOptions = {
        icon: 'success',
        title: 'Dashboard saved successfully.',
        text: '',
      };

      this.showAlert(errorAlert_dashboard)

      for (let i = 0; i < this.cards_2.length; i++) {
       

        this.Item = {
          P1: this.cards_2[i].totalEarnings,
          P2: this.cards_2[i].name,
          P3: this.cards_2[i].job,
          P4: JSON.stringify(this.cards_2[i].icon),
          P5: this.cards_2[i].updateUser,
          P6: this.cards_2[i].TileColor,
          P7: this.cards_2[i].updatedTime,
          P8: this.cards_2[i].online,
          P9: i

        }

        await this.updatedreamboardlookup(1, this.Item.P1, 'update', this.Item)

       
      }
      // this.spinner.hide();
      // const errorAlert_dashboard: SweetAlertOptions = {
      //   icon: 'success',
      //   title: 'Dashboard saved successfully.',
      //   text: '',
      // };

      // this.showAlert(errorAlert_dashboard)
      this.isCardMoved = false;
      this.cdr.detectChanges();

      const UserDetails = {
        "User Name": this.user,
        "Action": "View",
        "Module Name": "Dashboard",
        "Form Name": "Dashboard Group",
        "Description": "Dashboard Edited",
        "User Id": this.user,
        "Client Id": this.client,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails, this.client)

    }
    catch (error) {
      console.log("Error:", error)

      const errorAlert_dashboarderror: SweetAlertOptions = {
        icon: 'error',
        title: 'Dashboard not saved.',
        text: '',
      };

      this.showAlert(errorAlert_dashboarderror)
      this.isCardMoved = false
      this.cdr.detectChanges();
    }
  }

  
  searchQuery = '';
  get filteredCards() {
    return this.cards_2.filter(card =>
    // card.name?.toLowerCase().includes(this.searchQuery.toLowerCase() )|| card.job?.toLowerCase().includes(this.searchQuery.toLowerCase())

    (card.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (card.job && card.job !== 'N/A' && card.job.toLowerCase().includes(this.searchQuery.toLowerCase())))

    );
  }


  async updatedreamboardlookup(sk: any, id: any, type: any, item: any) {

    const tempClient = this.client + '#formgroup' + "#lookup";
    // console.log("Temp client is ", tempClient);
    // console.log("Type of client", typeof tempClient);
    try {
      const response = await this.api.GetMaster(tempClient, sk);

      if (response && response.options) {
        let data: ListItem[] = await JSON.parse(response.options);

        // Find the index of the item with the matching id
        let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 === id);

        if (findIndex !== -1) { // If item found
          if (type === 'update') {
            data[findIndex][`L${findIndex + 1}`] = item;

            // Create a new array to store the re-arranged data without duplicates
            const newData = [];

            // Loop through each object in the data array
            for (let i = 0; i < data.length; i++) {
              const originalKey = Object.keys(data[i])[0]; // Get the original key (e.g., L1, L2, ...)
              const newKey = `L${i + 1}`; // Generate the new key based on the current index

              // Check if the original key exists before renaming
              if (originalKey) {
                // Create a new object with the new key and the data from the original object
                const newObj = { [newKey]: data[i][originalKey] };

                // Check if the new key already exists in the newData array
                const existingIndex = newData.findIndex(obj => Object.keys(obj)[0] === newKey);

                if (existingIndex !== -1) {
                  // Merge the properties of the existing object with the new object
                  Object.assign(newData[existingIndex][newKey], data[i][originalKey]);
                } else {
                  // Add the new object to the newData array
                  newData.push(newObj);
                }
              } else {
                console.error(`Original key not found for renaming in data[${i}].`);
                // Handle the error or log a message accordingly
              }
            }

            // Replace the original data array with the newData array
            data = newData;

          } else if (type === 'delete') {
            // Remove the item at the found index
            data.splice(findIndex, 1);
          }

          // Prepare the updated data for API update
          let updateData = {
            PK: tempClient,
            SK: response.SK,
            options: JSON.stringify(data)
          };

          // Update the data in the API
          await this.api.UpdateMaster(updateData);

        } else { // If item not found
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retrying
          await this.updatedreamboardlookup(sk + 1, id, type, item); // Retry with next SK

        }
        // this.reloadEvent.emit(true);
      } else { // If response or listOfItems is null
        console.log("LOOKUP ID NOT FOUND")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

}
