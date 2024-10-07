import { ChangeDetectorRef, Component, EventEmitter, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Config } from 'datatables.net';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';


interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
  };
}

@Component({
  selector: 'app-permission2',
  templateUrl: './permission2.component.html',
  styleUrl: './permission2.component.scss'
})
export class Permission2Component {
  hideDeleteButton:boolean = true;
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();



  lookup_data_temp1: any = [];
  deviceTableData: any = [];
  columnTableData: any = [];
  lookup_data_temp3: any=[];
  formList: any[]=[];
  lookup_data_temp2: any=[];
  listofPowerboardIds: any[]=[];
  listofMagicboardIds: any[]=[];
  selectednewModules: any[] = [];
  selectedViewModules: any[] = [];
  selectedUpdateModules: any[] = [];
  clientID: any;
  maxlength: number = 500;
  dataform: any = [];
  reportsAdvanced:any=[{"text":"Mail Permissions","value":"mail_permission"},{"text":"All Reports ID Access ","value":"All_TM"}]

  isCheckboxSelected:boolean;
  form1: FormGroup;
  form2: FormGroup;
  form3:FormGroup
  form:FormGroup;
  createPermissionField: UntypedFormGroup;
  allPermissionDetails: any = {};
  data_temp: any = [];
  checkedItems: { [key: string]: boolean } = {};
  errorForUniqueID: any;
  listofSK: any = [];
  userSK: any;
  showModal: any = false;
  showHeading: any = false;
  dropdownSettings: IDropdownSettings = {};
  modulesArray: FormArray; 
  allModuleValues: any = [];
  allReportValues: any = [];

  //client ID as SK,PK is permissionID
  getLoggedUser: any;
  SK_clientID: any;

  selectedItems: any = [];
  selectedReports: any = [];
  allPermissions_user: any;
  dateTypeList:any[] =[]
  hideUpdateButton: any = false;

  dreamBoardIDs: any[]=[];

  modulesList: any[]= [
  
    { value1: "Device - View", text: 'Device ' ,id:1 , value2: "Device - Update", value3: "Device - xlsx View" ,value4: "Device - xlsx Update"},
    { value1: "Reading Device Type - View", text: 'Reading Device Type' ,id:1,value2: "Reading Device Type - Update", value3: "Reading Device Type - xlsx View",value4: "Reading Device Type - xlsx Update"},
    { value1: "Writing Device Type - View", text: 'Writing Device Type' ,id:1, value2:  "Writing Device Type - Update", value3: "Writing Device Type - xlsx View", value4:  "Writing Device Type - xlsx Update"},
    { value1: "Operational Schedule - View", text: 'Operational Schedule',id:1,value2:"Operational Schedule - Update" , value3: "Operational Schedule - xlsx View",value4:  "Operational Schedule - xlsx Update"},
    { value1: "User - View", text: 'User',id:2,value2: "User - Update",value3: "User - xlsx View",value4:  "User - xlsx Update" },
    { value1: "Permission - View", text: 'Permission',id:2,value2: "Permission - Update", value3: "Permission - xlsx View",value4:"Permission - xlsx Update"},
    { value1: "Company - View", text: 'Company',id:3,value2:"Company - Update",value3: "Company - xlsx View",value4: "Company - xlsx Update"},
    { value1: "Client - View", text: 'Client' ,id:3,value2:"Client - Update",value3: "Client - xlsx View",value4: "Client - xlsx Update"},
    { value1: "Location - View", text: 'Location',id:5,value2: "Location - Update", value3: "Location - xlsx View", value4:"Location - xlsx Update" },
    { value1: "Design Parameter - View", text: 'Design Parameter',id:1,value2:  "Design Parameter - Update",value3: "Design Parameter - xlsx View",value4: "Design Parameter - xlsx Update" },
    { value1: "Design Template - View", text: 'Design Template' ,id:1,value2:"Design Template - Update",value3: "Design Template - xlsx View", value4:  "Design Template - xlsx Update"},
    { value1: "Powerboard - View", text: 'Powerboard',id:4,value2:"Powerboard - Update", value3: "Powerboard - xlsx View",value4:  "Powerboard - xlsx Update"},
    { value1: "Dreamboard - View", text: 'Dreamboard',id:4,value2:"Dreamboard - Update", value3: "Dreamboard - xlsx View",value4:  "Dreamboard - xlsx Update"},
    { value1: "Fusion - View", text: 'Fusion',id:4,value2:"Fusion - Update", value3: "Fusion - xlsx View",value4:  "Fusion - xlsx Update"},
    { value1: "Magicboard - View", text: 'Magicboard' ,id:4,value2: "Magicboard - Update" , value3: "Magicboard - xlsx View", value4:  "Magicboard - xlsx Update"},
    { value1: "Mqtt - View", text: 'Mqtt',id:1 ,value2:  "Mqtt - Update",value3: "Mqtt - xlsx View",value4:  "Mqtt - xlsx Update"},
    { value1: "TimeMachine - View", text: 'TimeMachine',id:4 ,value2:  "TimeMachine - Update",value3: "TimeMachine - xlsx View",value4:  "TimeMachine - xlsx Update"},
  


  ]
  
