import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { APIService, GetMasterQuery } from 'src/app/API.service';
import Swal from 'sweetalert2';
import { SharedService } from '../shared.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
interface TreeNode {
  id: string;         // Assuming 'id' is a string
  text: string;       // Assuming 'text' is a string
  parent?: string;    // 'parent' can be a string or undefined
  node_type?: string; // Optional property for node type
}
// import { LocationPermissionService } from 'src/app/location-permission.service';
declare let $: any;
@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  styleUrl: './location-management.component.scss'
})
export class LocationManagementComponent implements OnInit {
  getLoggedUser: any;
  companyId: any;
  tempClient: string;
  trees: any;
  jsondata: { id: string; text: string; node_type: string; parent: string; dashboard_view: { id: null; }; leadership_view: { id: null; }; mobile_view: { id: null; }; area: null; summary_enable: null; summary_types: null; }[];
  formList: any;
  listofIconsIds: { value: string; text: string; }[];
  userdetails: any;
  userClient: string;
  metadataObject: any;
  originalData: any;



  onDeviceDeSelect($event: ListItem) {
    this.multiselectDevice = []
    this.multiselectDevice_text =[]
    console.log("deselect is triggering")
    }
    
      createLocationField: UntypedFormGroup;
      createDeviceField: FormGroup;
      createCompanyField: UntypedFormGroup;
      //createMultiDeviceField: FormGroup;
    All_button_permissions:any = false
    LeadershipViewOptions = [
        { value: 'auto', text: 'Auto' },
        { value: 'type_1', text: 'Type 1 LV' },
        { value: 'type_2', text: 'Type 2 LV' }
      ];
      data_temp: any = [];
      listofSK: any = [];
      temp: any = [];
      result: any = [];
      temp_tree: any = [];
      allDevices: any = [];
    
      final_list: any = [];
      tempTree: any = [];
      RDT_ID:any=''
      allLocationDetails: any = {};
      cognitoCurrentUserDetails: any = [];
      dropdownSettings: IDropdownSettings = {};
    
      singleSelection: any = {};
      singleSelection_magic: any = {};
      singleSelection_dream: any = {};
    
      userClientIDCognito: any;
      SK_clientID: any;
      user_companyID: any;
    
      temp_TemplateID_Label: any = [];
      templateIDsList: any = [];
      templateLabels: any = [];
    
      tempmagic: any[] = [];
    
    
      temp_powerboardID: any = [];
    
      showNewLoc: any = true;
      showNewDevice: any = true;
    
      enableDeviceButton: any = false;
      enableLocationButton: any = false;
    
      parentID_selected_node: any;
    
      listofMagicboardIds: any[] = [];
    
      allPermissions_user: any;
    
      hideUpdateButton: any = false;
      hideDeleteButton: any = true;
    
      multiselectDevice: any = [];
      multiselectDevice_text: any = [];
      allselectedDevices: any = [];
      allselectedDevices_text: any = [];
    
      multiselectLocation_dream: any = [];
      multiselectLocation: any = [];
      multiselectLeadership: any = [];
      multiselectMobileView: any = [];
    
      multiselect_device: any = [];
      multiselect_device_dream: any = [];
      multiselectLeadership_device: any = [];
      multiselectMobileView_device: any = [];
    
      Lookupdata: any = [];
      listofDreamboardIds: any = [];
    
      ApiToken: any = "";
      lookup_data_temp1: any = [];
      listofPowerboardIds: any[];
      lookup_data_tempL1: any[]=[];
      listofDeviceIds: any=[];
      user_name: any;
    
    
      constructor(private fb: UntypedFormBuilder, private companyConfiguration: SharedService,
        private powerboardConfiguration: SharedService,
        private devicesList: SharedService, private api: APIService, private toast: MatSnackBar, private crn: ChangeDetectorRef,
        private router: Router,private locationPermissionService:LocationPermissionService
      ) 
      
      {  

    
    }
      // private locationPermissionService:LocationPremissionService,
      ngOnInit() {
    
        this.dropdownSettings = this.devicesList.getMultiSelectSettings();
    
        this.singleSelection = this.devicesList.showSingleSelection();
    
        this.singleSelection_magic = this.devicesList.showSingleSelection_magic();
    
        this.singleSelection_dream = this.devicesList.showSingleSelection_dream();
    
        this.initializeDeviceFields();
        this.initializeLocationFields();
        this.getLoggedUser = this.companyConfiguration.getLoggedUserDetails()
        this.SK_clientID = this.getLoggedUser.clientID;
        console.log('this.SK_clientID check',this.SK_clientID)

        this.companyId = this.getLoggedUser.companyID;
        console.log('this.companyId check',this.companyId)
        this.tempClient = this.SK_clientID+"#"+this.companyId+"#location" + "#main";
        console.log('tempClient check',this.tempClient)
        // this.addFromService()
        this.populateDreamboardOptions();
     

        // this.SK_clientID = this.userClientIDCognito.attributes["custom:clientID"];
        // this.user_companyID = this.userClientIDCognito.attributes["custom:companyID"];
        //this.initializeMultiDeviceFields();
        // this.userClientIDCognito = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));
        // this.SK_clientID = this.userClientIDCognito.attributes["custom:clientID"];
        // this.user_companyID = this.userClientIDCognito.attributes["custom:companyID"];
    // this.user_name = this.userClientIDCognito.attributes["custom:username"];
        // this.allPermissions_user = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("permissionDetails"))));
    
       
    
        // this.getAllDevices();
        // this.fetchPBData(1);
        // this.fetchTMData(1)
        // const locationTree =
        // {
        //   "PK": "joy_companyID",
        //   "SK": "joy_clientID",
        //   "tree": [
        //    {
        //     "area": null,
        //     "dashboard_view": {
        //      "id": null
        //     },
        //     "id": "node1",
        //     "leadership_view": {
        //      "id": null
        //     },
        //     "mobile_view": {
        //      "id": null
        //     },
        //     "node_type": "location",
        //     "parent": "#",
        //     "summary_enable": null,
        //     "summary_types": null,
        //     "text": "World"
        //    },
        //    {
        //     "area": null,
        //     "dashboard_view": {
        //      "id": null
        //     },
        //     "id": "node2",
        //     "leadership_view": {
        //      "id": null
        //     },
        //     "mobile_view": {
        //      "id": null
        //     },
        //     "node_type": "location",
        //     "parent": "node1",
        //     "summary_enable": null,
        //     "summary_types": null,
        //     "text": "Asia"
        //    },
        //    {
        //     "area": null,
        //     "dashboard_view": {
        //      "id": null
        //     },
        //     "id": "India",
        //     "leadership_view": {
        //      "id": null
        //     },
        //     "mobile_view": {
        //      "id": null
        //     },
        //     "node_type": "location",
        //     "parent": "node2",
        //     "summary_enable": null,
        //     "summary_types": null,
        //     "text": "India"
        //    },
        //    {
        //     "dashboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "description": "DemoPowerboard",
        //     "dreamboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "icon": "fa fa-cubes",
        //     "id": "MG2GFRP92#1712485185146",
        //     "leadership_view": {
        //      "id": [
        //      ]
        //     },
        //     "mn": "MG2GFRP92",
        //     "mobile_view": {
        //      "id": [
        //      ]
        //     },
        //     "node_type": "device",
        //     "parent": "India",
        //     "powerboard_view_device": {
        //      "id": "Demo_PB1"
        //     },
        //     "text": "MG2GFRP92"
        //    },
        //    {
        //     "dashboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "description": "new",
        //     "dreamboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "icon": "fa fa-cubes",
        //     "id": "PIR_test1#1712485206979",
        //     "leadership_view": {
        //      "id": [
        //      ]
        //     },
        //     "mn": "PIR_test1",
        //     "mobile_view": {
        //      "id": [
        //      ]
        //     },
        //     "node_type": "device",
        //     "parent": "India",
        //     "powerboard_view_device": {
        //      "id": "Demo_PB1"
        //     },
        //     "text": "PIR_test1"
        //    },
        //    {
        //     "dashboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "description": "123",
        //     "dreamboard_view": {
        //      "id": [
        //      ]
        //     },
        //     "icon": "fa fa-cubes",
        //     "id": "MG2GFRP1#1712485223013",
        //     "leadership_view": {
        //      "id": [
        //      ]
        //     },
        //     "mn": "MG2GFRP1",
        //     "mobile_view": {
        //      "id": [
        //      ]
        //     },
        //     "node_type": "device",
        //     "parent": "India",
        //     "powerboard_view_device": {
        //      "id": "Demo_PB1"
        //     },
        //     "text": "MG2FRP1"
        //    },
        //    {
        //     "description": "1qw",
        //     "dreamboard_view": {
        //      "id": ""
        //     },
        //     "icon": "fa fa-inbox",
        //     "id": "scale_test_5_a#1726137401351",
        //     "leadership_view": {
        //      "id": ""
        //     },
        //     "magicboard_view": {
        //      "id": ""
        //     },
        //     "mn": "scale_test_5_a",
        //     "mobile_view": {
        //      "id": ""
        //     },
        //     "node_type": "device",
        //     "parent": "India",
        //     "powerboard_view_device": {
        //      "id": ""
        //     },
        //     "RDT": "ww",
        //     "text": [
        //      "test"
        //     ]
        //    },
        //    {
        //     "description": "DemoPowerboard",
        //     "dreamboard_view": {
        //      "id": ""
        //     },
        //     "icon": "fa fa-wifi",
        //     "id": "Automation_Device1#1726137643503",
        //     "leadership_view": {
        //      "id": ""
        //     },
        //     "magicboard_view": {
        //      "id": ""
        //     },
        //     "mn": "Automation_Device1",
        //     "mobile_view": {
        //      "id": ""
        //     },
        //     "node_type": "device",
        //     "parent": "node1",
        //     "powerboard_view_device": {
        //      "id": ""
        //     },
        //     "RDT": "ww",
        //     "text": [
        //      "Automation Device1"
        //     ]
        //    },
        //    {
        //     "description": "Joys device",
        //     "dreamboard_view": {
        //      "id": ""
        //     },
        //     "icon": "fa fa-rocket",
        //     "id": "joy_test_device#1726138788023",
        //     "leadership_view": {
        //      "id": ""
        //     },
        //     "magicboard_view": {
        //      "id": ""
        //     },
        //     "mn": "joy_test_device",
        //     "mobile_view": {
        //      "id": ""
        //     },
        //     "node_type": "device",
        //     "parent": "node1",
        //     "powerboard_view_device": {
        //      "id": ""
        //     },
        //     "RDT": "RDT",
        //     "text": [
        //      "joy_test_device"
        //     ]
        //    }
        //   ]
        //  }
              // this.createJSTree(this.trees);
    
      }

