import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule, NgbTooltipModule }  from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx-js-style';
import { ExcelValidatorService } from './excel-validator.service';
import { AES } from 'crypto-js';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../../shared.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DynamicApiService } from '../../dynamic-api.service';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import Swal from 'sweetalert2';

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
    P9:any;
    P10:any;
    P11:any;
  };
}

@Component({
  selector: 'app-user-export',
  standalone: true,
  imports: [NgbTooltipModule,NgbModule,CommonModule,NgxSpinnerModule],
  templateUrl: './user-export.component.html',
  styleUrl: './user-export.component.scss'
})
export class UserExportComponent {

  @Output() newItemEvent = new EventEmitter<any>();

  validExcelData: any;
  allUserDetails: any;
  maxlength: number = 500;
  userPool: any;

  constructor(private modalService: NgbModal, private excelValidator: ExcelValidatorService,private api:APIService,private sharedAPi:SharedService,private spinner:NgxSpinnerService,
    private DynamicApi:DynamicApiService
  ){}

  @Input() listofSK:any;
  @Input() uniqueList:any;
  @Input() adminLogin:any;
  @Input() SK_clientID:any;
  @Input() lookup_data_user:any;
  @Input() combinationOfUser:any;

  selectedFile: any;
  isDragging = false;
  error = '';
  validationErrors: string[] = [];
  isUploading:boolean = false


  reloadTable(){
    console.log("I am triggered here reload the table ",);
    this.newItemEvent.emit()
  }


  openFileUploadModal(content: TemplateRef<any>) {
    this.resetState();
    this.modalService.open(content, { 
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
  }

  resetState() {
    this.selectedFile = null;
    this.error = '';
    this.validationErrors = [];
    this.isUploading = false;
    this.isDragging = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
    event.target.value = ''; // Reset input
  }

  async handleFile(file: File) {
    this.error = '';
    this.validationErrors = [];

    // Check file type
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.error = 'Please select an XLSX file';
      return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'File size must be less than 5MB';
      return;
    }

    this.selectedFile = file;

    try {
      const validationResult = await this.excelValidator.validateExcelFile(file,this.listofSK,this.uniqueList,this.adminLogin,this.SK_clientID,this.combinationOfUser);
      if (!validationResult.isValid) {
        this.validationErrors = this.excelValidator.formatValidationErrors(validationResult.errors);
      }
      else{
        this.validExcelData = validationResult

        console.log("Data to be processed is here ",this.validExcelData);
      }
    } catch (err:any) {
      console.log("Error message is here ",err);

      this.error = err.message || 'Error validating file',err;
      this.selectedFile = null;
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.resetState();
  }


 


 exportTemplate(getType: any) {
    let Heading: any;
    let filename: any;
  
    // SELECTED is parameters xlsx
    if (getType == 'users_xlsx') {
      Heading = [
        ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
          'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node',  'Default Module',
          'Redirection ID', 'SMS', 'Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram',
          'Account', 'Cognito Update'
        ],
        ['', '', '', '', '', '', '',
          '', '', '', '', '', '', '',
          '', '', '', '', '', '',
          '']
      ];
  
      filename = 'Users.xlsx';
    }
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Add headings with styles (from Heading array)
    let onlyHeading = XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });
  
    // Define column width for all columns
    let modifiedColumnWidth: any = [];
    for (let allCells = 0; allCells < Heading[0].length; allCells++) {
      modifiedColumnWidth[allCells] = { wch: 50 }; // Set width to 50 for all columns
    }
    ws['!cols'] = modifiedColumnWidth;
  
