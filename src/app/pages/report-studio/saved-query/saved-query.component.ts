import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModuleDisplayService } from '../services/module-display.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SharedService } from '../../shared.service';
import { APIService } from 'src/app/API.service';
import { table } from 'console';


interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
  };
}

@Component({
  selector: 'app-saved-query',
  templateUrl: './saved-query.component.html',
  styleUrl: './saved-query.component.scss'
})
export class SavedQueryComponent implements OnInit {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  displayModule = false;
  @Input() editOperation:boolean;
  @Input() savedModulePacket:any = []
  @Input() listofSavedIds:any;
  @Input() tableState:any;
  createSavedQuery:FormGroup;
  isCollapsed1 = false;


  noticeSwal = Swal;
  swalOptions: SweetAlertOptions = {};



  clientNames:any =  [];
  getLoggedUser: any;
  SK_clientID: any;
  lookup_users: any = [];
  maxlength: number = 500;
  username: any;
  errorForUniqueID: string = '';
  currentSelectedQuery: any = '';
  allUsers: any;

  constructor(private moduleDisplayService: ModuleDisplayService,private fb:FormBuilder,private cd:ChangeDetectorRef,private notifyConfig:SharedService,
    private api:APIService
  ) {}

  async ngOnInit() {
    this.moduleDisplayService.displayModule$.subscribe(
      (showModule) => {
        this.displayModule = showModule;
      }
    );

  
    this.getLoggedUser = this.notifyConfig.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username
    console.log("Saved Module packet will be here ",JSON.parse(JSON.stringify(this.savedModulePacket)));
    console.log("Table state is here ",JSON.parse(JSON.stringify(this.tableState)));


    // const savedState = localStorage.getItem("tableState");

    // console.log("Saved State from localStorage ",savedState);


    this.dynamicFormInitializer()
    await this.addFromService()


    if(Array.isArray(this.savedModulePacket) == false){
      this.editOperation = true
      this.dynamicFormPopulate(this.savedModulePacket)
    }

    this.errorForUniqueID = '';

  }




  async addFromService() {
    await this.fetchAllUsers(1,this.SK_clientID+"#user"+"#lookup")
    this.clientNames = this.lookup_users.map((item:any)=>{
      return {PK:item.P1}
    })
  }


  dynamicFormPopulate(values:any){

    this.currentSelectedQuery = values.queryName

    this.createSavedQuery = this.fb.group({
      queryName:{ value: values.queryName, disabled: this.editOperation },
      queryDesc:[values.queryDesc,Validators.required],
      userIDs:[values.userIDs]
    })
  }


  checkUniqueIdentifier(getID: any) {

    const tempUser = getID.target.value
    this.errorForUniqueID = '';
    console.log("All the List of savedIDs ",this.listofSavedIds);

    if(this.listofSavedIds){

    for (let uniqueID = 0; uniqueID < this.listofSavedIds.length; uniqueID++) {
      if (tempUser.toLowerCase() == this.listofSavedIds[uniqueID].toLowerCase()) {
        this.createSavedQuery.setErrors({ invalidForm: true });
        this.errorForUniqueID = "Saved Query already exist"
    }
    }
    }

  }


  dynamicFormInitializer(){
    this.createSavedQuery = this.fb.group({
      queryName:['',Validators.required],
      queryDesc:['',Validators.required],
      userIDs:['']
    })
  }

 
  async onSubmitModule(event:any) {

    if(event.type == 'submit' && this.editOperation == false){
      console.log("Module form submitted");
      await this.createNewSavedQuery()
    }
    else{
      await this.updateSavedQuery()
      console.log("Module form is being updated");
    }
    console.log("Module form submitted");
    this.closeModal.emit();
  }



  async updateSavedQuery(){
    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Saved Query updated successfully!' : 'Saved Query created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };



    const savedQueryTemp = {
      queryName:this.currentSelectedQuery,
      queryDesc:this.createSavedQuery.value.queryDesc,
      userIDs:this.createSavedQuery.value.userIDs,
      reportMetadata:JSON.stringify(this.savedModulePacket.reportMetadata),
      conditionMetadata:JSON.stringify(this.savedModulePacket.conditionMetadata) || JSON.stringify([]),
      columnVisibility:JSON.stringify(this.savedModulePacket.columnVisibility),
      tableState:JSON.stringify(JSON.parse(JSON.stringify(this.tableState))),
      customColumnMetadata:JSON.stringify(this.savedModulePacket.customColumnMetadata)
    }

    console.log("Table state is here ",JSON.parse(JSON.stringify(this.tableState)));

    console.log("Saved query is here ",savedQueryTemp);


    const tempObj = {
      PK: this.SK_clientID+"#savedquery#"+savedQueryTemp.queryName+"#main",
      SK: 1,
      metadata:JSON.stringify(savedQueryTemp)
    }