      populateDreamboardOptions() {
        this.listofIconsIds = [
          { value: 'bi bi-tools', text: 'Tools' },
    { value: 'bi bi-wrench', text: 'Wrench' },
    { value: 'bi bi-hammer', text: 'Hammer' },
    { value: 'bi bi-screwdriver', text: 'Screwdriver' },
    { value: 'bi bi-gear', text: 'Gear' },
    { value: 'bi bi-clipboard', text: 'Clipboard' },
    { value: 'bi bi-battery', text: 'Battery' },
    { value: 'bi bi-box', text: 'Box' },
    { value: 'bi bi-archive', text: 'Archive' },
    { value: 'bi bi-minecart-loaded', text: 'Minecart Loaded' },
          { value: 'bi bi-table', text: 'Data Table' },
          { value: 'bi bi-graph-up', text: 'Growth Graph' },
          { value: 'bi bi-graph-down', text: 'Decline Graph' },
          { value: 'bi bi-pie-chart', text: 'Pie Chart' },
          { value: 'bi bi-bar-chart', text: 'Bar Chart' },
          { value: 'bi bi-file-earmark-spreadsheet', text: 'Spreadsheet File' },
          { value: 'bi bi-file-earmark-text', text: 'Text File' },
          { value: 'bi bi-clipboard-data', text: 'Clipboard Data' },
          { value: 'bi bi-cloud-upload', text: 'Upload Data' },
          { value: 'bi bi-cloud-download', text: 'Download Data' },
          { value: 'bi-file-earmark-text', text: 'Document' },
          { value: 'bi-file-earmark-zip', text: 'Zip File' },
          { value: 'bi-file-earmark-person', text: 'Contract' },
          { value: 'bi-file-earmark-rupee', text: 'Invoice' },
          { value: 'bi-file-earmark-check', text: 'Approved Document' },
          { value: 'bi-file-earmark-spreadsheet', text: 'Spreadsheet' },
          { value: 'bi-file-earmark-pdf', text: 'PDF Document' },
          { value: 'bi-file-earmark-lock', text: 'Secure Document' },
          { value: 'bi-file-earmark-plus', text: 'New Document' },
          { value: 'bi-file-earmark-earmark-minus', text: 'Delete Document' },
          { value: 'bi-pencil', text: 'Edit Document' },
          { value: 'bi-printer', text: 'Print Document' },
          { value: 'bi-download', text: 'Download Document' },
          { value: 'bi-upload', text: 'Upload Document' },
          { value: 'bi-hand-thumbs-up', text: 'Approve' },
          { value: 'bi-hand-thumbs-down', text: 'Reject' },
          { value: 'bi-calendar-check', text: 'Scheduled Meeting' },
          { value: 'bi-chat-dots', text: 'Comments/Discussions' },
          { value: 'bi-shield-lock', text: 'Secure Contract' },
          { value: 'bi-check-circle', text: 'Confirmation' },
          { value: 'bi-person', text: 'Person' },
          { value: 'bi-person-fill', text: 'Filled Person' },
          { value: 'bi-file-earmark-text', text: 'Text Document' },
          { value: 'bi-file-earmark-person', text: 'Personal Document' },
          { value: 'bi-envelope', text: 'Email' },
          { value: 'bi-phone', text: 'Phone' },
          { value: 'bi-calendar', text: 'Date of Birth' },
          { value: 'bi-geo-alt', text: 'Location' },
          { value: 'bi-birthday-cake', text: 'Birthday' },
          { value: 'bi-card-text', text: 'ID Card' },
          { value: 'bi-chat', text: 'Chat' },
          { value: 'bi-file-earmark-image', text: 'Profile Picture' },
          { value: 'bi-briefcase', text: 'Job Title' },
          { value: 'bi-person-check', text: 'Verified Person' },
          { value: 'bi-file-earmark-pdf', text: 'PDF Document' },
          { value: 'bi-upload', text: 'Upload Document' },
          { value: 'bi-download', text: 'Download Document' },
          { value: 'bi-shield-lock', text: 'Secure Information' },
          { value: 'bi-check-circle', text: 'Confirmation' },
          { value: 'bi-check-circle', text: 'Success' },
          { value: 'bi-x-circle', text: 'Error' },
          { value: 'bi-exclamation-circle', text: 'Warning' },
          { value: 'bi-info-circle', text: 'Information' },
          { value: 'bi-check-square', text: 'Validated' },
          { value: 'bi-x-square', text: 'Invalid' },
          { value: 'bi-exclamation-square', text: 'Caution' },
          { value: 'bi-file-earmark-excel', text: 'Excel Validation' },
          { value: 'bi-file-earmark-pdf', text: 'PDF Validation' },
          { value: 'bi-file-earmark-text', text: 'Text Document' },
          { value: 'bi-shield-check', text: 'Security Check' },
          { value: 'bi-lock', text: 'Locked Field' },
          { value: 'bi-unlock', text: 'Unlocked Field' },
          { value: 'bi-pencil', text: 'Edit' },
          { value: 'bi-archive', text: 'Archive' },
          { value: 'fa fa-file-contract', text: 'Contract' },
          { value: 'fa fa-signature', text: 'Signature' },
          { value: 'fa fa-file-signature', text: 'File Signature' },
          { value: 'fa fa-file-alt', text: 'File' },
          { value: 'fa fa-file-invoice', text: 'Invoice' },
          { value: 'fa fa-file-invoice-dollar', text: 'Invoice Dollar' },
          { value: 'fa fa-clipboard-list', text: 'Checklist' },
          { value: 'fa fa-paperclip', text: 'Paperclip' },
          { value: 'fa fa-stamp', text: 'Stamp' },
          { value: 'fa fa-handshake', text: 'Handshake' },
          { value: 'fa fa-shield-alt', text: 'Shield' },
          { value: 'fa fa-calendar-check', text: 'Calendar Check' },
          { value: 'fa fa-pencil-alt', text: 'Edit' },
          { value: 'fa fa-trash', text: 'Delete' },
          { value: 'fa fa-print', text: 'Print' },
          { value: 'fa fa-arrow-circle-right', text: 'Proceed' },
          { value: 'fa fa-download', text: 'Download' },
          { value: 'fa fa-upload', text: 'Upload' },
          { value: 'fa fa-user-check', text: 'User Check' },
          { value: 'fa fa-users-cog', text: 'Users Cog' },
          { value: 'fa fa-chart-line', text: 'Chart Line' },
        ];
      }
    
    
    
