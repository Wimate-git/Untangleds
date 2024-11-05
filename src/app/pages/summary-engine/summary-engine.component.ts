import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { AbstractControl, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Config } from 'datatables.net';
import { MatSnackBar } from '@angular/material/snack-bar';
interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
  };
}
@Component({
  selector: 'app-summary-engine',
  templateUrl: './summary-engine.component.html',
  styleUrl: './summary-engine.component.scss'
})
export class SummaryEngineComponent implements OnInit {
  reloadEvent: EventEmitter<boolean> = new EventEmitter();


  @ViewChild('closeSummary') closeSummary: any;
  getLoggedUser: any;
  SK_clientID: any;
  showModal: boolean;
  createSummaryField: FormGroup;
  errorForUniqueID: any;
  errorForMobile: any;
  errorForInvalidEmail: string;
  showHeading: any = false;
  companySK: any;
  allCompanyDetails: any;
  defaultLocation: any = {};

  datatableConfig: Config = {};
  lookup_data_company: any = [];
 
  listofSK: any;

  hideUpdateButton: any = false;
  maxlength: number = 500;
  listofClientIDs: any = [];
  lookup_data_client: any = [];
  columnDatatable:any = [];
  clientID: any;
  dataform: any = [];

  columnTableData: any = [];





  constructor(private summaryConfiguration: SharedService,private api: APIService,private fb: UntypedFormBuilder,private cd:ChangeDetectorRef,
    private toast: MatSnackBar
    ) { }
  ngOnInit() {
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check',this.getLoggedUser)

    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check',this.SK_clientID)

    this.initializeCompanyFields();
    this.addJsonValidation();
    this.showTable()
    this.addFromService()
    

  }




  metadata(): FormGroup {
    return this.createSummaryField.get('metadata') as FormGroup
  }

  edit(P1: any) {
    console.log("Edited username is here ", P1);
    $('#summaryModal').modal('show');
    this.openModalHelpher(P1)
  }


