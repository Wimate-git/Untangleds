import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Config } from 'datatables.net';
import moment from 'moment';
import { IUserModel, UserService, userInterface } from 'src/app/_fake/services/user-service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AES } from 'crypto-js';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



import bootstrap from 'bootstrap';
import { environment } from 'src/environments/environment';
import { AdminDeleteUserCommandInput, CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamicApiService } from '../dynamic-api.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { UserVerifiedTableComponent } from './user-verified-table/user-verified-table.component';
import { AuditTrailService } from '../services/auditTrail.service';

interface TreeNode {
  id: string;         // Assuming 'id' is a string
  text: string;       // Assuming 'text' is a string
  parent?: string;    // 'parent' can be a string or undefined
  node_type?: string; // Optional property for node type
}

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
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})




export class UserManagementComponent implements OnInit{

 

  isCollapsed1 = false;
  @ViewChild('closeUser') closeUser: any;
  @ViewChild('openModal1') openModal1!: TemplateRef<any>;
  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  lookupdatapermission: any = [];
  columnDatatable: any = [];
  lookup_data_company: any = [];
  columnTableData: any = [];
  showHeading:boolean = true
  base64textString: string;
  base64textString_temp: any;
  errorForUniqueUserID:any = ''
  errorForInvalidName:any = ''
  listofClientIDs:any = []
  listofCompanyIDs:any = []
  disabled_CLientID_textField: any = true;
  disabled_companyID_textField: boolean = true;
  errorForUniqueID:any = ''
  errorForUniqueEmail:any = ''
  errorForInvalidEmail:any = ''

  dynamicIDArray:any = ['None']


  //Swal need to be added
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};


  // Single model
  aUser: Observable<userInterface>;
  userModel: userInterface = { P1:'',P2:'',P3:'',P4:0,P5:''};



  switchBetweenDropdown_company_id: boolean = false;
  switchBetweenDropdown_textField:boolean = false

  locationPermissionArray :any =['All']

deviceListWorkAround :any =[{
  text: "None",
  value: "None"
 }]