      initializeDeviceFields() {
    
        this.createDeviceField = this.fb.group({
          'name': [[''], Validators.required],
          'description': ['', Validators.required],
          'magicboard_view': [['']],
          'leadership_view': [['']],
          'mobile_view': [['']],
          'icon': [''],
          "powerboard_view_device": [null],
          "dreamboard_view_device": [''],
        })
      }
    
    
      initializeLocationFields() {
        this.createLocationField = this.fb.group({
          'name': ['', Validators.required],
          'description': ['', Validators.required],
          'area': ['', Validators.required],
          'summary_enable': [''],
          'summary_types': ['', Validators.required],
          'magicboard_view': [['']],
          'leadership_view': [['']],
          'mobile_view': [['']],
          'powerboard_view': [null],
          'dreamboard_view': ['',],
        })
      }
    

      lookUpdataFinaldata: any[] = [];
      multiSelectMagicboard: any[] = [];
      async fetchMagicData(sk: any) {
        // this.auditTrialServices.audit_trail([],'2.1',"MagicBoard","GET_LIST","geting the data from lookup table",'7')
    
        // this.spinner.show();
        // this.lookUpdataFinaldata = [];
        // await this.api.GetLookupMagicboard(this.SK_clientID, sk)
        //   .then((Response) => {
        //     console.log(Response.items);
    
        //     if (Response && Response.items) {
        //       const data = JSON.parse(Response.items);
        //       for (let i = 0; i < data.length; i++) {
        //         this.lookUpdataFinaldata.push(data[i]);
        //       }
        //       // this.crn.detectChanges()
        //       new Promise((resolve) => setTimeout(resolve, 500));
    
        //       this.fetchMagicData(sk + 1);
        //       // this.spinner.hide();
        //     }
        //   })
        //   .catch((err) => {
        //     // this.spinner.hide();
        //     if (this.lookUpdataFinaldata != null) {
        //       console.log("this.Lookupdata",this.lookUpdataFinaldata)
    
        //      this. multiSelectMagicboard =   this.lookUpdataFinaldata.reduce((acc:any, current) => {
        //         // Create an object with "value" property set to the first element (the key)
        //         const formattedObject = { 'value': current[0],'text': current[0]};
        //         // Add the formatted object to the accumulator array
        //         return [...acc, formattedObject];
        //       }, []);
        //       // this.getDatatablelookup(this.Lookupdata);
        //       this.crn.detectChanges();
        //       console.log("this. multiSelectMagicboard ",this. multiSelectMagicboard )
        //     }
        //   });
    
        // await this.api.GetLookupMasterTable(this.SK_clientID + "#magicboard", sk)
        //   .then((Response) => {
        //     console.log(Response.items);
    
        //     if (Response && Response.items) {
        //       const data = JSON.parse(Response.items);
        //       console.log('datadatadatadata :>> ', data);
        //       //  const key = Object.keys(element)[0];
        //       for (let i = 0; i < data.length; i++) {
        //         // const key = Object.keys(data);
        //         let element = data[i];
        //         if (element !== null && element !== undefined) {
        //           const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
        //           const { P1, P2, P3 } = element[key]; // Extract values from the nested object
        //           this.lookUpdataFinaldata.push([P1, P2, P3])
        //         }
        //         else {
        //           break
        //         }
        //         //   this.Lookupdata.push(data[i]);
        //       }
        //       // this.crn.detectChanges()
        //       new Promise((resolve) => setTimeout(resolve, 500));
    
        //       this.fetchMagicData(sk + 1);
             
        //     }
        //   })
        //   .catch((err) => {
        //          if (this.lookUpdataFinaldata != null) {
        //       console.log("this.Lookupdata",this.lookUpdataFinaldata)
    
        //      this. multiSelectMagicboard =   this.lookUpdataFinaldata.reduce((acc:any, current) => {
        //         // Create an object with "value" property set to the first element (the key)
        //         const formattedObject = { 'value': current[0],'text': current[0]};
        //         // Add the formatted object to the accumulator array
        //         return [...acc, formattedObject];
        //       }, []);
        //       // this.getDatatablelookup(this.Lookupdata);
        //       this.crn.detectChanges();
        //       console.log("this. multiSelectMagicboard ",this. multiSelectMagicboard )
        //     }
        //     // if (this.Lookupdata != null) {
        //     //   this.getDatatablelookup(this.Lookupdata);
        //     // }
        //     // else {
        //     //   this.spinner.hide();
        //     // }
    
        //   });
      }


      
      // async getMagicBoardList() {
    
      //   this.api.ListMagicboards_ID({ PK: { contains: '' }, SK: { in: this.SK_clientID } }, 500, this.ApiToken)
      //     .then(async (result) => {
    
      //       this.ApiToken = result.nextToken;
      //       let data = JSON.parse(JSON.stringify(result.items));
      //       if (data.length !== 0) {
      //         this.tempmagic = data;
    
      //         for (let index = 0; index < this.tempmagic.length; index++) {
      //           //this.listofMagicboardIds.push({"value":this.tempmagic[index]?.PK,"text":this.tempmagic[index]?.PK})
      //           this.listofMagicboardIds.push(this.tempmagic[index]?.PK)
      //         }
    
      //         console.log('this.listofMagicboardIds', this.listofMagicboardIds);
    
      //       }
      //       console.log('data of magicboard', this.tempmagic);
      //       if (this.ApiToken !== null) {
      //         await this.getMagicBoardList(); // Call the API recursively until nextToken becomes null
    
      //       }
    
      //     })
      //     .catch((err) => {
      //       console.log('API error:', err);
      //     });
      // }
    
      // async getDreamBoardList(sk: any) {
      //   try {
      //     const response = await this.api.GetLookupTableDreamBoard(this.SK_clientID, sk);
      //     if (response && response.items) {
      //       // Check if response.items is a string
      //       if (typeof response.items === 'string') {
      //         let data = JSON.parse(response.items);
    
      //         if (Array.isArray(data)) {
      //           for (let index = 0; index < data.length; index++) {
      //             const element = data[index];
    
      //             if (element !== null && element !== undefined) {
      //               this.Lookupdata.push(element);
      //             } else {
      //               break;
      //             }
      //           }
      //           // Continue fetching recursively
      //           await this.getDreamBoardList(sk + 1);
    
      //           if (response.items !== null && response.items !== undefined) {
    
      //           }
      //         } else {
      //           console.error('Invalid data format - not an array.');
      //         }
      //       } else {
      //         console.error('response.items is not a string.');
      //       }
      //     } else {
      //       this.listofDreamboardIds = [];
      //       for (let index = 0; index < this.Lookupdata.length; index++) {
      //         this.listofDreamboardIds.push(this.Lookupdata[index][0])
    
