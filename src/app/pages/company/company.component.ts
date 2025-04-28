import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Config } from 'datatables.net';
import { SharedService } from '../shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuditTrailService } from '../services/auditTrail.service';

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
  };
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit{
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  datatableConfig: Config = {};
  swalOptions: SweetAlertOptions = {};
  isLoading:boolean = false

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  


  createCompanyField: UntypedFormGroup;
  showModal: any = false;
  showHeading: any = false;
  errorForUniqueID: any;
  errorForMobile: any;
  logo1_name: any;
  base64textString: any;
  base64textString_temp: any;
  isCollapsed1 = false;

  base64textString_logo1: any;
  base64textString_temp_logo1: any;

  allCompanyDetails: any = {};
  getLoggedUser: any;
  SK_clientID: any;
  loggedUser_Company: any;
  defaultLocation: any = {};

  errorForInvalidEmail: any;
  //default defaultLocation for all clients
  jsondata = [

    { "id": "node1", "parent": "#", "text": "World", "node_type": "location", "area": null, "summary_enable": null, "summary_types": null, "dashboard_view": {id:null}, "leadership_view":  {id:null}, "mobile_view":  {id:null} },
    { "id": "node2", "parent": "node1", "text": "Asia", "node_type": "location", "area": null, "summary_enable": null, "summary_types": null, "dashboard_view":  {id:null}, "leadership_view":  {id:null}, "mobile_view":  {id:null} },
    { "id": "India", "parent": "node2", "text": "India", "node_type": "location", "area": null, "summary_enable": null, "summary_types": null, "dashboard_view":  {id:null}, "leadership_view":  {id:null}, "mobile_view":  {id:null} }

  ];


  @ViewChild('closeCompany') closeCompany: any;

  data_temp: any = [];
  listofSK: any = [];
  companySK: any;

  allPermissions_user:any;

  hideUpdateButton: any = false;
  hideDeleteButton: any = false;

  columnDatatable:any = [];
  clientID: any;
  dataform: any = [];
  lookup_data_user: any = [];
  columnTableData: any = [];
  deviceTableData: any;
  maxlength: number = 500;
  lookup_data_client: any = [];
  listofClientIDs: any = [];
  lookup_data_company: any = [];
  editOperation: boolean = false;
  username: any;


  constructor(private fb: UntypedFormBuilder, private companyConfiguration: SharedService,
    private api: APIService, private toast: MatSnackBar, private sanitizer: DomSanitizer,
    private router:Router,private cd:ChangeDetectorRef,private auditTrail:AuditTrailService) { }

  ngOnInit() {
    
    this.getLoggedUser = this.companyConfiguration.getLoggedUserDetails()

    this.SK_clientID = this.getLoggedUser.clientID;

    this.username = this.getLoggedUser.username

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

    this.addFromService();
    this.initializeCompanyFields();

    this.showTable()
  }




  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deleteCompany(id);
  }

  create() {
    console.log("Add is clicked");
    this.openModal('')
  }


  edit(P1: any) {
    // console.log("Edited username is here ", P1);
    // $('#companyModal').modal('show');
    this.openModalHelpher(P1)


    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "Company",
        "Form Name": 'Company',
        "Description": `${P1} Company was Viewed`,
        "User Id": this.username,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }
  
      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
    }
    catch(error){
      console.log("Error while creating audit trails ",error);
    }
  }




  onSubmit(event:any){

    if (this.createCompanyField.invalid || this.errorForUniqueID =='Company ID already exists' ||
      this.errorForInvalidEmail == 'Invalid Email Address') {
      this.markAllFieldsTouched(this.createCompanyField);
      return;
    }
     
    console.log("All fields have been filled completly ",event);
    if(event.type == 'submit' && this.editOperation == false){
      this.createNewCompany('')
    }
    else{
      this.updateCompany(this.createCompanyField.value,'editCompany')
    }
  }


  markAllFieldsTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFieldsTouched(control);
      }
    });
  }


  async showTable() {

    console.log("Show DataTable is called BTW");

    this.datatableConfig = {}
    this.lookup_data_company = []
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters:any, callback) => {
        this.datatableConfig = {}
        this.lookup_data_company = []
        this.fetchCompanyLookupdata(1)
          .then((resp:any) => {
            const responseData = resp || []; // Default to an empty array if resp is null
             // Example filtering for search
             const searchValue = dataTablesParameters.search.value.toLowerCase();
             const filteredData = Array.from(new Set(
              responseData
                .filter((item: { P1: string }) => item.P1.toLowerCase().includes(searchValue.toLowerCase()))
                .map((item: any) => JSON.stringify(item)) // Stringify the object to make it unique
            )).map((item: any) => JSON.parse(item)); // Parse back to object

             callback({
                 draw: dataTablesParameters.draw,
                 recordsTotal: responseData.length,
                 recordsFiltered: filteredData.length,
                 data: filteredData // Return filtered data
             });

             console.log("Response is in this form ", filteredData);
                               
          })
          .catch((error: any) => {
            console.error('Error fetching user lookup data:', error);
            // Provide an empty dataset in case of an error
            callback({
              draw: dataTablesParameters.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
          });
      },
      columns: [
        {
          title: 'Company ID', 
          data: 'P1', 
          render: function (data, type, full) {
            const colorClasses = ['success', 'info', 'warning', 'danger'];
            const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            
            const initials = data[0].toUpperCase();
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;
  
            const nameAndEmail = `
              <div class="d-flex flex-column">
                <a href="javascript:;" class="clicable-href text-gray-800 text-hover-primary mb-1 view-item" data-action="edit" data-id="${full.P1}">${data}</a>
                <span>${full.P3}</span> <!-- Assuming P3 is the email -->
              </div>
            `;
  
            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                <a href="javascript:;" class="view-item" data-action="edit">
                  ${symbolLabel}
                </a>
              </div>
              ${nameAndEmail}
            `;
          }
        },
        {
          title: 'Client ID', data: 'P2' // Added a new column for phone numbers
        },
        {
          title: 'Updated', data: 'P4', render: function (data) {
            const date = new Date(data * 1000).toLocaleDateString() + " " + new Date(data * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            // const date = new Date(data * 1000);
            // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
            return date
          }
        }
      ],
      createdRow: (row, data:any, dataIndex) => {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        $(row)
        .find(".view-item")
        .on("click", () => {
          console.log("Event is triggered for:", data.P1);
          this.edit(data.P1); // `this` now correctly refers to the component
        });
      },
    };





    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "Company",
        "Form Name": 'Company',
        "Description": `Company Table was Viewed`,
        "User Id": this.username,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }
  
      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
    }
    catch(error){
      console.log("Error while creating audit trails ",error);
    }
  
  }
  

  fetchCompanyLookupdata(sk:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#company" + "#lookup", sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);
              
              if (Array.isArray(data)) {
                const promises = []; // Array to hold promises for recursive calls
  
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3, P4, P5, P6 } = element[key]; // Extract values from the nested object
                    this.lookup_data_company.push({ P1, P2, P3, P4, P5, P6 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_company);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_company.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_data_company);
  
                // Continue fetching recursively
                promises.push(this.fetchCompanyLookupdata(sk + 1)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_company)) // Resolve with the final lookup data
                  .catch(reject); // Handle any errors from the recursive calls
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            console.log("All the users are here", this.lookup_data_company);

            this.listofSK = this.lookup_data_company.map((item:any)=>item.P1)

            resolve(this.lookup_data_company); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }
  

  // async fetchTMLookupData(sk: any) {

  //   // console.log("Iam called Bro");
  //   // try {
  //   //   const response = await this.api.GetLookupMasterTable(this.clientID, sk);
   
  //   //   if (response && response.items) {
  //   //     // Check if response.listOfItems is a string
  //   //     if (typeof response.items === 'string') {
  //   //       let data = JSON.parse(response.items);
  //   //       console.log("d1 =",data)
  //   //       if (Array.isArray(data)) {
  //   //         for (let index = 0; index < data.length; index++) {
  //   //           const element = data[index];
  
  //   //           if (element !== null && element !== undefined) {
  //   //             // Extract values from each element and push them to lookup_data_temp1
  //   //             const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
  //   //             const { P1, P2, P3} = element[key]; // Extract values from the nested object
  //   //             this.lookup_data_user.push({P1, P2, P3 }); // Push an array containing P1, P2, and P3 values
  //   //             console.log("d2 =",this.lookup_data_user)
  //   //           } else {
  //   //             break;
  //   //           }
  //   //         }
  //   //         //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
  //   //         this.lookup_data_user.sort((a:any, b:any) => {
  //   //           return b.P3 - a.P3; // Compare P5 values in descending order
  //   //         });
  //   //         console.log("Lookup sorting",this.lookup_data_user);
  //   //         // Continue fetching recursively
  //   //         await this.fetchTMLookupData(sk + 1);
  //   //       } else {
  //   //         console.error('Invalid data format - not an array.');
  //   //       }
  //   //     } else {
  //   //       console.error('response.listOfItems is not a string.');
  //   //     }
  //   //   } else {
  //   //     // Sort the lookup_data_temp1 array based on the third element (P3)
  //   //   console.log()
     
  //   //     // Extract the IDs and display the datatable
  //   //     // this.listofPowerboardIds = this.lookup_data_temp1.map((item: any) => item[0]);
  //   //     // this.showDatatable(this.lookup_data_temp1);
        
  //   //     console.log("Permissions to be displayed",this.lookup_data_user);
  //   //     this.getTableUser(this.lookup_data_user);
       
        
  //   //     // for(let i = 0;i<this.lookup_data_temp1.length;i++){
  //   //     //   this.paramsBasedOnRDT.push(this.lookup_data_temp1[i].P2);
  //   //     // }
  //   //     // this.getDatatable(this.lookup_data_temp1);
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error:', error);
  //   //   // Handle the error as needed
  //   // }
  // }



  // getTableUser(getData: any) {
  //   // let editButton = 'btn btn-sm btn-primary editclasscompany '
  //   // let deleteButton = 'btn btn-sm btn-danger editclasscompany ';
  
  
  //   // if (typeof getData !== 'undefined') {
  
  //   //   for (let allData = 0; allData < getData.length; allData++) {
        
        
  
  //   //       this.dataform.push({
  //   //         company_id:getData[allData].P1,
  //   //         client_id:getData[allData].P2,
  //   //         updatedTime:new Date(getData[allData].P3*1000).toDateString() + " " + new Date(getData[allData].P3*1000).toLocaleTimeString(),
  //   //         //grid_details: grid_details
  //   //       })
  //   //   }
  
  //   // }
  //   // else {
  //   //   this.dataform = [];
  //   // }
  //   // let temp = [];
  
  //   // if (typeof getData !== 'undefined') {
  //   //   for (let formattedDate = 0; formattedDate < getData.length; formattedDate++) {
  
  //   //     temp[formattedDate] = new Date(getData[formattedDate].updatedTime).toLocaleString();
  //   //     getData[formattedDate].updatedTime = temp[formattedDate];
  //   //   }
  
  //   // }
  
  //   // else {
  //   //   getData = []
  //   // }
  
  
  //   // //update
  //   // if (this.hideDeleteButton === true) {
  //   //   this.columnTableData.push(
  //   //     {
  //   //       defaultContent: "<button class='" + editButton + "' data-bs-target='#companyModal' data-bs-toggle='modal'><i class='fa fa-edit'></i></i></button>"
  //   //     },
  //   //     {
  //   //       defaultContent: "<button class='" + deleteButton + "'><i class='fa fa-trash'></i></button>"
  //   //     }
  
  //   //   )
  
  
  //   // }
  
  //   // //view
  //   // else {
  //   //   this.columnTableData.push(
  
  //   //     {
  //   //       defaultContent: "<button class='" + editButton + "' data-bs-target='#companyModal' data-bs-toggle='modal''><i class='fa fa-edit'></i></i></button>"
  //   //     }
  
  //   //   )
  
  
  //   // }
  
  //   // console.log("columnDatatable",this.columnTableData);
  
  //   // console.log("dataform",this.dataform);
  
  
  //   // $('#company_lookup_table').off('click');
  //   // $('#company_lookup_table').on('click', '.editclasscompany', function () {
  
  //   //   //get row for data
  //   //   let tr = $(this).closest('tr');
  //   //   let row =_currClassRef.deviceTableData.row(tr);
  
  //   //   if (this.className == deleteButton) {
  //   //     // _currClassRef.deleteUser(row.data(), 'delete');
  //   //     _currClassRef.deleteCompany(row.data());
  //   //   }
  
  //   //   if (this.className == editButton) {
  //   //     _currClassRef.openModalHelpher(row.data());
  
  //   //   }
  
  //   // })
  
   
   
  //   //   this.getLookupTableData(this.dataform,this.columnTableData)
  //   //   this.addFromService();
  //   //     let _currClassRef = this;
  //   }



    openModalHelpher(getValue:any){
      console.log("Data from llokup :",getValue);
  
      this.api
        .GetMaster(`${getValue}#company#main`,1)
        .then((result :any) => {
          if (result && result !== undefined) {
      
            if(result){ 
              this.openModal(JSON.parse(result.metadata))
            }
        }
      })
      .catch((err) => {
        console.log("cant fetch", err);
      });
  }
  

  addFromService() {
    this.getClientID()
  }

  getCompanies(){

  }


  checkPermission(){
    // let hasDeviceUpdate = false;
    // let hasDeviceView = false;
    // // let permissionFound = false;

    // for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
    //   if (this.allPermissions_user[checkPermission] === 'Company - Update') {
    //     hasDeviceUpdate = true;
    //     // permissionFound = true;
    //   }

    //   else if (this.allPermissions_user[checkPermission] === 'Company - View') {
    //     hasDeviceView = true;
    //     // permissionFound = true;
    //   }
    // }

    
    // if (hasDeviceUpdate && hasDeviceView) {
    //   this.hideDeleteButton = true;
    // }
    // else if (hasDeviceUpdate) {
    //   this.hideDeleteButton = true;
    // } else if (hasDeviceView) {
    //   this.hideDeleteButton = false;
    // } else {
    //   this.router.navigate(['/404']);
    // }

  }

  initializeCompanyFields() {
    this.createCompanyField = this.fb.group({
      'logo1': [''],
      'logo2': [''],
      'clientID': ['', Validators.required],
      'companyID': ['', Validators.required],
      'companyName': ['', Validators.required],
      'companydesc': ['', Validators.required],
      'mobile': ['', Validators.required],
      'email_permission': ['', Validators.required],
      'sms_permission': ['', Validators.required],
      'telegram_permission': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'telegramID': ['', Validators.required],
      'enableCompany': ['', Validators.required],
    })
  }

  metadata(): UntypedFormArray {
    return this.createCompanyField.get('metadata') as UntypedFormArray
  }


  async getClientID() {
    try{

      await this.fetchTMClientLookup(1)

      for(let i = 0;i<this.lookup_data_client.length;i++){
        this.listofClientIDs.push(this.lookup_data_client[i].P1);
      } 

      this.listofClientIDs = Array.from(new Set(this.listofClientIDs)) 

      console.log("All the clients data is here ",this.listofClientIDs)

    }
    catch(err){
      console.log("Error fetching all the clients ");
    }
  }


  async fetchTMClientLookup(sk: any) {

    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster("client"+"#lookup", sk);
   
      if (response && response.options) {
        // Check if response.listOfItems is a string
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =",data)
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
  
              if (element !== null && element !== undefined) {
                // Extract values from each element and push them to lookup_data_temp1
                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                const { P1, P2, P3,P4 ,P5,P6} = element[key]; // Extract values from the nested object
                this.lookup_data_client.push({P1, P2, P3,P4,P5,P6 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =",this.lookup_data_client)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.lookup_data_client.sort((a:any, b:any) => {
              return b.P5 - a.P5; // Compare P5 values in descending order
            });
            console.log("Lookup sorting",this.lookup_data_client);
            // Continue fetching recursively
            await this.fetchTMClientLookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {
        // Sort the lookup_data_temp1 array based on the third element (P3)
      console.log()
        console.log("Lookup to be displayed",this.lookup_data_client);   
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }




  add() {
    // this.metadata().push(this.createItem());
  }

  createItem() {
    // return this.fb.group({
    //   key: new UntypedFormControl('', [Validators.required]),
    //   value: new UntypedFormControl('', [Validators.required]),
    // });
  }

  updateItem(getValues: any) {
    // //console.log('get', getValues);
    // this.metadata().clear();
    // for (let i = 0; i < getValues.length; i++) {
    //   this.metadata().push(this.fb.group({
    //     key: getValues[i].key,
    //     value: getValues[i].value,
    //   }));
    // }

    // return this.metadata();

  }

  remove(index: any) {
    console.log('remove', index);
    const addFields = this.createCompanyField.get('metadata') as UntypedFormArray
    addFields.removeAt(index);
  }

  checkUniqueIdentifier(getID: any) {
    console.log('getID', getID);
    this.errorForUniqueID = '';
    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
      if (getID.target.value.toLowerCase() == this.listofSK[uniqueID].toLowerCase()) {
        this.errorForUniqueID = "Company ID already exists";
      }
    }
  }

  openModal(getValues: any) {
    console.log('getvalues inside openModal', getValues);
    // if (getKey == 'edit' || getKey == '') {
    let temp = "";
    //console.log('temp',temp);
    if (getValues == "") {
      this.editOperation = false;
      this.showHeading = true;
      this.showModal = false;
      this.errorForUniqueID = '';
      this.errorForInvalidEmail = '';
      this.base64textString_temp = temp;
      this.base64textString_temp_logo1 = temp;
      this.createCompanyField.get('companyID')?.enable();
      this.createCompanyField = this.fb.group({
        'logo1': getValues.logo1,
        'logo2': getValues.logo2,
        'clientID': getValues.clientID,
        'companyID': getValues.companyID,
        'companyName': getValues.companyName,
        'companydesc': getValues.companyDesc,
        'mobile': getValues.mobile,
        'email_permission': getValues.email,
        'sms_permission': getValues.sms,
        'telegram_permission': getValues.telegram,
        'health_permission': getValues.healthCheck,
        'alert_permission': getValues.alert_permission,
        'enableCompany': getValues.enableCompany,
        'device_permission': getValues.device_permission,
        'email': getValues.email,
        'telegramID': getValues.telegramID,
      })

    }
    //updated device congifuration(update)
    else if (getValues) {
      console.log('get values on edit');
      //disabling RDT id field on edit,becas its shoukd be unique and making showmodal as true
      this.createCompanyField.get('companyID')?.disable();

//       for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
//         if (this.allPermissions_user[checkPermission] === 'Company - Update') {
//           this.hideUpdateButton = false;
// break;        }

//         else if (this.allPermissions_user[checkPermission] === 'Company - View') {
//           this.hideUpdateButton = true;
//         }
//       }
    this.editOperation = true;
      this.showHeading = false;
      this.showModal = true;
      this.base64textString_temp = getValues.logo1;
      this.base64textString_temp_logo1 = getValues.logo2;
      this.errorForUniqueID = '';
      this.errorForInvalidEmail = '';
      let parsed = '';
      if (getValues.metadata) {
        parsed = JSON.parse(getValues.metadata);
      }
      this.createCompanyField = this.fb.group({
        'logo1': getValues.logo1,
        'logo2': getValues.logo2,
        'clientID': { value: getValues.clientID, disabled: true },
        'companyID':{ value:  getValues.companyID, disabled: true },
        'companyName': getValues.companyName,
        'companydesc': getValues.companyDesc,
        'mobile': getValues.mobile,
        'email_permission': getValues.email,
        'sms_permission': getValues.sms,
        'telegram_permission': getValues.telegram,
        'health_permission': getValues.healthCheck,
        'alert_permission': getValues.alert_permission,
        'device_permission': getValues.deviceTimeout,
        'email': getValues.emailID,
        'telegramID': getValues.telegramID,
        'enableCompany': getValues.enableCompany,
      })

    }
    this.cd.detectChanges()    
  }


  firstLogoCompany(getFile: any) {
    console.log('image', getFile);
    //adding file to temp variable
    this.base64textString_temp = getFile;
    let files = getFile.target.files;
    let file = files[0];
    let fileExtension = file.type;

    //validating type
    if (fileExtension == "image/gif" || fileExtension == "image/png" || fileExtension == "image/bmp"
      || fileExtension == "image/jpeg" || fileExtension == "image/jpg") {

      if (files && file) {
        let reader = new FileReader();

        reader.onload = this.firstbase64.bind(this);

        reader.readAsBinaryString(file);

      }

    }

    else {

      Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        text: 'Image type should be only of GIF, PNG, JPG, JPEG and BMP',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,////prevents outside click
      })

    }
  }

  secondLogoCompany(getFile: any) {
    console.log('image', getFile);

    //adding file to temp variable
    this.base64textString_temp_logo1 = getFile;
    let files = getFile.target.files;
    let file = files[0];
    let fileExtension = file.type;

    //validating type
    if (fileExtension == "image/gif" || fileExtension == "image/png" || fileExtension == "image/bmp"
      || fileExtension == "image/jpeg" || fileExtension == "image/jpg") {

      if (files && file) {
        let reader = new FileReader();

        reader.onload = this.secondbase64.bind(this);

        reader.readAsBinaryString(file);

      }

    }

    else {

      Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        text: 'Image type should be only of GIF, PNG, JPG, JPEG and BMP',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,////prevents outside click
      })

    }
  }

  firstbase64(readerEvt: any) {
    console.log('readerEvt', readerEvt);
    let binaryString = readerEvt.target.result;

    this.base64textString = btoa(binaryString);
    let files = this.base64textString_temp.target.files;
    let file = files[0];
    let fileExtension = file.type;
    let fileName = file.name;
    //console.log('filename',fileName);
    this.logo1_name = fileName;

    let length = this.base64textString.length;

    let y = 1;
    //console.log('this.base64textString[this.base64textString.length - 1]',this.base64textString[this.base64textString.length - 1]);
    if (('=' == this.base64textString[this.base64textString.length - 1]) && ('=' == this.base64textString[this.base64textString.length - 2])) {
      y = 2;
    }
    let x = (length * (3 / 4)) - y;
    x = x / 1000;
    if (x < 200) {
      // console.log('x inside kb xonversion',x);

      this.base64textString_temp = 'data:' + fileExtension + ';base64,' + this.base64textString;

    }
    else {
      //return alert('Image should be less than 500KB');

      return Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        text: 'Image should be less than 200KB',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,////prevents outside click
        //confirmButtonText: 'Ok',
        //cancelButtonText: 'Cancel'
      })
    }

  }

  secondbase64(readerEvt: any) {
    let binaryString = readerEvt.target.result;
    this.base64textString_logo1 = btoa(binaryString);
    let files = this.base64textString_temp_logo1.target.files;
    let file = files[0];
    let fileExtension = file.type;

    let length = this.base64textString_logo1.length;
    //console.log('length of image',length);
    let y = 1;
    if (('=' == this.base64textString_logo1[this.base64textString_logo1.length - 1]) && ('=' == this.base64textString_logo1[this.base64textString_logo1.length - 2])) {
      y = 2;
    }
    let x = (length * (3 / 4)) - y;
    x = x / 1000;
    if (x < 200) {
      // console.log('x inside kb xonversion',x);

      this.base64textString_temp_logo1 = 'data:' + fileExtension + ';base64,' + this.base64textString_logo1;

    }
    else {
      //return alert('Image should be less than 500KB');

      return Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        text: 'Image should be less than 200KB',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,////prevents outside click
        //confirmButtonText: 'Ok',
        //cancelButtonText: 'Cancel'
      })
    }

  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    console.log('inputChar', inputChar);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  checkMail(event: any) {
    console.log('event', event);
    let Regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    this.errorForInvalidEmail = '';
    if (Regex.test(event.target.value) == false) {
      this.errorForInvalidEmail = "Invalid Email Address";
    }
  }

  getDatatable(data_temp: any) {
  }


  createNewCompany(getNewFields: any) {


    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Company updated successfully!' : 'Company created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Company ID already Exist!',
        text: '',
    };

    //console.log('allUserDetails', this.createCompanyField.value);

    let tempClient = this.createCompanyField.value.clientID+"#company"+"#lookup";

    this.allCompanyDetails = {
      companyID: this.createCompanyField.value.companyID,
      clientID: this.createCompanyField.value.clientID,
      companyName: this.createCompanyField.value.companyName,
      companyDesc: this.createCompanyField.value.companydesc,
      enableCompany: this.createCompanyField.value.enableCompany,
      mobile: this.createCompanyField.value.mobile,
      emailID: this.createCompanyField.value.email,
      email: this.createCompanyField.value.email_permission,
      sms: this.createCompanyField.value.sms_permission,
      telegram: this.createCompanyField.value.telegram_permission,
      healthCheck: this.createCompanyField.value.health_permission,
      deviceTimeout: this.createCompanyField.value.device_permission,
      alertTimeout: this.createCompanyField.value.alert_permission,
      telegramID: this.createCompanyField.value.telegramID,
      companyLogo1: this.base64textString_temp,
      companyLogo2: this.base64textString_temp_logo1,
      metadata: JSON.stringify(this.createCompanyField.value.metadata),
      updated: new Date()
    }

    const tempObj = {
      PK: this.createCompanyField.value.companyID+"#company"+"#main",
      SK: 1,
      metadata:JSON.stringify(this.allCompanyDetails)
    }

    console.log("Temp obj is here ",tempObj);


    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items ={
    P1: this.createCompanyField.value.companyID,
    P2: this.createCompanyField.value.clientID,
    P3:this.createCompanyField.value.email,
    P4: date
    }


    console.log("Items are here ",items);

    console.log('newly added Company config', this.allCompanyDetails);

    this.api.CreateMaster(tempObj).then(async (value: any) => {

      await this.createLookUpRdt(items,1,tempClient)

      this.datatableConfig = {}
      
      this.lookup_data_company = []

      // await this.loading()

      //need to refresh table so this is called 
      this.addFromService();

      if (value) {
        //alert('New configuration created successfully');

        // this.toast.open("New Company Configuration created successfully", " ", {
        //   //panelClass: 'error-alert-snackbar',

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        // })

        // this.closeCompany.nativeElement.click();

        //adding default location
        this.defaultLocation = {
          PK: this.createCompanyField.value.companyID,
          SK: this.createCompanyField.value.clientID,
          tree: JSON.stringify(this.jsondata)
        }

        // this.api.CreateLocation(this.defaultLocation).then(value => {

        //   //need to refresh table so this is called 
        //   //this.addFromService();

        //   if (value) {

        //     this.toast.open("New Location Configuration created successfully", " ", {
        //       //panelClass: 'error-alert-snackbar',

        //       duration: 2000,
        //       horizontalPosition: 'right',
        //       verticalPosition: 'top',
        //     })



        //   }
        //   else {
        //     Swal.fire({
        //       customClass: {
        //         container: 'swal2-container'
        //       },
        //       position: 'center',
        //       icon: 'warning',
        //       title: 'Error in adding Location Configuration',
        //       showCancelButton: true,
        //       allowOutsideClick: false,////prevents outside click
        //     })
        //   }

        // }).catch((err: any) => {
        //   console.log('err for creation', err);
        //   this.toast.open("Error in adding new Location Configuration ", "Check again", {
        //     //panelClass: 'error-alert-snackbar',

        //     duration: 5000,
        //     horizontalPosition: 'right',
        //     verticalPosition: 'top',
        //     //   //panelClass: ['blue-snackbar']
        //   })
        // })


        const temp:any=[
          {
            tree: JSON.stringify(this.jsondata)
          }
        ]
        const obj = {
          PK: items.P2+"#"+ this.createCompanyField.value.companyID + "#location" + "#main",
          SK: 1,
          metadata: JSON.stringify(temp)
        };
        
        
                
        
                this.api.CreateMaster(obj).then((value: any) => {
        
                  //need to refresh table so this is called 
                  //this.addFromService();
        
                  if (value) {
        
                    // this.toast.open("New Location Configuration created successfully", " ", {
                    //   //panelClass: 'error-alert-snackbar',
        
                    //   duration: 2000,
                    //   horizontalPosition: 'right',
                    //   verticalPosition: 'top',
                    // })

                    this.showAlert(successAlert)

                    try{
                      const UserDetails = {
                        "User Name": this.username,
                        "Action": "Created",
                        "Module Name": "Company",
                        "Form Name": 'Company',
                        "Description": `${items.P1} Company was Created`,
                        "User Id": this.username,
                        "Client Id": this.SK_clientID,
                        "created_time": Date.now(),
                        "updated_time": Date.now()
                      }
                  
                      this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
                    }
                    catch(error){
                      console.log("Error while creating audit trails ",error);
                    }
      




                    this.reloadEvent.next(true)
        
        
        
                  }
                  else {
                    Swal.fire({
                      customClass: {
                        container: 'swal2-container'
                      },
                      position: 'center',
                      icon: 'warning',
                      title: 'Error in adding Location Configuration',
                      showCancelButton: true,
                      allowOutsideClick: false,////prevents outside click
                    })
                  }
        
                }).catch((err: any) => {

                  this.showAlert(errorAlert)

                  console.log('err for creation', err);
                  // this.toast.open("Error in adding new Location Configuration ", "Check again", {
                  //   //panelClass: 'error-alert-snackbar',
        
                  //   duration: 5000,
                  //   horizontalPosition: 'right',
                  //   verticalPosition: 'top',
                  //   //   //panelClass: ['blue-snackbar']
                  // })
                })

      }
      else {
        this.showAlert(errorAlert)
        // Swal.fire({
        //   customClass: {
        //     container: 'swal2-container'
        //   },
        //   position: 'center',
        //   icon: 'warning',
        //   title: 'Error in adding Company Configuration',
        //   showCancelButton: true,
        //   allowOutsideClick: false,////prevents outside click
        // })
      }

    }).catch(err => {

      this.showAlert(errorAlert)
      console.log('err for creation', err);
      // this.toast.open("Error in adding new company Configuration ", "Check again", {
      //   //panelClass: 'error-alert-snackbar',

      //   duration: 5000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      //   //   //panelClass: ['blue-snackbar']
      // })
    })
  }


  async createLookUpRdt(item: any, pageNumber: number,tempclient:any){
    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(tempclient, pageNumber);
  
      let checklength: any[] = [];
      if (response != null && response.options && typeof response.options === 'string') {
        checklength = JSON.parse(response.options);
      }
  
      if (response != null && checklength.length < this.maxlength) {
        let newdata: any[] = [];
        if (response.options && typeof response.options === 'string') {
          const parsedData = JSON.parse(response.options);
  
          parsedData.forEach((item: any) => {
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                newdata.push(item[key]);
              }
            }
          });
        }
  
        newdata.unshift(item);
        newdata = newdata.map((data, index) => {
          return { [`L${index + 1}`]: data };
        });
  
        console.log('newdata 11111111 :>> ', newdata);
  
        let Look_data: any = {
          PK: tempclient,
          SK: response.SK,
          options: JSON.stringify(newdata),
        };
  
        const createResponse = await this.api.UpdateMaster(Look_data);
        console.log('createResponse :>> ', createResponse);
      } else if (response == null) {
        let newdata: any[] = [];
        newdata.push(item);
        newdata = newdata.map((data, index) => {
          return { [`L${index + 1}`]: data };
        });
  
        let Look_data = {
          SK: pageNumber,
          PK: tempclient,
          options: JSON.stringify(newdata),
        };
  
        console.log(Look_data);
  
        const createResponse = await this.api.CreateMaster(Look_data);
        console.log(createResponse);
      } else {
        await this.createLookUpRdt(item, pageNumber + 1,tempclient);
      }
    } catch (err) {
      console.log('err :>> ', err);
      // Handle errors appropriately, e.g., show an error message to the user
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
    this.cd.detectChanges();
    this.noticeSwal.fire();
  }




  updateCompany(value: any, key: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Company updated successfully!' : 'Comapany created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };



    //for editing reading Device type fields
    var tempObj:any= []

    if (key == "editCompany") {
      this.allCompanyDetails = {
        companyID: this.createCompanyField.get('companyID')?.value,
        clientID:  this.createCompanyField.get('clientID')?.value,
        companyName: this.createCompanyField.value.companyName,
        companyDesc: this.createCompanyField.value.companydesc,
        enableCompany: this.createCompanyField.value.enableCompany,
        mobile: this.createCompanyField.value.mobile,
        emailID: this.createCompanyField.value.email,
        email: this.createCompanyField.value.email_permission,
        sms: this.createCompanyField.value.sms_permission,
        telegram: this.createCompanyField.value.telegram_permission,
        healthCheck: this.createCompanyField.value.health_permission,
        deviceTimeout: this.createCompanyField.value.device_permission,
        alertTimeout: this.createCompanyField.value.alert_permission,
        telegramID: this.createCompanyField.value.telegramID,
        companyLogo1: this.base64textString_temp,
        companyLogo2: this.base64textString_temp_logo1,
        metadata: JSON.stringify(this.createCompanyField.value.metadata),
        updated: new Date()
      }

      tempObj = {
        PK: `${this.createCompanyField.get('companyID')?.value}#company#main`,
        SK:  1,
        metadata: JSON.stringify(this.allCompanyDetails)
      }
    }
    console.log('after updating', this.allCompanyDetails);

    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items ={
    P1: this.createCompanyField.get('companyID')?.value,
    P2: this.createCompanyField.get('clientID')?.value,
    P3:this.createCompanyField.value.email,
    P4: date
    }

    console.log("Tempobj is here ",tempObj);

    console.log("Item for lookup is ",items);

    this.api.UpdateMaster(tempObj).then(async value => {

      if (value) {
        await this.fetchTimeMachineById(1,items.P1, 'update', items);

        this.datatableConfig = {}

        this.lookup_data_company = []


        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "Edited",
            "Module Name": "Company",
            "Form Name": 'Company',
            "Description": `${items.P1} Company was Edited`,
            "User Id": this.username,
            "Client Id": this.SK_clientID,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }
      
          this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
        }
        catch(error){
          console.log("Error while creating audit trails ",error);
        }






        this.reloadEvent.next(true)

        //alert('Configuration updated successfully');
        // this.toast.open("Company Configuration updated successfully", "", {
        //   //panelClass: 'error-alert-snackbar',

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        //   //   //panelClass: ['blue-snackbar']
        // })

        this.showAlert(successAlert)

        //need to refresh table so updated value will be fetched
        this.addFromService();
        //modal closing based on viewchild
        // this.closeCompany.nativeElement.click();


      }
      else {
        this.showAlert(errorAlert)
        alert('Error in updating Company Configuration');
      }

    }).catch((err: any) => {
      this.showAlert(errorAlert)
      console.log('error for updating', err);
    })
  }

  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#company'+"#lookup";
    console.log("Temp client is ",tempClient);
    console.log("Type of client",typeof tempClient);
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
          await this.fetchTimeMachineById(sk + 1, id, type, item); // Retry with next SK
  
        }
      } else { // If response or listOfItems is null
        Swal.fire({
          position: "top-right",
          icon: "error",
          title: `ID ${id} not found`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  deleteCompany(value: any) {

    this.companySK = value;

    console.log("Delete this :",value);

      this.allCompanyDetails = {
        PK: value+"#company#main",
        SK: 1
      }


      const locationObj = {
        PK:`${this.SK_clientID}#${value}#location#main`,
        SK:1
      }

      console.log("All company Details :",this.allCompanyDetails);

          const date = Math.ceil(((new Date()).getTime()) / 1000)
          const items ={
          P1: value,
          }


          this.api.DeleteMaster(this.allCompanyDetails).then(async value => {

            if (value) {

              await this.fetchTimeMachineById(1,items.P1, 'delete', items);

              await this.api.DeleteMaster(locationObj)

              try{
                const UserDetails = {
                  "User Name": this.username,
                  "Action": "Deleted",
                  "Module Name": "Company",
                  "Form Name": 'Company',
                  "Description": `${items.P1} Company was Deleted`,
                  "User Id": this.username,
                  "Client Id": this.SK_clientID,
                  "created_time": Date.now(),
                  "updated_time": Date.now()
                }
            
                this.auditTrail.mappingAuditTrailData(UserDetails,this.SK_clientID)
              }
              catch(error){
                console.log("Error while creating audit trails ",error);
              }

              this.reloadEvent.next(true)

              Swal.fire(
                'Removed!',
                'Company configuration successfully.',
                'success'
              );
            }

          }).catch(err => {
            console.log('error for deleting', err);
          })
        }
  }

