import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from "../../_metronic/shared/shared.module";
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Config } from 'datatables.net';
import { Crud2Module } from "../../modules/crud2/crud.module";
import { FormArray, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { DynamicApiService } from '../dynamic-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrailService } from '../services/auditTrail.service';

//Version Date 5 Dec Asad 2025

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
    P4: any;
  };
}

@Component({
  selector: 'app-connection-settings',
  standalone: false,
  templateUrl: './connection-settings.component.html',
  styleUrl: './connection-settings.component.scss'
})
export class ConnectionSettingsComponent implements OnInit{
  errorForInvalidEmail: string = '';
  errorForUniqueEmail: string = '';
  listofEmails: any = [];
  errorForUniquemobileID: string = '';
  listofMobileID: any = [];
  errorForUniqueWhatsappmobileID: string = '';
  allCommtnDetails: any;
  getLoggedUser: any;
  SK_clientID: any;
  maxlength: number = 500;
  lookup_data_communication: any = [];
  currentEmail: any = '';

  selectedComms:any = []


  communicationTypeArray = ['Telegram','SMS','Push Notification','WhatsApp','Email']
  username: any;

  constructor(private fb:FormBuilder,private cd:ChangeDetectorRef,private api:APIService,private notifyConfig:SharedService,
    private DynamicApi:DynamicApiService,private toast:MatSnackBar,private auditTrail:AuditTrailService
  ){}
  
  swalOptions: SweetAlertOptions = {};
  isLoading:boolean = false
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  datatableConfig: Config = {};
  createConnectionField: UntypedFormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;
  editOperation = false;
  errorForUniqueID: any = '';
  listofSK: any = [];
  errorForMobile: any;

  selectedConfig: string = '';  // Holds the selected config type
  dynamicFields: { name: string, label: string }[] = []; 


  ngOnInit(): void {
    this.getLoggedUser = this.notifyConfig.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

    this.initializeForm()

    this.showTable()
  }


  initializeForm(){
    this.createConnectionField = this.fb.group({
      comtnID:['',Validators.required],
      configurationType: ['',Validators.required],
      version:['',Validators.required],
      chatID:[''],
      botToken:[''],
      smsNumber:[''],
      whatsappNumber:[''],
      balanceUrl:[''],
      smsUrl:[''],
      message_prefix:[''],
      message_sufix:[''],
      username:['',Validators.required],
      password:['',Validators.required],
      smsBalanceUrl:[''],
      smsSender:[''],
      smsPriority:[''],
      smsKey:[''],
      smsToken:[''],
      email:[''],
      name:[''],
      emailPriority:[''],
      errorDate:[''],
      emailResponse:[''],
      responseCode:[''],
      mailOptions_subject:[''],
      mailOptions_to:[''],
      emailToken:[''],
      pushToken:[''],
      pushPriority:[''],
      tokenIDPush:[''],
      whatsAppPriority:[''],
      whatsAppToken:[''],
      telegramPriority:[''],
      telegramToken:[''],
      dynamicFields: this.fb.array([])
    })
  }