      //       }
      //     }
      //   } catch (error) {
      //     //console.error('Error:', error);
      //     console.log("Finished parsing through the pages")
      //     //this.showDatatable(this.Lookupdata);
      //     console.log("ADDING TO THE TABLE")
      //     // Handle the error as needed
      //   }
      // }
    
      checkPermission() {
        let hasDeviceUpdate = false;
        let hasDeviceView = false;
        // let permissionFound = false;
    
        for (let checkPermission = 0; checkPermission < this.allPermissions_user.length; checkPermission++) {
          if (this.allPermissions_user[checkPermission] === 'Location - Update') {
            hasDeviceUpdate = true;
            // permissionFound = true;
          }
    
          else if (this.allPermissions_user[checkPermission] === 'Location - View') {
            hasDeviceView = true;
            // permissionFound = true;
    
          }
        }
    
    
        if (hasDeviceUpdate && hasDeviceView) {
          this.hideDeleteButton = true;
        }
        else if (hasDeviceUpdate) {
          this.hideDeleteButton = true;
        } else if (hasDeviceView) {
          this.hideDeleteButton = false;
        } else {
          this.router.navigate(['/404']);
        }
      }
    
      // getAllDevices() {
      //   this.devicesList.getSpecificConfiguration(this.SK_clientID).then(result => {
    
      //     if (result) {
    
      //       this.data_temp = result;
    
      //       this.allDevices = [];
    
      //       for (let deviceslist = 0; deviceslist < result.length; deviceslist++) {
      //         this.allDevices.push({ "value": result[deviceslist]?.mn, "text": result[deviceslist]?.mn_label, "textfield": result[deviceslist]?.mn + "-" + result[deviceslist]?.mn_label })
      //         //this.allDevices.push({ "value": result[deviceslist]?.mn, "text": result[deviceslist]?.mn, "textfield": result[deviceslist]?.mn + "-" + result[deviceslist]?.mn_label })
    
      //       }
    
    
      //     }
    
      //   }).catch((err) => {
      //     console.log('cant fetch', err);
      //   })
    
      // }
    
      // ngAfterViewInit() {
      //   setTimeout(() => {
      //     $('#SimpleJSTree').jstree({
      //       'core': {
      //         'check_callback': true,
      //         'data': this.jsondata,
      //         'multiple': false,
      //       },
      //       'search': {
      //         'show_only_matches': true
      //       },
      //       'plugins': ['contextmenu', 'dnd', 'search'],
      //       'contextmenu': {
      //         'items': ($node: any) => {
      //           let tree = $('#SimpleJSTree').jstree(true);
      //           return {
      //             'Create': {
      //               'label': 'Add Location',
      //               'action': false,
      //               'submenu': {
      //                 'Child': {
      //                   'label': 'Child',
      //                   action: (obj: any) => {
      //                     $node = tree.create_node($node, { text: 'New Child', type: 'file', icon: 'glyphicon glyphicon-file' });
      //                     tree.deselect_all();
      //                     tree.select_node($node);
      //                   }
      //                 },
      //                 'Parent': {
      //                   'label': 'Parent',
      //                   action: (obj: any) => {
      //                     $node = tree.create_node($node, { text: 'New Parent', type: 'default' });
      //                     tree.deselect_all();
      //                     tree.select_node($node);
      //                   }
      //                 }
      //               }
      //             },
      //             'Rename': {
      //               'label': 'Edit Location',
      //               'action': (obj: any) => {
      //                 tree.edit($node);
      //               }
      //             },
      //             'Remove': {
      //               'label': 'Remove Location',
      //               'action': (obj: any) => {
      //                 tree.delete_node($node);
      //               }
      //             }
      //           };
      //         }
      //       }
      //     })
      //     .on('changed.jstree', (e: any, data: any) => {
      //       if (data && data.node && data.node.text) {
      //         this.parentID_selected_node = data.node.parent;
      //         this.final_list = data.instance.get_node(data.selected[0]);
    
      //         if (this.final_list.original.node_type === 'location') {
      //           this.enableLocationButton = true;
      //           this.enableDeviceButton = false;
      //         } else if (this.final_list.original.node_type === 'device') {
      //           this.enableLocationButton = false;
      //           this.enableDeviceButton = true;
      //         }
      //       }
      //     });
    
      //     let to: any = false;
      //     $('#search').keyup(() => {
      //       if (to) {
      //         clearTimeout(to);
      //       }
      //       to = setTimeout(() => {
      //         const v = $('#search').val();
      //         $('#SimpleJSTree').jstree(true).search(v);
      //       }, 250);
      //     });
      //   }, 0);
      // }
      ngAfterViewInit() {
        this.addFromService()
    //     this.api.GetMaster(this.tempClient, 1).then((result: GetMasterQuery) => {
    //       if (result) {
    //         this.temp_TemplateID_Label = [];
    //         const templates = result; 
    //         console.log('templates check', templates);
            
    //         // Parse the metadata 
    //         if (templates.metadata) {
    //           const parsedMetadata = JSON.parse(templates.metadata);
    //           console.log('Parsed Metadata:', parsedMetadata);
              
    //           // Assuming the parsed metadata contains an array of trees
    //           this.trees = JSON.parse(parsedMetadata[0].tree);
    //           console.log('trees check', this.trees);
    //           this.temp =  this.trees
    //           // Prepare the jstree data
    //           const jstreeData = this.trees.map((treeNode: TreeNode) => ({
    //             id: treeNode.id, // Use 'id' for jstree node ID
    //             text: treeNode.text, // Use 'text' for jstree node display
    //             parent: treeNode.parent || "#", // Set parent, or use "#" for root
    //             node_type: treeNode.node_type // You can add additional properties as needed
    //           }));
    //  this.createJSTree(jstreeData);
              
    //         }
    //       }
    //     }).catch(err => {
    //       console.log('Error fetching template IDs', err);
    //     });
      }



                    // Initialize jstree with the fetched data
                    createJSTree(jsondata: any) {
                      // Store the original data to reinitialize the tree when needed
                      this.originalData = jsondata;
                    
                      const initializeTree = (data: any) => {
                        $('#SimpleJSTree').jstree({
                          "core": {
                            "check_callback": true,
                            'data': data,
                            'multiple': false,
                          },
                          'search': {
                            'show_only_matches': true, // Only show nodes that match the search
                          },
                          "plugins": ["contextmenu", "dnd", "search"],
                          "contextmenu": {
                            "items": (node: any) => {
                              let tree = $("#SimpleJSTree").jstree(true);
                              return {
                                "Create": {
                                  "separator_before": false,
                                  "separator_after": true,
                                  "label": "Add Location",
                                  "action": false,
                                  "submenu": {
                                    "Child": {
                                      "separator_before": false,
                                      "separator_after": false,
                                      "label": "Child",
                                      action: () => {
                                        let newNode = tree.create_node(node, { text: 'New Child', type: 'file', icon: 'glyphicon glyphicon-file' });
                                        tree.deselect_all();
                                        tree.select_node(newNode);
                                      }
                                    },
                                    "Parent": {
                                      "separator_before": false,
                                      "separator_after": false,
                                      "label": "Parent",
                                      action: () => {
                                        let newNode = tree.create_node(node, { text: 'New Parent', type: 'default' });
                                        tree.deselect_all();
                                        tree.select_node(newNode);
                                      }
                                    }
                                  }
                                },
                                "Rename": {
                                  "separator_before": false,
                                  "separator_after": false,
                                  "label": "Edit Location",
                                  "action": () => {
                                    tree.edit(node);
                                  }
                                },
                                "Remove": {
                                  "separator_before": false,
                                  "separator_after": false,
                                  "label": "Remove Location",
                                  "action": () => {
                                    tree.delete_node(node);
                                  }
                                }
                              };
                            }
                          }
                        })
                        .on("changed.jstree", (e: any, data: any) => {
                          if (data && data.node && data.node.text) {
                            this.parentID_selected_node = data.node.parent;
                            this.final_list = data.instance.get_node(data.selected[0]);
                    
                            if (this.final_list.original.node_type === 'location') {
                              this.enableLocationButton = true;
                              this.enableDeviceButton = false;
                            } else if (this.final_list.original.node_type === 'device') {
                              this.enableLocationButton = false;
                              this.enableDeviceButton = true;
                            }
                          }
                        });
                      };
                    
                      // Initialize the tree with the original data
                      initializeTree(this.originalData);
                    
                      let to: any = false;
                      $('#search').keyup(() => {
                        if (to) {
                          clearTimeout(to);
                        }
                        to = setTimeout(() => {
                          let searchTerm = $('#search').val();
                    
                          if (searchTerm && searchTerm.length > 0) {
                            // Perform the search if there's input
                            $('#SimpleJSTree').jstree(true).search(searchTerm);
                          } else {
                            // Clear the search and reset the tree when input is empty
                            $('#SimpleJSTree').jstree(true).clear_search();
                    
                            // Destroy the current tree instance
                            $('#SimpleJSTree').jstree(true).destroy();
                    
                            // Reinitialize the tree with the original data
                            initializeTree(this.originalData);
                          }
                        }, 250);
                      });
                    }
                    
                    
                    
    
      onDashboardViewSelect(option: any) {
        
    
        console.log('selected option board', option);
        console.log('selected option', option[0].value);
        this.multiselectLocation = []
        this.multiselectLocation.push(option[0].value);
        console.log('object :>> ', this.multiselectLocation);
    
      }
    
