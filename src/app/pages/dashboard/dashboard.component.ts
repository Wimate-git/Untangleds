import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal,{ SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuditTrailService } from '../services/auditTrail.service';



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

      console.log("PERMISSION DATA:", this.permission_data)

      if (this.permission_data.permission_ID !== 'All') {

        const permisson_response = await this.api.GetMaster(this.client + '#permission#' + this.permission_data.permission_ID + '#main', 1);

        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

        this.permissionFormgroup = (this.permission_data.formgroup)

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

              };
            })
          );
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
    
          this.auditTrail.mappingAuditTrailData(UserDetails,this.client)
    

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
    
          this.auditTrail.mappingAuditTrailData(UserDetails,this.client)

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
              };
            })
          );
        }

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
  
        this.auditTrail.mappingAuditTrailData(UserDetails,this.client)
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

            };
          })
        );
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
