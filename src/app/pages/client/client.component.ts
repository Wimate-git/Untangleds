import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SafeResourceUrl } from "@angular/platform-browser";
import { getCurrentUser } from "aws-amplify/auth";
import { Observable, catchError, debounceTime, map, of } from "rxjs";
import { APIService } from "src/app/API.service";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { SharedService } from "../shared.service";
import { Config } from "datatables.net";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";



interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
    P5: any;
  };
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  createClientField: UntypedFormGroup;
  showModal: any = false;
  showHeading: any = false;
  errorForUniqueID: any;
  base64textString: any;
  base64textString_temp: any;

  base64textString_logo1: any;
  base64textString_temp_logo1: any;

  allClientDetails: any = {};
  getLoggedUser: any;
  SK_clientID: any;
  loggedUser_Company: any;
  errorForInvalidEmail: any;

  tempUrl: any = '';

  @ViewChild('closeClient') closeClient: any;

  data_temp: any = [];
  listofSK: any = [];
  clientSK: any;

  allPermissions_user: any;

  hideUpdateButton: any = false;
  hideDeleteButton: any = true;

  columnDatatable:any = [];
  clientID: any;
  dataform: any = [];
  lookup_data_user: any = [];
  columnTableData: any = [];
  deviceTableData: any;
  maxlength: number = 500;


  newMacId: string = '';
  activeTabIndex: number = 0;
  subscritionFields: UntypedFormGroup;


    addUnifier:boolean = false
    deviceForm: FormGroup;
    devices: Array<{ deviceName: string; updatedTime: string; unifierID: string }> = [];
    showDeviceForm = false;
    allSubscribed: any = [];
    selectedIdentifier: any;
    scalingtemp: any;
    devicesArray: any = [];
    macdata: any;
    macTableData: any;
    editOperation: boolean = false;
    deviceEdit: boolean = false;
    adminLogin: boolean = false;
    showSubscription: boolean = true;
    uniqueEmail: any = [];
    errorForUniqueEmail: string;
    tempValueHolder: any;
    validEmail: boolean = true;
  editedClientID: any;

  isCollapsed1 = false;

  isLoading:boolean = false

 
  

    async ngOnInit(){


      this.getLoggedUser = this.companyconfig.getLoggedUserDetails()

      this.SK_clientID = this.getLoggedUser.clientID;
      // this.SK_clientID = 'WIMATE_ADMIN';
    
      this.initializeClientFields();
      this.addFromService();
      // this.loading()

      this.showTable()
    }


    onSubmit(event:any){
     
      console.log("Submitted is clicked ",event);
      if(event.type == 'submit' && this.editOperation == false){
        this.createNewClient('')
      }
      else{
        this.updateClient(this.createClientField.value,'editClient')
      }
    }

    
    constructor(private fb: UntypedFormBuilder,private cd:ChangeDetectorRef,private api: APIService,private toast: MatSnackBar,private companyconfig:SharedService){

    }
  

    async showTable() {

      console.log("Show DataTable is called BTW");
  
      this.datatableConfig = {}
      this.lookup_data_user = []
      this.datatableConfig = {
        serverSide: true,
        ajax: (dataTablesParameters:any, callback) => {
          this.datatableConfig = {}
          this.lookup_data_user = []
          this.fetchTMLookupData(1)
            .then((resp:any) => {
              var responseData = resp || []; // Default to an empty array if resp is null
              

              responseData = Array.from(new Set(responseData))
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
   
    
              console.log("Response is in this form ", responseData);
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
            title: 'Client ID', 
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
                <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
                  <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                  <span>${full.P3}</span> <!-- Assuming P3 is the email -->
                </div>
              `;
    
              return `
                <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                  <a href="javascript:;">
                    ${symbolLabel}
                  </a>
                </div>
                ${nameAndEmail}
              `;
            }
          },
          {
            title: 'Client Name', data: 'P2' // Added a new column for phone numbers
          },
          {
            title: 'Mobile', data: 'P3' // Added a new column for email
          },
          {
            title: 'Email', data: 'P4' // Assuming P4 is the role
          },
          {
            title: 'Updated', data: 'P5', render: function (data) {
              const date = new Date(data * 1000);
              return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
            }
          }
        ],
        createdRow: (row, data, dataIndex) => {
          $('td:eq(0)', row).addClass('d-flex align-items-center');
        },
      };
    
    }



  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deleteClient(id);
  }

  create() {
    this.openModal('','')
  }


  edit(P1: any) {
    console.log("Edited username is here ", P1);
    // $('#clientModal').modal('show');
    // this.openModalHelpher(P1)
    this.openModalHelpher(P1);
  }




  // Custom validator to check if start date is before end date
  dateRangeValidator(control: FormGroup) {
    const start = control.get('warrantyStartDate')?.value;
    const end = control.get('warrantyEndDate')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }





  async loading() {
    var table = $('#datatables').DataTable();
    table.destroy();
    this.dataform = [];
    this.lookup_data_user = [];
    this.fetchTMLookupData(1);
}




  async filterListOfClients(response:any){

    if (response && response.items) {
      // Check if response.listOfItems is a string
      if (typeof response.items === 'string') {
        let data = JSON.parse(response.items);
        console.log("d1 =",data)
        if (Array.isArray(data)) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element !== null && element !== undefined) {
              // Extract values from each element and push them to lookup_data_temp1
              const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
              const { P1, P2, P3,P4 ,P5,P6} = element[key]; // Extract values from the nested object
              this.lookup_data_user.push({P1, P2, P3,P4,P5,P6 }); // Push an array containing P1, P2, and P3 values
              console.log("d2 =",this.lookup_data_user)
            } else {
              break;
            }
          }
          //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
          this.lookup_data_user.sort((a:any, b:any) => {
            return b.P5 - a.P5; // Compare P5 values in descending order
          });
          console.log("Lookup sorting",this.lookup_data_user);
          // Continue fetching recursively
        } else {
          console.error('Invalid data format - not an array.');
        }
      } else {
        console.error('response.listOfItems is not a string.');
      }
    } else {
      // Sort the lookup_data_temp1 array based on the third element (P3)
    console.log()
   
      // Extract the IDs and display the datatable
      // this.listofPowerboardIds = this.lookup_data_temp1.map((item: any) => item[0]);
      // this.showDatatable(this.lookup_data_temp1);
      
      console.log("Lookup to be displayed",this.lookup_data_user);
     
      
      // for(let i = 0;i<this.lookup_data_temp1.length;i++){
      //   this.paramsBasedOnRDT.push(this.lookup_data_temp1[i].P2);
      // }
      // this.getDatatable(this.lookup_data_temp1);
    }
  } catch (error: any) {
    console.error('Error:', error);
    // Handle the error as needed
  }


  async fetchTMLookupData(sk: any) {
   
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster("client"+"#lookup", sk)
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
                    this.lookup_data_user.push({ P1, P2, P3, P4, P5, P6 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_user);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_user.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_data_user);
  
                // Continue fetching recursively
                promises.push(this.fetchTMLookupData(sk + 1)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_user)) // Resolve with the final lookup data
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
            console.log("All the users are here", this.lookup_data_user);
            console.log("Lookup to be displayed",this.lookup_data_user);

            var tempLookup

            this.listofSK = this.lookup_data_user.map((item:any)=>item.P1)

            this.uniqueEmail = this.lookup_data_user.map((item:any)=>item.P4)
            if(this.SK_clientID != 'WIMATE_ADMIN'){
              this.lookup_data_user = this.lookup_data_user.filter((item:any)=>item.P1 == this.SK_clientID)
            }   


            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
          
  }


  getTableUser(getData: any,key:any) {

    if(key == 'main'){
      this.uniqueEmail = getData.map((item: { P4: any; }) => item.P4);
    }
   
    console.log("All the unique emails are here",this.uniqueEmail);

    let editButton = 'btn btn-sm btn-primary editclassclient '
    let deleteButton = 'btn btn-sm btn-danger editclassclient ';
  
  
    if (typeof getData !== 'undefined') {
  
      for (let allData = 0; allData < getData.length; allData++) {
        
        
  
          this.dataform.push({
            clientID:getData[allData].P1,
            clientName:getData[allData].P2,
            mobile: getData[allData].P3,
            emailID: getData[allData].P4,
            updated:new Date(getData[allData].P5*1000).toDateString() + " " + new Date(getData[allData].P5*1000).toLocaleTimeString(),
            //grid_details: grid_details
            P6:getData[allData].P6?getData[allData].P6:false
          })
      }
  
    }
    else {
      this.dataform = [];
    }
  
      this.columnTableData.push(
        {
          defaultContent: "<button class='" + editButton + "' data-bs-target='#clientModal' data-bs-toggle='modal'><i class='fa fa-edit'></i></i></button>"
        },
        {
          defaultContent: "<button class='" + deleteButton + "'><i class='fa fa-trash'></i></button>"
        }
  
      )
  
  
    console.log("columnDatatable",this.columnTableData);
  
    console.log("dataform",this.dataform);
  
  
    $('#client_lookup_table').off('click');
    $('#client_lookup_table').on('click', '.editclassclient', function () {
  
      //get row for data
      let tr = $(this).closest('tr');
      let row =_currClassRef.deviceTableData.row(tr);
  
      if (this.className == deleteButton) {
        _currClassRef.deleteClient(row.data());
      }
  
      if (this.className == editButton) {
        _currClassRef.openModalHelpher(row.data());
      }
    })
      this.getLookupTableData(this.dataform,this.columnTableData)
      this.addFromService();
        let _currClassRef = this;
    }
  

    private async getLookupTableData(pbData: any, colData: any): Promise<void> {
      console.log('chk1 tm', pbData);
      console.log('chk2 tm', colData);
      try {
          // Check if DataTable instance exists and destroy it before initializing a new one
          if (this.deviceTableData && ($.fn.DataTable as any).isDataTable('#client_lookup_table')) {
              $('#client_lookup_table').DataTable().destroy(); // Destroy existing DataTable instance
          }
  
          // Initialize DataTable with provided data and columns
          this.deviceTableData = $('#client_lookup_table').DataTable({
              pagingType: 'full_numbers',
              destroy: true, // Ensure DataTable is reinitialized
              lengthChange: true,
              data: pbData,
              ordering: true,
              order: [[5, 'asc']], // Adjust index if needed
              columnDefs: [
                  {
                      type: 'date',
                      targets: 5 // Adjust the column index if necessary
                  },
                  // {
                  //     visible: false, // Ensure P6 is not visible in the table
                  //     targets: -1 // Target the last column if P6 is not part of columnData
                  // }
              ],
              

              columns: colData,
              // rowCallback: (row: any, data: any) => {
              //      // Apply background color only to the first column based on P6 value
              //      if (data && data.P6 == 'expired') {
              //       $(row).find('td:eq(0)').css({
              //           'background-color': '#dc3545', // Set background color if P6 is true
              //           'color': 'white' // Set text color if P6 is true
              //       });
              //   } else if(data && (data.P6 == false || data.P6 == "")){
              //       $(row).find('td:eq(0)').css({
              //           'background-color': '#9BEC00', // Reset background color if P6 is false
              //           'color': 'black' // Reset text color if P6 is false
              //       });
              //   }

              //   else{
              //     $(row).find('td:eq(0)').css({
              //       'background-color': '#FFB534', // Reset background color if P6 is false
              //       'color': 'black' // Reset text color if P6 is false
              //   });
              //   }

              //   if(data && data.clientID == 'WIMATE_ADMIN'){
              //     $(row).find('td:eq(0)').css({
              //       'background-color': '#21209C', // Reset background color if P6 is false
              //       'color': 'white' // Reset text color if P6 is false
              //   });
              //   }
              // }
          });
  
      } catch (error) {
          console.error('Error initializing DataTable:', error);
      }
  }
  


    
    openModalHelpher(getData:any){
      console.log("Data from llokup :",getData);

      
      this.api
        .GetMaster(getData+"#client"+"#main",1)
        .then((result :any) => {
          if (result && result !== undefined) {
            
            console.log("User Manangement details", result);
            
            const tempResult = JSON.parse(result.metadata)

            if(result){
              this.openModal(tempResult, 'edit');
            }
  
          }
        })
        .catch((err: any) => {
          console.log("cant fetch", err);
        });
  
          
    }
  


  addFromService() {

    this.columnDatatable = [];
    this.columnTableData = [];
    this.columnDatatable= [
                  {
                    data: "clientID"
                  },
              
                  {
                    data: "clientDesc"
                  },
                  {
                    data: "mobile"
                  },
                  {
                    data: "emailID"
                  },
                  {
                    data: "updated"
                  }
                ]


    this.columnTableData = [
      {
        data: "clientID"
      },
      {
        data: "clientName"
      },
      {
        data: "mobile"
      },
      {
        data: "emailID"
      },
      {
        data: "updated"
      }
    ]

    // this.checkPermission();

  }

//   checkPermission(){

//     let hasDeviceUpdate = false;
//     let hasDeviceView = false;
//     // let permissionFound = false;

//     for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
//       if (this.allPermissions_user[checkPermission] === 'Client - Update') {
//         hasDeviceUpdate = true;
//         // permissionFound = true;
//       }

//       else if (this.allPermissions_user[checkPermission] === 'Client - View') {
//         hasDeviceView = true;
      
//       }
//     }


//     if (hasDeviceUpdate && hasDeviceView) {
//       this.hideDeleteButton = true;
//     }
//     else if (hasDeviceUpdate) {
//       this.hideDeleteButton = true;
//     } else if (hasDeviceView) {
//       this.hideDeleteButton = false;
//     } else {
//       this.router.navigate(['/404']);
//     }
//   }

  initializeClientFields() {
    this.createClientField = this.fb.group({
      'logo1': [''],
      'logo2': [''],
      'clientID': ['', Validators.required],
      'clientName': ['', Validators.required],
      'customUrl':['', Validators.required],
      'clientdesc': ['', Validators.required],
      'mobile': ['', Validators.required],
      'email_permission': ['', Validators.required],
      'sms_permission': ['', Validators.required],
      'telegram_permission': ['', Validators.required],
      'email': ['', Validators.required],
      'telegramID': ['', Validators.required],
      'enableClient': ['', Validators.required],
      // metadata: this.fb.array([this.createItem()])
    })    

  }


  checkUniqueIdentifier(getID: any) {
    console.log('getID', getID);
    this.errorForUniqueID = '';

    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
       
        if (getID.target.value.toLowerCase() === this.listofSK[uniqueID]) {
            this.errorForUniqueID = "Client ID already exists";
            return; 
        }
    }
    // Case-insensitive comparison for reserved ID
    if (getID.target.value.toLowerCase() === 'wimate_admin') {
        this.errorForUniqueID = "Client ID is reserved";
        return; 
    }
}



  createItem(): UntypedFormGroup {
    return this.fb.group({
      key: new UntypedFormControl('', [Validators.required]),
      value: new UntypedFormControl('', [Validators.required]),
    });
  }

  metadata(): UntypedFormArray {
    return this.createClientField.get('metadata') as UntypedFormArray
  }

  add() {
    this.metadata().push(this.createItem());
  }

  remove(index: any) {
    console.log('remove', index);
    const addFields = this.createClientField.get('metadata') as UntypedFormArray
    addFields.removeAt(index);
  }

//   getDatatable(data_temp: any) {
//     console.log('inside get datatble', data_temp);

//     let clientTable: any = [];
//     let temp = [];

//     if (typeof data_temp !== 'undefined') {
//       for (let allData = 0; allData < data_temp.length; allData++) {

//         for (let formattedDate = 0; formattedDate < data_temp.length; formattedDate++) {

//           temp[formattedDate] = new Date(data_temp[formattedDate].updated).toLocaleString();
//           data_temp[formattedDate].updated = temp[formattedDate];
//         }

//         let clientID = data_temp[allData].clientID;
//         let description = data_temp[allData].clientDesc;
//         let clientName = data_temp[allData].clientName
//         let deviceTimeout = data_temp[allData].deviceTimeout
//         let email = data_temp[allData].email
//         let emailID = data_temp[allData].emailID
//         let enableClient = data_temp[allData].enableClient
//         let healthCheck = data_temp[allData].healthCheck
//         let mobile = data_temp[allData].mobile
//         let sms = data_temp[allData].sms
//         let telegram = data_temp[allData].telegram
//         let alert_permission = data_temp[allData].alertTimeout
//         let telegramID = data_temp[allData].telegramID
//         let logo1 = data_temp[allData].clientLogo1
//         let logo2 = data_temp[allData].clientLogo2
//         let metadata = data_temp[allData].metadata
//         let updated = data_temp[allData].updated;

//         clientTable.push({

//           clientID: clientID,
//           clientDesc: description,
//           clientName: clientName,
//           deviceTimeout: deviceTimeout,
//           email: email,
//           emailID: emailID,
//           enableClient: enableClient,
//           healthCheck: healthCheck,
//           mobile: mobile,
//           sms: sms,
//           telegram: telegram,
//           alert_permission: alert_permission,
//           telegramID: telegramID,
//           logo1: logo1,
//           logo2: logo2,
//           metadata: metadata,
//           updated: updated
//         })
//       }
//     }
//     else {
//       clientTable = [];
//     }

//     //console.log('temp_dates',temp_dates);
//     console.log('user table', clientTable.length);

//     let editButton = 'btn btn-sm btn-primary editdelete '
//     let deleteButton = 'btn btn-sm btn-danger editdelete ';

//     $('#client_configuration').off('click');
//     $('#client_configuration').on('click', '.editdelete', function () {

//       //get row for data
//       let tr = $(this).closest('tr');
//       let row = table.row(tr);

//       if (this.className == deleteButton) {
//         _currClassRef.deleteClient(row.data());

//       }

//       else if (this.className == editButton) {
//         _currClassRef.openModal(row.data(), 'edit');

//       }

//     })

//     if (this.hideDeleteButton === true) {
//       this.columnDatatable.push(
//         {
//           defaultContent: "<button class='" + editButton + "' data-bs-target='#clientModal' data-bs-toggle='modal'><i class='fa fa-edit'></i></button>"
//         },
//         {
//           defaultContent: "<button class='" + deleteButton + "'><i class='fa fa-trash'></i></button>"
//         }
//       )
//     }

//     //view
//     else{
//       this.columnDatatable.push(
//         {
//           defaultContent: "<button class='" + editButton + "' data-bs-target='#clientModal' data-bs-toggle='modal'><i class='fa fa-edit'></i></button>"
//         },


//       )
//     }


//     //this.table = $('#datatables').DataTable({
//     let table = $('#client_configuration').DataTable({
//       "pagingType": "full_numbers",
//       //destroys every time before updating value
//       destroy: true,
//       lengthChange: false,
   
//       data: clientTable,
//       // columns: [
//       //   {
//       //     data: "clientID"
//       //   },

//       //   {
//       //     data: "clientDesc"
//       //   },
//       //   {
//       //     data: "mobile"
//       //   },
//       //   {
//       //     data: "emailID"
//       //   },
//       //   {
//       //     data:"updated"
//       //   },
//       //   {
//       //     defaultContent: "<button class='" + editButton + "' data-bs-target='#clientModal' data-bs-toggle='modal'><i class='fa fa-edit'></i></button>"
//       //   },
//       //   {
//       //     defaultContent: "<button class='" + deleteButton + "'><i class='fa fa-trash'></i></button>"
//       //   }

//       // ]
//       columns: this.columnDatatable
//     });

//     let _currClassRef = this;

//   }


  createNewClient(getNewFields: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Client updated successfully!' : 'Client created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };

    const tempObj = {
      clientID: this.createClientField.value.clientID,
      clientName: this.createClientField.value.clientName,
      customUrl: this.createClientField.value.customUrl,
      clientDesc: this.createClientField.value.clientdesc,
      enableClient: this.createClientField.value.enableClient,
      mobile: this.createClientField.value.mobile,
      emailID: this.createClientField.value.email,
      email: this.createClientField.value.email_permission,
      sms: this.createClientField.value.sms_permission,
      telegram: this.createClientField.value.telegram_permission,
      telegramID: this.createClientField.value.telegramID,
      clientLogo1: this.base64textString_temp,
      clientLogo2: this.base64textString_temp_logo1,
      updated: new Date()
    }

    this.allClientDetails = {
      PK: this.createClientField.value.clientID+"#client"+"#main",
      SK: 1,
      metadata:JSON.stringify(tempObj)
    }

    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items ={
    P1: tempObj.clientID,
    P2: tempObj.clientName,
    P3: tempObj.mobile,
    P4: tempObj.emailID,
    P5: date,
    }


    let customUrl = ''
    if(this.createClientField.value.customUrl != ''){
      customUrl = this.createClientField.value.customUrl
    }


    console.log('newly added Operational Schedule', this.allClientDetails);

    this.api.CreateMaster(this.allClientDetails).then(async (value: any) => {

      //need to refresh table so this is called 
      this.addFromService();

      if (value) {
        //alert('New configuration created successfully');

        await this.createLookUpRdt(items,1,"client"+"#lookup")

        if(customUrl != ''){
          const tempItems = {
            PK: customUrl,
            SK: 1,
            metadata: JSON.stringify({clientID:this.allClientDetails.PK, clientLogo1: this.base64textString_temp,
              clientLogo2: this.base64textString_temp_logo1,})
          }
          await this.api.CreateMaster(tempItems)
        }




        this.showAlert(successAlert)

        this.reloadEvent.next(true);

        // this.toast.open("New Client Configuration created successfully", " ", {
        //   //panelClass: 'error-alert-snackbar',

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        // })

        // this.closeClient.nativeElement.click();


      }
      else {
        this.showAlert(errorAlert)
        // Swal.fire({
        //   customClass: {
        //     container: 'swal2-container'
        //   },
        //   position: 'center',
        //   icon: 'warning',
        //   title: 'Error in adding Client Configuration',
        //   showCancelButton: true,
        //   allowOutsideClick: false,////prevents outside click
        // })
        //alert('Error in adding User Configuration');
      }

    }).catch((err: any) => {
      console.log('err for creation', err);
      this.showAlert(errorAlert)
      // this.toast.open("Error in adding new client Configuration ", "Check again", {
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



  updateClient(value: any, key: any) {


    let customUrl = ''
    if(this.createClientField.value.customUrl != ''){
      customUrl = this.createClientField.value.customUrl
    }

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Company updated successfully!' : 'Company created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };

    console.log('passing value on update', value);

    console.log('updating User fields', this.createClientField.value);

    //for editing reading Device type fields

    let tempObj;

    if (key == "editClient") {

      tempObj = {
        clientID: this.editedClientID,
        clientName: this.createClientField.value.clientName,
        customUrl:this.createClientField.value.customUrl,
        clientDesc: this.createClientField.value.clientdesc,
        enableClient: this.createClientField.value.enableClient,
        mobile: this.createClientField.value.mobile,
        emailID: this.createClientField.value.email,
        email: this.createClientField.value.email_permission,
        sms: this.createClientField.value.sms_permission,
        telegram: this.createClientField.value.telegram_permission,
        telegramID: this.createClientField.value.telegramID,
        clientLogo1: this.base64textString_temp,
        clientLogo2: this.base64textString_temp_logo1,
        updated: new Date()
      }
  
      this.allClientDetails = {
        PK: this.editedClientID+"#client"+"#main",
        SK: 1,
        metadata:JSON.stringify(tempObj)
      }
  
     
    }

    console.log("Temp OBj is here ",tempObj);

    console.log('after updating', this.allClientDetails);

    const date = Math.ceil(((new Date()).getTime()) / 1000)
      const items ={
      P1: tempObj?.clientID,
      P2: tempObj?.clientName,
      P3: tempObj?.mobile,
      P4: tempObj?.emailID,
      P5: date,
      }


    this.api.UpdateMaster(this.allClientDetails).then(async (value: any) => {

      if (value) {

        await this.fetchTimeMachineById(1,items.P1, 'update', items);

           //URL update and delete logi is here 
           if(this.tempUrl != customUrl){
            const tempItems = {
              PK: this.tempUrl,
              SK: 1
            }
  
            if(this.tempUrl){
              await this.api.DeleteMaster(tempItems)
            }
            
  
  
            if(customUrl != ''){
              const tempItems = {
                PK: customUrl,
                SK: 1,
                metadata: JSON.stringify({clientID:this.allClientDetails.PK, clientLogo1: this.base64textString_temp,
                  clientLogo2: this.base64textString_temp_logo1,})
              }
              await this.api.CreateMaster(tempItems)
            }
  
  
          }
          else{
            if(customUrl != ''){
              const tempItems = {
                PK: customUrl,
                SK: 1,
                metadata: JSON.stringify({clientID:this.allClientDetails.PK, clientLogo1: this.base64textString_temp,
                  clientLogo2: this.base64textString_temp_logo1,})
              }
              await this.api.UpdateMaster(tempItems)
            }
          }
  

        this.showAlert(successAlert)

        





        this.reloadEvent.next(true)

        //alert('Configuration updated successfully');
        // this.toast.open("Client Configuration updated successfully", "", {
        //   //panelClass: 'error-alert-snackbar',

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        //   //   //panelClass: ['blue-snackbar']
        // })

        //need to refresh table so updated value will be fetched
        this.addFromService();
        //modal closing based on viewchild
        // this.closeClient.nativeElement.click();


      }
      else {
        this.showAlert(errorAlert)
        alert('Error in updating Client Configuration');
      }

    }).catch((err: any) => {
      this.showAlert(errorAlert)
      console.log('error for updating', err);
    })


  }


  async deleteWholeclient(sk: any, id: any, type: any, item: any){
    try {
      // Construct the deletion request
      const deletionRequest = {
        PK: id+"#client", // PK of the item to delete
        SK: sk, // SK of the item to delete
      };
    
      // Make the deletion request to the API
      await this.api.DeleteMaster(item);
    
      // Optionally, you can handle success or show a message
      console.log('Item deleted successfully.');
    
    } catch (error) {
      // Handle errors, e.g., network failure, API errors, etc.
      console.error('Error:', error);
    }
  }



  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = 'client'+"#lookup";
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





  deleteClient(value: any) {

    this.clientSK = value;

    console.log('deleteuser is called', value);

    if (this.clientSK) {

      this.allClientDetails = {
        PK: value+"#client#main",
        SK: 1
      }


        const date = Math.ceil(((new Date()).getTime()) / 1000)
        const items ={
        P1: value,
        }

        
        try{
          this.api.DeleteMaster(this.allClientDetails).then(async (value: any) => {

            this.addFromService();

            if (value) {

              // await this.deleteWholeclient(1,items.P1, 'delete', items);

              await this.fetchTimeMachineById(1, items.P1, 'delete', items);

              this.reloadEvent.next(true)

            
            }
        })
        }
        catch(err){
          console.log("Deleting client error ",err);
        }
        
       
    }

  }






  openModal(getValues: any, getKey: any) {

    this.devicesArray = []
        this.tempUrl = ''
    this.errorForUniqueEmail = ''

    this.base64textString_temp = getValues.clientLogo1;
    this.base64textString_temp_logo1 =getValues.clientLogo2;

    this.tempValueHolder = {};
    
    if (getKey == 'edit' || getKey == '') {
      let temp = "";
      //console.log('temp',temp);
      if (getValues == "") {

        this.editOperation = false

        this.showHeading = true;
        this.showModal = false;
        this.errorForUniqueID = '';
        this.errorForInvalidEmail = '';
        this.errorForUniqueEmail = '';
        this.base64textString_temp = temp;
        this.createClientField.get('clientID')?.enable();
        this.createClientField = this.fb.group({
          'logo1': getValues.logo1,
          'logo2': getValues.logo2,
          'clientID': getValues.clientID,
          'clientName': getValues.clientName,
          'customUrl':getValues.customUrl,
          'clientdesc': getValues.clientDesc,
          'mobile': getValues.mobile,
          'email_permission': getValues.email,
          'sms_permission': getValues.sms,
          'telegram_permission': getValues.telegram,
          'enableClient': getValues.enableClient,
          'email': getValues.email,
          'telegramID': getValues.telegramID,
          // 'metadata': this.fb.array([])
        })

      }
      //updated device congifuration(update)
      else if (getValues) {

        this.editOperation = true


        console.log("All the values are here to be polpulated ",getValues);

        // const tempParsemetadata = JSON.parse(getValues.metadata)

      

        this.tempValueHolder = getValues

        // for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
        //   if (this.allPermissions_user[checkPermission] === 'Client - Update') {
        //     this.hideUpdateButton = false;
        //     break;
        //   }

        //   else if (this.allPermissions_user[checkPermission] === 'Client - View') {
        //     this.hideUpdateButton = true;
        //   }
        // }
        this.showHeading = false;
        this.showModal = true;
        this.base64textString_temp = getValues.clientLogo1;
        this.base64textString_temp_logo1 =getValues.clientLogo2;
        this.errorForUniqueID = '';
        this.errorForInvalidEmail = '';
        let parsed = '';
        this.createClientField.get('clientID')?.disable();
        // if (getValues.metadata) {
        //   parsed = JSON.parse(getValues.metadata);
        // }

        // if(getValues.subscription){
        //   const temp = JSON.parse(getValues.subscription);
        //   this.allSubscribed = temp
        //   console.log("Get values subscription:",this.allSubscribed);
        // }

        this.tempUrl = getValues.customUrl

        this.editedClientID = getValues.clientID

        this.createClientField = this.fb.group({
          'logo1': getValues.logo1,
          'logo2': getValues.logo2,
          'clientID': { value: getValues.clientID, disabled: true },
          'clientName': getValues.clientName,
          'customUrl':getValues.customUrl,
          'clientdesc': getValues.clientDesc,
          'mobile': getValues.mobile,
          'email_permission': getValues.email,
          'sms_permission': getValues.sms,
          'telegram_permission': getValues.telegram,
          'email': getValues.emailID,
          'telegramID': getValues.telegramID,
          'enableClient': getValues.enableClient,
          // 'metadata': this.updateItem(parsed)
        })
      }
    }
    this.cd.detectChanges()
  }

  // updateItem(getValues: any): UntypedFormArray {
  //   //console.log('get', getValues);
  //   this.metadata().clear();
  //   for (let i = 0; i < getValues.length; i++) {
  //     this.metadata().push(this.fb.group({
  //       key: getValues[i].key,
  //       value: getValues[i].value,
  //     }));
  //   }

  //   return this.metadata();

  // }


  onFileChange(getFile: any) {
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

        reader.onload = this.handleKBconversion.bind(this);

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

  onFileChange1(getFile: any) {
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

        reader.onload = this.handleKBconversion1.bind(this);

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

  handleKBconversion(readerEvt: any) {
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    let files = this.base64textString_temp.target.files;
    let file = files[0];
    let fileExtension = file.type;

    let length = this.base64textString.length;

    let y = 1;
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


  handleKBconversion1(readerEvt: any) {
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
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  checkMail(event: any) {
    console.log('event', event);
    let Regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    this.errorForInvalidEmail = '';

    this.validEmail = false;

    console.log("Values of tempholder is",this.tempValueHolder);

    this.errorForUniqueEmail = '';
    if (Regex.test(event.target.value) == false) {
      this.errorForInvalidEmail = "Invalid Email Address";
      return;
    }
    if(this.uniqueEmail.includes(event.target.value) == true && this.tempValueHolder.emailID != event.target.value){
      this.errorForUniqueEmail = "Duplicate Email Address Found";
      return;
    }
    this.validEmail = true;
  }


}