      onDreamboardViewSelect(option: any) {
       
    
        console.log('selected option board', option);
        console.log('selected option', option.value);
        this.multiselectLocation_dream = []
        this.multiselectLocation_dream.push(option);
        console.log('object :>> ', this.multiselectLocation_dream);
    
      }
    
      onLeadershipViewSelect(option: any) {
        
        console.log('selected option from', option);
        this.multiselectLeadership = []
        this.multiselectLeadership.push(option.value);
    
      }
    
    
    
      onMobileViewSelect(option: any) {
       
    
        this.multiselectMobileView.push(option[0].value);
    
      }
    
      onDashboardViewSelect_device(option: any) {
        
        console.log('selected option magicboard', option[0].value);
        // console.log('selected option', option.value);
    
        this.multiselect_device.push(option);
    
      }
    
      onDreamboardViewSelect_device(option: any) {
      
        console.log('selected option', option);
        console.log('selected option', option[0].value);
    
        this.multiselect_device_dream.push(option[0].avlue);
    
    
      }
    
      onLeadershipViewSelect_device(option: any) {
       
        console.log('selected option', option);
    
        this.multiselectLeadership_device.push(option[0].value);
    
      }
    
      onMobileViewSelect_device(option: any) {
       
        this.multiselectMobileView_device.push(option[0].value);
      }
      onDeviceSelect(option: any) {
        
        this.multiselectDevice.push(option.value);
        this.multiselectDevice_text.push(option.text);
    const fullItem = this.lookup_data_tempL1.find(data  => data.P1 === option.value)
    // this.RDT_ID = fullItem.P3
        console.log(' this.multiselectDevice', this.multiselectDevice);
      }
    
      onSelectAllDevices(allDevices: any) {
        for (let allValues = 0; allValues < allDevices.length; allValues++) {
          this.allselectedDevices.push(allDevices[allValues].value);
          this.allselectedDevices_text.push(allDevices[allValues].text);
        }
      }
    
      updateLocation(getNewFields: any, getType: any) {
        console.log('this.multiselectLocation  :>> ', this.multiselectLocation);
    
        if (getType == 'location') {
    
          this.temp.push({
            id: this.createLocationField.value.name + "#" + (new Date).getTime(),//add unique number 
            //id: this.createLocationField.value.name,
            parent: this.final_list.id,
            text: this.createLocationField.value.name,
            description: this.createLocationField.value.description,
            node_type: "location",
            area: this.createLocationField.value.area,
            summary_enable: this.createLocationField.value.summary_enable,
            summary_types: this.createLocationField.value.summary_types,
            magicboard_view: { "id": this.createLocationField.value.magicboard_view },
            dreamboard_view: { "id": this.createLocationField.value.dreamboard_view },
            leadership_view: { "id": this.createLocationField.value.leadership_view },
            powerboard_view: { "id": this.createLocationField.value.powerboard_view },
            mobile_view: { "id": this.multiselectMobileView }
          })
    
          console.log('temp location', this.temp);
        }
    
        else if (getType == 'updatelocation') {
          //console.log('this.finallist of nodes', this.final_list);
          for (let index = 0; index < this.temp.length; index++) {
            if (this.temp[index].id == this.final_list.id) {
    
              this.temp[index].text = this.createLocationField.value.name;
              this.temp[index].description = this.createLocationField.value.description;
              //this.temp[index].node_type =  "location",
              this.temp[index].area = this.createLocationField.value.area;
              this.temp[index].summary_enable = this.createLocationField.value.summary_enable;
              this.temp[index].summary_types = this.createLocationField.value.summary_types;
              this.temp[index].magicboard_view = { "id": this.createLocationField.value.magicboard_view }
              this.temp[index].dreamboard_view = { "id": this.createLocationField.value.dreamboard_view  },
                this.temp[index].leadership_view = { "id": this.multiselectLeadership };
              this.temp[index].powerboard_view = { "id": this.createLocationField.value.powerboard_view },
    
                this.temp[index].mobile_view = { "id": this.multiselectMobileView };
    
            }
          }
        console.log('updatelocation :>> ', this.temp);
        }
    
    
        else if (getType == 'device') {
    
          //if all is selected
          if (this.allselectedDevices.length != 0) {
            for (let noOfChild = 0; noOfChild < this.allselectedDevices.length; noOfChild++) {
              this.temp.push({
                id: this.createDeviceField.get('name')?.value[0].value + "#" + (new Date).getTime(),
                //id:this.multiselectDevice[noOfChild],
                mn: this.createDeviceField.get('name')?.value[0].value,
                text: [this.createDeviceField.get('name')?.value[0].text],
    RDT:this.RDT_ID,
                parent: this.final_list.id,
                description: this.createDeviceField.value.description,
                node_type: "device",
                icon: this.createDeviceField.value.icon,
                magicboard_view:  { "id": this.createDeviceField.value.magicboard_view },
                dreamboard_view:{ "id": this.createDeviceField.value.dreamboard_view_device },
                leadership_view: { "id": this.createDeviceField.value.leadership_view },
                mobile_view: { "id": this.createDeviceField.value.mobile_view },
                powerboard_view_device: { "id": this.createDeviceField.value.powerboard_view_device }
    
    
              })
            }
    
            console.log('device :>> ', this.temp);
          }
          //if all option is not selected
          else {
            for (let noOfChild = 0; noOfChild < this.multiselectDevice.length; noOfChild++) {
              this.temp.push({
                id: this.createDeviceField.get('name')?.value[0].value + "#" + (new Date).getTime(),
                //id:this.multiselectDevice[noOfChild],
                mn: this.createDeviceField.get('name')?.value[0].value,
                text: [this.createDeviceField.get('name')?.value[0].text],
                RDT:this.RDT_ID,
                parent: this.final_list.id,
                description: this.createDeviceField.value.description,
                node_type: "device",
                icon: this.createDeviceField.value.icon,
                magicboard_view: { "id": this.createDeviceField.value.magicboard_view },
                dreamboard_view: {"id": this.createDeviceField.value.dreamboard_view_device },
                leadership_view: {"id": this.createDeviceField.value.leadership_view },
                mobile_view: {"id": this.createDeviceField.value.mobile_view  },
                powerboard_view_device: { "id": this.createDeviceField.value.powerboard_view_device }
    
    
              })
            }
    
            console.log('noOfChild :>> ', this.temp);
          }
        }
    
        else if (getType == 'updatedevice') {
    
          // console.log('this.finallist of nodes', this.final_list);
          // console.log('finallist of nodes id', this.final_list.id);
    
          console.log(' this.createDeviceField.value.name',  this.createDeviceField.get('name')?.value)
         
          for (let index = 0; index < this.temp.length; index++) {
            if (this.temp[index].id == this.final_list.id) {
    if(this.createDeviceField.get('name')?.value[0].text!==null){
    
      this.temp[index].text = [this.createDeviceField.get('name')?.value[0].text]
    }
    if(this.createDeviceField.get('name')?.value[0].value!==null){
      this.temp[index].mn = this.createDeviceField.get('name')?.value[0].value
    } 
    if(this.createDeviceField.get('name')?.value[0].value!==null&&this.RDT_ID!==""){
      this.temp[index].RDT = this.RDT_ID
    } 
    
              this.temp[index].description = this.createDeviceField.value.description;
              this.temp[index].icon = this.createDeviceField.value.icon;
              this.temp[index].magicboard_view =  { "id": this.createDeviceField.value.magicboard_view }
                this.temp[index].dreamboard_view = { "id": this.createDeviceField.value.dreamboard_view_device }
                this.temp[index].leadership_view = { "id": this.createDeviceField.value.leadership_view }
                this.temp[index].mobile_view = { "id": this.createDeviceField.value.mobile_view }
                this.temp[index].powerboard_view_device = { "id": this.createDeviceField.value.powerboard_view_device }
    
            }
    
          }
    
          console.log('after update of device', this.temp);
        }
    
    
        // this.allLocationDetails = {
        //   PK: this.tempClient,
        //   SK: 1,
        //   tree: JSON.stringify(this.temp)
        // }
        const temp:any=[
          {
            tree: JSON.stringify(this.temp)
          }
        ]
         this.allLocationDetails = {
          PK: this.tempClient,
          SK: 1,
          metadata: JSON.stringify(temp)
        };
    
        console.log("this.allLocationDetails:", this.allLocationDetails)
    
        this.api.UpdateMaster(this.allLocationDetails).then(value => {
    
          //need to refresh table so this is called 
          //this.addFromService();
    
          if (value&&value.metadata&&value.metadata) {
    
            this.tempTree = JSON.parse(JSON.stringify(value?.metadata))

            const parsedOuter = JSON.parse( this.tempTree);

            // Now parse the inner string contained in the "tree" property
            const innerJsonString = parsedOuter[0].tree;
            // this.jsonData = JSON.parse(innerJsonString);
        
            
            // this.tempTree =JSON.parse(this.tempTree)
            $('#SimpleJSTree').jstree(true).settings.core.data = JSON.parse(innerJsonString);
            $('#SimpleJSTree').jstree(true).refresh(true);
    
    
            this.toast.open("Location Configuration updated successfully", " ", {
              //panelClass: 'error-alert-snackbar',
    
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            })
    
            this.multiselectDevice = [];
            this.multiselectDevice_text = [];
            this.allselectedDevices = [];
            this.allselectedDevices_text = [];
    
            //this.closeLocation.nativeElement.click();
            //this.closeLocation.hide();
    
          }
          else {
            Swal.fire({
              customClass: {
                container: 'swal2-container'
              },
              position: 'center',
              icon: 'warning',
              title: 'Error in updating Location Configuration',
              showCancelButton: true,
              allowOutsideClick: false,////prevents outside click
            })
            //alert('Error in adding User Configuration');
          }
        }).catch(err => {
          console.log('err for updation', err);
          this.toast.open("Error in updating new Location Configuration ", "Check again", {
            //panelClass: 'error-alert-snackbar',
    
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            //   //panelClass: ['blue-snackbar']
          })
        })
      }
    