    // Apply styles to the first row (headers)
    for (let colIndex = 0; colIndex < Heading[0].length; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      const cell = ws[cellAddress];
  
      // Apply style (orange background, white font)
      if (cell) {
        // If it's a required field (like 'UserName' and 'Password'), make it red, otherwise orange
        const isRequired = ['UserName', 'Password','Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile','Mobile Privacy','Permission ID','Location Permission', 'FormID Permission','Start Node'].includes(Heading[0][colIndex]);
        cell.s = {
          fill: {
            fgColor: { rgb: isRequired ? "FF0000" : "FFA500" }, // Red for required, orange for optional
          },
          font: {
            color: { rgb: "FFFFFF" }, // White font color
            bold: true, // Bold font
          }
        };
      }
    }
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Export the file as Users.xlsx
    XLSX.writeFile(wb, filename);
  }
  

  async downLoadUser(){

    this.spinner.show()

      console.log("Users to download are here  ",this.lookup_data_user);

    const pkValues = this.lookup_data_user.map((item: any) => ({
      PK: `${item.P1}#user#main`,
      SK: 1
    }));
    
    // Use a Map to eliminate duplicates based on the combination of PK and SK
    const uniquePkValues = Array.from(
      new Map(pkValues.map((item: any) => [`${item.PK}#${item.SK}`, item])).values()
    );
    
      const chunkArray = (array: any[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }
        return result;
      };

      const pkBatches = chunkArray(uniquePkValues, 100);

      let fetchedData = []

      for (const batch of pkBatches) {
        try {
          const response:any = await this.sharedAPi.batchGetItems(batch) // Convert observable to promise
          console.log("Batch response:", );

          const result = JSON.parse(response.body)

          fetchedData.push(result.items)
        
        } catch (error) {

          this.spinner.hide()
          console.error("Error retrieving batch:", error);
        }
      }

      fetchedData = fetchedData.flat()

      fetchedData = fetchedData.map((item:any)=>item && typeof item.metadata == 'string'? JSON.parse(item.metadata):item.metadata)

      console.log("Fetched data is here ",fetchedData);
      this.downloadExcell(fetchedData,'users_xlsx')
  }


  downloadExcell(fetchedData: any,getType:any) {
    let Heading: any;
    let filename: any;
  
    // SELECTED is parameters xlsx
    if (getType == 'users_xlsx') {
      Heading = [
        ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
          'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node',  'Default Module',
          'Redirection ID', 'SMS', 'Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram',
          'Account', 'Cognito Update'
        ]
      ];
      filename = 'Users.xlsx';
    }
  
    // Prepare the data for insertion into the worksheet
    const formattedData = fetchedData.flat().map((user: any) => {
      return [
        user.username || '',
        user.password || '',
        user.clientID || '',
        user.companyID || '',
        user.email || '',
        user.userID || '',
        user.description || '',
        user.mobile || '',
        user.mobile_privacy || '',
        user.telegramID || '',
        user.permission_ID || '',
        user.location_permission && user.location_permission.toString() || '',
        user.form_permission && user.form_permission.toString() || '',
        user.start_node || '',
        user.default_module || '',
        user.redirectionURL || '',
        user.alert_sms || '',
        user.alert_telegram || '',
        user.escalation_email || '',
        user.escalation_sms || '',
        user.escalation_telegram || '',
        user.enable_user || '',
        user.cognito_update || ''
      ];
    });
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Add headings to the sheet
    let onlyHeading = XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });
  
    // Add data to the sheet
    XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: 'A2' });
  
    // Define column width for all columns (Set width to 50 for all columns)
    let modifiedColumnWidth: any = [];
    for (let allCells = 0; allCells < Heading[0].length; allCells++) {
      modifiedColumnWidth[allCells] = { wch: 50 }; // Set width to 50 for all columns
    }
    ws['!cols'] = modifiedColumnWidth;
  
    // Apply styles to the first row (headers)
    for (let colIndex = 0; colIndex < Heading[0].length; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      const cell = ws[cellAddress];
  
      if (cell) {
        const isRequired = ['UserName', 'Password','Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile','Mobile Privacy','Permission ID','Location Permission', 'FormID Permission','Start Node'].includes(Heading[0][colIndex]);
        cell.s = {
          fill: {
            fgColor: { rgb: isRequired ? "FF0000" : "FFA500" }, // Red for required, orange for optional
          },
          font: {
            color: { rgb: "FFFFFF" }, // White font color
            bold: true, // Bold font
          }
        };
      }
    }
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Export the file as Users.xlsx
    XLSX.writeFile(wb, filename);

    this.spinner.hide()
  }


  
  async uploadFile(modal: any): Promise<void> {
    if (!this.selectedFile || this.validationErrors.length > 0) return;

    try {
      this.isUploading = true;

      const tempcreateHolder = this.validExcelData.createRows
      const tempupdateHolder = this.validExcelData.updateRows

      this.spinner.show()


      if(tempcreateHolder && Array.isArray(tempcreateHolder) && tempcreateHolder.length > 0){
        for(let user of tempcreateHolder){
          await this.createNewUser(user)
        }
      }


      if(tempupdateHolder && Array.isArray(tempupdateHolder) && tempupdateHolder.length > 0){
        for(let user of tempupdateHolder){
          await this.updateUser(user)
        }
      }

      Swal.fire({
        icon: 'success', // or another icon like 'info', 'error', etc.
        title: `File Uploaded Successfully: ${tempcreateHolder.length} users added,  ${tempupdateHolder.length} users updated.`,
        showConfirmButton: true,
      })

      this.reloadTable()         
      console.log('File uploaded successfully:', this.selectedFile);
      modal.close();
    } catch (err) {
      this.error = 'Error uploading file. Please try again.',err;
    } finally {
      this.isUploading = false;
      this.spinner.hide()
    }
  }

  async updateUser(userFields: any) {

    try{
      console.log("User Details are here ",userFields);
      let tempObj:any = {}
  
  
        this.allUserDetails = {}
  
          this.allUserDetails = {
            username: userFields[0].toLowerCase(),
            password: userFields[1],
            clientID: userFields[2],
            companyID:userFields[3],
            email: userFields[4],
            userID: userFields[5].toLowerCase(),
            description: userFields[6],
            mobile: userFields[7],
            mobile_privacy: userFields[8],
            telegramID: userFields[9],
            permission_ID: userFields[10],
            location_permission:userFields[11].includes(',') == true ? userFields[11].split(','):[userFields[11]],
            form_permission:userFields[12].includes(',') == true ? userFields[12].split(','):[userFields[12]],
            start_node: userFields[13],
            default_module:userFields[14],
            redirectionURL:userFields[15],
            alert_sms: userFields[16],
            alert_telegram: userFields[17],
            escalation_email: userFields[18],
            escalation_sms: userFields[19],
            escalation_telegram: userFields[20],
            cognito_update:userFields[21],
            enable_user: userFields[22],
            updated: new Date()
          }
  
  
          tempObj = {
            PK:(this.allUserDetails.username).toLowerCase()+"#user"+"#main",
            SK:1,
            metadata:JSON.stringify(this.allUserDetails)
          }

          const tempClient = this.allUserDetails.clientID
      

          let temp1 = this.allUserDetails.form_permission;
          let temp2 = '';
    
          if (temp1) {
            // If temp1 is not null or undefined
            if (temp1.length === 1) {
              temp2 = temp1[0];
            } else if (temp1.length > 1) {
              temp2 = temp1[0] + '...(' + (temp1.length) + ')';
            } else {
              temp2 = '...(0)';
            }
          } else {
            // If temp1 is null or undefined
            temp2 = '...(0)';
          }
    
    
    
          let temp3 = this.allUserDetails.location_permission;
          let temp4 = '';
    
          if (temp3) {
            // If temp1 is not null or undefined
            if (temp3.length === 1) {
              temp4 = temp3[0];
            } else if (temp3.length > 1) {
              temp4 = temp3[0] + '...(' + (temp3.length) + ')';
            } else {
              temp4 = '...(0)';
            }
          } else {
            // If temp1 is null or undefined
            temp4 = '...(0)';
          }
    
    
          const date = Math.ceil(((new Date()).getTime()) / 1000)
          const items ={
          P1: (this.allUserDetails.username).toLowerCase(),
          P2: this.allUserDetails.mobile,
          P3: this.allUserDetails.email,
          P4: this.allUserDetails.permission_ID,
          P5:temp4,
          P6:temp2,
          P7:date
          }
    
          const masterUser = {
            P1:(this.allUserDetails.username).toLowerCase(),
            P2:this.allUserDetails.clientID,
            P3:this.allUserDetails.email,
            P4:this.allUserDetails.mobile,
            P5:(this.allUserDetails.userID).toLowerCase()
          }
    
          console.log("User master table data is here ",masterUser);
    
          console.log('newly added user', this.allUserDetails);
    
          console.log("Items are here ",items);


          // Create the master user table entry
          await this.api.UpdateMaster(tempObj);

          await this.fetchTimeMachineById(1,masterUser.P1, 'update', items,masterUser.P2);
          await this.fetchAllusersData(1,masterUser.P1,'update',masterUser)

          await this.updateCognitoAttributes(this.allUserDetails);
    }
    catch(error){
      console.log("Error in object Creation ",error);
    }
  }



  async updateCognitoAttributes(userFields: any) {

    console.log("User fields are here ",userFields);

    try {
      // Prepare the authentication data
      let authenticationData = {
        Username: userFields.username,
        Password: userFields.password,
      };
  
      let poolData = {
        UserPoolId: "ap-south-1_aaPSwPS14", // Your Cognito UserPoolId
        ClientId: "42pb85v3sv84jdrfi1rub7a4e5" // Your Cognito ClientId
      };
  
      // Create user pool and cognito user instance
      let userPool = new CognitoUserPool(poolData);
      let poolDetails: any = {
        Username: userFields.username,
        Pool: userPool
      };
      
      let cognitoUser = new CognitoUser(poolDetails);
      
      // Prepare the user data for updating attributes
      let userData: any = {
        "email": userFields.email,
        'custom:userID': userFields.userID,
        'custom:password': userFields.password,
        'custom:clientID': this.allUserDetails.clientID,
        'custom:companyID': this.allUserDetails.companyID,
        'custom:username': userFields.username,
        'custom:description': userFields.description,
        'custom:mobile': JSON.stringify(userFields.mobile),
        'custom:mobile_privacy': userFields.mobile_privacy,
        'custom:user_type': JSON.stringify(userFields.user_type),
        'custom:enable_user': JSON.stringify(userFields.enable_user == null ? false : userFields.enable_user),
        'custom:disable_user': JSON.stringify(userFields.disable_user == null ? false : userFields.disable_user),
        'custom:alert_email': JSON.stringify(userFields.alert_email == null ? false : userFields.alert_email),
        'custom:alert_sms': JSON.stringify(userFields.alert_sms == null ? false : userFields.alert_sms),
        'custom:alert_telegram': JSON.stringify(userFields.alert_telegram == null ? false : userFields.alert_telegram),
        'custom:escalation_email': JSON.stringify(userFields.escalation_email == null ? false : userFields.escalation_email),
        'custom:escalation_sms': JSON.stringify(userFields.escalation_sms == null ? false : userFields.escalation_sms),
        'custom:escalation_telegram': JSON.stringify(userFields.escalation_telegram == null ? false : userFields.escalation_telegram),
        'custom:telegramID': JSON.stringify(userFields.telegramID),
        'custom:permission_id': this.allUserDetails.permission_ID,
        'custom:defaultdevloc': userFields.default_dev_loc ?? '',
      };
  
      // Wrap the authenticateUser in a Promise to use async/await
      const authenticateUser = () => {
        return new Promise((resolve, reject) => {
          let authenticationDetails = new AuthenticationDetails(authenticationData);
  
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result: any) {
              resolve(result);
            },
            onFailure: function (err: any) {
              reject(err);
            },
          });
        });
      };
  
      // Wait for authentication to succeed
      const authResult:any = await authenticateUser();
      const accessToken = authResult.getAccessToken().getJwtToken();
  
      console.log("Authentication successful, access token: ", accessToken);
  
      // Prepare the attribute list
      let attributeList = Object.keys(userData).map((key) => {
        return new CognitoUserAttribute({
          Name: key,
          Value: userData[key]
        });
      });
  
      // Wrap the updateAttributes function in a Promise to use async/await
      const updateAttributes = () => {
        return new Promise((resolve, reject) => {
          cognitoUser.updateAttributes(attributeList, (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };
  
      // Wait for the attributes to be updated
      const updateResult = await updateAttributes();
      console.log("User attributes updated successfully: ", updateResult);
  
    } catch (error) {
      console.error("Error updating Cognito attributes: ", error);
    }
  }
  



  async createNewUser(userFields: any) {

    try{
      console.log("User Details are here ",userFields);

      let token = this.generateToken((userFields[0]).toLowerCase(), userFields[2]);
      let tempObj:any = {}
  
  
        this.allUserDetails = {}
  
        
          this.allUserDetails = {
            key: token,
            username: userFields[0].toLowerCase(),
            password: userFields[1],
            clientID: userFields[2],
            companyID:userFields[3],
            email: userFields[4],
            userID: userFields[5].toLowerCase(),
            description: userFields[6],
            mobile: userFields[7],
            mobile_privacy: userFields[8],
            telegramID: userFields[9],
            permission_ID: userFields[10],
            location_permission:userFields[11].includes(',') == true ? userFields[11].split(','):[userFields[11]],
            form_permission:userFields[12].includes(',') == true ? userFields[12].split(','):[userFields[12]],
            start_node: userFields[13],
            default_module:userFields[14],
            redirectionURL:userFields[15],
            alert_sms: userFields[16],
            alert_telegram: userFields[17],
            escalation_email: userFields[18],
            escalation_sms: userFields[19],
            escalation_telegram: userFields[20],
            cognito_update:userFields[21],
            enable_user: userFields[22],
            updated: new Date()
          }
  
  
          tempObj = {
            PK:(this.allUserDetails.username).toLowerCase()+"#user"+"#main",
            SK:1,
            metadata:JSON.stringify(this.allUserDetails)
          }

          const tempClient = this.allUserDetails.clientID
      

          let temp1 = this.allUserDetails.form_permission;
          let temp2 = '';
    
          if (temp1) {
            // If temp1 is not null or undefined
            if (temp1.length === 1) {
              temp2 = temp1[0];
            } else if (temp1.length > 1) {
              temp2 = temp1[0] + '...(' + (temp1.length) + ')';
            } else {
              temp2 = '...(0)';
            }
          } else {
            // If temp1 is null or undefined
            temp2 = '...(0)';
          }
    
    
    
          let temp3 = this.allUserDetails.location_permission;
          let temp4 = '';
    
          if (temp3) {
            // If temp1 is not null or undefined
            if (temp3.length === 1) {
              temp4 = temp3[0];
            } else if (temp3.length > 1) {
              temp4 = temp3[0] + '...(' + (temp3.length) + ')';
            } else {
              temp4 = '...(0)';
            }
          } else {
            // If temp1 is null or undefined
            temp4 = '...(0)';
          }
    
    
          const date = Math.ceil(((new Date()).getTime()) / 1000)
          const items ={
          P1: (this.allUserDetails.username).toLowerCase(),
          P2: this.allUserDetails.mobile,
          P3: this.allUserDetails.email,
          P4: this.allUserDetails.permission_ID,
          P5:temp4,
          P6:temp2,
          P7:date
          }
    
          const masterUser = {
            P1:(this.allUserDetails.username).toLowerCase(),
            P2:this.allUserDetails.clientID,
            P3:this.allUserDetails.email,
            P4:this.allUserDetails.mobile,
            P5:(this.allUserDetails.userID).toLowerCase()
          }
    
          console.log("User master table data is here ",masterUser);
    
          console.log('newly added user', this.allUserDetails);
    
          console.log("Items are here ",items);


          // Create the master user table entry
          await this.api.CreateMaster(tempObj);

          // Send dynamic lambda request
          const body = { type: "userVerify", username: masterUser.P1, name: userFields.password, email: masterUser.P3 };
          await this.DynamicApi.sendData(body).toPromise();  // Use toPromise for async/await


          await this.createLookUpRdt(items,1,tempClient+"#user"+"#lookup")
          await this.createLookUpRdt(masterUser,1,"#user#All");

          await this.addtoCognitoTable(this.allUserDetails);
        
      
    }
    catch(error){
      console.log("Error in object Creation ",error);
    }

  }


  async addtoCognitoTable(getValues: any) {
    // Adding to cognito table
    console.log('cogntio table', getValues);
    if (getValues) {
  
      let poolData = {
        UserPoolId: "ap-south-1_aaPSwPS14", 
        ClientId: "42pb85v3sv84jdrfi1rub7a4e5"
      };
  
      console.log('poolData after user added to cognito', poolData);
  
      this.userPool = new CognitoUserPool(poolData);
  
      let attributeList = [];
      let formData: any = {
        "email": String(getValues.email),
        'custom:userID': String(getValues.userID),
        'custom:password': String(getValues.password),
        'custom:clientID': String(getValues.clientID),
        'custom:companyID': String(getValues.companyID),
        'custom:username': String(getValues.username),
        'custom:description': String(getValues.description),
        'custom:mobile': JSON.stringify(getValues.mobile),
        'custom:mobile_privacy': String(getValues.mobile_privacy),
        'custom:user_type': JSON.stringify(getValues.user_type),
        'custom:enable_user': String(getValues.enable_user ?? false),
        'custom:disable_user': String(getValues.disable_user ?? false),
        'custom:alert_email': String(getValues.alert_email ?? false),
        'custom:alert_sms': String(getValues.alert_sms ?? false),
        'custom:alert_telegram': String(getValues.alert_telegram ?? false),
        'custom:escalation_email': String(getValues.escalation_email ?? false),
        'custom:escalation_sms': String(getValues.escalation_sms ?? false),
        'custom:escalation_telegram': String(getValues.escalation_telegram ?? false),
        'custom:telegramID': String(getValues.telegramID),
        'custom:permission_id': String(getValues.permission_ID),
        'custom:defaultdevloc': String(getValues.default_dev_loc ?? ''),
      }
  
      // Loop through and add attributes to cognito
      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        }
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }
  
      // Sign up user in Cognito sequentially
      return new Promise((resolve, reject) => {
        this.userPool.signUp(getValues.username, getValues.password, attributeList, [], (err: { message: any; }, result: any) => {
          if (err) {
            reject(err.message || JSON.stringify(err));
          }
          resolve(result);
        });
      });
    } else {
      // Handle error part if values are not provided
      throw new Error('Invalid user data for Cognito');
    }
  }
  




  // async addtoCognitoTable(getValues: any) {
  //   //adding to cognito table
  //   console.log('cogntio table', getValues);
  //   if (getValues) {

  //     //aceesing iDs from env.ts
  //     let poolData = {
  //       UserPoolId: "ap-south-1_aaPSwPS14", // user pool id here
  //       ClientId: "42pb85v3sv84jdrfi1rub7a4e5"// client id here
  //     };

  //     console.log('poolData after user added to cognito', poolData);

  //     this.userPool = new CognitoUserPool(poolData);

  //     let attributeList = [];

  //     let formData: any = {
  //       "email": String(getValues.email),
  //       'custom:userID': String(getValues.userID),
  //       'custom:password': String(getValues.password),
  //       'custom:clientID': String(getValues.clientID),
  //       'custom:companyID': String(getValues.companyID),
  //       'custom:username': String(getValues.username),
  //       'custom:description': String(getValues.description),
  //       'custom:mobile': JSON.stringify(getValues.mobile), // Check if this needs to be a string
  //       'custom:mobile_privacy': String(getValues.mobile_privacy),
  //       'custom:user_type': JSON.stringify(getValues.user_type),
  //       'custom:enable_user': String(getValues.enable_user ?? false),
  //       'custom:disable_user': String(getValues.disable_user ?? false),
  //       'custom:alert_email': String(getValues.alert_email ?? false),
  //       'custom:alert_sms': String(getValues.alert_sms ?? false),
  //       'custom:alert_telegram': String(getValues.alert_telegram ?? false),
  //       'custom:escalation_email': String(getValues.escalation_email ?? false),
  //       'custom:escalation_sms': String(getValues.escalation_sms ?? false),
  //       'custom:escalation_telegram': String(getValues.escalation_telegram ?? false),
  //       'custom:telegramID': String(getValues.telegramID),
  //       'custom:permission_id': String(getValues.permission_ID),
  //       'custom:defaultdevloc': String(getValues.default_dev_loc ?? ''),
  //   }

  //     //looping key,value
  //     for (let key in formData) {

  //       let attrData = {
  //         Name: key,
  //         Value: formData[key]
  //       }
  //       //console.log('attribute data', attrData)
  //       let attribute = new CognitoUserAttribute(attrData);
  //       attributeList.push(attribute)
  //     }

  //     //}
  //     //console.log('attribute list', attributeList);
  //     this.userPool.signUp(getValues.username, getValues.password, attributeList, [], (
  //       err: { message: any; },
  //       result: any
  //     ) => {
  //       // this.isLoading = false;
  //       if (err) {
  //         //console.log('err on signup', err);
  //         alert(err.message || JSON.stringify(err));
  //       }
  //       console.log('result after user is added', result);

  //     });
  //   }
  //   else {
  //    //Error part
  //   }
  // }


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

  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any,client:any) {
    const tempClient = client+'#user'+"#lookup";
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
          await this.fetchTimeMachineById(sk + 1, id, type, item,client); // Retry with next SK
  
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



  async   fetchAllusersData(sk: any, id: any, type: any, item: any) {
    const tempClient = '#user'+"#All";
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
          await this.fetchAllusersData(sk + 1, id, type, item); // Retry with next SK
  
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


  generateToken(username: string, clientInfo: string): string {
    const data = `${username}:${clientInfo}`;
    const secretKey = 'wimate_trust'; // Replace with your secret key

    const encryptedData = AES.encrypt(data, secretKey).toString();
    console.log('My_key', encryptedData)
    return encryptedData;
  }

}