  // Method to clear validators for all relevant fields
clearValidatorsForAllFields(): void {
  this.createConnectionField.get('chatID')?.clearValidators();
  this.createConnectionField.get('botToken')?.clearValidators();
  this.createConnectionField.get('smsNumber')?.clearValidators();
  this.createConnectionField.get('whatsappNumber')?.clearValidators();
  this.createConnectionField.get('whatsAppPriority')?.clearValidators();
  this.createConnectionField.get('email')?.clearValidators();
  this.createConnectionField.get('emailPriority')?.clearValidators();
  this.createConnectionField.get('tokenIDPush')?.clearValidators();
  this.createConnectionField.get('pushPriority')?.clearValidators();
  this.createConnectionField.get('telegramPriority')?.clearValidators()
  this.createConnectionField.get('smsPriority')?.clearValidators()
}

// Method to update the validity of the fields after adding/removing validators
updateValidatorsForFields(): void {
  this.createConnectionField.get('chatID')?.updateValueAndValidity();
  this.createConnectionField.get('botToken')?.updateValueAndValidity();
  this.createConnectionField.get('smsNumber')?.updateValueAndValidity();
  this.createConnectionField.get('whatsappNumber')?.updateValueAndValidity();
  this.createConnectionField.get('whatsAppPriority')?.updateValueAndValidity();
  this.createConnectionField.get('email')?.updateValueAndValidity();
  this.createConnectionField.get('emailPriority')?.updateValueAndValidity();
  this.createConnectionField.get('tokenIDPush')?.updateValueAndValidity();
  this.createConnectionField.get('pushPriority')?.updateValueAndValidity();
  this.createConnectionField.get('telegramPriority')?.updateValueAndValidity()
  this.createConnectionField.get('smsPriority')?.updateValueAndValidity()
}



commChangeTracker(event:any){
  try{

    const value = event.value
      console.log("Changed value is here", value);

      if(!value){
        return
      }
  
      // Reset validators for all fields first
      this.clearValidatorsForAllFields();
  
      // Telegram Validation
      if (value.includes('Telegram')) {
        this.createConnectionField.get('chatID')?.setValidators([Validators.required]);
        this.createConnectionField.get('botToken')?.setValidators([Validators.required]);
        this.createConnectionField.get('telegramPriority')?.setValidators([Validators.required]);
      }
  
      // SMS Validation
      if (value.includes('SMS')) {
        this.createConnectionField.get('smsNumber')?.setValidators([Validators.required]);
        this.createConnectionField.get('smsPriority')?.setValidators([Validators.required]);
      }
  
      // WhatsApp Validation
      if (value.includes('WhatsApp')) {
        this.createConnectionField.get('whatsappNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
        this.createConnectionField.get('whatsAppPriority')?.setValidators([Validators.required]);
      }
  
      // Email Validation
      if (value.includes('Email')) {
        this.createConnectionField.get('email')?.setValidators([Validators.required, Validators.email]);
        this.createConnectionField.get('emailPriority')?.setValidators([Validators.required]);
      }
  
      // Push Notification Validation
      if (value.includes('Push Notification')) {
        this.createConnectionField.get('tokenIDPush')?.setValidators([Validators.required]);
        this.createConnectionField.get('pushPriority')?.setValidators([Validators.required]);
      }
  
      // Update the validity of the fields after adding/removing validators
      this.updateValidatorsForFields();
      this.cd.detectChanges()


        // Update button state based on the form's validity
        this.toggleSubmitButton();
      console.log("Is form valid " ,this.createConnectionField.valid);

  }
  catch(error){
    console.log("Error in valueChnages ",error)
  }
}



// Method to toggle submit button enable/disable based on form validity
toggleSubmitButton(): void {
  const submitButton = document.getElementById('kt_modal_update_customer_submit') as HTMLButtonElement;
  if (submitButton) {
    submitButton.disabled = !this.createConnectionField.valid;
  }
}

  async showTable() {

    console.log("Show DataTable is called BTW");

    this.datatableConfig = {}
    this.lookup_data_communication = []
    this.datatableConfig = {
      serverSide: true,
      destroy:true,
      ordering:true,
      ajax: (dataTablesParameters:any, callback) => {
        this.datatableConfig = {}
        this.lookup_data_communication = []
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
          title: 'Communication ID', 
          data: 'P1', 
          orderable: true,
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
          title: 'Version', data: 'P2',orderable: true // Added a new column for phone numbers
        },
        {
          title: 'Updated', data: 'P4',orderable: true, render: function (data) {
            const date = new Date(data * 1000).toLocaleDateString() + " " + new Date(data * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

          // const date = new Date(data * 1000);
          // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
          return date
        }
        }
        
      ],
      createdRow: (row, data, dataIndex) => {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };





    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "Communication",
        "Form Name": 'Communication',
      "Description": `Communication Table was Viewed`,
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
      this.api.GetMaster(this.SK_clientID+"#communication"+"#lookup", sk)
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
                    this.lookup_data_communication.push({ P1, P2, P3, P4, P5, P6 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_communication);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_communication.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_data_communication);
  
                // Continue fetching recursively
                promises.push(this.fetchCompanyLookupdata(sk + 1)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_communication)) // Resolve with the final lookup data
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
            console.log("All the users are here", this.lookup_data_communication);

            this.listofSK = this.lookup_data_communication.map((item:any)=>item.P1)

            resolve(this.lookup_data_communication); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
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
    this.openModalHelpher(P1)


    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "Communication",
        "Form Name": 'Communication',
      "Description": `${P1} Communication details were Viewed`,
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


  deleteCompany(value: any) {

    console.log("Delete this :",value);

      this.allCommtnDetails = {
        PK: this.SK_clientID+"#communication#"+value+"#main",
        SK: 1
      }


      console.log("All company Details :",this.allCommtnDetails);

          const date = Math.ceil(((new Date()).getTime()) / 1000)
          const items ={
          P1: value,
          }


          this.api.DeleteMaster(this.allCommtnDetails).then(async value => {

            if (value) {

              await this.fetchTimeMachineById(1,items.P1, 'delete', items);



              try{
                const UserDetails = {
                  "User Name": this.username,
                  "Action": "Deleted",
                  "Module Name": "Communication",
                  "Form Name": 'Communication',
                "Description": `${items.P1} Communication ID was Deleted`,
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

              // Swal.fire(
              //   'Removed!',
              //   'Company configuration successfully.',
              //   'success'
              // );
            }

          }).catch(err => {
            console.log('error for deleting', err);
          })
        }


  checkUniqueIdentifier(getID: any) {
    console.log('getID', getID);
    this.errorForUniqueID = '';
    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
      if (getID.target.value == this.listofSK[uniqueID]) {
        this.errorForUniqueID = "Communication ID already exists";
      }
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


  uniqueWhatsAppMobile(getUserID: any){
    this.errorForUniqueWhatsappmobileID = '';
    if(getUserID.target.value.length != 10){
      this.errorForUniqueWhatsappmobileID = "Phone number must be exactly 10 digits.";
    }
    for (let uniqueID = 0; uniqueID < this.listofMobileID.length; uniqueID++) {
      // if(this.dataUser.mobile == getUserID.target.value && this.editOperation){

      // }
      // else 
      if(getUserID.target.value.length != 10){
        this.errorForUniqueWhatsappmobileID = "Phone number must be exactly 10 digits.";
      }
      if (getUserID.target.value == this.listofMobileID[uniqueID]) {
        this.errorForUniqueWhatsappmobileID = "Mobile no already exists";
      }
    }
  }


  uniqueMobile(getUserID: any){
    this.errorForUniquemobileID = '';
    if(getUserID.target.value.length != 10){
      this.errorForUniquemobileID = "Phone number must be exactly 10 digits.";
    }
    for (let uniqueID = 0; uniqueID < this.listofMobileID.length; uniqueID++) {
      // if(this.dataUser.mobile == getUserID.target.value && this.editOperation){

      // }
      // else 
      console.log("PH no is here ",getUserID.target.value);
      console.log("PH length is here ",getUserID.target.value.length);
     
      if (getUserID.target.value == this.listofMobileID[uniqueID]) {
        this.errorForUniquemobileID = "Mobile no already exists";
      }
    }
  }


  onConfigTypeChange(): void {

    // Reset dynamic fields whenever the configuration type changes
    // this.dynamicFields = [];
    // this.clearFormArray();

  
        this.dynamicFields.push(
          { label: 'Telegram Custom Field 1', name: 'telegramCustom1' },
          { label: 'Telegram Custom Field 2', name: 'telegramCustom2' },
        );
       

    console.log("Dynamic fields are here ",this.dynamicFields);
    this.cd.detectChanges()

    // Dynamically add form controls for the selected configuration
    this.addDynamicFieldsToFormArray();
  }


  openModalHelpher(getValue:any){
   
    this.api
      .GetMaster(this.SK_clientID+"#communication#"+getValue+"#main",1)
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



  openModal(getValues: any) {
    console.log('getvalues inside openModal', getValues);

    this.currentEmail = ''
    this.selectedComms = []
  
    if (getValues == "") {
      this.editOperation = false;
      this.errorForUniqueID = '';
      this.errorForInvalidEmail = '';
      this.errorForUniqueWhatsappmobileID = ''
     
      this.createConnectionField.reset()

      this.createConnectionField.get('comtnID')?.enable()

      // Re-initialize dynamicFields (FormArray)
      const dynamicFieldsFormArray = this.createConnectionField.get('dynamicFields') as FormArray;
      dynamicFieldsFormArray.clear(); // Clear any existing controls (if any)

    }
    
    else if (getValues) {
    this.editOperation = true;
      this.errorForUniqueID = '';
      this.errorForInvalidEmail = '';
      this.errorForUniqueWhatsappmobileID = ''
      let emailParsed ;
      let telegramParsed ;
      let smsParsed ;
      let pushParsed ;
      let whatsAppParsed 

      if (getValues.email) {
        emailParsed = JSON.parse(getValues.email);
      }
      if(getValues.push){
        pushParsed = JSON.parse(getValues.push);
      }
      if(getValues.sms){
        smsParsed = JSON.parse(getValues.sms);
      }
      if(getValues.whatsApp){
        whatsAppParsed = JSON.parse(getValues.whatsApp);
      }
      if(getValues.telegram){
        telegramParsed = JSON.parse(getValues.telegram);
      }


      this.selectedComms =  getValues.configurationType == undefined ? []: JSON.parse(getValues.configurationType)


      //Set the form Values (Populate)
      this.createConnectionField = this.fb.group({
        comtnID:{value:getValues.commID,disabled:true},
        version:getValues.version,
        username:getValues.username,
        password:getValues.password,
        configurationType:[this.selectedComms],

        //Telegram
        chatID:telegramParsed.chatID,
        botToken:telegramParsed.botToken,
        telegramPriority:telegramParsed.telegramPriority,
        telegramToken:telegramParsed.telegramToken,

        //SMS
        smsNumber:smsParsed.smsNumber,
        smsUrl:smsParsed.smsUrl,
        message_prefix:smsParsed.message_prefix,
        message_sufix:smsParsed.message_sufix,
        smsBalanceUrl:smsParsed.smsBalanceUrl,
        smsSender:smsParsed.smsSender,
        smsPriority:smsParsed.smsPriority,
        smsKey:smsParsed.smsKey,
        smsToken:smsParsed.smsToken,
       

        //Whatsapp
        whatsappNumber:whatsAppParsed.whatsappNumber,
        whatsAppPriority:whatsAppParsed.whatsAppPriority,
        whatsAppToken:whatsAppParsed.whatsAppToken,
       
        
        //Email
        email:emailParsed.email,
        name:emailParsed.name,
        emailPriority:emailParsed.emailPriority,
        errorDate:emailParsed.errorDate,
        emailResponse:emailParsed.emailResponse,
        responseCode:emailParsed.responseCode,
        mailOptions_subject:emailParsed.mailOptions_subject,
        mailOptions_to:emailParsed.mailOptions_to,
        emailToken:emailParsed.emailToken,
       
        
       //Push Botifications
        pushToken:pushParsed.pushToken,
        pushPriority:pushParsed.pushPriority,
        tokenIDPush:pushParsed.tokenIDPush,
       
        //Dynamic fields
        dynamicFields: this.fb.array([])
      })

      console.log("Values to be populated are here  ",this.createConnectionField.value);

      this.currentEmail = emailParsed.email

      // Now let's populate the dynamic fields (if any)
      if (getValues.dynamicFields) {
        const dynamicFieldsArray = JSON.parse(getValues.dynamicFields);
        const dynamicFieldsFormArray = this.createConnectionField.get('dynamicFields') as FormArray;

        // Iterate over dynamicFieldsArray and create a FormGroup for each item
        dynamicFieldsArray.forEach((field:any) => {
          const group = this.fb.group({
            label: [field.label, Validators.required],  // Adjust fields based on your data structure
            value: [field.value, Validators.required]   // Adjust fields based on your data structure
          });
          dynamicFieldsFormArray.push(group);  // Add the FormGroup to the FormArray
        });
      }

      console.log("Form values are here ",this.createConnectionField.value);
    
    }
    this.cd.detectChanges()    
  }

  populateDynamicFields() {
    // Clear existing form fields (optional if you want to start fresh)
    if(this.dynamicFieldsArray){
      this.dynamicFieldsArray.clear();
    }
 
  
    // Loop over your dynamicFieldsData array and add each field
    this.dynamicFields.forEach((field:any) => {
      const group = this.fb.group({
        label: [field.label, Validators.required],  // pre-fill label
        value: [field.value, Validators.required]   // pre-fill value
      });
      this.dynamicFieldsArray.push(group);
    });
  }

  // Get the dynamic fields FormArray (cast to FormArray)
  get dynamicFieldsArray(): any {
    return this.createConnectionField.get('dynamicFields') as FormArray;
  }

  // Add dynamic fields to the FormArray
  addDynamicFieldsToFormArray() {
    // Clear the current FormArray
    this.dynamicFieldsArray.clear();

    // Add controls for each dynamic field
    this.dynamicFields.forEach((field) => {
      const group = this.fb.group({
        label: [field.label, Validators.required],
        value: ['', Validators.required] // 'value' field for input value
      });
      this.dynamicFieldsArray.push(group);
    });
  }

  // Method to add a new dynamic field (if needed in the future)
  addDynamicField() {
    const newField = this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.dynamicFieldsArray.push(newField);
  }


   // Method to remove a dynamic field from the FormArray
   removeDynamicField(index: number) {
    this.dynamicFieldsArray.removeAt(index);
  }


  removeAllDynamicFields() {
    console.log("Form data is here ",this.createConnectionField);

    console.log("Form is ",this.createConnectionField.valid);


    console.log('Form is valid:', this.createConnectionField.valid); // true or false
  console.log('Form errors:', this.createConnectionField.errors); // any form-wide errors
  console.log('Form status:', this.createConnectionField.status);
    this.dynamicFieldsArray.clear();
  }

  onSubmit(event:any){
     
    console.log("Submitted is clicked ",event);

    //Enabling all the disabled fields
    this.createConnectionField.get('comtnID')?.enable()
    if(event.type == 'submit' && this.editOperation == false){
      this.createNewCommunication('')
    }
    else{
      this.updateCommunication(this.createConnectionField.value,'editCompany')
    }
  }


  createNewCommunication(getNewFields: any) {


    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Communication updated successfully!' : 'Communication created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };

    console.log("All the form values are here ",this.createConnectionField.value);

    let tempClient = this.SK_clientID+"#communication"+"#lookup";

    this.allCommtnDetails = {
      commID: this.createConnectionField.value.comtnID,
      version: this.createConnectionField.value.version,
      username: this.createConnectionField.value.username,
      password: this.createConnectionField.value.password,
      configurationType: JSON.stringify(this.createConnectionField.value.configurationType),
      


      //Telegram
      telegram:JSON.stringify({
        chatID: this.createConnectionField.value.chatID,
        botToken: this.createConnectionField.value.botToken,
        telegramPriority: this.createConnectionField.value.telegramPriority,
        telegramToken: this.createConnectionField.value.telegramToken,
      }),

      //SMS
      sms:JSON.stringify({
        smsUrl: this.createConnectionField.value.smsUrl,
        smsNumber: this.createConnectionField.value.smsNumber,
        message_prefix: this.createConnectionField.value.message_prefix,
        message_sufix: this.createConnectionField.value.message_sufix,
        smsBalanceUrl: this.createConnectionField.value.smsBalanceUrl,
        smsPriority: this.createConnectionField.value.smsPriority,
        smsSender: this.createConnectionField.value.smsSender,
        smsKey: this.createConnectionField.value.smsKey,
        smsToken: this.createConnectionField.value.smsToken,
      }),

      //Whatsapp
      whatsApp:JSON.stringify({
        whatsappNumber: this.createConnectionField.value.whatsappNumber,
        whatsAppPriority: this.createConnectionField.value.whatsAppPriority,
        whatsAppToken: this.createConnectionField.value.whatsAppToken,
      }),


      //Email
      email:JSON.stringify({
        email: this.createConnectionField.value.email,
        name: this.createConnectionField.value.name,
        emailPriority: this.createConnectionField.value.emailPriority,
        errorDate: this.createConnectionField.value.errorDate,
        emailResponse: this.createConnectionField.value.emailResponse,
        responseCode: this.createConnectionField.value.responseCode,
        mailOptions_subject: this.createConnectionField.value.mailOptions_subject,
        mailOptions_to: this.createConnectionField.value.mailOptions_to,
        emailToken: this.createConnectionField.value.emailToken,
      }),

      //Push Notification
       push:JSON.stringify({
        pushToken: this.createConnectionField.value.pushToken,
        pushPriority: this.createConnectionField.value.pushPriority,
        tokenIDPush: this.createConnectionField.value.tokenIDPush,
      }),
   
      
      dynamicFields: JSON.stringify(this.createConnectionField.value.dynamicFields),
    }

  

    const tempObj = {
      PK: this.SK_clientID+"#communication#"+this.createConnectionField.value.comtnID+"#main",
      SK: 1,
      metadata:JSON.stringify(this.allCommtnDetails)
    }

    console.log("Temp obj is here ",tempObj);


    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items ={
    P1: this.createConnectionField.value.comtnID,
    P2: this.createConnectionField.value.version,
    P3:this.createConnectionField.value.username,
    P4: date
    }


    console.log("Items are here ",items);

    console.log('newly added Company config', this.allCommtnDetails);

    this.api.CreateMaster(tempObj).then(async (value: any) => {

      await this.createLookUpRdt(items,1,tempClient)


      try{
        const UserDetails = {
          "User Name": this.username,
          "Action": "Created",
          "Module Name": "Communication",
          "Form Name": 'Communication',
        "Description": `${items.P1} Communication ID was Created`,
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










      if(this.createConnectionField.value.email != '' && this.selectedComms.includes('Email')){
        const body = { type: "verifyIdentities",email:this.createConnectionField.value.email};

        this.DynamicApi.sendData(body).subscribe(response => {
          console.log('Response from Lambda:', response);
    
    
          this.toast.open("Mail Sent Successfully", " ", {
    
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            //   //panelClass: ['blue-snackbar']
          })
    
    
        }, error => {
          console.error('Error calling dynamic lambda:', error);
        });
      }

     



      this.datatableConfig = {}
      
      this.lookup_data_communication = []

      // this.addFromService();

      if (value) {
        this.showAlert(successAlert)
        this.reloadEvent.next(true)
      }
      else {
        this.showAlert(errorAlert)
      }

    }).catch((err: any) => {

      this.showAlert(errorAlert)
      console.log('err for creation', err);
    })
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

  updateCommunication(value: any, key: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Communication updated successfully!' : 'Communication created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };

    var tempObj:any= []

    

    if (key == "editCompany") {
      this.allCommtnDetails = {
        commID: this.createConnectionField.value.comtnID,
        version: this.createConnectionField.value.version,
        username: this.createConnectionField.value.username,
        password: this.createConnectionField.value.password,
        configurationType:JSON.stringify(this.createConnectionField.value.configurationType),
  
  
        //Telegram
        telegram:JSON.stringify({
          chatID: this.createConnectionField.value.chatID,
          botToken: this.createConnectionField.value.botToken,
          telegramPriority: this.createConnectionField.value.telegramPriority,
          telegramToken: this.createConnectionField.value.telegramToken,
        }),
  
        //SMS
        sms:JSON.stringify({
          smsUrl: this.createConnectionField.value.smsUrl,
          smsNumber: this.createConnectionField.value.smsNumber,
          message_prefix: this.createConnectionField.value.message_prefix,
          message_sufix: this.createConnectionField.value.message_sufix,
          smsBalanceUrl: this.createConnectionField.value.smsBalanceUrl,
          smsPriority: this.createConnectionField.value.smsPriority,
          smsSender: this.createConnectionField.value.smsSender,
          smsKey: this.createConnectionField.value.smsKey,
          smsToken: this.createConnectionField.value.smsToken,
        }),
  
        //Whatsapp
        whatsApp:JSON.stringify({
          whatsappNumber: this.createConnectionField.value.whatsappNumber,
          whatsAppPriority: this.createConnectionField.value.whatsAppPriority,
          whatsAppToken: this.createConnectionField.value.whatsAppToken,
        }),
  
  
        //Email
        email:JSON.stringify({
          email: this.createConnectionField.value.email,
          name: this.createConnectionField.value.name,
          emailPriority: this.createConnectionField.value.emailPriority,
          errorDate: this.createConnectionField.value.errorDate,
          emailResponse: this.createConnectionField.value.emailResponse,
          responseCode: this.createConnectionField.value.responseCode,
          mailOptions_subject: this.createConnectionField.value.mailOptions_subject,
          mailOptions_to: this.createConnectionField.value.mailOptions_to,
          emailToken: this.createConnectionField.value.emailToken,
        }),
  
        //Push Notification
        push:JSON.stringify({
          pushToken: this.createConnectionField.value.pushToken,
          pushPriority: this.createConnectionField.value.pushPriority,
          tokenIDPush: this.createConnectionField.value.tokenIDPush,
        }),
     
        
        dynamicFields: JSON.stringify(this.createConnectionField.value.dynamicFields),
      }

      const tempObj = {
        PK: this.SK_clientID+"#communication#"+this.createConnectionField.value.comtnID+"#main",
        SK: 1,
        metadata:JSON.stringify(this.allCommtnDetails)
      }
  
      console.log("Temp obj is here ",tempObj);
  
  
      const date = Math.ceil(((new Date()).getTime()) / 1000)
      const items ={
      P1: this.createConnectionField.value.comtnID,
      P2: this.createConnectionField.value.version,
      P3:this.createConnectionField.value.username,
      P4: date
      }


    this.api.UpdateMaster(tempObj).then(async value => {

      if (value) {
        await this.fetchTimeMachineById(1,items.P1, 'update', items);


        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "Edited",
            "Module Name": "Communication",
            "Form Name": 'Communication',
          "Description": `${items.P1} Communication ID was Edited`,
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
  


        if(this.selectedComms.includes('Email')){
          const body = { type: "verifyIdentities",email:this.createConnectionField.value.email};

          if(this.currentEmail != body.email){
            this.DynamicApi.sendData(body).subscribe(response => {
              console.log('Response from Lambda:', response);
        
        
              this.toast.open("Mail Sent Successfully", " ", {
        
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                //   //panelClass: ['blue-snackbar']
              })
        
        
            }, error => {
              console.error('Error calling dynamic lambda:', error);
            });
          }
         
        }

       

        this.datatableConfig = {}
        this.lookup_data_communication = []
        this.reloadEvent.next(true)
        this.showAlert(successAlert)
      
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

}



  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    // const tempClient = this.SK_clientID+'#company'+"#lookup";
    let tempClient = this.SK_clientID+"#communication"+"#lookup";
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



  checkMail(event: any) {
    console.log('event', event);
    let Regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    this.errorForInvalidEmail = '';
    if (Regex.test(event.target.value) == false) {
      this.createConnectionField.setErrors({ invalidForm: true });
      this.errorForInvalidEmail = "Invalid Email Address";
    }
  }

  checkUniqueEmail(getMail: any) {
    console.log('getMail', getMail);
    this.errorForUniqueEmail = '';
    for (let uniqueID = 0; uniqueID < this.listofEmails.length; uniqueID++) {
      if (getMail.target.value == this.listofEmails[uniqueID]) {
        this.errorForUniqueEmail = "Email already exists";
      }
    }
  }

}