  reportTypeList: any = [

  ]
  columnDatatable: any = [];

  @ViewChild("closePermission") closePermission: any;
  
  reportsArray: any = [];
  selectedValues: any = [];

  modalOpened: any = false;
  lookup_data_user: any = [];

  constructor(
    private fb: FormBuilder,
    private api: APIService,
    private toast: MatSnackBar,
    private permissionConfiguration: SharedService,
    private getDiagnostics: SharedService,
    private router: Router,
    private fb1: FormBuilder,
    private fb2: FormBuilder,
    private cd:ChangeDetectorRef
  ) {
  }

  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deletePermission(id);
  }

  create() {
    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
  }


  edit(P1: any) {
    console.log("Edited username is here ", P1);
    $('#permissionModal').modal('show');
    this.openModalHelpher(P1)
  }



  loading(){

    var table = $('#datatables').DataTable();

    table.destroy();
    this.dataform = [];  
    this.lookup_data_temp1 = [];
    this.fetchTMData(1);
  
  }

  ngOnInit() {

    this.getLoggedUser = this.getDiagnostics.getLoggedUserDetails()

    this.SK_clientID = this.getLoggedUser.clientID;

    this.initializePermissionFields();

    this.fetchTMData(1)

    this.addFromService()

    this.showTable()
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
        this.fetchUserLookupdata(1)
          .then((resp:any) => {
            const responseData = resp || []; // Default to an empty array if resp is null
  
            // Prepare the response structure expected by DataTables
            callback({
              draw: dataTablesParameters.draw, // Echo the draw parameter
              recordsTotal: responseData.length, // Total number of records
              recordsFiltered: responseData.length, // Filtered records (you may want to adjust this)
              data: responseData // The actual data array
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
          title: 'ID', 
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
          title: 'Label', data: 'P2' // Added a new column for phone numbers
        },
        {
          title: 'Updated', data: 'P3', render: function (data) {
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


  fetchUserLookupdata(sk:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#permission" + "#lookup", sk)
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
                    const { P1, P2, P3} = element[key]; // Extract values from the nested object
                    this.lookup_data_user.push({ P1, P2, P3, }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_user);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_user.sort((a: { P3: number; }, b: { P3: number; }) => b.P3 - a.P3);
                console.log("Lookup sorting", this.lookup_data_user);
  
                // Continue fetching recursively
                promises.push(this.fetchUserLookupdata(sk + 1)); // Store the promise for the recursive call
                
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


            this.listofSK = this.lookup_data_user.map((item:any)=>item.P1);

            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }
    

  onCheckboxChange(event: any, arrayName: string, value: any) {
    const formArray = this.form1.get(arrayName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(value));
      this.checkedItems[value] = true;
    } else {
      let i: number = 0;
      formArray.controls.forEach((item: any) => {
        if (item.value === value) {
          formArray.removeAt(i);
          this.checkedItems[value] = false;
          return;
        }
        i++;
      });
    }
  }

  selectAll(event: any, arrayName: string, dataArray: any[]) {
    const isChecked = event.target.checked;

    dataArray.forEach((item) => {
      item.selected = isChecked;
      console.log("is checked giving me", isChecked);
    });

    const formArray = this.form1.get(arrayName) as FormArray;

    if (isChecked) {
      dataArray.forEach((item) => {
        if (!formArray.value.includes(item.value)) {
          formArray.push(new FormControl(item.value));
        }
      });
    } else {
      const valuesToRemove = dataArray.map((item) => item.value);
      formArray.controls.forEach((control, index) => {
        if (valuesToRemove.includes(control.value)) {
          formArray.removeAt(index);
        }
      });
    }
  }



  initializePermissionFields() {
    this.createPermissionField = this.fb.group({
      permissionID: ["", Validators.required],
      label: ["", Validators.required],
      description: ["", Validators.required],
      report_type: [[""], Validators.required],
      time: ["", Validators.required],
      no_of_request: ["", Validators.required],
      no_of_records: ["", Validators.required],
      size: ["", Validators.required],
      settings: ["", Validators.required],
      user_grade: ["", Validators.required],
      api_enable: [false,Validators.required],
      //'allowOtherClient':'',
      formList: [[], Validators.required],
      dreamBoardIDs:[[],Validators.required]
    });
  }


  onCheckboxChange1(event: any, arrayName: string, value: any) {
    const formArray = this.form2.get(arrayName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((item: any) => {
        if (item.value == value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  selectAll1(event: any, arrayName: string, dataArray: any[]) {
    const isChecked = event.target.checked;

    dataArray.forEach((item) => {
      item.selected = isChecked;
    });

    const formArray = this.form2.get(arrayName) as FormArray;

    if (isChecked) {
      dataArray.forEach((item) => {
        if (!formArray.value.includes(item.value)) {
          formArray.push(new FormControl(item.value));
        }
      });
    } else {
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }
    }
  }

  openModal(getValues: any, getKey: any) {
    console.log("getvalues inside openModal", getValues);
    this.modalOpened = true;

    

    if (getKey == "edit" || getKey == "") {
      if (getValues == "") {
        this.showHeading = true;
        this.showModal = false;
        this.errorForUniqueID = "";
        this.createPermissionField.get("permissionID")?.enable();

        this.createPermissionField = this.fb.group({
          permissionID: getValues.permissionid,
          label: getValues.label,
          description: getValues.description,
          modules: getValues.modules,
          api_enable: getValues.api_enable,
          time: getValues.time,
          no_of_request: getValues.numberOfRequest,
          no_of_records: getValues.numberOfRecords,
          size: getValues.size,
          settings: getValues.settings,
          user_grade: getValues.user_grade,
          formList: [[]],
          dreamBoardIDs:[[]]
          //'allowOtherClient':getValues.allowOtherClient
        });
        // Call read back function to check checkboxes
      }
      //updated device congifuration(update)
      else if (getValues) {
        
        this.showModal = true
      
        this.createPermissionField = this.fb.group({
          permissionID: getValues.permissionid,
          label: getValues.label,
          description: getValues.description,
          api_enable: getValues.api_enable,
          time: getValues.time,
          no_of_request: getValues.numberOfRequest,
          no_of_records: getValues.numberOfRecords,
          size: getValues.size,
          user_grade: getValues.user_grade,
          formList:[getValues.formList],
          settings: getValues.other_settings,
          dreamBoardIDs:getValues && getValues.dreamBoardIDs?[getValues.dreamBoardIDs]:[]
        });

        this.cd.detectChanges()

        console.log("after value is assigned", this.createPermissionField);


      }
    }
  }


  async addFromService() {
    try{
      await this.api.GetMaster(this.SK_clientID+"#dynamic_form#lookup",1).then((result:any)=>{
        if(result){
          const helpherObj = JSON.parse(result.options)

          this.formList = helpherObj.map((item:any)=>item[0])
        }
      })
    }
    catch(err){
      console.log("Error fetching the dynamic form data ",err);
    }
   
  }






  checkUniqueIdentifier(getID: any) {
    console.log("getID", getID.target.value);
    this.errorForUniqueID = "";
    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
      if (getID.target.value == this.listofSK[uniqueID]) {
        this.errorForUniqueID = "Permission ID already exists";
      }
    }
  }

  createNewPermission(key: any) {
    
    console.log("After Submit this.createPermissionField",this.createPermissionField.value)
    console.log("After Submit form",this.form)

    this.allPermissionDetails = {
      //permissionID: this.createPermissionField.value.permissionID,
      Label: this.createPermissionField.value.label,
      Description: this.createPermissionField.value.description,
      api_enable: this.createPermissionField.value.api_enable,
      Time: this.createPermissionField.value.time,
      formIDs:this.createPermissionField.value.formList,
      dreamBoardIDs:this.createPermissionField.value.dreamBoardIDs,
      numberOfRequest: this.createPermissionField.value.no_of_request,
      numberOfRecords: this.createPermissionField.value.no_of_records,
      size: this.createPermissionField.value.size,
      user_grade: this.createPermissionField.value.user_grade,
      other_settings: JSON.stringify(this.createPermissionField.value.settings),
    };


    const tempObj = {
      PK:this.SK_clientID+"#permission#"+this.createPermissionField.value.permissionID+"#main",
      SK:1,
      metadata:JSON.stringify(this.allPermissionDetails)
    }

    console.log("Temp obj is here ",tempObj);

    this.api
      .CreateMaster(tempObj)
      .then(async (value) => {
        //need to refresh table so this is called


          const date = Math.ceil(((new Date()).getTime()) / 1000)
          const items ={
          P1: this.createPermissionField.value.permissionID,
          P2: this.allPermissionDetails.Label,
          P3: date
          }

    console.log("Lookup date items",items);

        if (value) {

          await this.createLookUpRdt(items,1,this.SK_clientID+"#permission#lookup")


          this.reloadEvent.next(true)

          this.toast.open(
            "New Permission configuration created successfully",
            " ",
            {
              //panelClass: 'error-alert-snackbar',

              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top",
            }
          );

          this.closePermission.nativeElement.click();
        } else {
          alert("Error in adding Permission Configuration");
        }
      })
      .catch((err) => {
        console.log("err for creation", err);
        this.toast.open(
          "Error in adding new Permission Configuration ",
          "Check again",
          {
            //panelClass: 'error-alert-snackbar',

            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "top",
            //   //panelClass: ['blue-snackbar']
          }
        );
      });
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





  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#permission'+"#lookup";
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






  updatePermission(value: any, key: any) {
    this.checkedItems;

    let tempObj:any
    //for editing reading Device type fields
    if (key == "editPermission") {
      this.allPermissionDetails = {
        //permissionID: this.createPermissionField.value.permissionID,
        Label: this.createPermissionField.value.label,
        Description: this.createPermissionField.value.description,
        api_enable: this.createPermissionField.value.api_enable,
        Time: this.createPermissionField.value.time,
        numberOfRequest: this.createPermissionField.value.no_of_request,
        numberOfRecords: this.createPermissionField.value.no_of_records,
        size: this.createPermissionField.value.size,
        user_grade: this.createPermissionField.value.user_grade,
        formIDs:this.createPermissionField.value.formList,
        dreamBoardIDs:this.createPermissionField.value.dreamBoardIDs,
        other_settings: JSON.stringify(this.createPermissionField.value.settings),
        //allowOtherClient:this.createPermissionField.value.allowOtherClient
      };

      tempObj = {
        PK: this.SK_clientID+'#permission#'+this.createPermissionField.value.permissionID+"#main",
        SK: 1,
        metadata:JSON.stringify(this.allPermissionDetails)
      }

    }
    console.log("after updating", this.allPermissionDetails);

    this.api
      .UpdateMaster(tempObj)
      .then(async(value) => {



      const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items ={
    P1: this.createPermissionField.value.permissionID,
    P2: this.allPermissionDetails.Label,
    P3: date
    }

    console.log("Lookup date items",items);

        this.addFromService();

        if (value) {

          await this.fetchTimeMachineById(1,this.createPermissionField.value.permissionID, 'update', items);

          this.reloadEvent.next(true)
          
          //alert('Configuration updated successfully');
          this.toast.open("User Permission updated successfully", "", {
            //panelClass: 'error-alert-snackbar',

            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top",
            //   //panelClass: ['blue-snackbar']
          });

          //need to refresh table so updated value will be fetched
          this.addFromService();
          //modal closing based on viewchild
          this.closePermission.nativeElement.click();
        } else {
          alert("Error in updating user permission");
        }
      })
      .catch((err) => {
        console.log("error for updating", err);
      });
  }

  deletePermission(value: any) {
    this.userSK = value;
    console.log("deleteuser is called", value);

    if (this.userSK) {
      this.allPermissionDetails = {
        PK: this.SK_clientID+"#permission#"+this.userSK+"#main",
        SK: 1,
      };

      console.log("before deleting user", this.allPermissionDetails);

          this.api
            .DeleteMaster(this.allPermissionDetails)
            .then(async(value) => {
              // this.addFromService();

              const date = Math.ceil(((new Date()).getTime()) / 1000)
              const items ={
              P1: this.userSK,
              P3: date
              }


              if (value) {
                //console.log('confirmButtonText', value);
                await this.fetchTimeMachineById(1,items.P1, 'delete', items);


                this.reloadEvent.next(true)
              }
      });
    }
  }

  // readBackData1(selectedValues: any[], formArrayNames: string[]) {
  //   const uniqueSelectedValues = Array.from(new Set(selectedValues));

  //   for (const formArrayName of formArrayNames) {
  //     const formArray = this.form1.get(formArrayName) as FormArray;
  //     const selectedSet = new Set();

  //     if (uniqueSelectedValues.includes("Select All")) {
  //       formArray.clear();
  //       for (const category of this.Data) {
  //         for (const item of category.items) {
  //           this.checkedItems[item.value] = true;
  //           selectedSet.add(item.value);
  //           formArray.push(new FormControl(item.value));
  //         }
  //       }
  //       selectedSet.delete("Select All");
  //     } else {
  //       for (const category of this.Data) {
  //         if (category.items) {
  //           // Null check for category.items
  //           for (const item of category.items) {
  //             if (uniqueSelectedValues.includes(item.value)) {
  //               this.checkedItems[item.value] = true;
  //               selectedSet.add(item.value);
  //             } else {
  //               this.checkedItems[item.value] = false;
  //             }
  //           }
  //         }
  //       }
  //       formArray.clear();
  //       selectedSet.forEach((value) => {
  //         formArray.push(new FormControl(value));
  //       });
  //     }
  //   }

  //   // Update the Modules control in the form
  //   for (const formArrayName of formArrayNames) {
  //     const selectedItems: any[] = [];

  //     // Find the category that matches the formArrayName
  //     const matchingCategory = this.Data.find(
  //       (category) => category.text === formArrayName
  //     );

  //     if (matchingCategory && matchingCategory.items) {
  //       // Null check for matchingCategory.items
  //       // Filter the items based on selectedValues
  //       matchingCategory.items.forEach((item: { value: any }) => {
  //         if (selectedValues.includes(item.value)) {
  //           selectedItems.push(item.value);
  //         }
  //       });

  //       // Update the FormArray's value
  //       const formArray = this.form1.get(formArrayName) as FormArray;
  //       formArray.patchValue(selectedItems);
  //     }
  //   }
  // }

  // Data2: Array<any> = [
   
  //   { value: "Schedule Hour", text: "Schedule Hour" },
  //   {  text: "Schedule Day" },
  // ];
  // readBackData2(selectedValues: any[]) {
  //   const formArray = this.form2.get("reportsArray") as FormArray;
  //   formArray.clear();

  //   if (selectedValues.includes("Select All")) {
  //     for (const item of this.Data2) {
  //       this.checkedItems[item.value] = true;
  //       formArray.push(new FormControl(item.value));
  //     }
  //   } else {
  //     for (const item of this.Data2) {
  //       if (selectedValues.includes(item.value)) {
  //         this.checkedItems[item.value] = true;
  //         formArray.push(new FormControl(item.value));
  //       } else {
  //         this.checkedItems[item.value] = false;
  //       }
  //     }
  //   }

  //   this.form2.patchValue({
  //     Report_type: selectedValues,
  //   });
  // }
 
  onSubmit() {
     const selectedViewModules = this.form.value.modules
    .filter((module: { view: any; }) => module.view)
    .map((module: { value1: any;  }) => (
       module.value1

    ));

  const selectedUpdateModules = this.form.value.modules
    .filter((module: { update: any; }) => module.update)
    .map((module: { value2: any; }) => (
       module.value2
    ));
    const selectedXlsxViewModules = this.form.value.modules
    .filter((module: { xlsxView: any; }) => module.xlsxView)
    .map((module: { value3: any; }) => (module.value3));

  const selectedXlsxUpdateModules = this.form.value.modules
    .filter((module: { xlsxUpdate: any; }) => module.xlsxUpdate)
    .map((module: { value4: any; }) => (
    module.value4
    ));
  
    const selectedModules = [...selectedViewModules, ...selectedUpdateModules,...selectedXlsxViewModules, ...selectedXlsxUpdateModules];
  
    console.log('Selected Modules:', selectedModules);


    const selectedReportParmeter = this.form3.value.reports
    .filter((report: { parameter: any; }) => report.parameter)
    .map((report: { value1: any;  }) => (
       report.value1
    ));

  const selectedReportHour = this.form3.value.reports
    .filter((report: { hour: any; }) => report.hour)
    .map((report: { value2: any; }) => (
      report.value2
    ));
    const selectedReportDay = this.form3.value.reports
    .filter((report: { day: any; }) => report.day)
    .map((report: { value3: any; }) => (report.value3));
    const selectedReports = [...selectedReportParmeter,...selectedReportHour,...selectedReportDay];
    console.log(selectedReports)
  }
 
 
  // onViewCheckboxChange(event: any, module: any) {
  //   if (event.target.checked) {
  //     const existingModule = this.selectedViewModules.find((m: any) => m.id === module.id);
  //     if (!existingModule) {
  //       this.selectedViewModules.push({ id: module.id, value: module.value });
  //     }
  //   } else {
  //     const index = this.selectedViewModules.findIndex((m: any) => m.id === module.id);
  //     if (index !== -1) {
  //       this.selectedViewModules.splice(index, 1);
  //     }
  //   }
  // }

  // onUpdateCheckboxChange(event: any, module: any) {
  //   if (event.target.checked) {
  //     const existingModule = this.selectedUpdateModules.find((m: any) => m.id === module.id);
  //     if (!existingModule) {
  //       this.selectedUpdateModules.push({ id: module.id, value: module.value });
  //     }
  //   } else {
  //     const index = this.selectedUpdateModules.findIndex((m: any) => m.id === module.id);
  //     if (index !== -1) {
  //       this.selectedUpdateModules.splice(index, 1);
  //     }
  //   }
  // }
  getModuleControls(): AbstractControl[] {
    return (this.form.get('modules') as FormArray).controls;
  }
  getReportsControls(): FormGroup[] {
    return (this.form3.get('reports') as FormArray).controls as FormGroup[];
  }

  toggleSelectAll(moduleId: number) {
    const modulesFormArray = this.form.get('modules') as FormArray;
    const selectAllValue = this.form.get('selectAll')?.value;
  
    modulesFormArray.controls.forEach((moduleControl) => {
      if (moduleControl.get('id')?.value === moduleId) {
        moduleControl.patchValue({
          view: selectAllValue,
          update: selectAllValue,
          xlsxView: selectAllValue,
          xlsxUpdate: selectAllValue
        });
      }
    });
  }
  toggleSelectAll1(moduleId: number) {
    const reportsFormArray = this.form3.get('reports') as FormArray;
    const selectAllValue = this.form3.get('selectAll1')?.value;
  
    reportsFormArray.controls.forEach((reportControl) => {
      if (reportControl.get('id')?.value === moduleId) {
        reportControl.patchValue({
          parameter: selectAllValue,
          hour: selectAllValue,
          day: selectAllValue,
          
        });
      }
    });
  }
  // get modulesFormArray(): FormArray {
  //   return this.form.get('modules') as FormArray;
  // }

  // addModuleCheckboxes() {
  //   this.modulesList.forEach(() => {
  //     const control = new FormGroup({
  //       view: new FormControl(false),
  //       update: new FormControl(false),
  //     });
  //     this.modulesFormArray.push(control);
  //   });
  // }

  // getModuleName(index: number): string {
  //   const module = this.modulesList[index];
  //   if (this.modulesFormArray.at(index).get('view')?.value && this.modulesFormArray.at(index).get('update')?.value) {
  //     return `${module.text} - View & Update`;
  //   } else if (this.modulesFormArray.at(index).get('view')?.value) {
  //     return `${module.text} - View`;
  //   } else if (this.modulesFormArray.at(index).get('update')?.value) {
  //     return `${module.text} - Update`;
  //   }
  //   return module.text;
  // }

  // readback() {
  //   const modulesArray = this.createPermissionField.get('modules') as FormArray;
  //   const reportTypeArray = this.createPermissionField.get('report_type') as FormArray;
  
  //   // Clear previous values
  //   this.multiselectModule = [];
  //   this.multiselectReport = [];
  
  //   // Read back modules and check the checkboxes
  //   modulesArray.controls.forEach((moduleControl, index) => {
  //     const moduleData = getValues.modules.find((module: any) => module.text === moduleControl.value.text);
  
  //     if (moduleData) {
  //       // Module is found in submitted data, populate the checkboxes
  //       moduleControl.patchValue({
  //         view: moduleData.view,
  //         update: moduleData.update,
  //         xlsxView: moduleData.xlsxView,
  //         xlsxUpdate: moduleData.xlsxUpdate
  //       });
  
  //       // Add the module to multiselectModule if it's selected
  //       if (moduleData.view || moduleData.update || moduleData.xlsxView || moduleData.xlsxUpdate) {
  //         this.multiselectModule.push({
  //           id: index + 1, // You can assign a unique ID here
  //           text: moduleControl.value.text, // Replace with the appropriate field name
  //         });
  //       }
  //     }
  //   });
  
  //   // Read back report types and check the checkboxes
  //   reportTypeArray.controls.forEach((reportTypeControl, index) => {
  //     const reportTypeData = getValues.report_type.find((reportType: any) => reportType.text === reportTypeControl.value.text);
  
  //     if (reportTypeData) {
  //       // Report type is found in submitted data, populate the checkboxes
  //       reportTypeControl.patchValue({
  //         selected: reportTypeData.selected
  //       });
  
  //       // Add the report type to multiselectReport if it's selected
  //       if (reportTypeData.selected) {
  //         this.multiselectReport.push({
  //           id: index + 1, // You can assign a unique ID here
  //           text: reportTypeControl.value.text, // Replace with the appropriate field name
  //         });
  //       }
  //     }
  //   });
  // }
  



async fetchTMData(sk: any) {
  console.log("iam trying to fetch",this.clientID)
  try {
    const response = await this.api.GetMaster(this.SK_clientID+"#dreamboard#lookup", sk);
 
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
              const { P1, P2, P3,P4 } = element[key]; // Extract values from the nested object
              this.dreamBoardIDs.push({P1, P2, P3,P4 }); // Push an array containing P1, P2, and P3 values
              console.log("d2 =",this.dreamBoardIDs)
            } else {
              break;
            }
          }
          //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
          this.dreamBoardIDs.sort((a:any, b:any) => {
            return b.P4 - a.P4; // Compare P5 values in descending order
          });
          console.log("Lookup sorting",this.dreamBoardIDs);
          // Continue fetching recursively
          await this.fetchTMData(sk + 1);
        } else {
          console.error('Invalid data format - not an array.');
        }
      } else {
        console.error('response.listOfItems is not a string.');
      }
    } else {
      

      this.dreamBoardIDs  = this.dreamBoardIDs.map((item:any)=>item.P1)

      console.log("All the dreamboard id are here ",this.dreamBoardIDs);

    }
  } catch (error) {
    console.error('Error:', error);
    // Handle the error as needed
  }
}




  openModalHelpher(getData:any){

    this.createPermissionField.reset()

    console.log("Data from llokup :",getData);
    this.data_temp = []

    this.api
      .GetMaster(this.SK_clientID+"#permission#"+getData+"#main",1)
      .then((result :any) => {
        if (result && result !== undefined) {
          this.data_temp.push(JSON.parse(result.metadata));
          console.log("permission configuration details", this.data_temp);


          if(result){


    let permissionTable: any = [];
    // let dayslist = [];
    // let datelist = [];
    // let temp_days = [];
    if (typeof this.data_temp  !== "undefined") {
      for (let allData = 0; allData < this.data_temp .length; allData++) {
        let permissionid = getData;
        let label = this.data_temp [allData].Label;
        let description = this.data_temp [allData].Description;
        let api_enable = this.data_temp [allData].api_enable
        let time = this.data_temp [allData].Time;
        let numberOfRequest = this.data_temp [allData].numberOfRequest;
        let numberOfRecords = this.data_temp [allData].numberOfRecords;
        let size = this.data_temp [allData].size;
        let other_settings = JSON.parse(this.data_temp [allData].other_settings);
        let user_grade = this.data_temp [allData].user_grade;
        let formList = this.data_temp [allData].formIDs;
        let dreamBoardIDs = this.data_temp[allData].dreamBoardIDs;
        //let allowOtherClient= this.data_temp [allData].allowOtherClient
        
        let date_type = this.data_temp [allData].Date_type
        permissionTable.push({
          permissionid: permissionid,
          label: label,
          description: description,
          time: time,
          numberOfRequest: numberOfRequest,
          numberOfRecords: numberOfRecords,
          size: size,
          api_enable: api_enable,
          date_type: date_type,
          user_grade: user_grade,
          other_settings: other_settings,
          formList:formList,
          dreamBoardIDs:dreamBoardIDs
          // allowOtherClient:allowOtherClient
        });

      }
    } else {
      permissionTable = [];
    }

    //console.log('temp_dates',temp_dates);
    console.log("permission table", permissionTable);


            for(let i = 0;i<permissionTable.length;i++){
              console.log(permissionTable[i].permissionid+ "=="+ getData.ID);
              if(permissionTable[i].permissionid == getData){

                console.log("Iam called :");
                this.openModal(permissionTable[i], "edit");
                break;
              }
            }
          }

        }
      })
      .catch((err) => {
        console.log("cant fetch", err);
      });


  }
}