      editLocation() {
        //for populating modal again
        //this.closeLocation.nativeElement.click();
    
        //changing heading of modal 
        this.showNewLoc = false;
    
        console.log('this.final_list.original', this.final_list.original);
    
    
        //this.final_list has selected node details
        this.createLocationField.patchValue({
          'name': this.final_list.original.text,
          'description': this.final_list.original.description,
          'area': this.final_list.original.area,
          'summary_enable': typeof (this.final_list.original.summary_enable) == 'string' ? JSON.parse(this.final_list.original.summary_enable) : this.final_list.original.summary_enable,
          'summary_types': this.final_list.original.summary_types,
          'magicboard_view': this.final_list.original.magicboard_view && this.final_list.original.magicboard_view.id !== null ? this.final_list.original.magicboard_view.id : "",
          'dreamboard_view': (this.final_list.original.dreamboard_view && this.final_list.original.dreamboard_view.id !== null) ? this.final_list.original.dreamboard_view.id : "",
          'leadership_view': this.final_list.original.leadership_view && this.final_list.original.leadership_view.id !== null ? this.final_list.original.leadership_view.id : "",
          'mobile_view': this.final_list.original.mobile_view && this.final_list.original.mobile_view.id !== null ? this.final_list.original.mobile_view.id : "",
          'powerboard_view': this.final_list.original.powerboard_view && this.final_list.original.powerboard_view.id !== null ? this.final_list.original.powerboard_view.id : ""
        })
    
      //   {
      //     "area": 1,
      //     "parent": "ITC#1716284934389",
      //     "magicboard_view": [
      //         {
      //             "text": "ITC",
      //             "value": "ITC"
      //         }
      //     ],
      //     "description": "ITC Mysuru",
      //     "summary_types": "",
      //     "mobile_view": {
      //         "id": []
      //     },
      //     "dreamboard_view": {
      //         "id": []
      //     },
      //     "node_type": "location",
      //     "powerboard_view": {
      //         "id": "ITC"
      //     },
      //     "id": "ITC Mysuru#1716284954951",
      //     "text": "ITC Mysuru",
      //     "summary_enable": false,
      //     "leadership_view": {
      //         "id": []
      //     },
      //     "state": {}
      // }
      }
    
      addLocation() {
    
    
        this.createLocationField = this.fb.group({
          'name': '',
          'description': '',
          'area': '',
          'summary_enable': false,
          'summary_types': '',
          'magicboard_view': '',
          'dreamboard_view': '',
          'leadership_view': '',
          'powerboard_view': '',
          'mobile_view': ''
        })
        this.showNewLoc = true;
      }
    
      editDevice() {
        //this.closeDevice.nativeElement.click();
        this.RDT_ID =""
        console.log('on edit of device', this.final_list.original);
        let tempID: any = [];
    
        console.log('all devices', this.allDevices);
    
        for (let checkDevices = 0; checkDevices < this.allDevices.length; checkDevices++) {
          if (this.final_list.original.id.split("#")[0] === this.allDevices[checkDevices].value) {
            tempID.push(this.allDevices[checkDevices].text);
            break;
          }
        }
        console.log(' before check Array.isArray(tempID)', (tempID));
        this.showNewDevice = false;
        // if (Array.isArray(tempID) === true) {
        //   console.log(' after check Array.isArray(tempID)',Array.isArray(tempID));
    ///BIGGIE CHANGE1
    const temp_rd = [{'text':this.final_list.original.text[0],'value':this.final_list.original.mn}]
    console.log("check jjobj",temp_rd)
        this.createDeviceField.patchValue({
          'name':temp_rd,
          'description': this.final_list.original.description,
          'magicboard_view': this.final_list.original.magicboard_view && this.final_list.original.magicboard_view.id !== null ? this.final_list.original.magicboard_view.id : "",
          'dreamboard_view_device': this.final_list.original.dreamboard_view && this.final_list.original.dreamboard_view !== null ? this.final_list.original.dreamboard_view.id : "",
          'leadership_view': this.final_list.original.leadership_view && this.final_list.original.leadership_view.id !== null ? this.final_list.original.leadership_view.id : "",
          'mobile_view': this.final_list.original.mobile_view && this.final_list.original.mobile_view.id !== null ? this.final_list.original.mobile_view.id : "",
          // 'magicboard_view':this.final_list.original.magicboard_view && this.final_list.original.magicboard_view.id ? this.final_list.original.magicboard_view.id[0].text : [this.final_list.original.magicboard_view.id],
          // 'leadership_view':this.final_list.original.leadership_view && this.final_list.original.leadership_view.id ? this.final_list.original.leadership_view.id[0].text : [this.final_list.original.leadership_view.id],
          // 'mobile_view': this.final_list.original.mobile_view && this.final_list.original.mobile_view.id ? this.final_list.original.mobile_view.id[0].text : [this.final_list.original.mobile_view.id],
          'icon': this.final_list.original.icon,
          'powerboard_view_device': this.final_list.original.powerboard_view_device && this.final_list.original.powerboard_view_device.id !== null ? this.final_list.original.powerboard_view_device.id : ""
    
        })
    
        this.createDeviceField.get('name')?.disable();
        //}
    
      //   {
      //     "mobile_view": {
      //         "id": []
      //     },
      //     "mn": "ITC_MYS_PLC1",
      //     "parent": "ITC Mysuru#1716284954951",
      //     "dreamboard_view": {
      //         "id": []
      //     },
      //     "node_type": "device",
      //     "powerboard_view_device": {
      //         "id": "ITC"
      //     },
      //     "magicboard_view": [
      //         {
      //             "text": "ITC",
      //             "value": "ITC"
      //         }
      //     ],
      //     "icon": "fa fa-cube",
      //     "description": " ITC Mysore PLC1",
      //     "id": "ITC_MYS_PLC1#1716286924273",
      //     "text": [
      //         "ITC_MYS_PLC1"
      //     ],
      //     "leadership_view": {
      //         "id": []
      //     },
      //     "state": {}
      // }
    this.crn.detectChanges()
        // console.log('after values assigned',this.createDeviceField);
    
      }
    