rdtListWorkAround :any =[{
  text: "None",
  value: "None"
  }]

  listofPermissionIDs:any = ["All"]
  listofReportingUsers:any = ["All"]


  createUserField: UntypedFormGroup;
  dropdownSettings: any = {};
  startNode:any = []
  hideUpdateButton:any
  showModal:any
  listofUserID: any = [];
  dataUser: any;
  editOperation: boolean;
  multiselectDeviceType_permission: never[];
  multiselectDevice_permission: never[];
  multiselectDevice_dev: never[];
  showMobileNumber: any;
  showDisabledClientID: any = false;
  showDisabledCompanyID: any;
  SK_clientID: any;
  user_companyID: any;
  lookup_client: any;
  lookup_data_user: any = [];
  listofSK: any = [];
  listofEmails: any = [];
  allUserDetails:any =  {};
  maxlength: number = 500;
  userPool: any;

  isLoading:boolean = false
  data_temp: any = [];
  maskedNumber: any;
  userSK: any;
  getLoggedUser: any;
  loggedUserName: any;
  lookup_data_client: any = [];
  disableFields: boolean = false;
  master_user_data: any;
  errorForUniquemobileID: string = '';
  listofMobileID: any = [];
  lookup_All_User: any = [];
  permission_data: any = [];
  company_data: any = [];
  formList: any = ["All"];
  temp: any;
  originalData: any;
  parentID_selected_node: any;
  final_list: any;
  enableLocationButton: boolean;
  enableDeviceButton: boolean;
  adminLogin:boolean = false
  Allpermission: any;
  cloneUserOperation: boolean = false;
  redirectionURL: string = '';
  lookup_All_temp: any = [];
  tempUserName: string;
  tempUserID: string;
  combinationOfUser: any = [];
  tempUpdateUser: any;
  username: any;

  constructor(private apiService: UserService,private configService:SharedService,private fb:FormBuilder
    ,private cd:ChangeDetectorRef,private api:APIService,private toast:MatSnackBar,private spinner:NgxSpinnerService,private modalService: NgbModal,private DynamicApi:DynamicApiService,
    private locationPermissionService:LocationPermissionService,private auditTrail:AuditTrailService){}


    reloadTable(){
      console.log("Table is reloaded here ");
      this.reloadEvent.next(true)
      this.addFromService()
    }



  async ngOnInit(){

    this.getLoggedUser = this.configService.getLoggedUserDetails()

    this.SK_clientID = this.getLoggedUser.clientID;

    this.Allpermission = this.getLoggedUser.permission_ID == 'All'?true:false;

    this.username = this.getLoggedUser.username


    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

    console.log("All the permissions are here ",this.Allpermission);
 
    this.adminLogin = this.SK_clientID == 'WIMATE_ADMIN'?true:false 
    this.user_companyID = this.getLoggedUser.companyID
 
    this.dropdownSettings = this.configService.getSettings();
    this.addFromService();
    this.initializeUserFields()

    this.showTable()

    this.getTreeInputData()

    
  }


  getTreeInputData(){
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
        }
      )
  }



  onSubmit(event:any){
     
    console.log("Submitted is clicked ",event);
    if(event.type == 'submit' && this.editOperation == false){
      this.createNewUser('','html')
    }
    else{
      this.updateUser(this.createUserField.value,'editUser')
    }
  }

  

  createJSTree(jsondata: any) {
    // Store the original data to reinitialize the tree when needed
    this.originalData = jsondata;
  
    const initializeTree = (data: any) => {
      (<any>$("#SimpleJSTree")).jstree({
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
            let tree = (<any>$("#SimpleJSTree")).jstree(true);
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
        let searchTerm:any = $('#search').val();
  
        if (searchTerm && searchTerm.length > 0) {
          // Perform the search if there's input
          (<any>$("#SimpleJSTree")).jstree(true).search(searchTerm);
        } else {
          // Clear the search and reset the tree when input is empty
          (<any>$("#SimpleJSTree")).jstree(true).clear_search();
  
          // Destroy the current tree instance
          (<any>$("#SimpleJSTree")).jstree(true).destroy();
  
          // Reinitialize the tree with the original data
          initializeTree(this.originalData);
        }
      }, 250);
    });
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


  async getTreeData(){
    try{
      await this.api.GetMaster(`${this.SK_clientID}#${this.user_companyID}#location#main`,1).then((result)=>{
        if(result && result.metadata){

          // console.log("tree result is here ",result);

          const tree = JSON.parse(result.metadata)
          const modifiedJson = JSON.parse(tree[0].tree)
          console.log("modifiied data is here ",modifiedJson);

          if(Array.isArray(modifiedJson) && modifiedJson.length > 0){
            this.locationPermissionArray = []
          }

          for(let i = 0;i<modifiedJson.length;i++){

            if(modifiedJson[i].node_type == "location"){
              if (i == 0) {
                this.locationPermissionArray.push("All")
              }
    
              // if (i !== 0) {
                //substracting -1 becas of binding list first 2 consist of All,none
                this.locationPermissionArray.push(
                  modifiedJson[i].text
                )
              // }
  
              
              this.startNode.push(modifiedJson[i].text)
              // this.defaultlocation.push(this.temp[i].text+"-"+this.temp[i].node_type)
            }
            // else if(this.temp[i].node_type == "device"){
            //   this.startNode.push(this.temp[i].text+"-"+this.temp[i].node_type)
            //   this.defaultlocation.push(this.temp[i].text+"-"+this.temp[i].node_type)
            // }

                       
          }
          console.log("Tree data is",this.locationPermissionArray); 

          this.cd.detectChanges()
        }
      })
    }
    catch(error){
      console.log("Error getting the tree data ",error);
    }
  }



  testAPI(){
    const body = { type: "userVerify", username:"Asad",name:"Asad",email:"asad@gmail.com"};


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


  logAndDismiss(modal:any) {
    console.log(modal);
    modal.dismiss();
  }

  initializeUserFields() {
    this.createUserField = this.fb.group({
      'userID': ['', Validators.required],
      'name': ['', Validators.required],
      'allowOtherClient': [''],
      'allowNewClient': [''],
      'allowOtherCompanyID': [''],
      'allowNewCompanyID': [''],
      'clientID': ['', Validators.required],
      'disabled_CLientID': [''],
      'companyID': ['', Validators.required],
      'username': ['', Validators.required],
      'description': ['', Validators.required],
      'mobile': [''],
      'mobile_privacy': [''],
      'key': [''],
      'location_object': [''],
      'default_module': [''],
      // 'admin': ['', Validators.required],
      // 'user_type': ['', Validators.required],
      'alert_email': ['', Validators.required],
      'alert_sms': ['', Validators.required],
      'alert_telegram': ['', Validators.required],
      'escalation_email': ['', Validators.required],
      'escalation_sms': ['', Validators.required],
      'escalation_telegram': ['', Validators.required],
      'email': ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      'telegramID': ['', Validators.required],
      'location_permission': ['', Validators.required],
      'device_type_permission': ['', Validators.required],
      'device_permission': ['', Validators.required],
      'form_permission': ['', Validators.required],
      'default_dev': [''],
      'default_loc': [''],
      'default_type': ['', Validators.required],
      'start_node': [''],
      'alert_levels': ['', Validators.required],
      'permission_ID': ['', Validators.required],
      'report_to': ['', Validators.required],
      'enable_user': [''],
      'disable_user': [''],
      'cognito_update': ['', Validators.required],
      'profile_picture': [''],
      'health_check': [''],
      'device_timeout': [''],
      'alert_timeout': [''],
      'disabled_companyid': [''],
    })
  }



  async addFromService() {
    await this.getClientID()
    await this.fetchAllUsersData(1)
    await this.getAllUsers()
    await this.getPermissionIDs(1)
    await this.getCompanyIDs(1);
    await this.getTreeData();


    try {
      await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options);
    
          // Corrected the map function
          this.formList = helpherObj.map((item: any) => (item[0]));

          this.formList.unshift('All')
        }
      });
    } catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }
  }



  async getCompanyIDs(sk: any){
    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster(this.SK_clientID+"#company#lookup", sk);

   
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
                this.company_data.push({P1, P2, P3,P4,P5,P6 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =",this.company_data)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.company_data.sort((a:any, b:any) => {
              return b.P5 - a.P5; // Compare P5 values in descending order
            });
            console.log("Lookup sorting",this.company_data);
            // Continue fetching recursively
            await this.getCompanyIDs(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {
        // Sort the lookup_data_temp1 array based on the third element (P3)
      console.log()
        console.log("companies to be displayed",this.company_data);  
        
        this.listofCompanyIDs = this.company_data.map((item:any)=>item.P1)
      }
    } catch (error) {
      console.error('Error:', error);
     
    }
  }

  async getPermissionIDs(sk: any) {

    console.log("Iam called Bro");
    try {
      const response = await this.api.GetMaster(this.SK_clientID+"#permission#lookup", sk);
   
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
                this.permission_data.push({P1, P2, P3,P4,P5,P6 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =",this.permission_data)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.permission_data.sort((a:any, b:any) => {
              return b.P5 - a.P5; // Compare P5 values in descending order
            });
            console.log("Lookup sorting",this.permission_data);
            // Continue fetching recursively
            await this.getPermissionIDs(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {
        // Sort the lookup_data_temp1 array based on the third element (P3)
      console.log()
        console.log("Permissions to be displayed",this.permission_data);  
        
        this.listofPermissionIDs = this.permission_data.map((item:any)=>item.P1)

        this.listofPermissionIDs.unshift('All')

        this.listofPermissionIDs = new Set(this.listofPermissionIDs)
      }
    } catch (error) {
      console.error('Error:', error);
     
    }
  }





  async getAllUsers(){
   
    try {
      
      console.log("All the unique details of user are here ", this.lookup_All_User);

      this.combinationOfUser = this.lookup_All_User.map((item:any)=>{
        return {user:item.P1,clientID:item.P2}
      })

      this.listofUserID = this.lookup_All_User.map((item:any)=>item.P5)

      this.listofEmails = this.lookup_All_User.map((item:any)=>item.P3)

      this.listofMobileID = this.lookup_All_User.map((item:any)=>item.P4)

      this.listofSK = this.lookup_All_User.map((item:any)=>item.P1)

      // console.log("Combination of users ",this.combinationOfUser);

  } catch (err) {
      console.error("Error fetching all the clients", err);
  }
  }



  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deleteUser(id, 'delete');

  }

  create() {
    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
    console.log("Add is clicked");
    this.openModal('','')
  }


  edit(P1: any) {
    console.log("Edit is clicked ");
    this.openModalHelpher(P1)


    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "User Management",
        "Form Name": 'User Management',
       "Description": `${P1} username details were Viewed`,
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

  openModalUser(modalTemplate: TemplateRef<any>) {
    this.modalService.open(modalTemplate);
  }




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

  handleKBconversion(readerEvt: any) {
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    let files = this.base64textString_temp.target.files;
    let file = files[0];
    let fileExtension = file.type;
    this.base64textString_temp = 'data:' + fileExtension + ';base64,' + this.base64textString;

    let length = this.base64textString.length;
    //console.log('length of image',length);
    let y = 1;
    if (('=' == this.base64textString[this.base64textString.length - 1]) && ('=' == this.base64textString[this.base64textString.length - 2])) {
      y = 2;
    }
    let x = (length * (3 / 4)) - y;
    x = x / 1000;
    if (x < 400) {
      
    }
    else {
    
      return Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        text: 'Image should be less than 400KB',
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,
      })
    }

  }

  checkUniqueUserID(getUserID: any) {
    this.errorForUniqueUserID = '';
    for (let uniqueID = 0; uniqueID < this.listofUserID.length; uniqueID++) {
      if(this.dataUser.userID == getUserID.target.value && this.editOperation){

      }
      else if ((getUserID.target.value).toLowerCase() == (this.listofUserID[uniqueID]).toLowerCase()) {
        this.createUserField.setErrors({ invalidForm: true });
        this.errorForUniqueUserID = "User ID already exists";
      }
    }
  }

  uniqueMobile(getUserID: any){



    this.errorForUniquemobileID = '';
    for (let uniqueID = 0; uniqueID < this.listofMobileID.length; uniqueID++) {
      if(this.dataUser.mobile == getUserID.target.value && this.editOperation){

      }
      else if (getUserID.target.value == this.listofMobileID[uniqueID]) {
        this.createUserField.setErrors({ invalidForm: true });
        this.errorForUniquemobileID = "Mobile no already exists";
      }
    }
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


  checkName_asPassword(getPassword: Event) {
    const password = (getPassword.target as HTMLInputElement).value;
    console.log('Password is here:', password);
    // Updated regex: includes special character requirement
    // const temp_Password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
    const temp_Password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?`~_-]).{6,}$/;
    this.errorForInvalidName = ''; // Clear previous error
    if (!temp_Password.test(password)) {
      this.createUserField.setErrors({ invalidForm: true });
        this.errorForInvalidName =
            "Password must contain at least 1 numeric character, at least 1 lowercase letter, at least 1 uppercase letter, at least 1 special character, and be at least 6 characters long.";
    }
    console.log(this.errorForInvalidName);
}

  switchInputs(getValue: any) {
    
    if (getValue && getValue !== null && getValue.target && getValue.target.checked == true) {
      this.switchBetweenDropdown_textField = true;
      this.disabled_CLientID_textField = false;
    }
    else if (getValue && getValue !== null && getValue.target && getValue.target.checked == false) {
      this.switchBetweenDropdown_textField = false;
      this.disabled_CLientID_textField = true;
    }

    else {
      this.switchBetweenDropdown_textField = true;
      this.disabled_CLientID_textField = false;
      this.showDisabledClientID = this.createUserField.get('disabled_CLientID')?.setValue(this.SK_clientID, { emitEvent: false });
      this.createUserField.get('disabled_CLientID')?.disable({ emitEvent: false })
    }
  }

  switchCompanyID(getValue: any) {
    console.log("Iam triggered in seitch :");
    if (getValue && getValue !== null && getValue.target && getValue.target.checked == true) {
      this.switchBetweenDropdown_company_id = true;
      this.disabled_companyID_textField = false;
    }
    else if (getValue && getValue !== null && getValue.target && getValue.target.checked == false) {
      this.switchBetweenDropdown_company_id = false;
      this.disabled_companyID_textField = true;
    }

    else {
      this.switchBetweenDropdown_company_id = true;
      this.disabled_companyID_textField = false;
      this.showDisabledCompanyID = this.createUserField.get('disabled_companyid')?.setValue(this.user_companyID, { emitEvent: false });
      this.createUserField.get('disabled_companyid')?.disable({ emitEvent: false })
    }
  }

  checkUniqueIdentifier(getID: any) {

    const tempUser = getID.target.value
    this.errorForUniqueID = '';

    if(tempUser.includes(' ') == true){
      this.errorForUniqueID = "Space not allowed";
    }

    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
      if(this.dataUser.username == tempUser && this.editOperation){

      }
      else if (tempUser.toLowerCase() == this.listofSK[uniqueID].toLowerCase()) {
        this.createUserField.setErrors({ invalidForm: true });
        this.errorForUniqueID = "User Name already exists";
      }
    }
  }

  keyPress(event: any) {
    const pattern = /['0-9'\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    // console.log('inputchar',inputChar);
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

  checkUniqueEmail(getMail: any) {
    console.log('getMail', getMail);
    this.errorForUniqueEmail = '';
    for (let uniqueID = 0; uniqueID < this.listofEmails.length; uniqueID++) {
      if (getMail.target.value == this.listofEmails[uniqueID]) {
        this.createUserField.setErrors({ invalidForm: true });
        this.errorForUniqueEmail = "Email already exists";
      }
    }
  }


  onDeviceTypeSelect(option: any) {
    // this.multiselectDeviceType_permission.push(option.value.split("-")[0]);
    
  }


  onDeviceDefaukt(option: any){
    // this.multiDefaultdevice.push(option.value.split("-")[0]);
  }

  onLocationSelect(option: any){
      // this.multiselectLocation.push(option.value)
  }


  onDeviceType(option: any) {
    // this.multiselectDevice_dev.push(option.value);
  }

  onSelectAll(devicetype: any) {
    // for (let allValues = 0; allValues < devicetype.length; allValues++) {
    //   this.allDeviceTypeValues.push(devicetype[allValues].value);
    // }
  }

  onDeviceSelect(option: any) {
    // this.multiselectDevice_permission.push(option.value.split("-")[0]);

  }

  onSelectAllDevices(device: any) {
    // for (let allValues = 0; allValues < device.length; allValues++) {
    //   this.allDeviceValues.push(device[allValues].value);
    // }
  }
  
  updateUser(value: any, key: any) {
    console.log("value",value)


    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'User updated successfully!' : 'User created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };



    let updateDevice_type: any = [];
    let updateDevice: any = [];
    let updateLocation :any = [];

   
    let companyidTemp = '';
    if(this.createUserField.value.allowNewCompanyID == null || this.createUserField.value.allowNewCompanyID == false){
      console.log("Iam entered in the companyID disable :",this.createUserField.get('disabled_companyid')?.value);
      companyidTemp = this.createUserField.get('disabled_companyid')?.value;
    }
    else{
      console.log("Iam entered in the companyID Enabled :",this.createUserField.value.companyID);
      companyidTemp = this.createUserField.value.companyID
    }

    let clientTemp = ''
    //console.log('temp_device_permi_list',temp_device_permi_list);
    if (this.createUserField.value.allowOtherClient == null || this.createUserField.value.allowOtherClient == false) {
      console.log("Iam entered in the ClientID disable :",this.createUserField.get('disabled_CLientID')?.value);
      clientTemp = this.createUserField.get('disabled_CLientID')?.value;
      if(this.createUserField.get('disabled_CLientID')?.value){
        clientTemp = this.createUserField.get('disabled_CLientID')?.value;
      }
      else{
        clientTemp = this.createUserField.value.clientID
      }
    }
    else{
      console.log("Iam entered in the ClientID Enabled :",this.createUserField.value.clientID);
      clientTemp = this.createUserField.value.clientID
    }

    var tempObj:any;

    if (key == "editUser") {

      this.dynamicRedirectChanged(this.createUserField.value.location_object)

      this.allUserDetails = {
     
        userID: this.createUserField.get('userID')?.getRawValue(),
        password: this.createUserField.value.name,
        clientID:clientTemp,
        allowOtherClient: this.createUserField.value.allowOtherClient,
        allowNewClient: this.createUserField.value.allowNewClient,
        allowOtherCompanyID: this.createUserField.value.allowOtherCompanyID,
        allowNewCompanyID: this.createUserField.value.allowNewCompanyID,
        companyID: companyidTemp,
        username:this.tempUpdateUser,
        description: this.createUserField.value.description,
        mobile: this.createUserField.value.mobile,
        mobile_privacy: this.createUserField.value.mobile_privacy,
        // admin: this.createUserField.value.admin,
        // user_type: this.createUserField.value.user_type,
        alert_email: this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email,
        alert_sms: this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms,
        alert_telegram: this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram,
        escalation_email: this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email,
        escalation_sms: this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms,
        escalation_telegram: this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram,
        email: this.createUserField.value.email,
        telegramID: this.createUserField.value.telegramID,
        location_permission: this.createUserField.get('location_permission')?.value,
        form_permission:this.createUserField.get('form_permission')?.value,
        device_type_permission: updateDevice_type,
        device_permission: updateDevice,
        default_dev: this.createUserField.value.default_dev,
        default_loc: this.createUserField.value.default_loc,
        default_type: this.createUserField.value.default_type,
        start_node: this.createUserField.value.start_node,
        alert_levels: this.createUserField.value.alert_levels,
        permission_ID: this.createUserField.value.permission_ID,
        report_to: this.createUserField.value.report_to,
        enable_user: this.createUserField.value.enable_user == null ? false : this.createUserField.value.enable_user,
        disable_user: this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user,
        health_check: this.createUserField.value.health_check == null ? false : this.createUserField.value.health_check,
        device_timeout: this.createUserField.value.device_timeout == null ? false : this.createUserField.value.device_timeout,
        alert_timeout: this.createUserField.value.alert_timeout == null ? false : this.createUserField.value.alert_timeout,
        profile_picture: this.base64textString_temp,
        redirectionURL:this.redirectionURL,
        location_object:this.createUserField.value.location_object,
        default_module:this.createUserField.value.default_module,
        updated: new Date()

      }

      tempObj = {
        PK:this.tempUpdateUser+"#user"+"#main",
        SK: 1,
        metadata:JSON.stringify(this.allUserDetails)
      }
    }


  
    console.log("temp obj is here ",tempObj);


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
  P1: this.tempUpdateUser,
  P2: this.allUserDetails.mobile || 'N/A',
  P3: this.allUserDetails.email,
  P4: this.allUserDetails.permission_ID,
  P5:temp4,
  P6:temp2,
  P7:date

  }
  console.log("Items to add on lookup are ",items);


  const masterUser = {
    P1:this.tempUpdateUser,
    P2:this.allUserDetails.clientID,
    P3:this.allUserDetails.email,
    P5:this.createUserField.value.userID,
    P4:this.allUserDetails.mobile || 'N/A'
  }
   

    console.log("master table data is here ",masterUser);

    console.log('object :>> ', this.allUserDetails);

    console.log("Items to be pushed into database :",items);



    if (this.createUserField.value.clientID === this.SK_clientID) {
      // console.log(' this.userpool', this.userPool);
      // if( this.cognitoUSER.userConfirmed === false){

      //   return  Swal.fire(
      //     'User should be confirmed from mail'
      //   )
      // }


    console.log("temp obj is here after submit",tempObj);

      
      this.api.UpdateMaster(tempObj).then(async value => {

        this.spinner.show()

        if (value) {

       

          await this.fetchTimeMachineById(1,this.tempUpdateUser, 'update', items);

          await this.fetchAllusersData(1,this.tempUpdateUser,'update',masterUser)

          this.spinner.hide()


      

          // await this.loading()
          // await this.showTable()

          this.datatableConfig = {}
          this.lookup_data_user = []


            //Create Query Paramter Strings for cognito service for enable or disable the user
            let QueryParam = {}
            if(this.allUserDetails.enable_user == true){
              QueryParam = {
                "path": "/enableUser",
                "queryStringParameters": {
                "email": masterUser.P3,
                "username":masterUser.P1,
                "clientID": masterUser.P2
              }
              }
            }
            else{
              QueryParam = {
                "path": "/disableUser",
                "queryStringParameters": {
                "email": masterUser.P3,
                "username":masterUser.P1,
                "clientID": masterUser.P2
              }
              }
            }




                const body = { "type": "cognitoServices",
                "event":QueryParam
                }


          try {

            const response = await this.DynamicApi.getData(body);
            console.log("Response is here ",JSON.parse(response.body));

          } catch (error) {
            console.error('Error calling dynamic lambda:', error);
            this.spinner.hide();
          }
















          try{
            const UserDetails = {
              "User Name": this.username,
              "Action": "Edited",
              "Module Name": "User Management",
              "Form Name": 'User Management',
             "Description": `${masterUser.P1} username details were Edited`,
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



          this.updateCognitoAttributes();


          this.showAlert(successAlert)
          this.reloadEvent.next(true)

          //alert('Configuration updated successfully');
          // this.toast.open("User Configuration updated successfully", "", {
          //   //panelClass: 'error-alert-snackbar',

          //   duration: 2000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'top',
          //   //   //panelClass: ['blue-snackbar']
          // })

          //need to refresh table so updated value will be fetched
          this.addFromService();
          //modal closing based on viewchild
          // this.closeUser.nativeElement.click();


          //___________________updating cutom attributes__________________________in aws cognito

 

        }
        else {
          alert('Error in updating user Configuration');
        }

      }).catch(err => {
        this.showAlert(errorAlert)
        console.log('error for updating', err);
        this.spinner.hide()
      })
    }

    else {
      ///Operation Only remove & Add dynamoDB record  ,Update Cognito
      console.log('inside else')
      // this.fetchTimeMachineById(1,items.P1, 'delete', items);

      
      
      this.deleteUser(this.allUserDetails, 'update_delete');
    }




  }



  updateCognitoAttributes() {

    let authenticationData = {
      Username: this.tempUpdateUser,
      Password: this.createUserField.value.name,
    };

    let poolData = {
      UserPoolId: "ap-south-1_aaPSwPS14", // user pool id here
      ClientId: "42pb85v3sv84jdrfi1rub7a4e5"// client id here
    };

    let userPool = new CognitoUserPool(poolData);


    let poolDetails: any = {
      Username: this.tempUpdateUser,
      Pool: userPool
    }



    let userData: any = {
      "email": this.createUserField.value.email,
      'custom:userID': this.createUserField.value.userID,
      'custom:password': this.createUserField.value.name,
      'custom:clientID': this.allUserDetails.clientID,
      'custom:companyID': this.allUserDetails.companyID,
      'custom:username': this.tempUpdateUser,
      'custom:description': this.createUserField.value.description,
      'custom:mobile': JSON.stringify(this.createUserField.value.mobile),
      'custom:mobile_privacy': this.createUserField.value.mobile_privacy,
      // 'custom:admin': JSON.stringify(this.createUserField.value.admin),
      // 'custom:user_type': JSON.stringify(this.createUserField.value.user_type),
      'custom:user_type': JSON.stringify(this.createUserField.value.user_type),
      'custom:enable_user': JSON.stringify(this.createUserField.value.enable_user == null ? false : this.createUserField.value.enable_user),
      'custom:disable_user': JSON.stringify(this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user),
      'custom:alert_email': JSON.stringify(this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email),
      'custom:alert_sms': JSON.stringify(this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms),
      'custom:alert_telegram': JSON.stringify(this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram),
      'custom:escalation_email': JSON.stringify(this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email),
      'custom:escalation_sms': JSON.stringify(this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms),
      'custom:escalation_telegram': JSON.stringify(this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram),
      'custom:telegramID': JSON.stringify(this.createUserField.value.telegramID),
      'custom:permission_id': this.allUserDetails.permission_ID,
      'custom:defaultdevloc': this.createUserField.value.default_dev_loc,
      // "phone_number": (this.registrationForm.value.phone_number)
    }

    let cognitoUser = new CognitoUser(poolDetails);

    let authenticationDetails = new AuthenticationDetails(authenticationData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        let accessToken = result.getAccessToken().getJwtToken();

        // console.log('after authenicated result', result);

        // console.log('accessToken after receiving result', accessToken);

        /* Use the idToken for Logins Map when Federating User Pools 
        with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
        //let idToken = result.idToken.jwtToken;
        let attributeList = [];
        for (let key in userData) {
          let attrData = {
            Name: key,
            Value: userData[key]
          }
          //console.log('attribute data', attrData)
          let attribute = new CognitoUserAttribute(attrData);
          attributeList.push(attribute);
        }
        // console.log('userData', userData);
        // console.log('attributeList', attributeList);
        //cognitoUser.getUserAttributes
        cognitoUser.updateAttributes(attributeList, (err, result) => {
          if (err) {
            console.log("\n\nUpdate Error: ", err, "\n\n");
          } else {
            console.log('after updating', result);
          }
        });
      },

      

      onFailure: function (err) {
        console.log("Cognito Error",err);

        if(err.message != 'User is disabled.'){
          alert(err)
        }
      },

    });
  }




  async createNewUser(getNewFields: any, key: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'User updated successfully!' : 'User created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };


    //without sending email, confimration needed for update,so just update attributes in cognito
    let token = this.generateToken((this.createUserField.value.username).toLowerCase(), this.createUserField.value.clientID);
    console.log('USER GENERTED ENCRIPTED KEY', token)
    console.log('clientID', this.createUserField.value.clientID);

    let tempObj:any = {}

    if (key == "update") {

      this.dynamicRedirectChanged(this.createUserField.value.location_object)

     
      this.allUserDetails = {
        userID: (this.createUserField.value.userID).toLowerCase(),
        name: this.createUserField.value.name,
        key: token,
        allowOtherClient: this.createUserField.value.allowOtherClient,
        allowNewClient: this.createUserField.value.allowNewClient,
        allowOtherCompanyID: this.createUserField.value.allowOtherCompanyID,
        allowNewCompanyID: this.createUserField.value.allowNewCompanyID,
        clientID: this.createUserField.value.clientID,
        companyID: this.createUserField.value.companyID,
        username: (this.createUserField.value.username).toLowerCase(),
        description: this.createUserField.value.description,
        mobile: this.createUserField.value.mobile,
        mobile_privacy: this.createUserField.value.mobile_privacy,
        location_object: this.createUserField.value.location_object,
        // admin: this.createUserField.value.admin,
        // user_type: this.createUserField.value.user_type,
        alert_email: this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email,
        alert_sms: this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms,
        alert_telegram: this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram,
        escalation_email: this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email,
        escalation_sms: this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms,
        escalation_telegram: this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram,
        email: this.createUserField.value.email,
        telegramID: this.createUserField.value.telegramID,
        // location_permission: this.multiselectLocation,
        device_type_permission: this.multiselectDeviceType_permission,
        device_permission: this.multiselectDevice_permission,
        // default_dev: this.multiDefaultdevice,
        default_loc: this.createUserField.value.default_loc,
        default_type: this.createUserField.value.default_type,
        start_node: this.createUserField.value.start_node,
        alert_levels: this.createUserField.value.alert_levels,
        permission_ID: this.createUserField.value.permission_ID,
        report_to: this.createUserField.value.report_to,
        enable_user: this.createUserField.value.enable_user == null ? false : this.createUserField.value.enable_user,
        disable_user: this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user,
        // health_check: this.createUserField.value.health_check == null ? false : this.createUserField.value.health_check,
        // device_timeout: this.createUserField.value.device_timeout == null ? false : this.createUserField.value.device_timeout,
        // alert_timeout: this.createUserField.value.alert_timeout == null ? false : this.createUserField.value.alert_timeout,
        profile_picture: this.base64textString_temp,
        redirectionURL:this.redirectionURL,
        cognito_update: this.createUserField.value.cognito_update == null ? false : this.createUserField.value.cognito_update,
        updated: new Date()
      }


      


      tempObj = {
        PK:(this.createUserField.value.username).toLowerCase()+"#user"+"#main",
        SK:1,
        metadata:JSON.stringify(this.allUserDetails)
      }


      console.log('this.allUserDetails update_delete :', this.createUserField.value);


        const date = Math.ceil(((new Date()).getTime()) / 1000)
      const items ={
      P1: this.allUserDetails.PK,
      P2: this.allUserDetails.mobile || 'N/A',
      P3: this.allUserDetails.email,
      P4: this.allUserDetails.permission_ID,
      }


      

      this.api.CreateMaster(tempObj).then(async value => {

        //need to refresh table so this is called 
        //console.log('new user is added')
        this.addFromService();

        if (value) {

          await this.createLookUpRdt(items,1,this.SK_clientID+"#user"+"#lookup")

          // await this.loading()

          this.toast.open("User configuration updated successfully", " ", {
          //panelClass: 'error-alert-snackbar',

            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })

          this.closeUser.nativeElement.click();

          // this.updateCognitoAttributes();

        }
        else {
          Swal.fire({
            customClass: {
              container: 'swal2-container'
            },
            position: 'center',
            icon: 'warning',
            title: 'Error in adding User Configuration',
            showCancelButton: true,
            allowOutsideClick: false,////prevents outside click
          })
          //alert('Error in adding User Configuration');
        }

      }).catch(err => {
        console.log('err for creation', err);
        this.toast.open("Error in adding new user Configuration ", "Check again", {
          //panelClass: 'error-alert-snackbar',

          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          //   //panelClass: ['blue-snackbar']
        })
      })
    }

    //create new user with mail confirmation
    if (key == 'html') {
      console.log('user fields', this.createUserField);

      this.dynamicRedirectChanged(this.createUserField.value.location_object)

      // let length_device_permission = this.createUserField.value.device_permission.length;
      // let temp_device_permi_list = [];


      // for (let temp_device_permission = 0; temp_device_permission < length_device_permission; temp_device_permission++) {
      //   temp_device_permi_list.push(this.createUserField.value.device_permission[temp_device_permission]);
      // }

      // let length_device_type_permission = this.createUserField.value.device_type_permission.length;
      // let temp_device_type_permi_list = [];

      // for (let temp_device_type_permission = 0; temp_device_type_permission < length_device_type_permission; temp_device_type_permission++) {
      //   temp_device_type_permi_list.push(this.createUserField.value.device_permission[temp_device_type_permission]);
      // }

      let companyidTemp = '';
      if(this.createUserField.value.allowNewCompanyID == null || this.createUserField.value.allowNewCompanyID == false){
        console.log("Iam entered in the companyID disable :",this.createUserField.value.disabled_companyid);
        companyidTemp = this.createUserField.get('disabled_companyid')?.value;
      }
      else{
        console.log("Iam entered in the companyID Enabled :",this.createUserField.value.companyID);
        companyidTemp = this.createUserField.value.companyID
      }

      //console.log('temp_device_permi_list',temp_device_permi_list);
      if (this.createUserField.value.allowOtherClient == null || this.createUserField.value.allowOtherClient == false) {


        this.allUserDetails = {
          key: token,
          userID: (this.createUserField.value.userID).toLowerCase(),
          password: this.createUserField.value.name,
          allowOtherClient: this.createUserField.value.allowOtherClient,
          allowNewClient: this.createUserField.value.allowNewClient,
          allowOtherCompanyID: this.createUserField.value.allowOtherCompanyID,
          allowNewCompanyID: this.createUserField.value.allowNewCompanyID,
          clientID: this.SK_clientID,
          companyID: companyidTemp,
          username: (this.createUserField.value.username).toLowerCase(),
          description: this.createUserField.value.description,
          mobile: this.createUserField.value.mobile,
          mobile_privacy: this.createUserField.value.mobile_privacy,
          // admin: this.createUserField.value.admin,
          // user_type: this.createUserField.value.user_type,
          alert_email: this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email,
          alert_sms: this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms,
          alert_telegram: this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram,
          escalation_email: this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email,
          escalation_sms: this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms,
          escalation_telegram: this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram,
          email: this.createUserField.value.email,
          telegramID: this.createUserField.value.telegramID,
          location_permission: this.createUserField.get('location_permission')?.value,
          default_module:this.createUserField.value.default_module,
          // device_type_permission: this.multiselectDeviceType_permission,
          form_permission: this.createUserField.get('form_permission')?.value,
          default_dev: this.multiselectDevice_dev,
          default_loc: this.createUserField.value.default_loc,
          default_type: this.createUserField.value.default_type,
          start_node: this.createUserField.value.start_node,
          alert_levels: this.createUserField.value.alert_levels,
          permission_ID: this.createUserField.value.permission_ID,
          report_to: this.createUserField.value.report_to,
          enable_user: true,
          disable_user: this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user,
          // health_check: this.createUserField.value.health_check == null ? false : this.createUserField.value.health_check,
          // device_timeout: this.createUserField.value.device_timeout == null ? false : this.createUserField.value.device_timeout,
          // alert_timeout: this.createUserField.value.alert_timeout == null ? false : this.createUserField.value.alert_timeout,
          profile_picture: this.base64textString_temp,
          cognito_update: this.createUserField.value.cognito_update == null ? false : this.createUserField.value.cognito_update,
          updated: new Date()
        }

        tempObj = {
          PK:(this.createUserField.value.username).toLowerCase()+"#user"+"#main",
          SK:1,
          metadata:JSON.stringify(this.allUserDetails)
        }


        // if (this.allDeviceTypeValues.length > 0) {
        //   this.allUserDetails.device_type_permission = this.allDeviceTypeValues
        // }

        // if (this.allDeviceValues.length > 0) {
        //   this.allUserDetails.device_permission = this.allDeviceValues
        // }



      }

      else {
        this.allUserDetails = {
          key: token,
          userID: (this.createUserField.value.userID).toLowerCase(),
          password: this.createUserField.value.name,
          allowOtherClient: this.createUserField.value.allowOtherClient,
          allowNewClient: this.createUserField.value.allowNewClient,
          allowOtherCompanyID: this.createUserField.value.allowOtherCompanyID,
          allowNewCompanyID: this.createUserField.value.allowNewCompanyID,
          clientID: this.createUserField.value.clientID,
          companyID:companyidTemp,
          username: (this.createUserField.value.username).toLowerCase(),
          description: this.createUserField.value.description,
          mobile: this.createUserField.value.mobile,
          mobile_privacy: this.createUserField.value.mobile_privacy,
          // admin: this.createUserField.value.admin,
          // user_type: this.createUserField.value.user_type,
          alert_email: this.createUserField.value.alert_email == null ? false : this.createUserField.value.alert_email,
          alert_sms: this.createUserField.value.alert_sms == null ? false : this.createUserField.value.alert_sms,
          alert_telegram: this.createUserField.value.alert_telegram == null ? false : this.createUserField.value.alert_telegram,
          escalation_email: this.createUserField.value.escalation_email == null ? false : this.createUserField.value.escalation_email,
          escalation_sms: this.createUserField.value.escalation_sms == null ? false : this.createUserField.value.escalation_sms,
          escalation_telegram: this.createUserField.value.escalation_telegram == null ? false : this.createUserField.value.escalation_telegram,
          email: this.createUserField.value.email,
          telegramID: this.createUserField.value.telegramID,
          location_permission:this.createUserField.get('location_permission')?.value,
          // device_type_permission: this.multiselectDeviceType_permission,
          default_module:this.createUserField.value.default_module,
          form_permission:this.createUserField.get('form_permission')?.value,
          default_dev: this.createUserField.value.default_dev,
          default_loc: this.createUserField.value.default_loc,
          default_type: this.createUserField.value.default_type,
          start_node: this.createUserField.value.start_node,
          alert_levels: this.createUserField.value.alert_levels,
          permission_ID: this.createUserField.value.permission_ID,
          report_to: this.createUserField.value.report_to,
          enable_user: this.createUserField.value.enable_user == null ? false : this.createUserField.value.enable_user,
          disable_user: this.createUserField.value.disable_user == null ? false : this.createUserField.value.disable_user,
          health_check: this.createUserField.value.health_check == null ? false : this.createUserField.value.health_check,
          device_timeout: this.createUserField.value.device_timeout == null ? false : this.createUserField.value.device_timeout,
          alert_timeout: this.createUserField.value.alert_timeout == null ? false : this.createUserField.value.alert_timeout,
          profile_picture: this.base64textString_temp,
          cognito_update: this.createUserField.value.cognito_update == null ? false : this.createUserField.value.cognito_update,
          // others:JSON.stringify(tempPermission),
          updated: new Date()
        }


        tempObj = {
          PK:(this.createUserField.value.username).toLowerCase()+"#user"+"#main",
          SK:1,
          metadata:JSON.stringify(this.allUserDetails)
        }

        // if (this.allDeviceTypeValues.length > 0) {
        //   this.allUserDetails.device_type_permission = this.allDeviceTypeValues
        // }

        // if (this.allDeviceValues.length > 0) {
        //   this.allUserDetails.device_permission = this.allDeviceValues
        // }
      }


      // const checkAuthUser = await this.checkUsernameExists(this.createUserField.value.username)

      // if(checkAuthUser){
      //     return Swal.fire({
      //       position: "center",
      //       icon: "error",
      //       title: `Username: ${this.createUserField.value.username} already exist`,
      //       showConfirmButton: false,
      //       timer: 1500,
      //     });
      // }
      


      console.log("All USer Details :",this.allUserDetails);


      const tempClient = this.allUserDetails.clientID
      

      let temp1 = this.allUserDetails.form_permission;
      let temp2 = '';

      // const uniqueItems = new Set();
      // temp1 = temp1.filter((item: { value: any; }) => {
      //   const isDuplicate = uniqueItems.has(item.value);
      //   uniqueItems.add(item.value);
      //   return !isDuplicate;
      // });

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
      P1: (this.createUserField.value.username).toLowerCase(),
      P2: this.allUserDetails.mobile || 'N/A',
      P3: this.allUserDetails.email,
      P4: this.allUserDetails.permission_ID,
      P5:temp4,
      P6:temp2,
      P7:date
      }

      const masterUser = {
        P1:(this.createUserField.value.username).toLowerCase(),
        P2:this.allUserDetails.clientID,
        P3:this.allUserDetails.email,
        P4:this.allUserDetails.mobile || 'N/A',
        P5:(this.createUserField.value.userID).toLowerCase()
      }


      console.log("User master table data is here ",masterUser);


      //console.log('newly added user', this.allUserDetails);
      console.log('newly added user', this.createUserField);

      console.log("Items are here ",items);

      this.spinner.show()

      this.api.CreateMaster(tempObj).then(async value => {

        //need to refresh table so this is called 
        this.addFromService();

        if (value) {

          const body = { type: "userVerify", username:masterUser.P1,name: this.createUserField.value.name,email:masterUser.P3,clientID:masterUser.P2};


          this.DynamicApi.sendData(body).subscribe(response => {
            console.log('Response from Lambda:', response);


            this.toast.open("A confirmation email has been successfully sent to the user.", " ", {

              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              //   //panelClass: ['blue-snackbar']
            })


          }, error => {
            console.error('Error calling dynamic lambda:', error);
          });





          await this.createLookUpRdt(items,1,tempClient+"#user"+"#lookup")

          await this.createLookUpRdt(masterUser,1,"#user#All");


          try{
            const UserDetails = {
              "User Name": this.username,
              "Action": "Created",
              "Module Name": "User Management",
              "Form Name": 'User Management',
             "Description": `${masterUser.P1} username was Created`,
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
      


          this.datatableConfig = {}
          this.lookup_data_user = []

          this.showAlert(successAlert)
          this.reloadEvent.next(true)

          // await this.loading()

          // this.toast.open("New User configuration created successfully", " ", {
          //   //panelClass: 'error-alert-snackbar',

          //   duration: 2000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'top',
          // })

          this.addtoCognitoTable(this.allUserDetails);

          this.spinner.hide()

          // this.closeUser.nativeElement.click();

          //after adding to dynamodb,added to cognito table
        

         

          
        }
        else {
          Swal.fire({
            customClass: {
              container: 'swal2-container'
            },
            position: 'center',
            icon: 'warning',
            title: 'Error in adding User Configuration',
            showCancelButton: true,
            allowOutsideClick: false,////prevents outside click
          })
          //alert('Error in adding User Configuration');
        }

      }).catch(err => {
        this.spinner.hide()
        console.log('err for creation', err);

        this.showAlert(errorAlert)
        // this.toast.open("Error in adding new user Configuration ", "Check again", {
        //   //panelClass: 'error-alert-snackbar',

        //   duration: 5000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        //   //   //panelClass: ['blue-snackbar']
        // })
      })
    }
  }


  addtoCognitoTable(getValues: any) {
    //adding to cognito table
    console.log('cogntio table', getValues);
    if (this.createUserField.value) {

      //aceesing iDs from env.ts
      let poolData = {
        UserPoolId: "ap-south-1_aaPSwPS14", // user pool id here
        ClientId: "42pb85v3sv84jdrfi1rub7a4e5"// client id here
      };

      console.log('poolData after user added to cognito', poolData);

      this.userPool = new CognitoUserPool(poolData);

      let attributeList = [];

      let formData: any = {
        "email": String(this.createUserField.value.email),
        'custom:userID': String(this.createUserField.value.userID),
        'custom:password': String(this.createUserField.value.name),
        'custom:clientID': String(getValues.clientID),
        'custom:companyID': String(getValues.companyID),
        'custom:username': String(this.createUserField.value.username),
        'custom:description': String(this.createUserField.value.description),
        'custom:mobile': JSON.stringify(this.createUserField.value.mobile), // Check if this needs to be a string
        'custom:mobile_privacy': String(this.createUserField.value.mobile_privacy),
        'custom:user_type': JSON.stringify(this.createUserField.value.user_type),
        'custom:enable_user': String(this.createUserField.value.enable_user ?? false),
        'custom:disable_user': String(this.createUserField.value.disable_user ?? false),
        'custom:alert_email': String(this.createUserField.value.alert_email ?? false),
        'custom:alert_sms': String(this.createUserField.value.alert_sms ?? false),
        'custom:alert_telegram': String(this.createUserField.value.alert_telegram ?? false),
        'custom:escalation_email': String(this.createUserField.value.escalation_email ?? false),
        'custom:escalation_sms': String(this.createUserField.value.escalation_sms ?? false),
        'custom:escalation_telegram': String(this.createUserField.value.escalation_telegram ?? false),
        'custom:telegramID': String(this.createUserField.value.telegramID),
        'custom:permission_id': String(getValues.permission_ID),
        'custom:defaultdevloc': String(this.createUserField.value.default_dev_loc),
    }

      //looping key,value
      for (let key in formData) {

        let attrData = {
          Name: key,
          Value: formData[key]
        }
        //console.log('attribute data', attrData)
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute)
      }

      //}
      //console.log('attribute list', attributeList);
      this.userPool.signUp(this.createUserField.value.username, this.createUserField.value.name, attributeList, [], (
        err: { message: any; },
        result: any
      ) => {
        // this.isLoading = false;
        if (err) {
          //console.log('err on signup', err);
          alert(err.message || JSON.stringify(err));


        }
        console.log('result after user is added', result);

      });
    }
    else {
      Swal.fire({
        customClass: {
          container: 'swal2-container'
        },
        position: 'center',
        icon: 'warning',
        title: 'Error in adding to Cognito Configuration',
        showCancelButton: true,
        allowOutsideClick: false,////prevents outside click
      })
    }
  }














  generateToken(username: string, clientInfo: string): string {
    const data = `${username}:${clientInfo}`;
    const secretKey = 'wimate_trust'; // Replace with your secret key

    const encryptedData = AES.encrypt(data, secretKey).toString();
    console.log('My_key', encryptedData)
    return encryptedData;
  }



  openModal(getValues: any, getKey: any) {


    this.redirectionURL = ''

    this.disableFields = false

    console.log("Openmodal value are here ",getValues);

    this.switchBetweenDropdown_textField = false;
    this.disabled_CLientID_textField = true;
    this.switchBetweenDropdown_company_id = false;
    this.disabled_companyID_textField = true;

    this.tempUserName = ''
    this.tempUserID = ''

    this.dataUser = getValues;
    this.editOperation = false;
    // console.log('getvalues inside openModal', getValues);
    this.multiselectDeviceType_permission = [];
    this.multiselectDevice_permission = [];
    this.multiselectDevice_dev = []
    if (getKey == 'edit' || getKey == '') {
      let temp = "";
      //console.log('temp',temp);
      if (getValues == "") {
        this.showHeading = true;
        this.showModal = false;
        this.cd.detectChanges()
        this.errorForUniqueID = '';
        this.errorForUniqueEmail = '';
        this.errorForInvalidName = '';
        this.errorForInvalidEmail = '';
        this.errorForUniqueUserID = '';
        this.errorForUniquemobileID = ''
        this.showMobileNumber = getValues.mobile;
        this.switchBetweenDropdown_textField = false;
        this.disabled_CLientID_textField = true;
        this.switchBetweenDropdown_company_id = false;
        this.disabled_companyID_textField = true;
        //temp = JSON.stringify(getValues.profile).replace(/\"/g, "")
        this.base64textString_temp = temp;

        this.createUserField.get('userID')?.enable();
        this.createUserField = this.fb.group({
          'userID': getValues.userID,
          'name': getValues.name,
          'key': getValues.key,
          'clientID': getValues.clientID,
          'disabled_CLientID': this.showDisabledClientID,
          'disabled_companyid':this.showDisabledCompanyID,
          'allowOtherClient':  [{value:false,disabled: !this.Allpermission}],
          'allowNewClient': [{value:getValues.allowNewClient}],
          'allowOtherCompanyID': getValues.allowOtherCompanyID,
          'allowNewCompanyID':  [{value:false,disabled: !this.Allpermission}],
          'companyID': getValues.companyID,
          'username': getValues.username,
          'description': getValues.description,
          'mobile': getValues.mobile,
          'mobile_privacy': getValues.mobile_privacy,
          'location_object': getValues.location_object,
          'default_module': getValues.default_module,
          // 'admin': getValues.admin,
          // 'user_type': getValues.user_type,
          'alert_email': getValues.alert_email,
          'alert_sms': getValues.alert_sms,
          'alert_telegram': getValues.alert_telegram,
          'escalation_email': getValues.escalation_email,
          'escalation_sms': getValues.escalation_sms,
          'escalation_telegram': getValues.escalation_telegram,
          'email': getValues.email,
          'telegramID': getValues.telegramID,
          'location_permission': getValues.location_permission,
          'device_type_permission': getValues.device_type_permission,
          'device_permission': getValues.device_permission,
          'form_permission': getValues.form_permission,
          'default_dev': getValues.default_dev,
          'default_loc': getValues.default_loc,
          'default_type': getValues.default_type,
          'start_node': getValues.start_node,
          'alert_levels': getValues.alert_levels,
          'permission_ID': getValues.permission_ID,
          'report_to': getValues.report_to,
          'enable_user': getValues.enable_user,
          'disable_user': getValues.disable_user,
          'cognito_update': getValues.cognito_update,
          'profile_picture': getValues.profile,
          'health_check': getValues.health_check,
          'device_timeout': getValues.device_timeout,
          'alert_timeout': getValues.alert_timeout,
        })

        this.showDisabledClientID = this.createUserField.get('disabled_CLientID')?.setValue(this.SK_clientID, { emitEvent: false });
        this.createUserField.get('disabled_CLientID')?.disable({ emitEvent: false })

        this.showDisabledCompanyID = this.createUserField.get('disabled_companyid')?.setValue(this.user_companyID, { emitEvent: false });
        this.createUserField.get('disabled_companyid')?.disable({ emitEvent: false })
      }
      //updated device congifuration(update)
      else if (getValues) {

        this.cloneUserOperation = false

        this.disabled_CLientID_textField = true
       

        console.log('edit of user', getValues);
        this.showHeading = false;
        this.showModal = true;
        this.base64textString_temp = getValues.profile;
        this.errorForUniqueID = '';
        this.errorForUniqueEmail = '';
        this.errorForInvalidName = '';
        this.errorForInvalidEmail = '';
        this.errorForUniqueUserID = '';
        this.errorForUniquemobileID = ''
        this.showMobileNumber = getValues.mobile;

        this.switchBetweenDropdown_textField = false


        this.disableFields = true

        this.createUserField.get('userID')?.disable();
        // this.switchInputs(getValues.allowOtherClient);

        // console.log('client id',getValues);


       this.editOperation = true;


       //[{value:getValues.clientID,disabled:true}]

       this.tempUpdateUser = getValues.username

        this.createUserField = this.fb.group({
          'userID': getValues.userID,
          'name': getValues.name,
          'clientID': getValues.clientID,
          'disabled_CLientID': [{value:getValues.clientID,disabled:true}],
          'disabled_companyid':[{value:getValues.companyID,disabled:true}],
          'key': getValues.key,
          //'disabled_CLientID':this.switchInputs( getValues.allowOtherClient),
          'allowOtherClient': [{value:false,disabled:!this.Allpermission}],
          'allowNewClient': [{value:getValues.allowNewClient}],
          'allowOtherCompanyID': getValues.allowOtherCompanyID,
          'allowNewCompanyID': [{value:false,disabled:!this.Allpermission}],
          'companyID': [{value:getValues.clientID,disabled:true}],
          'username':  {value:getValues.username,disabled:this.editOperation},
          'description': getValues.description,
          'mobile': getValues.testMobile,
          'mobile_privacy': getValues.mobile_privacy,
          // 'admin': getValues.admin,
          // 'user_type': getValues.user_type,
          'alert_email': getValues.alert_email,
          'alert_sms': getValues.alert_sms,
          'alert_telegram': getValues.alert_telegram,
          'escalation_email': getValues.escalation_email,
          'escalation_sms': getValues.escalation_sms,
          'escalation_telegram': getValues.escalation_telegram,
          'location_object': getValues.location_object,
          'default_module': getValues.default_module,
          'email': getValues.email,
          'telegramID': getValues.telegramID,
          'location_permission': [getValues.location_permission],
          'device_type_permission': [getValues.device_type_permission],
          'device_permission': [getValues.device_permission],
          'form_permission': [getValues.form_permission],
          'default_loc': getValues.default_loc,
          'default_dev': getValues.default_dev,
          'default_type': getValues.default_type,
          'start_node': getValues.start_node,
          'alert_levels': getValues.alert_levels,
          'permission_ID': getValues.permission_ID,
          'report_to': getValues.report_to,
          'enable_user': getValues.enable_user,
          'disable_user': getValues.disable_user,
          'cognito_update': getValues.cognito_update,
          'profile_picture': getValues.profile,
          'health_check': getValues.health_check,
          'device_timeout': getValues.device_timeout,
          'alert_timeout': getValues.alert_timeout,
        })


        this.redirectionURL = getValues.redirectionURL


        this.dynamicRedirectID(getValues.default_module)


        console.log("Asad redirectionURL ",this.redirectionURL);
        if(this.redirectionURL && this.redirectionURL.includes('/')){
          const redirectionID = this.redirectionURL.split('/')

          console.log("Asad redirectionURL ",redirectionID);
          this.createUserField.get('location_object')?.setValue(`${this.redirectionURL.split('/')[redirectionID.length-1]}`)
        }


          console.log("Final thing on openModal :",this.createUserField.value);
        this.cd.detectChanges()
      }
    }
  }




  async getClientID() {
    try{

      await this.fetchTMLookupData(1)

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




  fetchUserLookupdata(sk:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#user" + "#lookup", sk)
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
                    const { P1, P2, P3, P4, P5, P6,P7 } = element[key]; // Extract values from the nested object
                    this.lookup_data_user.push({ P1, P2, P3, P4, P5, P6,P7 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_user);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_user.sort((a: { P7: number; }, b: { P7: number; }) => b.P7 - a.P7);
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
            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }

  fetchAllUsersData(sk:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster("#user" + "#All", sk)
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
                    const { P1, P2, P3, P4, P5 } = element[key]; // Extract values from the nested object
                    this.lookup_All_User.push({ P1, P2, P3, P4, P5}); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_All_User);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_All_User.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_All_User);
  
                // Continue fetching recursively
                promises.push(this.fetchAllUsersData(sk + 1)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_All_User)) // Resolve with the final lookup data
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
            console.log("All the users are here", this.lookup_All_User);
            resolve(this.lookup_All_User); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }
  




  async fetchTMLookupData(sk: any) {

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
            await this.fetchTMLookupData(sk + 1);
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


  // async showTable() {
  //   this.datatableConfig = {
  //     serverSide: true,
  //     ajax: (dataTablesParameters: any, callback) => {
  //       this.fetchUserLookupdata(1)
  //         .then((resp: any) => {
  //           // Assuming 'resp' is the array you provided
  //           const responseData = resp || []; // Default to an empty array if resp is null
    
  //           // Prepare the response structure expected by DataTables
  //           callback({
  //             draw: dataTablesParameters.draw, // Echo the draw parameter
  //             recordsTotal: responseData.length, // Total number of records
  //             recordsFiltered: responseData.length, // Filtered records (you may want to adjust this)
  //             data: responseData // The actual data array
  //           });
    
  //           console.log("Response is in this form ", responseData);
  //         })
  //         .catch((error: any) => {
  //           console.error('Error fetching user lookup data:', error);
  //           // Provide an empty dataset in case of an error
  //           callback({
  //             draw: dataTablesParameters.draw,
  //             recordsTotal: 0,
  //             recordsFiltered: 0,
  //             data: []
  //           });
  //         });
  //     },
  //     columns: [
  //       {
  //         title: 'Username', data: 'P1', render: function (data, type, full) {
  //           const colorClasses = ['success', 'info', 'warning', 'danger'];
  //           const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    
  //           const initials = data[0].toUpperCase();
  //           const symbolLabel = `
  //             <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
  //               ${initials}
  //             </div>
  //           `;
    
  //           const nameAndEmail = `
  //             <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
  //               <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
  //               <span>${full.P3}</span> <!-- Assuming P3 is the email -->
  //             </div>
  //           `;
    
  //           return `
  //             <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
  //               <a href="javascript:;">
  //                 ${symbolLabel}
  //               </a>
  //             </div>
  //             ${nameAndEmail}
  //           `;
  //         }
  //       },
  //       {
  //         title: 'Phone', data: 'P2' // Added a new column for phone numbers
  //       },
  //       {
  //         title: 'Email', data: 'P3' // Added a new column for email
  //       },
  //       {
  //         title: 'Permission', data: 'P4' // Assuming P4 is the role
  //       },
  //       {
  //         title: 'Updated', data: 'P5', render: function (data) {
  //           // Ensure data is in seconds; convert to milliseconds for Date
  //           const date = new Date(data * 1000);
  //           return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
  //         }
  //       }
  //     ],
  //     createdRow: (row, data:any, dataIndex) => {
  //       $('td:eq(0)', row).addClass('d-flex align-items-center');
  //     },
  //   };
  // }


  async showTable() {

    console.log("Show DataTable is called BTW");

    this.datatableConfig = {}
    this.lookup_data_user = []
    this.datatableConfig = {
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
          title: 'Username', 
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
          title: 'Phone', data: 'P2' // Added a new column for phone numbers
        },
        // {
        //   title: 'Email', data: 'P3' // Added a new column for email
        // },
        {
          title: 'Permission', data: 'P4' // Assuming P4 is the role
        },
        {
          title: 'Location Permission',
          data: 'P5',
          render: (data) => data || 'update required' // Handle undefined
        },
        {
          title: 'Form ID Permission',
          data: 'P6',
          render: (data) => data || 'update required' // Handle undefined
        },
        {
          title: 'Updated', data: 'P7', render: function (data) {
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
        "Module Name": "User Management",
        "Form Name": 'User Management',
       "Description": `User Table was Viewed`,
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
  

  openModalHelpher(getData:any){
    console.log("Data from llokup :",getData);
    this.data_temp = []

    this.api
      .GetMaster(getData+"#user"+"#main",1)
      .then((result :any) => {
        if (result && result !== undefined) {
          this.data_temp.push(JSON.parse(result.metadata));
          console.log("User Manangement details", this.data_temp);


          if(result){


            // if(redirectionURL){

            // }


            let userTable: any = [];

            if (typeof this.data_temp  !== 'undefined') {
              console.log(this.data_temp )
              for (let allData = 0; allData < this.data_temp .length; allData++) {
        
                let userid = result.SK;
                // let admin = this.data_temp [allData].admin;
                let alert_email = this.data_temp [allData].alert_email;
                let alert_levels = this.data_temp [allData].alert_levels;
                let alert_sms = this.data_temp [allData].alert_sms;
                let alert_telegram = this.data_temp [allData].alert_telegram;
                let clientID = this.data_temp [allData].clientID;
                let allowOtherClient = this.data_temp [allData].allowOtherClient;
                let allowNewClient = this.data_temp [allData].allowNewClient;
                let allowOtherCompanyID = this.data_temp [allData].allowOtherCompanyID;
                let allowNewCompanyID = this.data_temp [allData].allowNewCompanyID;
                let cognito_update = this.data_temp [allData].cognito_update;
                let companyID = this.data_temp [allData].companyID;
                let default_dev = this.data_temp [allData].default_dev;
                let default_loc = this.data_temp [allData].default_loc;
                let default_type = this.data_temp [allData].default_type;
                let description = this.data_temp [allData].description
                let device_permission = this.data_temp [allData].device_permission;
                let form_permission = this.data_temp [allData].form_permission;
                let device_type_permission = this.data_temp [allData].device_type_permission;
                let disable_user = this.data_temp [allData].disable_user;
                let email = this.data_temp [allData].email;
                let enable_user = this.data_temp [allData].enable_user;
                let escalation_email = this.data_temp [allData].escalation_email;
                let escalation_sms = this.data_temp [allData].escalation_sms;
                let escalation_telegram = this.data_temp [allData].escalation_telegram;
                let location_permission = this.data_temp [allData].location_permission;
                let mobile = this.data_temp [allData].mobile;
                let mobile_privacy = this.data_temp [allData].mobile_privacy;
                let name = this.data_temp[allData].password;
                let permission_ID = this.data_temp [allData].permission_ID;
                let health_check = this.data_temp [allData].health_check;
                let device_timeout = this.data_temp [allData].device_timeout;
                let alert_timeout = this.data_temp [allData].alert_timeout;
                let report_to = this.data_temp [allData].report_to;
                let start_node = this.data_temp [allData].start_node;
                let telegramID = this.data_temp [allData].telegramID;
                let userID = this.data_temp [allData].userID;
                let user_type = this.data_temp [allData].user_type;
                let username = this.data_temp [allData].username;
                let profile = this.data_temp [allData].profile_picture;
                let location_object=this.data_temp [allData].location_object
                let default_module=this.data_temp [allData].default_module
                let others = this.data_temp [allData].others
                let add_updateTime = new Date(this.data_temp [allData].updated).toLocaleString();
                let redirectionURL = this.data_temp[allData].redirectionURL
                
        
                userTable.push({
                  userid: userID,
                  // admin: admin,
                  alert_email: alert_email,
                  alert_levels: alert_levels,
                  alert_sms: alert_sms,
                  alert_telegram: alert_telegram,
                  clientID: clientID,
                  allowOtherClient: allowOtherClient,
                  allowNewClient: allowNewClient,
                  allowOtherCompanyID: allowOtherCompanyID,
                  allowNewCompanyID: allowNewCompanyID,
                  cognito_update: cognito_update,
                  companyID: companyID,
                  default_dev: default_dev,
                  default_loc: default_loc,
                  default_type: default_type,
                  description: description,
                  device_permission: device_permission,
                  form_permission: form_permission,
                  device_type_permission: device_type_permission,
                  disable_user: disable_user,
                  email: email,
                  enable_user: enable_user,
                  escalation_email: escalation_email,
                  escalation_sms: escalation_sms,
                  escalation_telegram: escalation_telegram,
                  location_permission: location_permission,
                  mobile: this.maskedNumber,
                  mobile_privacy: mobile_privacy,
                  name: name,
                  permission_ID: permission_ID,
                  health_check: health_check,
                  device_timeout: device_timeout,
                  alert_timeout: alert_timeout,
                  report_to: report_to,
                  start_node: start_node,
                  telegramID: telegramID,
                  userID: userID,
                  user_type: user_type,
                  username: username,
                  profile: profile,
                  testMobile: mobile,
                  add_updateTime: add_updateTime,
                  location_object:location_object,
                  default_module:default_module,
                  others:others,
                  redirectionURL:redirectionURL
                })
              }
            }
            else {
              userTable = [];
            }


            console.log("Edited User Will be ,",userTable);
            for(let i = 0;i<userTable.length;i++){
              console.log(userTable[i].username+ "=="+ getData);
              if(userTable[i].username == getData){
        
                console.log("Iam called :");
                this.openModal(userTable[i], "edit");
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



  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#user'+"#lookup";
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




  deleteUser(value: any, key: any) {
    this.userSK = value;
    console.log('this user will get deleted', value);

    

    if (key == 'delete') {
        this.spinner.show()
       this.deleteCognito(this.userSK)
    }

    //just delete and add new
    else if (key === 'update_delete') {
      this.allUserDetails = {
        PK: `${value.username}#user#main`,
        SK: 1,
        metadata:JSON.stringify(value)
      }


      let temp1 = value.form_permission;
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
  
  
  
      let temp3 = value.location_permission;
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
    P1: value.username,
    P2: value.mobile,
    P3: value.email,
    P4: value.permission_ID,
    P5:temp4,
    P6:temp2,
    P7:date
  
    }


    const masterUser = {
      P1:value.username,
      P2:value.clientID,
      P3:value.email,
      P5:value.userID,
      P4:value.mobile
    }
     
  
      console.log("master table data is here ",masterUser);

      console.log('before deleting user on update_delete :', this.allUserDetails);

      console.log("Items to be deleted :",items);


        this.api.UpdateMaster(this.allUserDetails).then(async (value: any) => {

        if (value) {

          await this.fetchTimeMachineById(1,masterUser.P1, 'delete', items);

          await this.createLookUpRdt(items,1,masterUser.P2+"#user"+"#lookup")
          
          await this.fetchAllusersData(1,masterUser.P1,'update',masterUser)


          // this.createNewUser(this.allUserDetails, 'update');

          // await this.loading()

          this.toast.open("User configuration updated successfully", " ", {
            //panelClass: 'error-alert-snackbar',
  
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            })

            this.reloadEvent.next(true)
  
            this.closeUser.nativeElement.click();

          this.addFromService();
        }

      }).catch((err: any) => {
        console.log('error for deleting', err);
      })

  }
  }



  async deleteCognito(getValues: any){
    console.log("for field",getValues)

    this.allUserDetails = {
      PK: `${getValues}#user#main`,
      SK: 1,
    }
 
    await this.api
        .GetMaster(`${getValues}#user#main`,1)
        .then(async (result :any) => {
          if (result) {

            console.log("Result is here ",result);
            await this.deleteCognitoUser(JSON.parse(result.metadata))
            }
        })
        .catch((err) => {
          this.spinner.hide()
          console.log("cant fetch", err);
        });
  }

  

  deleteCognitoUser = async (getValues: any) => {
    console.log('current user', getValues);
  
    // Create a new CognitoIdentityProvider object for your Cognito User Pool Region
    const cognitoIdentityProvider = new CognitoIdentityProvider({ region: 'ap-south-1' });
  
    // Authentication data and user pool setup
    let authenticationData = {
      Username: getValues.username,
      Password: getValues.password, // Ensure this is the correct field for the password
    };
  
    let poolData = {
      UserPoolId:'ap-south-1_aaPSwPS14',
      ClientId:  '42pb85v3sv84jdrfi1rub7a4e5'
    };
  
    let userPool = new CognitoUserPool(poolData);
    console.log("userPool", userPool);
  
    let poolDetails: any = {
      Username: getValues.username,
      Pool: userPool
    };
    console.log("poolDetails", poolDetails);
  
    let cognitoUser = new CognitoUser(poolDetails);
    console.log("cognitoUser", cognitoUser);
  
    let authenticationDetails = new AuthenticationDetails(authenticationData);
    console.log("authenticationDetails", authenticationDetails);
  
    try {
      // Authenticate user
      const authResult = await new Promise<CognitoUserSession>((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            resolve(result);
          },
          onFailure: function (err) {
            reject(err);
          },
        });
      });
  
      console.log("User authenticated successfully");
      console.log("AccessToken", authResult.getAccessToken().getJwtToken());
  
      // Delete the user
      const deleteParams = {
        AccessToken: authResult.getAccessToken().getJwtToken()
      };
  
      await new Promise<void>((resolve, reject) => {
        cognitoIdentityProvider.deleteUser(deleteParams, function (err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
  
      console.log("User deleted successfully in Cognito");
  
      const date = Math.ceil(((new Date()).getTime()) / 1000);
      const items = {
        P1: getValues.username,
      };

      const deletedUser = {
        P1:getValues.username,
        P2:getValues.clientID
      }
  
      const value = await this.api.DeleteMaster(this.allUserDetails);
      if (value) {
        await this.fetchTimeMachineById(1, items.P1, 'delete', items);

        await this.fetchAllusersData(1, deletedUser.P1, 'delete', items)


        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "Deleted",
            "Module Name": "User Management",
            "Form Name": 'User Management',
           "Description": `${items.P1} username was Deleted`,
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
    






        this.spinner.hide()

        this.datatableConfig = {}

        this.lookup_data_user = []
        
        this.reloadEvent.next(true)
  
        Swal.fire(
          'Removed!',
          'User configuration successfully.',
          'success'
        );
      }
    } catch (error:any) {

      this.spinner.hide()
      console.log('Error during deletion', error);

      if (error.message === 'User does not exist.') {
        const date = Math.ceil(((new Date()).getTime()) / 1000);
        const items = {
          P1: getValues.username,
        };
  
        const deletedUser = {
          P1:getValues.username,
          P2:getValues.clientID
        }
    
        const value = await this.api.DeleteMaster(this.allUserDetails);
        if (value) {
          await this.fetchTimeMachineById(1, items.P1, 'delete', items);
  
          await this.fetchAllusersData(1, deletedUser.P1, 'delete', items)


          this.reloadEvent.next(true)
  
          Swal.fire(
            'Removed!',
            'User configuration successfully.',
            'success'
          );

        }
      }
      else{
        alert(error)
      }




      // Swal.fire('User not confirmed' + '' + 'and User configuration not removed');
    }
  };







  async onCloneUser(){
      this.cloneUserOperation = true

      this.createUserField.get('username')?.reset()
      this.createUserField.get('username')?.enable()
      this.createUserField.get('name')?.reset()
      this.createUserField.get('userID')?.reset()
      this.createUserField.get('email')?.reset()
      this.createUserField.get('mobile')?.reset()

      this.editOperation = false


      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success', // or another icon like 'info', 'error', etc.
        title: 'User Configuration Cloned Successfully',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      
  }

  onModuleLocationSelect(option: any) {
    const selectedValues = this.createUserField.get('location_permission')?.value;
    
    if(selectedValues.includes('All')){
      this.createUserField.get('location_permission')?.setValue(['All'])
    }
  }


  onModuleSelect(option: any) {
    const selectedValues = this.createUserField.get('form_permission')?.value; 
    
    if(selectedValues.includes('All')){
      this.createUserField.get('form_permission')?.setValue(['All'])
    }
  }




  dynamicRedirectChanged(event:any){

    let eventData;
    if(event && event.target && event.target.value){
      eventData = event.target.value
    }
    else{
      eventData = event
    }

     let dashUrl = '/dashboard'
    let projecturl = '/project-dashboard'

    const selectedModule = this.createUserField.get('default_module')?.value

    console.log("iam triggered here ",selectedModule);

    switch(selectedModule){
      case 'Dashboard - Group':
        this.redirectionURL =  dashUrl
        this.dynamicIDArray = []
        break;
      case 'Project - Group':
        this.redirectionURL = projecturl
        this.dynamicIDArray = []
        break
      case 'Forms':
        this.redirectionURL =  '/view-dreamboard/Forms/'+eventData
        break;
      case 'Summary Dashboard':
        this.redirectionURL =  '/summary-engine/'+eventData
        break;
      case 'Dashboard':
        this.redirectionURL =  '/dashboard/dashboardFrom/Forms/'+eventData
        break;
      case 'Projects':
        this.redirectionURL =  '/project-dashboard/project-template-dashboard/'+eventData
        break;
      case 'Project - Detail':
        this.redirectionURL =  '/view-dreamboard/Project%20Detail/'+eventData
        break;
      case 'None':
        this.redirectionURL =  dashUrl
        this.dynamicIDArray = []
        break;
  }
  
}



fetchDynamicLookupData(pk:any,sk:any):any {
  console.log("I am called Bro");
  
  return new Promise((resolve, reject) => {
    this.api.GetMaster(pk, sk)
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
                  const { P1, P2, P3, P4, P5 } = element[key]; // Extract values from the nested object
                  this.lookup_All_temp.push({ P1, P2, P3, P4, P5}); // Push an array containing P1, P2, P3, P4, P5, P6
                  console.log("d2 =", this.lookup_All_temp);
                } else {
                  break;
                }
              }

              // Sort the lookup_data_user array based on P5 values in descending order
              this.lookup_All_temp.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
              console.log("Lookup sorting", this.lookup_All_temp);

              // Continue fetching recursively
              promises.push(this.fetchAllUsersData(sk + 1)); // Store the promise for the recursive call
              
              // Wait for all promises to resolve
              Promise.all(promises)
                .then(() => resolve(this.lookup_All_temp)) // Resolve with the final lookup data
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
          console.log("All the users are here", this.lookup_All_temp);
          resolve(this.lookup_All_temp); // Resolve with the current lookup data
        }
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error); // Reject the promise on error
      });
  });
}






  async dynamicRedirectID(event:any){

    console.log("Event is triggered");


    this.createUserField.get('location_object')?.setValue("")


    let dashUrl = '/dashboard'
    let projecturl = '/project-dashboard'

    let eventData;
    if(event && event.target && event.target.value){
      eventData = event.target.value
    }
    else{
      eventData = event
    }

    this.lookup_All_temp = []
  

    switch(eventData){
      case 'Dashboard - Group':
        this.redirectionURL =  dashUrl
        this.dynamicIDArray = []
        break;
      case 'Project - Group':
        this.redirectionURL = projecturl
        this.dynamicIDArray = []
        break
      case 'Forms':
        this.dynamicIDArray = this.formList.filter((item:any)=>item != 'All')
        break
      case 'Summary Dashboard':
        const result = await this.fetchDynamicLookupData(`${this.SK_clientID}#summary#lookup`,1)
        this.dynamicIDArray = []
        this.dynamicIDArray = result.map((item:any)=>item.P1)
        break;
      case 'Dashboard':
        const result1 =  await this.fetchDynamicLookupData(`${this.SK_clientID}#formgroup#lookup`,1)
        this.dynamicIDArray = []
        this.dynamicIDArray = result1.map((item:any)=>item.P1)
        break;
      case 'Projects':
        const result2 = await this.fetchDynamicLookupData(`${this.SK_clientID}#folder#lookup`,1)
        this.dynamicIDArray = []
        this.dynamicIDArray = result2.map((item:any)=>item.P1)
        break;
      case 'Project - Detail':
        const result3 = await this.fetchDynamicLookupData(`${this.SK_clientID}#project#lookup`,1)
        this.dynamicIDArray = []
        this.dynamicIDArray = result3.map((item:any)=>item.P1)
        break;
      default:
        this.dynamicIDArray = []
        break
    }


    this.cd.detectChanges()
  }




  async showUnverifiedUsers(){

    let storedResponse:any;

    this.spinner.show()

    const body = { "type": "cognitoServices",
      "event":{
          "path": "/listVerifiedUsers",
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
          return { username: item.username, email: item.attributes.email };
        }
        return null; 
      })
      .filter((user: any) => user !== null); 
      this.spinner.hide();

    } catch (error) {
      console.error('Error calling dynamic lambda:', error);
      this.spinner.hide();
    }




    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "User Management",
        "Form Name": 'User Management',
       "Description": `Unconfirmed usernames details were Viewed`,
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








    const modalRef = this.modalService.open(UserVerifiedTableComponent,{ size: 'lg' })
    modalRef.componentInstance.unverifiedUsers = storedResponse

  }

} 
