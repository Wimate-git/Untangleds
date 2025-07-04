import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx-js-style';
import { ExcelValidatorService } from './excel-validator.service';
import { AES } from 'crypto-js';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../../shared.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DynamicApiService } from '../../dynamic-api.service';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import Swal from 'sweetalert2';
import { AuditTrailService } from '../../services/auditTrail.service';
import { UserFormsService } from '../../services/user-forms.service';
import ExcelJS from 'exceljs';

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
  selector: 'app-user-export',
  standalone: true,
  imports: [NgbTooltipModule, NgbModule, CommonModule, NgxSpinnerModule],
  templateUrl: './user-export.component.html',
  styleUrl: './user-export.component.scss'
})
export class UserExportComponent {

  @Output() newItemEvent = new EventEmitter<any>();

  validExcelData: any;
  allUserDetails: any;
  maxlength: number = 500;
  userPool: any;
  username: any;
  avgLabourHistory: any = [];
  listAllUsersCOgnito: any = [];

  constructor(private modalService: NgbModal, private excelValidator: ExcelValidatorService, private api: APIService, private sharedAPi: SharedService, private spinner: NgxSpinnerService,
    private DynamicApi: DynamicApiService, private loggedInUser: SharedService, private auditTrail: AuditTrailService, private userForm: UserFormsService
  ) { }

  @Input() listofSK: any;
  @Input() uniqueList: any;
  @Input() adminLogin: any;
  @Input() SK_clientID: any;
  @Input() lookup_data_user: any;
  @Input() combinationOfUser: any;

  selectedFile: any;
  isDragging = false;
  error = '';
  validationErrors: string[] = [];
  isUploading: boolean = false


  ngOnInit() {

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

    const logInUserData = this.loggedInUser.getLoggedUserDetails()
    this.username = logInUserData.username

    this.listAllUsers()
  }


  reloadTable() {
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
      const validationResult = await this.excelValidator.validateExcelFile(file, this.listofSK, this.uniqueList, this.adminLogin, this.SK_clientID, this.combinationOfUser);
      if (!validationResult.isValid) {
        this.validationErrors = this.excelValidator.formatValidationErrors(validationResult.errors);
      }
      else {
        this.validExcelData = validationResult

        console.log("Data to be processed is here ", this.validExcelData);
      }
    } catch (err: any) {
      console.log("Error message is here ", err);

      this.error = err.message || 'Error validating file', err;
      this.selectedFile = null;
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.resetState();
  }



  exportTemplateV2(getType: any) {

    console.log("This uniqueList ",this.uniqueList);
  
    let Heading: any;
    let filename: any;
    let dropdownConfigs: any = {};

    if (getType == 'users_xlsx') {
      Heading = [
        ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
          'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node', 'Default Module',
          'Redirection ID', 'Average Labour Cost','Enable Email', 'Enable SMS', 'Enable Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram', "Enable User"
        ],
        ['', '', '', '', '', '', '',
          '', '', '', '', '', '', '',
          '', '', '', '', '', '',
          '']
      ];

      dropdownConfigs = {
        'Default Module': ['None','Forms','Dashboard','Dashboard - Group','Summary Dashboard','Projects','Project - Group','Project - Detail'],
        'Mobile Privacy': ['Visible','Invisible']
      };

      filename = 'Users.xlsx';
    }
  
    const requiredFields =['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Permission ID', 'Location Permission', 'FormID Permission'];
  
    const workbook: any = new ExcelJS.Workbook();
    const worksheet: any = workbook.addWorksheet('USER');
  
    worksheet.addRows(Heading);
    worksheet.columns = Heading[0].map(() => ({ width: 50 }));
  
    // ✅ Arrays from component
    const locationPermissionOptions = this.uniqueList[6] || ["All"] ;
    const formPermissionOptions =  this.uniqueList[7] || ["All"] ;
    // const rdtPermssionOptions = this.rdtListWorkAround || ["All"] 
    const permissionIDOptions:any = Array.from(this.uniqueList[5]) || ["All"] 
    const companyOptions = this.uniqueList[1] || [] 
    // const treeOptions = this.treeDataArray || ["World"]
  
    // Create hidden sheet for large dropdowns
    const hiddenSheet = workbook.addWorksheet('DropdownOptions');
    hiddenSheet.state = 'veryHidden';
  
    // Fill location permissions in column A
    locationPermissionOptions.forEach((value: string, index: number) => {
      hiddenSheet.getCell(`C${index + 1}`).value = value;
    });
  
    // // Fill device permissions in column B
    formPermissionOptions.forEach((value: string, index: number) => {
      hiddenSheet.getCell(`D${index + 1}`).value = value;
    });