  openModalHelpher(getValue:any){
    console.log("Data from llokup :",getValue);

    this.api
      .GetMaster(`${this.SK_clientID}#${getValue}#summary#main`,1)
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
jsonValidator(control: AbstractControl) {
  try {
    const value = control.value;
    if (value) {
      JSON.parse(value);  // Check if the value is valid JSON
    }
    return null;  // Return null if valid JSON
  } catch (e) {
    return { invalidJson: true };  // Return an error if not valid JSON
  }
}

openModal(getValues: any) {
  console.log('getvalues inside openModal', getValues);
  // if (getKey == 'edit' || getKey == '') {
  let temp = "";
  //console.log('temp',temp);
  if (getValues == "") {
    this.showHeading = true;
    this.showModal = false;
    // this.errorForUniqueID = '';
    // this.errorForInvalidEmail = '';


    this.createSummaryField.get('summaryID')?.enable();
    this.createSummaryField = this.fb.group({
   
      'summaryID': getValues.summaryID,
      'summaryName': getValues.summaryName,
      'summarydesc': getValues.summarydesc,
      jsonInputControl: ['', this.jsonValidator],
     
    })
    console.log(' this.createSummaryField check', this.createSummaryField)

  }


  //updated device congifuration(update)
  else if (getValues) {
    console.log('get values on edit');
    //disabling RDT id field on edit,becas its shoukd be unique and making showmodal as true
    this.createSummaryField.get('summaryID')?.disable();

//       for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
//         if (this.allPermissions_user[checkPermission] === 'Company - Update') {
//           this.hideUpdateButton = false;
// break;        }

//         else if (this.allPermissions_user[checkPermission] === 'Company - View') {
//           this.hideUpdateButton = true;
//         }
//       }

    this.showHeading = false;
    this.showModal = true;

    this.errorForUniqueID = '';
   
    let parsed = '';
    if (getValues.metadata) {
      parsed = JSON.parse(getValues.metadata);
    }
    this.createSummaryField = this.fb.group({
  
      'summaryID':{ value:  getValues.summaryID, disabled: true },
  'summaryName': getValues.summaryName,
      'summarydesc': getValues.summaryDesc,

      jsonInputControl: [ JSON.stringify(getValues.jsonData,null,2), this.jsonValidator],
    })

  }
  this.cd.detectChanges()    
}


checkUniqueIdentifier(getID: any) {
  console.log('getID', getID);
  this.errorForUniqueID = '';
  for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
    if (getID.target.value == this.listofSK[uniqueID]) {
      this.errorForUniqueID = "Company ID already exists";
    }
  }
}

deleteCompany(value: any) {

  this.companySK = value;

  console.log("Delete this :",value);

    this.allCompanyDetails = {
      PK: this.SK_clientID+"#"+value+"#summary#main",
      SK: 1
    }

    console.log("All company Details :",this.allCompanyDetails);

        const date = Math.ceil(((new Date()).getTime()) / 1000)
        const items ={
        P1: value,
        }


        this.api.DeleteMaster(this.allCompanyDetails).then(async value => {

          if (value) {

            await this.fetchTimeMachineById(1,items.P1, 'delete', items);

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


      delete(id: number) {
        console.log("Deleted username will be", id);
        this.deleteCompany(id);
      }
      create() {
        // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
      }




  initializeCompanyFields() {
    this.createSummaryField = this.fb.group({
   
 
      'summaryID': ['', Validators.required],
      'summaryName': ['', Validators.required],
      'summarydesc': ['', Validators.required],
     
    })
  }

  addJsonValidation() {
    this.createSummaryField.addControl('jsonInputControl', 
      new FormControl('', [Validators.required, this.jsonValidator])  // Add the JSON field with validation
    );
  }


  createNewSummary(getNewFields: any) {
    // Check if the form is valid, including the JSON field
    if (this.createSummaryField.invalid || this.createSummaryField.get('jsonInputControl')?.invalid) {
      // If invalid, show an error and do not proceed with the API call
      this.createSummaryField.markAllAsTouched(); // This ensures that all fields show their error messages
      console.log("Invalid form or invalid JSON data.");
      
      this.toast.open("Please enter valid JSON data before saving", " ", {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      
      return; // Do not proceed further if the form is invalid
    }
  
    let tempClient = this.SK_clientID + "#summary" + "#lookup";
    console.log('tempClient checking', tempClient);
  
    // Parse the jsonInputControl value to ensure it's valid JSON
    let parsedJsonData;
    try {
      parsedJsonData = JSON.parse(this.createSummaryField.value.jsonInputControl);  // Parse the JSON string into a JSON object
    } catch (error) {
      console.error("Invalid JSON format", error);
      this.toast.open("Invalid JSON format. Please correct it.", " ", {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }
  
    // Prepare company details and ensure only specific fields are stringified
    this.allCompanyDetails = {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,
      jsonData: parsedJsonData  // Store the parsed JSON object
    };
  
    console.log("company data ", this.allCompanyDetails);
  
    // Prepare tempObj and stringify the entire metadata object
    const tempObj = {
      PK: this.SK_clientID + "#" + this.allCompanyDetails.summaryID + "#summary" + "#main",
      SK: 1,
      metadata: JSON.stringify({
        summaryID: this.allCompanyDetails.summaryID,  // Stringify specific fields
        summaryName: this.allCompanyDetails.summaryName,
        summaryDesc: this.allCompanyDetails.summaryDesc,
        jsonData: this.allCompanyDetails.jsonData  // Keep jsonData as an object within the stringified structure
      })
    };
  
    console.log("TempObj is here ", tempObj);
  
    const date = Math.ceil(((new Date()).getTime()) / 1000);
    const items = {
      P1: this.createSummaryField.value.summaryID,
      P2: this.createSummaryField.value.summaryName,
      P3: this.createSummaryField.value.summarydesc,
      P4: date
    };
  
    this.api.CreateMaster(tempObj).then(async (value: any) => {
      await this.createLookUpSummary(items, 1, tempClient);
  
      this.datatableConfig = {};
      this.lookup_data_company = [];
      this.reloadEvent.next(true);
  
      console.log('value check', value);
      if (value) {
        this.toast.open("New Summary Configuration created successfully", " ", {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
  
        this.closeSummary.nativeElement.click();
      } else {
        Swal.fire({
          customClass: {
            container: 'swal2-container'
          },
          position: 'center',
          icon: 'warning',
          title: 'Error in adding Company Configuration',
          showCancelButton: true,
          allowOutsideClick: false,  // prevents outside click
        });
      }
  
    }).catch(err => {
      console.log('err for creation', err);
      this.toast.open("Error in adding new Summary Configuration ", "Check again", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
  

  
  


  async createLookUpSummary(item: any, pageNumber: number,tempclient:any){
    console.log('temp client checking from lookupsummary',tempclient)
    
    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(tempclient, pageNumber);
      console.log('response check',response)
  
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
        await this.createLookUpSummary(item, pageNumber + 1,tempclient);
      }
    } catch (err) {
      console.log('err :>> ', err);
      // Handle errors appropriately, e.g., show an error message to the user
    }
  }


  fetchCompanyLookupdata(sk:any):any {
    console.log("I am called Bro");
    console.log('this.SK_clientID check lookup',this.SK_clientID)
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#summary" + "#lookup", sk)
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
                  console.log('element check',element)
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object
                    this.lookup_data_company.push({ P1, P2, P3, P4,}); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_company);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                // this.lookup_data_company.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
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
          // render: function (data, type, full) {
          //   const colorClasses = ['success', 'info', 'warning', 'danger'];
          //   const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            
          
          //   const initials = data[0].toUpperCase();
          //   const symbolLabel = `
          //     <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
          //       ${initials}
         
          //     </div>
          //   `;
  

  
          //   return `
          //     <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
          //       <a href="javascript:;">
          //         ${symbolLabel}
          //       </a>
          //     </div>
             
          //   `;
          // }
        },


        {
          title: 'Name', data: 'P2' // Added a new column for phone numbers
        },
        {
          title: 'Description', data: 'P3' // Added a new column for phone numbers
        },
        {
          title: 'Updated', data: 'P4', render: function (data) {
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


  jsondata(jsondata: any): string {
    throw new Error('Method not implemented.');
  }


updateSummary(value: any, key: any) {
  this.createSummaryField.get('summaryID')?.enable();
  console.log("bbii", this.createSummaryField.value);

  // For editing, reading device type fields
  let tempObj: any = [];

  if (key == "editSummary") {
    // Parse the jsonInputControl value to ensure it's valid JSON
    let parsedJsonData;
    try {
      parsedJsonData = JSON.parse(this.createSummaryField.value.jsonInputControl);  // Parse the JSON string into a JSON object
    } catch (error) {
      console.error("Invalid JSON format", error);
      this.toast.open("Invalid JSON format. Please correct it.", " ", {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    // Prepare the updated company details
    this.allCompanyDetails = {
      summaryID: this.createSummaryField.value.summaryID,
      summaryName: this.createSummaryField.value.summaryName,
      summaryDesc: this.createSummaryField.value.summarydesc,
      jsonData: parsedJsonData,  // Include the updated JSON data
      updated: new Date()
    };

    // Prepare tempObj with the updated company details
    tempObj = {
      PK: this.SK_clientID + "#" + this.allCompanyDetails.summaryID + "#summary" + "#main",
      SK: 1,
      metadata: JSON.stringify(this.allCompanyDetails)  // Stringify the metadata to send to the API
    };
  }

  console.log('after updating', this.allCompanyDetails);

  const date = Math.ceil(((new Date()).getTime()) / 1000);
  const items = {
    P1: this.createSummaryField.value.summaryID,
    P2: this.createSummaryField.value.summaryName,
    P3: this.createSummaryField.value.summarydesc,
    P4: date
  };

  console.log("Tempobj is here ", tempObj);
  console.log("Item for lookup is ", items);

  // Call the API to update the data
  this.api.UpdateMaster(tempObj).then(async value => {
    if (value) {
      // Handle the successful update
      await this.fetchTimeMachineById(1, items.P1, 'update', items);

      this.datatableConfig = {};
      this.lookup_data_company = [];
      this.reloadEvent.next(true);

      this.toast.open("Summary Configuration updated successfully", "", {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      // Refresh the table and close the modal
      this.addFromService();
      this.closeSummary.nativeElement.click();
    } else {
      alert('Error in updating Company Configuration');
    }
  }).catch((err: any) => {
    console.log('error for updating', err);
  });
}




  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#summary'+"#lookup";
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



  addFromService() {
    this.getClientID()
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
      const response = await this.api.GetMaster("client" + "#lookup", sk);
      
      if (response && response.options) {
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data);
          
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
  
              if (element !== null && element !== undefined) {
                const key = Object.keys(element)[0];
                const { P1, P2, P3, P4 } = element[key];
                this.lookup_data_client.push({ P1, P2, P3, P4 });
                console.log("d2 =", this.lookup_data_client);
              } else {
                break;
              }
            }
            
            this.lookup_data_client.sort((a: any, b: any) => b.P5 - a.P5);
            console.log("Lookup sorting", this.lookup_data_client);
  
            // Continue fetching recursively with fetchTMClientLookup itself
            await this.fetchTMClientLookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.options is not a string.');
        }
      } else {
        console.log("Lookup to be displayed", this.lookup_data_client);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  remove(index: any) {
    console.log('remove', index);
    const addFields = this.createSummaryField.get('metadata') as UntypedFormArray
    addFields.removeAt(index);
  }
  






}