      addDevice() {
    
        this.createDeviceField = this.fb.group({
          'name': [''],
          'description': [''],
          'magicboard_view': [''],
          'dreamboard_view_device': [''],
          'leadership_view': [''],
          'mobile_view': [''],
          'icon': [''],
          'powerboard_view_device': [''],
        })
        this.showNewDevice = true;
    
      }
    
      deleteDevice() {
        // Get the selected node ID
        let nodeID = $("#SimpleJSTree").jstree(true).get_selected()[0];
        console.log('Selected node ID:', nodeID);
        
        // Check if a node is selected
        if (!nodeID) {
            return Swal.fire({
                customClass: { container: 'swal2-container' },
                position: 'center',
                icon: 'warning',
                title: 'Select any Location or Device',
                showCancelButton: true,
                allowOutsideClick: false,
            });
        }
    
        // Get the selected node
        let children = $("#SimpleJSTree").jstree(true).get_node(nodeID);
        console.log('Children object:', children);
    
        // Check if the children object is defined
        if (!children) {
            console.error('No children found for node ID:', nodeID);
            return Swal.fire({
                customClass: { container: 'swal2-container' },
                position: 'center',
                icon: 'warning',
                title: 'Invalid node selected',
                showCancelButton: true,
                allowOutsideClick: false,
            });
        }
    
        // Check if the selected node is a root node
        if (children.parent === "#") {
            return Swal.fire({
                customClass: { container: 'swal2-container' },
                position: 'center',
                icon: 'warning',
                title: 'Don\'t delete root node',
                showCancelButton: true,
                allowOutsideClick: false,
            });
        }
    
        // Check if the node has children that need to be deleted first
        for (let nodesList = 0; nodesList < this.temp.length; nodesList++) {
            if (children.id === this.temp[nodesList].parent) {
                return Swal.fire({
                    customClass: { container: 'swal2-container' },
                    position: 'center',
                    icon: 'warning',
                    title: 'Delete child node first',
                    showCancelButton: true,
                    allowOutsideClick: false,
                });
            }
        }
    
        // Remove the selected node from the temp array
        for (let nodesList = 0; nodesList < this.temp.length; nodesList++) {
            if (this.temp[nodesList].id === children.id) {
                this.temp.splice(nodesList, 1);
                break;
            }
        }
    
        // Immediately update the jstree data
        $('#SimpleJSTree').jstree(true).settings.core.data = this.temp; // Update tree data
        $('#SimpleJSTree').jstree(true).refresh(true); // Refresh the tree
   if(typeof this.temp =="string") {
this.temp =JSON.parse(this.temp)
   }
   else{
    this.temp = this.temp
   }
        // Prepare data for updating the server
        const temp = [{ tree: JSON.stringify(this.temp) }];
        this.allLocationDetails = {
            PK: this.tempClient,
            SK: 1,
            metadata: JSON.stringify(temp),
        };
    
        // Call the API to delete from the server
        this.api.UpdateMaster(this.allLocationDetails).then(value => {
            console.log('API response:', value); // Inspect the entire response object
    
            if (value && value.metadata) {
                // Display success message
                this.toast.open("Location Configuration deleted successfully", " ", {
                    duration: 2000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
                this.multiselectDevice = [];
            } else {
                console.error('Invalid response structure:', value);
                Swal.fire({
                    customClass: { container: 'swal2-container' },
                    position: 'center',
                    icon: 'warning',
                    title: 'Error in deleting Location Configuration',
                    showCancelButton: true,
                    allowOutsideClick: false,
                });
            }
        }).catch(err => {
            console.error('Error during API update:', err);
            this.toast.open("Error in deleting Location Configuration", "Check again", {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        });
    }
    
    


      async addFromService() {
        
        try {
          const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
          if (result) {
            const helpherObj = JSON.parse(result.options);
            this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
            this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
            console.log('this.formList check from location', this.formList);
          }
        } catch (err) {
          console.log("Error fetching the dynamic form data", err);
        }

 this.userdetails = this.getLoggedUser.username;
      this.userClient = this.userdetails +"#user"+"#main"
        console.log('this.tempClient from form service check',this.userClient)
        this.All_button_permissions =  await this.api.GetMaster(this.userClient,1).then(data =>{
          // const metadataString: string | null | undefined = data.metadata;

          // // Check if metadataString is a valid string before parsing
          // if (typeof metadataString === 'string') {
          //     try {
          //         // Parse the JSON string into a JavaScript object
          //         this.metadataObject = JSON.parse(metadataString);
          //         console.log('Parsed Metadata Object:', this.metadataObject);
          //     } catch (error) {
          //         console.error('Error parsing JSON:', error);
          //     }
          // } else {
          //     console.log('Metadata is not a valid string:', metadataString);
          // }
          if(data){
            console.log('data checking from add form',data)
                      const metadataString: string | null | undefined = data.metadata;

          // Check if metadataString is a valid string before parsing
          if (typeof metadataString === 'string') {
              try {
                  // Parse the JSON string into a JavaScript object
                  this.metadataObject = JSON.parse(metadataString);
                  console.log('Parsed Metadata Object from location', this.metadataObject);
              } catch (error) {
                  console.error('Error parsing JSON:', error);
              }
          } else {
              console.log('Metadata is not a valid string:', this.metadataObject);
          }
            // console.log("userPermissions iside",this.modifyList(data.location_permission,data.device_type_permission,data.device_permission))
           return  this.modifyList(this.metadataObject.location_permission,this.metadataObject.form_permission)==="All-All"?false:true
          
          }
          
          })
    
          console.log("this.All_button_permissions",this.All_button_permissions )
        this.locationPermissionService.fetchGlobalLocationTree()
        .then((jsonModified:any) => {
          if (!jsonModified) {
            throw new Error("No data returned");
          }
    
          console.log("Data from location: check", jsonModified);
          this.temp = jsonModified
          const jstreeData = jsonModified.map((treeNode: TreeNode) => ({
            id: treeNode.id, // Use 'id' for jstree node ID
            text: treeNode.text, // Use 'text' for jstree node display
            parent: treeNode.parent || "#", // Set parent, or use "#" for root
            node_type: treeNode.node_type // You can add additional properties as needed
          }));
          setTimeout(() => {
            this.createJSTree(jstreeData);
          }, 1000);
 
          // Proceed with creating the JSTree
         
          // this.createJSTree(jsonModified);
          // this.getAllDevices();
        }
      )
      }
      
    
      // async fetchPBData(sk: any) {
    
      //   try {
      //     const response = await this.api.GetLookupPowerBoard(this.SK_clientID, sk);
    
      //     if (response && response.items) {
      //       // Check if response.items is a string
      //       if (typeof response.items === 'string') {
      //         let data = JSON.parse(response.items);
    
      //         if (Array.isArray(data)) {
      //           for (let index = 0; index < data.length; index++) {
      //             const element = data[index];
    
      //             if (element !== null && element !== undefined) {
      //               this.lookup_data_temp1.push(element);
      //             } else {
      //               break;
      //             }
      //           }
    
      //           //console.log('Data:', this.lookup_data_temp1);
    
      //           // Continue fetching recursively
      //           await this.fetchPBData(sk + 1);
    
      //           if (response.items !== null && response.items !== undefined) {
    
      //           }
      //         } else {
      //           console.error('Invalid data format - not an array.');
      //         }
      //       } else {
      //         console.error('response.items is not a string.');
      //       }
      //     } else {
      //       this.lookup_data_temp1.sort((a: any, b: any) => a[3] - b[3]);
      //       this.listofPowerboardIds = [];
      //       for (let getSK = 0; getSK < this.lookup_data_temp1.length; getSK++) {
      //         this.listofPowerboardIds.push(this.lookup_data_temp1[getSK][0]);
      //         //this.listofReportingUsers.push(result[getSK]?.username);
      //       }
      //       console.log('BUTTON CONFIGURATION', this.listofPowerboardIds)
      //       // for (let getSK = 0; getSK < this.lookup_data_temp1.length; getSK++) {
      //       //   this.listofPowerboardIds.push(this.lookup_data_temp1[getSK][0]);
      //       //   //this.listofReportingUsers.push(result[getSK]?.username);
      //       // }
      //     }
      //   } catch (error) {
      //     console.error('Error:', error);
      //     // Handle the error as needed
      //   }
      // }
      // async fetchPBData(sk: any) {
      //   try {
      //     const response = await this.api.GetLookupMasterTable(this.SK_clientID+"#power_board", sk);
      
      //     if (response && response.items) {
      //       // Check if response.listOfItems is a string
      //       if (typeof response.items === 'string') {
      //         let data = JSON.parse(response.items);
      
      //         if (Array.isArray(data)) {
      //           for (let index = 0; index < data.length; index++) {
      //             const element = data[index];
      
      //             if (element !== null && element !== undefined) {
      //               // Extract values from each element and push them to lookup_data_temp1
      //               const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
      //               const { P1, P2, P3 } = element[key]; // Extract values from the nested object
      //               this.lookup_data_temp1.push([P1, P2, P3]); // Push an array containing P1, P2, and P3 values
      //             } else {
      //               break;
      //             }
      //           }
      
      //           // Continue fetching recursively
      //           await this.fetchPBData(sk + 1);
      //         } else {
      //           console.error('Invalid data format - not an array.');
      //         }
      //       } else {
      //         console.error('response.listOfItems is not a string.');
      //       }
      //     } else {
      //       // Sort the lookup_data_temp1 array based on the third element (P3)
      //       this.lookup_data_temp1.sort((a: any, b: any) => b[2] - a[2]);
      //       this.listofPowerboardIds = [];
      //       // Extract the IDs and display the datatable
           
      //       this.listofPowerboardIds = this.lookup_data_temp1.map((item: any) => item[0]);
       
      //     }
      //   } catch (error) {
      //     console.error('Error:', error);
      //     // Handle the error as needed
      //   }
      // }
      // async fetchTMData(sk: any) {
      //   console.log("iam trying to fetch",this.SK_clientID)
      //   try {
      //     const response = await this.api.GetLookupMasterTable(this.SK_clientID+"#device", sk);
       
      //     if (response && response.items) {
      //       // Check if response.listOfItems is a string
      //       if (typeof response.items === 'string') {
      //         let data = JSON.parse(response.items);
      //         console.log("d1 =",data)
      //         if (Array.isArray(data)) {
      //           for (let index = 0; index < data.length; index++) {
      //             const element = data[index];
      
      //             if (element !== null && element !== undefined) {
      //               // Extract values from each element and push them to lookup_data_temp1
      //               const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
      //               const { P1, P2, P3,P4,P5 } = element[key]; // Extract values from the nested object
      //               this.lookup_data_tempL1.push({P1, P2, P3,P4,P5 }); // Push an array containing P1, P2, and P3 values
      //               console.log("d2 =",this.lookup_data_temp1)
      //             } else {
      //               break;
      //             }
      //           }
      //           //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
      //           this.lookup_data_tempL1.sort((a: { P5: number; }, b: { P5: number; }) => {
      //             return b.P5 - a.P5; // Compare P5 values in descending order
      //           });
      //           console.log("Lookup sorting",this.lookup_data_tempL1);
      //           // Continue fetching recursively
      //           await this.fetchTMData(sk + 1);
      //         } else {
      //           console.error('Invalid data format - not an array.');
      //         }
      //       } else {
      //         console.error('response.listOfItems is not a string.');
      //       }
      //     } else {
      //       // Sort the lookup_data_temp1 array based on the third element (P3)
      //     console.log()
         
      //       // Extract the IDs and display the datatable
      //       // this.listofPowerboardIds = this.lookup_data_temp1.map((item: any) => item[0]);
      //       // this.showDatatable(this.lookup_data_temp1);
      //       console.log("Data to bemmmmm displayed",this.lookup_data_tempL1);
      //       // this.getDatatable(this.lookup_data_temp1);
      //       // for (let getSK = 0; getSK < this.lookup_data_tempL1.length; getSK++) {
      //       //   this.listofDeviceIds[getSK] = this.lookup_data_tempL1[getSK].P1;
      //       //   //this.listofReportingUsers.push(result[getSK]?.username);
      //       // }
    
      //       for (let getSK = 0; getSK < this.lookup_data_tempL1.length; getSK++) {
      //         this.listofDeviceIds.push({"value":this.lookup_data_tempL1[getSK].P1,"text":this.lookup_data_tempL1[getSK].P2,"RDT":this.lookup_data_tempL1[getSK].P3});
      //       }
      //       console.log("Data to bemmmmssssssm displayed -----",this.listofDeviceIds);
    
            
    
      //       this.crn.detectChanges()
      //     }
      //   } catch (error) {
      //     console.error('Error:', error);
      //     // Handle the error as needed
      //   }
      // }
      modifyList(location_permission: any, form_permissions: any): string {
        // Check if locationPermission and devicePermissions are defined and are arrays
        if (!Array.isArray(location_permission) || !Array.isArray(form_permissions)) {
            console.error("Invalid input: locationPermission and devicePermissions must be arrays.");
            return ''; // Return early if inputs are not valid
        }
    
        // Determine the permission type for location and device
        const keyLocation = location_permission.length === 1 && location_permission[0] === "All" ? "All" : "Not all";
        const keyDevices = form_permissions.length === 1 && form_permissions[0] === "All" ? "All" : "Not all";
    
        console.log("modify", `${keyLocation}--${keyDevices}`);
    
        // Concatenate data based on the keys
        switch (`${keyLocation}-${keyDevices}`) {
            case "All-All":
                // return [...deviceTypePermissions, ...devicePermissions]; // Assuming deviceTypePermissions is defined
                return "All-All";
    
            default:
                console.log("Unrecognized case");
                return '';
        }
    }
    
    //    get RDT(){
    //     if(this.RDT_ID!==""&&this.RDT_ID!==undefined){
    // return this.RDT_ID
    //     }else if(this.final_list?.original?.RDT!==""){
    // return this.final_list?.original?.RDT
    
    //     }else{
    //       return "rdt is empty"
    //     }
    // // return this.RDT_ID!==""||this.RDT_ID!==undefined?this.RDT_ID:this.final_list?.original?.RDT!==""?this.final_list?.original?.RDT:"rdt is empty"
    //    }

}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