    // rdtPermssionOptions.forEach((value: string, index: number)=>{
    //   hiddenSheet.getCell(`C${index + 1}`).value = value;
    // })  

    permissionIDOptions.forEach((value: string, index: number)=>{
      hiddenSheet.getCell(`A${index + 1}`).value = value;
    })  

    companyOptions.forEach((value: string, index: number)=>{
      hiddenSheet.getCell(`B${index + 1}`).value = value;
    })  

    // treeOptions.forEach((value: string, index: number)=>{
    //   hiddenSheet.getCell(`F${index + 1}`).value = value;
    // })  


    // Create reference ranges
    const locationListRange = `DropdownOptions!$C$1:$C$${locationPermissionOptions.length}`;
    const deviceListRange = `DropdownOptions!$D$1:$D$${formPermissionOptions.length}`;
    // const rdtListRange = `DropdownOptions!$C$1:$C$${rdtPermssionOptions.length}`;
    const permissionRange = `DropdownOptions!$A$1:$A$${permissionIDOptions.length}`;
    const companyRange = `DropdownOptions!$B$1:$B$${companyOptions.length}`;
    // const treeRange = `DropdownOptions!$B$1:$B$${treeOptions.length}`;
  
    // Add dropdowns and styles to header row
    Heading[0].forEach((header: string, columnIndex: number) => {
      const cell = worksheet.getCell(1, columnIndex + 1);
      const columnLetter = worksheet.getColumn(columnIndex + 1).letter;
  
      // Style header
      cell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: requiredFields.includes(header) ? 'FF0000' : 'FFA500' }
        },
        font: {
          bold: true,
          color: { argb: 'FFFFFF' }
        }
      };
  
      
      if(header === 'Location Permission'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${locationListRange}`]
        });
      }
      if(header === 'FormID Permission'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${deviceListRange}`]
        });
      }
      if(header === 'Permission ID'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${permissionRange}`]
        });
      }
      else if(header === 'Company ID'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${companyRange}`]
        });
      }

      else if (dropdownConfigs[header]) {
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`"${dropdownConfigs[header].join(',')}"`]
        });
      }
    });
  
    // Export the file
    workbook.xlsx.writeBuffer().then((buffer: BlobPart) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }).catch((error: any) => {
      console.error('Error writing the file', error);
    });
  }




  exportTemplate(getType: any) {
    let Heading: any;
    let filename: any;

    // SELECTED is parameters xlsx
    if (getType == 'users_xlsx') {
      Heading = [
        ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
          'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node', 'Default Module',
          'Redirection ID', 'Average Labour Cost','Enable Email', 'Enable SMS', 'Enable Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram', "Enable User"
        ],
        ['', '', '', '', '', '', '',
          '', '', '', '', '', '', '',
          '', '', '', '', '', '',
          '']
      ];

      filename = 'Users.xlsx';
    }

    //avg_labour_cost

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
        const isRequired = ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Permission ID', 'Location Permission', 'FormID Permission'].includes(Heading[0][colIndex]);
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



    try {
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "User Management",
        "Form Name": 'User Management',
        "Description": `User Template was Downloaded`,
        "User Id": this.username,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails, this.SK_clientID)
    }
    catch (error) {
      console.log("Error while creating audit trails ", error);
    }


  }


  async downLoadUser() {

    this.spinner.show()

    console.log("Users to download are here  ", this.lookup_data_user);

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
        const response: any = await this.sharedAPi.batchGetItems(batch) // Convert observable to promise
        console.log("Batch response:",);

        const result = JSON.parse(response.body)

        fetchedData.push(result.items)

      } catch (error) {

        this.spinner.hide()
        console.error("Error retrieving batch:", error);
      }
    }

    fetchedData = fetchedData.flat()

    fetchedData = fetchedData.map((item: any) => item && typeof item.metadata == 'string' ? JSON.parse(item.metadata) : item.metadata)

    fetchedData = fetchedData.sort((a:{updated:any},b:{updated:any})=> new Date(b.updated).getTime() - new Date(a.updated).getTime())

    console.log("Fetched data is here ", fetchedData);
    this.downloadExcell(fetchedData, 'users_xlsx')




    try {
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "User Management",
        "Form Name": 'User Management',
        "Description": `User List Exported/Downloaded`,
        "User Id": this.username,
        "Client Id": this.SK_clientID,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails, this.SK_clientID)
    }
    catch (error) {
      console.log("Error while creating audit trails ", error);
    }
  }

  downloadExcell(fetchedData: any, getType: any) {
    let Heading: any;
    let filename: any;
    let dropdownConfigs:any

    // SELECTED is parameters xlsx
    if (getType == 'users_xlsx') {
      Heading = [
        ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
          'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node', 'Default Module',
          'Redirection ID', 'Average Labour Cost','Enable Email', 'Enable SMS', 'Enable Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram', "Enable User"
        ]
      ];

      dropdownConfigs = {
        'Default Module':['None','Forms','Dashboard','Dashboard - Group','Summary Dashboard','Projects','Project - Group','Project - Detail'],
        'Mobile Privacy': ['Visible', 'Invisible']
      }
      filename = 'Users.xlsx';
    }

    const requiredFields =['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Permission ID', 'Location Permission', 'FormID Permission'];

    // Prepare the data for insertion into the worksheet
    const formattedData = fetchedData.flat().map((user: any) => {
      return [
        user.username || '',
        "Password@123",
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
        user.avg_labour_cost || '',
        user.alert_email || '',
        user.alert_sms || '',
        user.alert_telegram || '',
        user.escalation_email || '',
        user.escalation_sms || '',
        user.escalation_telegram || '',
        user.enable_user || ''
      ];
    });

    const workbook: any = new ExcelJS.Workbook();
    const worksheet: any = workbook.addWorksheet('USER');
  
    worksheet.addRows(Heading);
    worksheet.columns = Heading[0].map(() => ({ width: 50 }));
  
    // ✅ Arrays from component
    const locationPermissionOptions = this.uniqueList[6] || ["All"] ;
    const formPermissionOptions =  this.uniqueList[7] || ["All"] ;
    // const rdtPermssionOptions = this.rdtListWorkAround || ["All"] 
    const permissionIDOptions:any = Array.from(this.uniqueList[5]) || ["All"] 
    const companyOptions = this.uniqueList[1] || [] 
    // const treeOptions = this.treeDataArray || ["World"]
  
    // Create hidden sheet for large dropdowns
    const hiddenSheet = workbook.addWorksheet('DropdownOptions');
    hiddenSheet.state = 'veryHidden';
  
    // Fill location permissions in column A
    locationPermissionOptions.forEach((value: string, index: number) => {
      hiddenSheet.getCell(`C${index + 1}`).value = value;
    });
  
    // // Fill device permissions in column B
    formPermissionOptions.forEach((value: string, index: number) => {
      hiddenSheet.getCell(`D${index + 1}`).value = value;
    });

    // rdtPermssionOptions.forEach((value: string, index: number)=>{
    //   hiddenSheet.getCell(`C${index + 1}`).value = value;
    // })  

    permissionIDOptions.forEach((value: string, index: number)=>{
      hiddenSheet.getCell(`A${index + 1}`).value = value;
    })  

    companyOptions.forEach((value: string, index: number)=>{
      hiddenSheet.getCell(`B${index + 1}`).value = value;
    })  

    // treeOptions.forEach((value: string, index: number)=>{
    //   hiddenSheet.getCell(`F${index + 1}`).value = value;
    // })  


    // Create reference ranges
    const locationListRange = `DropdownOptions!$C$1:$C$${locationPermissionOptions.length}`;
    const deviceListRange = `DropdownOptions!$D$1:$D$${formPermissionOptions.length}`;
    // const rdtListRange = `DropdownOptions!$C$1:$C$${rdtPermssionOptions.length}`;
    const permissionRange = `DropdownOptions!$A$1:$A$${permissionIDOptions.length}`;
    const companyRange = `DropdownOptions!$B$1:$B$${companyOptions.length}`;
    // const treeRange = `DropdownOptions!$B$1:$B$${treeOptions.length}`;
  
    // Add dropdowns and styles to header row
    Heading[0].forEach((header: string, columnIndex: number) => {
      const cell = worksheet.getCell(1, columnIndex + 1);
      const columnLetter = worksheet.getColumn(columnIndex + 1).letter;
  
      // Style header
      cell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: requiredFields.includes(header) ? 'FF0000' : 'FFA500' }
        },
        font: {
          bold: true,
          color: { argb: 'FFFFFF' }
        }
      };
  
      
      if(header === 'Location Permission'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${locationListRange}`]
        });
      }
      if(header === 'FormID Permission'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${deviceListRange}`]
        });
      }
      if(header === 'Permission ID'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${permissionRange}`]
        });
      }
      else if(header === 'Company ID'){
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`=${companyRange}`]
        });
      }

      else if (dropdownConfigs[header]) {
        worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1000`, {
          type: 'list',
          allowBlank: true,
          formulae: [`"${dropdownConfigs[header].join(',')}"`]
        });
      }
    });


       // Add grid data (excluding header row)
       const temGridDataHolder = formattedData && JSON.parse(JSON.stringify(formattedData));
       if (temGridDataHolder) {
         temGridDataHolder.forEach((dataRow: any) => {
           worksheet.addRow(dataRow);
         });
       }
     
       workbook.xlsx.writeBuffer().then((buffer: BlobPart) => {
         const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = filename;
         link.click();
       }).catch((error: any) => {
         console.error("Error exporting Excel file", error);
       });

    this.spinner.hide();
  }


  // downloadExcell(fetchedData: any,getType:any) {
  //   let Heading: any;
  //   let filename: any;

  //   // SELECTED is parameters xlsx
  //   if (getType == 'users_xlsx') {
  //     Heading = [
  //       ['UserName', 'Password', 'Client ID', 'Company ID', 'Email', 'User ID', 'Description', 'Mobile',
  //         'Mobile Privacy', 'Telegram Channel ID', 'Permission ID', 'Location Permission', 'FormID Permission', 'Start Node',  'Default Module',
  //         'Redirection ID','Average Labour Cost', 'SMS', 'Telegram', 'Escalation Email', 'Escalation SMS', 'Escalation Telegram','Created Time'
  //       ]
  //     ];
  //     filename = 'Users.xlsx';
  //   }

  //   // Prepare the data for insertion into the worksheet
  //   const formattedData = fetchedData.flat().map((user: any) => {
  //     return [
  //       user.username || '',
  //       user.password || '',
  //       user.clientID || '',
  //       user.companyID || '',
  //       user.email || '',
  //       user.userID || '',
  //       user.description || '',
  //       user.mobile || '',
  //       user.mobile_privacy || '',
  //       user.telegramID || '',
  //       user.permission_ID || '',
  //       user.location_permission && user.location_permission.toString() || '',
  //       user.form_permission && user.form_permission.toString() || '',
  //       user.start_node || '',
  //       user.default_module || '',
  //       user.redirectionURL || '',
  //       user.avg_labour_cost || '',
  //       user.alert_sms || '',
  //       user.alert_telegram || '',
  //       user.escalation_email || '',
  //       user.escalation_sms || '',
  //       user.escalation_telegram || ''
  //     ];
  //   });

  //   // Create a new workbook
  //   const wb = XLSX.utils.book_new();
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  //   // Add headings to the sheet
  //   let onlyHeading = XLSX.utils.sheet_add_aoa(ws, Heading, { origin: 'A1' });

  //   // Add data to the sheet
  //   XLSX.utils.sheet_add_aoa(ws, formattedData, { origin: 'A2' });

  //   // Define column width for all columns (Set width to 50 for all columns)
  //   let modifiedColumnWidth: any = [];
  //   for (let allCells = 0; allCells < Heading[0].length; allCells++) {
  //     modifiedColumnWidth[allCells] = { wch: 50 }; // Set width to 50 for all columns
  //   }
  //   ws['!cols'] = modifiedColumnWidth;

  //   // Apply styles to the first row (headers)
  //   for (let colIndex = 0; colIndex < Heading[0].length; colIndex++) {
  //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
  //     const cell = ws[cellAddress];

  //     if (cell) {
  //       const isRequired = ['UserName', 'Password','Client ID', 'Company ID', 'Email', 'User ID', 'Description','Permission ID','Location Permission', 'FormID Permission'].includes(Heading[0][colIndex]);
  //       cell.s = {
  //         fill: {
  //           fgColor: { rgb: isRequired ? "FF0000" : "FFA500" }, // Red for required, orange for optional
  //         },
  //         font: {
  //           color: { rgb: "FFFFFF" }, // White font color
  //           bold: true, // Bold font
  //         }
  //       };
  //     }
  //   }

  //   // Append the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Export the file as Users.xlsx
  //   XLSX.writeFile(wb, filename);

  //   this.spinner.hide()
  // }



  async uploadFile(modal: any): Promise<void> {

  

    if (!this.selectedFile || this.validationErrors.length > 0) return;

    try {
      this.isUploading = true;

      const tempcreateHolder = this.validExcelData.createRows
      const tempupdateHolder = this.validExcelData.updateRows

      this.spinner.show()


      await this.listAllUsers()


      if (tempcreateHolder && Array.isArray(tempcreateHolder) && tempcreateHolder.length > 0) {
        for (let user of tempcreateHolder) {
          await this.createNewUser(user)
        }
      }


      if (tempupdateHolder && Array.isArray(tempupdateHolder) && tempupdateHolder.length > 0) {
        for (let user of tempupdateHolder) {
          await this.updateUser(user)
        }
      }


      if (tempupdateHolder && Array.isArray(tempupdateHolder) && tempupdateHolder.length > 0 || tempcreateHolder && Array.isArray(tempcreateHolder) && tempcreateHolder.length > 0) {
        Swal.fire({
          icon: 'success', // or another icon like 'info', 'error', etc.
          title: `File Uploaded Successfully: ${tempcreateHolder.length} users added,  ${tempupdateHolder.length} users updated.`,
          showConfirmButton: true,
        })


        try {
          const UserDetails = {
            "User Name": this.username,
            "Action": "Created/Edited",
            "Module Name": "User Management",
            "Form Name": 'User Management',
            "Description": `Users were Imported through excel`,
            "User Id": this.username,
            "Client Id": this.SK_clientID,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }

          this.auditTrail.mappingAuditTrailData(UserDetails, this.SK_clientID)
        }
        catch (error) {
          console.log("Error while creating audit trails ", error);
        }

      }
      else if (tempupdateHolder && Array.isArray(tempupdateHolder) && tempupdateHolder.length == 0 && tempcreateHolder && Array.isArray(tempcreateHolder) && tempcreateHolder.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'No Users Found in File',
          text: 'The uploaded Excel file does not contain any user data. Please make sure the file includes at least one user entry.',
          showConfirmButton: true,
        });
      }

      this.reloadTable()
      console.log('File uploaded successfully:', this.selectedFile);

      modal.close();
    } catch (err) {
      this.error = 'Error uploading file. Please try again.', err;
    } finally {
      this.isUploading = false;
      this.spinner.hide()
    }
  }

  async updateUser(userFields: any) {

    console.log("All the users data is here ", this.lookup_data_user);

    try {
      console.log("User Details are here ", userFields);
      let tempObj: any = {}


      const getPassword = this.listAllUsersCOgnito.find((user:any)=>user.username == userFields[0].toLowerCase())
      
      console.log("GEt Passerod is jhere ",getPassword);

      this.allUserDetails = {}

      this.allUserDetails = {
        username: userFields[0].toLowerCase(),
        password: getPassword.password,
        clientID: this.SK_clientID || userFields[2],
        companyID: userFields[3],
        email: getPassword.email || userFields[4],
        userID: getPassword.userID || userFields[5].toLowerCase(),
        description: userFields[6],
        mobile: userFields[7],
        mobile_privacy: userFields[8],
        telegramID: userFields[9],
        permission_ID: userFields[10],
        location_permission: userFields[11].includes(',') == true ? userFields[11].split(',') : [userFields[11]],
        form_permission: userFields[12].includes(',') == true ? userFields[12].split(',') : [userFields[12]],
        start_node: userFields[13],
        default_module: userFields[14],
        redirectionURL: userFields[15],
        avg_labour_cost: userFields[16],
        alert_email: userFields[17] ? (typeof userFields[17] === 'string' && (userFields[17].toLowerCase() === "true" || userFields[17].toLowerCase() === "false"))
        ? JSON.parse(userFields[17].toString().toLowerCase())
        : userFields[17]
        : false,
        alert_sms:userFields[18] ? (typeof userFields[18] === 'string' && (userFields[18].toLowerCase() === "true" || userFields[18].toLowerCase() === "false"))
        ? JSON.parse(userFields[18].toString().toLowerCase())
        : userFields[18]
        : false,
        alert_telegram:  userFields[19] ? (typeof userFields[17] === 'string' && (userFields[19].toLowerCase() === "true" || userFields[19].toLowerCase() === "false"))
        ? JSON.parse(userFields[19].toString().toLowerCase())
        : userFields[19]
        : false,
        escalation_email: userFields[20] ? (typeof userFields[20] === 'string' && (userFields[20].toLowerCase() === "true" || userFields[20].toLowerCase() === "false"))
        ? JSON.parse(userFields[20].toString().toLowerCase())
        : userFields[20]
        : false,
        escalation_sms: userFields[21] ? (typeof userFields[21] === 'string' && (userFields[21].toLowerCase() === "true" || userFields[21].toLowerCase() === "false"))
        ? JSON.parse(userFields[21].toString().toLowerCase())
        : userFields[21]
        : false,
        escalation_telegram: userFields[22] ? (typeof userFields[22] === 'string' && (userFields[22].toLowerCase() === "true" || userFields[22].toLowerCase() === "false"))
        ? JSON.parse(userFields[22].toString().toLowerCase())
        : userFields[22]
        : false,
        // created: userFields[23] == '' || userFields[23] == undefined ? Date.now() : userFields[23],
        // cognito_update:userFields[21] ,
        enable_user: userFields[23] ? (typeof userFields[23] === 'string' && (userFields[23].toLowerCase() === "true" || userFields[23].toLowerCase() === "false"))
        ? JSON.parse(userFields[23].toString().toLowerCase())
        : userFields[23]
        : false,
        updated: new Date()
      }


      const userCreatedTime = userFields[22] == '' || userFields[22] == undefined || userFields[22] == null ? Date.now() : userFields[22]


      tempObj = {
        PK: (this.allUserDetails.username).toLowerCase() + "#user" + "#main",
        SK: 1,
        metadata: JSON.stringify(this.allUserDetails)
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
      const items = {
        P1: (this.allUserDetails.username).toLowerCase(),
        P2: this.allUserDetails.mobile || 'N/A',
        P3: this.allUserDetails.email,
        P4: this.allUserDetails.permission_ID,
        P5: temp4,
        P6: temp2,
        P7: date
      }

      const masterUser = {
        P1: (this.allUserDetails.username).toLowerCase(),
        P2: this.allUserDetails.clientID,
        P3: this.allUserDetails.email,
        P4: this.allUserDetails.mobile || 'N/A',
        P5: (this.allUserDetails.userID).toLowerCase()
      }

      console.log("User master table data is here ", masterUser);

      console.log('newly added user', this.allUserDetails);

      console.log("Items are here ", items);


      // Create the master user table entry
      await this.api.UpdateMaster(tempObj);

      await this.fetchTimeMachineById(1, masterUser.P1, 'update', items, masterUser.P2);
      await this.fetchAllusersData(1, masterUser.P1, 'update', masterUser)

      if (this.allUserDetails.enable_user != true) {
        await this.updateCognitoAttributesV2(this.allUserDetails)
      }

      // await this.updateCognitoAttributes(this.allUserDetails);



      this.lookup_data_user = []

      let QueryParam = {}
      if (this.allUserDetails.enable_user == true) {
        QueryParam = {
          "path": "/enableUser",
          "queryStringParameters": {
            "email": masterUser.P3,
            "username": masterUser.P1,
            "clientID": masterUser.P2
          }
        }
      }
      else {
        QueryParam = {
          "path": "/disableUser",
          "queryStringParameters": {
            "email": masterUser.P3,
            "username": masterUser.P1,
            "clientID": masterUser.P2
          }
        }
      }




      const body = {
        "type": "cognitoServices",
        "event": QueryParam
      }


      try {

        const response = await this.DynamicApi.getData(body);
        console.log("Response is here ", JSON.parse(response.body));

      } catch (error) {
        console.error('Error calling dynamic lambda:', error);
        this.spinner.hide();
      }


      if (this.allUserDetails.enable_user == true) {
        await this.updateCognitoAttributesV2(this.allUserDetails)
      }



      try {
        await this.recordUserDetails(this.allUserDetails, 'update', userCreatedTime)
      }
      catch (error) {
        console.log("Error in configuration ", error);
      }




      try {
        const UserDetails = {
          "User Name": this.username,
          "Action": "Edited",
          "Module Name": "User Management",
          "Form Name": 'User Management',
          "Description": `${masterUser.P1} User was Edited Through Excel`,
          "User Id": this.username,
          "Client Id": this.SK_clientID,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }

        this.auditTrail.mappingAuditTrailData(UserDetails, this.SK_clientID)
      }
      catch (error) {
        console.log("Error while creating audit trails ", error);
      }


    }
    catch (error) {
      console.log("Error in object Creation ", error);
    }
  }


  async updateCognitoAttributesV2(userFields: any) {
    let authenticationData = {
      Username: userFields.username,
      Password: userFields.password,
    };

    const poolData = {
      UserPoolId: "ap-south-1_aaPSwPS14",
      ClientId: "42pb85v3sv84jdrfi1rub7a4e5"
    };

    const userPool = new CognitoUserPool(poolData);

    const poolDetails = {
      Username: userFields.username,
      Pool: userPool
    };

    const userData: any = {
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

    const cognitoUser = new CognitoUser(poolDetails);
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    try {
      const session = await new Promise<any>((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: resolve,
          onFailure: reject
        });
      });

      const attributeList = Object.entries(userData).map(([key, value]: any) => {
        return new CognitoUserAttribute({ Name: key, Value: value });
      });

      const updateResult = await new Promise((resolve, reject) => {
        cognitoUser.updateAttributes(attributeList, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      console.log('Attributes updated successfully:', updateResult);

    } catch (err: any) {
      console.error("Cognito Error:", err);

      if (err.message !== 'User is disabled.') {
        if (err.message === 'User is not confirmed.') {
          Swal.fire({
            icon: 'error',
            title: 'User is not confirmed!',
            text: 'User details weren\'t updated in Cognito.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.message
          });
        }
      }
    }
  }


  async updateCognitoAttributes(userFields: any) {

    console.log("User fields are here ", userFields);

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
      const authResult: any = await authenticateUser();
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

    try {
      console.log("User Details are here ", userFields);

      let token = this.generateToken((userFields[0]).toLowerCase(), userFields[2]);
      let tempObj: any = {}


      this.allUserDetails = {}

      //Create avg_labour_history packet
      this.avgLabourHistory = []
      if (userFields && userFields[16] && userFields[16] != '') {
        const avgCost = userFields[16]
        this.avgLabourHistory.push([
          avgCost, new Date().getTime()
        ])
      }


      this.allUserDetails = {
        key: token,
        username: userFields[0].toLowerCase(),
        password: userFields[1],
        clientID: userFields[2],
        companyID: userFields[3],
        email: userFields[4],
        userID: userFields[5].toLowerCase(),
        description: userFields[6],
        mobile: userFields[7],
        mobile_privacy: userFields[8],
        telegramID: userFields[9],
        permission_ID: userFields[10],
        location_permission: userFields[11].includes(',') == true ? userFields[11].split(',') : [userFields[11]],
        form_permission: userFields[12].includes(',') == true ? userFields[12].split(',') : [userFields[12]],
        start_node: userFields[13],
        default_module: userFields[14],
        redirectionURL: userFields[15],
        avg_labour_cost: userFields[16],
        alert_email: userFields[17] ? (typeof userFields[17] === 'string' && (userFields[17].toLowerCase() === "true" || userFields[17].toLowerCase() === "false"))
        ? JSON.parse(userFields[17].toString().toLowerCase())
        : userFields[17]
        : false,
        alert_sms:userFields[18] ? (typeof userFields[18] === 'string' && (userFields[18].toLowerCase() === "true" || userFields[18].toLowerCase() === "false"))
        ? JSON.parse(userFields[18].toString().toLowerCase())
        : userFields[18]
        : false,
        alert_telegram:  userFields[19] ? (typeof userFields[17] === 'string' && (userFields[19].toLowerCase() === "true" || userFields[19].toLowerCase() === "false"))
        ? JSON.parse(userFields[19].toString().toLowerCase())
        : userFields[19]
        : false,
        escalation_email: userFields[20] ? (typeof userFields[20] === 'string' && (userFields[20].toLowerCase() === "true" || userFields[20].toLowerCase() === "false"))
        ? JSON.parse(userFields[20].toString().toLowerCase())
        : userFields[20]
        : false,
        escalation_sms: userFields[21] ? (typeof userFields[21] === 'string' && (userFields[21].toLowerCase() === "true" || userFields[21].toLowerCase() === "false"))
        ? JSON.parse(userFields[21].toString().toLowerCase())
        : userFields[21]
        : false,
        escalation_telegram: userFields[22] ? (typeof userFields[22] === 'string' && (userFields[22].toLowerCase() === "true" || userFields[22].toLowerCase() === "false"))
        ? JSON.parse(userFields[22].toString().toLowerCase())
        : userFields[22]
        : false,
        avg_labour_history: this.avgLabourHistory,
        // cognito_update:userFields[21] ,
        // enable_user: userFields[22] ,
        enable_user: true,
        updated: new Date(),
        created: new Date().getTime()
      }


      tempObj = {
        PK: (this.allUserDetails.username).toLowerCase() + "#user" + "#main",
        SK: 1,
        metadata: JSON.stringify(this.allUserDetails)
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
      const items = {
        P1: (this.allUserDetails.username).toLowerCase(),
        P2: this.allUserDetails.mobile || 'N/A',
        P3: this.allUserDetails.email,
        P4: this.allUserDetails.permission_ID,
        P5: temp4,
        P6: temp2,
        P7: date
      }

      const masterUser = {
        P1: (this.allUserDetails.username).toLowerCase(),
        P2: this.allUserDetails.clientID,
        P3: this.allUserDetails.email,
        P4: this.allUserDetails.mobile || 'N/A',
        P5: (this.allUserDetails.userID).toLowerCase()
      }

      console.log("User master table data is here ", masterUser);

      console.log('newly added user', this.allUserDetails);

      console.log("Items are here ", items);


      // Create the master user table entry
      await this.api.CreateMaster(tempObj);




      await this.createLookUpRdt(items, 1, tempClient + "#user" + "#lookup")
      await this.createLookUpRdt(masterUser, 1, "#user#All");

      await this.addtoCognitoTable(this.allUserDetails);

      try {
        //Creating User Management Forms Data here similar to the Audit trails
        await this.recordUserDetails(this.allUserDetails, 'add', this.allUserDetails.created)
      }
      catch (error) {
        console.log("Error in configuration ", error);
      }



      // Send dynamic lambda request
      const body = { type: "userVerify", username: masterUser.P1, name: this.allUserDetails.password, email: masterUser.P3 };
      await this.DynamicApi.sendData(body).toPromise();  // Use toPromise for async/await


      try {
        const UserDetails = {
          "User Name": this.username,
          "Action": "Created",
          "Module Name": "User Management",
          "Form Name": 'User Management',
          "Description": `${masterUser.P1} User was Created Through Excel`,
          "User Id": this.username,
          "Client Id": this.SK_clientID,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }

        this.auditTrail.mappingAuditTrailData(UserDetails, this.SK_clientID)
      }
      catch (error) {
        console.log("Error while creating audit trails ", error);
      }



    }
    catch (error) {
      console.log("Error in object Creation ", error);
    }

  }


  async recordUserDetails(getValues: any, key: any, createdTime: any) {
    if (key == 'add' || key == 'update') {

      try {
        const UserDetails = {
          "User Name": getValues.username,
          "Password": getValues.password,
          "Client ID": getValues.clientID,
          "Company ID": getValues.companyID,
          "Email": getValues.email,
          "User ID": getValues.userID,
          "Description": getValues.description,
          "Mobile": getValues.mobile,
          "Mobile Privacy": getValues.mobile_privacy,
          "Telegram Channel ID": getValues.telegramID,
          "Permission ID": getValues.permission_ID,
          "Location Permission": getValues.location_permission,
          "FormID Permission": getValues.form_permission,
          "Start Node": getValues.start_node,
          "Default Module": getValues.default_module,
          "Redirection ID": getValues.location_object,
          "Average Labour Cost": getValues.avg_labour_cost,
          "SMS": getValues.alert_sms,
          "Telegram": getValues.alert_telegram,
          "Escalation Email": getValues.escalation_email,
          "Escalation SMS": getValues.escalation_sms,
          "Escalation Telegram": getValues.escalation_telegram,
          "Enable User": getValues.enable_user,
          "Average Labour Cost History": getValues.avg_labour_history && typeof getValues.avg_labour_history == 'string' ? JSON.parse(getValues.avg_labour_history) : getValues.avg_labour_history,

          "Notification": [
            (getValues.alert_sms && typeof getValues.alert_sms == 'boolean') ? getValues.alert_sms : false,
            (getValues.alert_telegram && typeof getValues.alert_telegram == 'boolean') ? getValues.alert_telegram : false
          ],
          "Escalation Enable:": [
            (getValues.escalation_email && typeof getValues.escalation_email == 'boolean') ? getValues.escalation_email : false,
            (getValues.escalation_sms && typeof getValues.escalation_sms == 'boolean') ? getValues.escalation_sms : false,
            (getValues.escalation_telegram && typeof getValues.escalation_telegram == 'boolean') ? getValues.escalation_telegram : false
          ],
          "created": createdTime
        }

        console.log('Data to be added in User forms are here ', UserDetails);

        this.userForm.mappingAuditTrailData(UserDetails, this.SK_clientID, this.username)
      }
      catch (error) {
        console.log("Error while creating audit trails ", error);
      }

    }
    else {
      await this.userForm.delete_request_look_up_main_audit_trail(createdTime, this.SK_clientID, 'SYSTEM_USER_CONFIGURATION')
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



  async createLookUpRdt(item: any, pageNumber: number, tempclient: any) {
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
        await this.createLookUpRdt(item, pageNumber + 1, tempclient);
      }
    } catch (err) {
      console.log('err :>> ', err);
      // Handle errors appropriately, e.g., show an error message to the user
    }
  }

  async fetchTimeMachineById(sk: any, id: any, type: any, item: any, client: any) {
    const tempClient = client + '#user' + "#lookup";
    console.log("Temp client is ", tempClient);
    console.log("Type of client", typeof tempClient);
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
          await this.fetchTimeMachineById(sk + 1, id, type, item, client); // Retry with next SK

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



  async fetchAllusersData(sk: any, id: any, type: any, item: any) {
    const tempClient = '#user' + "#All";
    console.log("Temp client is ", tempClient);
    console.log("Type of client", typeof tempClient);
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


  async listAllUsers(){
    let storedResponse:any;

    const body = { "type": "cognitoServices",
      "event":{
          "path": "/listAllUsers",
          "queryStringParameters": {},
          "clientID":this.SK_clientID
      }
    }
    try {

      const response = await this.DynamicApi.getData(body);
      console.log("Response is here ",JSON.parse(response.body));

      storedResponse = JSON.parse(response.body).users
      .map((item: any) => {
        if (item.attributes.email_verified !== 'true') {
          // Return the user data for unverified users
          return { username: item.username,password: item.attributes['custom:password'],email: item.attributes['email'],
            userID: item.attributes['custom:userID']
          };
        }
        return null; 
      })
      .filter((user: any) => user !== null); 

      console.log("Strored Response is here ",storedResponse);
      this.listAllUsersCOgnito = JSON.parse(JSON.stringify(storedResponse))

    } catch (error) {
      console.error('Error calling dynamic lambda:', error);
    }
  }

}