    await this.api.UpdateMaster(tempObj).then(async (value: any)=>{  
      if (value) {

        const username = this.username;
        this.allUsers = JSON.parse(JSON.stringify(this.createSavedQuery.value.userIDs.map((item:any)=>item.PK)))

        console.log("All users are here ",this.allUsers);

        const item={
          P1:savedQueryTemp.queryName,
          P2:JSON.stringify({username:username,userList:this.allUsers}),
          P3:Math.ceil(((new Date()).getTime())/1000)
      }

      console.log("Item is here ",item);

        await this.fetchTimeMachineById(1,this.SK_clientID+"#savedquery"+"#lookup", 'update', item);
        this.showAlert(successAlert)
      }
      else {
        alert('Error in Creating Dashboard Configuration');
      }
    }).catch((err: any) => {
      console.log('err for creation', err);
      this.showAlert(errorAlert)
    })
  }



  createNewSavedQuery(){
    console.log("Saved query data is here ",this.createSavedQuery.value);

      const successAlert: SweetAlertOptions = {
        icon: 'success',
        title: 'Success!',
        text: this.editOperation ? 'Saved Query updated successfully!' : 'Saved Query created successfully!',
      };
      const errorAlert: SweetAlertOptions = {
          icon: 'error',
          title: 'Error!',
          text: '',
      };


      console.log("Success alert data is here ",successAlert);

      console.log("Saved Query column visibility ",this.savedModulePacket[2]);


      const savedQueryTemp = {
        queryName:this.createSavedQuery.value.queryName,
        queryDesc:this.createSavedQuery.value.queryDesc,
        userIDs:this.createSavedQuery.value.userIDs,
        reportMetadata:JSON.stringify(this.savedModulePacket[0]),
        conditionMetadata:JSON.stringify(this.savedModulePacket[1]),
        columnVisibility:JSON.stringify(this.savedModulePacket[2]),
        tableState:JSON.stringify(JSON.parse(JSON.stringify(this.tableState))),
        customColumnMetadata:JSON.stringify(this.savedModulePacket[4]),
        advancedCustomColumnMetadata:JSON.stringify(this.savedModulePacket[5]),
        advancedFilterColumnMetadata:JSON.stringify(this.savedModulePacket[6])
      }


      console.log("Table state is here ",JSON.parse(JSON.stringify(this.tableState)));

      console.log("Metadata to be created is ",savedQueryTemp);

      const tempObj = {
        PK: this.SK_clientID+"#savedquery#"+savedQueryTemp.queryName+"#main",
        SK: 1,
        metadata:JSON.stringify(savedQueryTemp)
      }
  
     
      this.api.CreateMaster(tempObj).then(async (value: any)=>{  
        if (value) {

          const userList = this.createSavedQuery.value.userIDs.map((item:any)=>item.PK)
  
          var item={
            P1:savedQueryTemp.queryName,
            P2:JSON.stringify({username:this.username,userList:userList}),
            P3:Math.ceil(((new Date()).getTime())/1000)
        }
          await this.createLookUpRdt(item,1,this.SK_clientID+"#savedquery"+"#lookup")
          this.showAlert(successAlert)
        }
        else {
          alert('Error in Creating Dashboard Configuration');
        }
      }).catch((err: any) => {
        console.log('err for creation', err);
        this.showAlert(errorAlert)
      })
  }




  onModuleSelect( option: any) {

    // if(option.originalEvent && option.originalEvent.selected === true){
    //   console.log("Multiselecte is selecting",option);

    //     console.log("Level index is",levelIndex);

    //     // Get the current values of the userIDs control at this level
    //     const userIDs = (this.levels.at(levelIndex).get('userIDs')?.value).map((item:any)=>item.PK) || [];
    //     // Add the new user ID, if it's not already in the array
        
    //     if (!userIDs.includes(option.itemValue.PK)) {
    //       userIDs.push(option.itemValue.PK);
    //       this.levels.at(levelIndex).get('userIDs')?.setValue(userIDs);
    //     }
    //     this.updateUserPermissions(levelIndex, userIDs);
    // }
    // else if(option.originalEvent && option.originalEvent.selected === false){
    //   this.onDeSelect(levelIndex,option)
    // }

    
  }
  
  onDeSelect(levelIndex: number, option: any) {
    // Get the current values of the userIDs control at this level
    // const userIDs = (this.levels.at(levelIndex).get('userIDs')?.value).map((item:any)=>item.PK) || [];
    // console.log(userIDs)
    // // Remove the user ID
    // const indexToRemove = userIDs.indexOf(option.itemValue.PK);
    // if (indexToRemove !== -1) {
    //   userIDs.splice(indexToRemove, 1);
    //   this.levels.at(levelIndex).get('userIDs')?.setValue(userIDs);
    // }
    // console.log("userIDs", userIDs)
    // this.updateUserPermissions(levelIndex, userIDs);
  }
  
  onSelectAll( modules: any) {
    // // Map the modules to their IDs and set it to the userIDs control
    // if(modules.checked == false){
    //   this.updateUserPermissions(levelIndex, []);
    // }
    // else{
    //   console.log("modules ",modules);
    //   const userIDs = this.clientNames.map((module: { PK: any; }) => module.PK);
    //   console.log("userIDs", userIDs)
    //   this.updateUserPermissions(levelIndex, userIDs);
    // }
  }
  
  onDeSelectAll(levelIndex: number) {

    // console.log("On deselection is here ");
    // // Clear the userIDs control at this level
    // this.levels.at(levelIndex).get('userIDs')?.setValue([]);
    // this.updateUserPermissions(levelIndex, []);
  }



  dismissModule(){
    this.closeModal.emit();
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
    this.noticeSwal.fire(this.swalOptions);

  }


  async createLookUpRdt(item: any, pageNumber: number,tempclient:any){
    try {
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
    }
  }

  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#savedquery'+"#lookup";
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



  fetchAllUsers(sk:any,pkValue:any):any {    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(pkValue, sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              
              if (Array.isArray(data)) {
                const promises = []; // Array to hold promises for recursive calls
  
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
  
                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3 } = element[key]; // Extract values from the nested object
                    this.lookup_users.push({ P1, P2, P3 }); // Push an array containing P1, P2, P3, P4, P5, P6
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_users.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
  
                // Continue fetching recursively
                promises.push(this.fetchAllUsers(sk + 1,pkValue)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_users)) // Resolve with the final lookup data
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
            resolve(this.lookup_users); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }
}



 

