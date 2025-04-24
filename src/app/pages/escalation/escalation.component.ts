//import { EventEmitter, Inject, Input, Output } from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiSearch, Config } from 'datatables.net';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../shared.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuditTrailService } from '../services/auditTrail.service';

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
  };
}

//Pushing to Github


@Component({
  selector: 'app-configuration',
  templateUrl: './escalation.component.html',
  styleUrls: ['./escalation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EscalationComponent implements OnInit {
  @ViewChild('closeModal') closeModal: any;
  @ViewChild('closeAlert') closeAlert: any;

  datatableConfig: Config = {};
  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  allModuleValues: any = [];
  notificationForm: FormGroup | any;
  permissions: FormGroup | any;
  allDatas: any = {};
  SK_clientID: any;
  getLoggedUser: any;
  submitted: boolean;
  temp_notificationForm: any = {};
  columnDatatable: any = [];
  uniqueDevicesList: any = [];
  uniqueDeviceLabel_list: any = [];
  allPermissions_user: any;
  data_temp: any = [];
  showModal: any = false;
  showHeading: any = false;
  hideUpdateButton: any = false;
  hideDeleteButton: any = true;
  dropdownSettings: IDropdownSettings = {};
  multiselectModule: any = [];
  stopTimer: any = '';
  maxlength=5;
  getDialogData: any = {
    id: '',
    client_id: '',
  
  };
  duplicate: any;
  isCollapsed1 = false;


  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  errorForUniqueLabel: string;
  errorForUniqueID: string;
  data: Promise<void | ({ __typename: "Client"; PK: string; SK: string; clientID?: string | null | undefined; clientName?: string | null | undefined; clientDesc?: string | null | undefined; clientLogo1?: string | null | undefined; clientLogo2?: string | null | undefined; enableClient?: boolean | null | undefined; email?: boolean | null | undefined; sms?: boolean | null | undefined; telegram?: boolean | null | undefined; healthCheck?: boolean | null | undefined; deviceTimeout?: boolean | null | undefined; alertTimeout?: boolean | null | undefined; mobile?: string | null | undefined; emailID?: string | null | undefined; telegramID?: string | null | undefined; metadata?: string | null | undefined; updated?: string | null | undefined; } | null)[] | undefined>;
  Lookupdata: any;
  listofNMIds: any=[];
  nm_table: any;
  pbTableData:any =[];
  allPB_details: any;
  edit_delete: any=false;
  common_PK: any='';
  common_SK: any='';
  common_label: any='';
  common_createdTime: any='';
  common_escalationTime: any='';
  common_levels: any='';
  common_others: any='';
  selectedValues: any=[];
  totEscLvl: number=0;
  isLoading:boolean = false

  clientNames:any =  [
    {  PK: 'Asad' },
    {  PK: 'Joey' },
    {  PK: 'Ningraj' },
  ];

  tableData:any = [
    ["User1",'label1',1726640928],
    ["User2",'label2',1726640928],
    ["User3",'label3',1726640928]
  ]
  deviceDateTable: any;
  lookup_data_user: any [] = [];
  lookup_data_notification: any = [];
  seletedPK: any;
  lookup_users: any = [];
  editOperation: boolean = false;
  username: any;
  permissionID: any;
  formIDPermission: any;
  locationPermission: any;
  companyID: any;
  permissionForm: any;
  validForms: any;
  filtermatchedData: any[];
  formsToDisplay: any[];
  selectedFormFields: any = [];
  lookup_data_Options: any = [];
  getDerivedArrayList: any = [];


  constructor(private fb: FormBuilder,
    public router: Router,private toast: MatSnackBar,
    private cd: ChangeDetectorRef,private api:APIService,private notifyConfig:SharedService,private auditTrail:AuditTrailService) { 
      this.initializeDeviceFields()
    }



    formsList:any=[];

    selectedForm: any;



  async ngOnInit() {
    //this.initializeDeviceFields();

    this.getLoggedUser = this.notifyConfig.getLoggedUserDetails()

    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username;

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)

    this.Lookupdata=[]

    this.checkPermissions()
    
    this.addFromService()

    this.showTable()

    
   
  }



  async checkPermissions() {



    try {
      await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options);

          // Corrected the map function
          this.formsList = helpherObj.map((item: any) => (item[0]));

          console.log("Form list is here ", this.formsList);
        }
      });
    } catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }


    //Get the user configuratyion
    const userResponse = await this.api.GetMaster(`${this.username}#user#main`, 1);

    if (userResponse && userResponse.metadata) {

      console.log("userResponse.metadata ", userResponse.metadata);

      const tempHolder = JSON.parse(userResponse.metadata)
      this.permissionID = tempHolder.permission_ID
      this.formIDPermission = tempHolder.form_permission
      this.locationPermission = tempHolder.location_permission
      this.companyID = tempHolder.companyID
    }



    const keyLocation = Array.isArray(this.locationPermission) && this.locationPermission.length === 1 && this.locationPermission[0] === "All" ? "All" : "Not all";
    const keyDevices = Array.isArray(this.formIDPermission) && this.formIDPermission.length === 1 && this.formIDPermission[0] === "All" ? "All" : "Not all";





    if (this.permissionID !== 'All') {

      const permisson_response = await this.api.GetMaster(this.SK_clientID + '#permission#' + this.permissionID + '#main', 1);
      const permission_data = permisson_response && JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))
      this.permissionForm = permission_data && JSON.parse(permission_data.dynamicEntries)   // Dymaic Entries 
      console.log("PERMISSION FORM:", this.permissionForm)

      const result = await this.api.GetMaster(`${this.SK_clientID}#${this.companyID}#location#main`, 1)
      if (result) {
        console.log("TREE RESPONSE:", JSON.parse(JSON.parse(JSON.stringify(result.metadata))))

        const tree_reponse = JSON.parse(JSON.parse(JSON.stringify(result.metadata)))

        console.log("TREE RESPONSE 2:", JSON.parse(JSON.parse(JSON.stringify(tree_reponse[0].tree))))

        const tree_response_1 = JSON.parse(JSON.parse(JSON.stringify(tree_reponse[0].tree)))


     
        this.validForms = this.permissionForm.filter((item: any) => item.permission.includes('Read') == true || item.permission.includes('All') == true)
        console.log("Valid forms are here ", this.validForms);
        const allowedForms = this.validForms.reduce((acc: string[], permission: any) => {
          return acc.concat(permission.dynamicForm);
        }, []);
        console.log("ALLOW FORMS:", allowedForms)



        console.log("keyLocation ,keyDevices ", keyLocation, keyDevices);

        if (`${keyLocation}-${keyDevices}` == "Not all-Not all" || `${keyLocation}-${keyDevices}` == "Not all-All") {

          const returnValueTree = await this.modifyList(this.locationPermission, this.formIDPermission, tree_response_1);

          console.log("FilterValuetreee", returnValueTree)

          if (returnValueTree.length > 0) {
            // Extracting text for nodes with node_type "device"
            this.filtermatchedData = returnValueTree
              .filter((node: any) => node.node_type === "device")
              .flatMap((node: any) => node.text || []);
            console.log("jsonModified_in_service_final", this.filtermatchedData);
          }
          if (returnValueTree.length == 0) {
            this.filtermatchedData = []
          }


          console.log("GROUP LIST:", this.filtermatchedData)

          this.filtermatchedData = this.filtermatchedData.filter((item: any) => allowedForms.includes(item))


          this.formsToDisplay = this.filtermatchedData

        }
        else if (`${keyLocation}-${keyDevices}` == "All-All") {



          let matchingItems = []
          if (allowedForms.includes('All')) {
            matchingItems = this.formsList;
          }
          else {
            matchingItems = allowedForms
          }

          this.formsToDisplay = matchingItems
        }
        else {
          this.filtermatchedData = this.formIDPermission

          this.formsToDisplay = this.filtermatchedData.filter((ele: any) => allowedForms.includes(ele))
        }
      }

    }
    else {
      const keyLocation = Array.isArray(this.locationPermission) && this.locationPermission.length === 1 && this.locationPermission[0] === "All" ? "All" : "Not all";
      const keyDevices = Array.isArray(this.formIDPermission) && this.formIDPermission.length === 1 && this.formIDPermission[0] === "All" ? "All" : "Not all";

      if (`${keyLocation}-${keyDevices}` == "All-All") {
        this.formsToDisplay = this.formsList
      }

      this.api.GetMaster(`${this.SK_clientID}#${this.companyID}#location#main`, 1).then(async (result) => {
        if (result) {
          console.log("TREE RESPONSE:", JSON.parse(JSON.parse(JSON.stringify(result.metadata))))

          const tree_reponse = JSON.parse(JSON.parse(JSON.stringify(result.metadata)))

          console.log("TREE RESPONSE 2:", JSON.parse(JSON.parse(JSON.stringify(tree_reponse[0].tree))))

          const tree_response_1 = JSON.parse(JSON.parse(JSON.stringify(tree_reponse[0].tree)))

          const keyLocation = Array.isArray(this.locationPermission) && this.locationPermission.length === 1 && this.locationPermission[0] === "All" ? "All" : "Not all";
          const keyDevices = Array.isArray(this.formIDPermission) && this.formIDPermission.length === 1 && this.formIDPermission[0] === "All" ? "All" : "Not all";

          if (`${keyLocation}-${keyDevices}` !== "All-All") {

            const returnValueTree = await this.modifyList(this.locationPermission, this.formIDPermission, tree_response_1);

            console.log("FilterValuetreee", returnValueTree)

            if (returnValueTree.length > 0) {
              // Extracting text for nodes with node_type "device"
              this.filtermatchedData = returnValueTree
                .filter((node: any) => node.node_type === "device")
                .flatMap((node: any) => node.text || []);
              console.log("jsonModified_in_service_final", this.filtermatchedData);
            }
            if (returnValueTree.length == 0) {
              this.filtermatchedData = []
            }

            this.formsToDisplay = this.filtermatchedData

          }

        }
      })
    }


    // this.formsToDisplay = this.formsToDisplay.filter((item:any) => item != 'All')

    console.log("Permission is being checked and the forms to display are ", this.formsToDisplay);


    this.cd.detectChanges()

  }


  async modifyList(locationPermission: any, formPermission: any, originalArray: Node[]): Promise<Node[]> {
    const keyLocation = Array.isArray(this.locationPermission) && locationPermission.length === 1 && locationPermission[0] === "All" ? "All" : "Not all";
    const keyDevices = Array.isArray(this.formIDPermission) && formPermission.length === 1 && formPermission[0] === "All" ? "All" : "Not all";

    console.log("modifyList:", `${keyLocation}-${keyDevices}`);

    switch (`${keyLocation}-${keyDevices}`) {
      case "All-All":
        return [];
      case "Not all-All":
        return this.calculateNodesToShow(locationPermission, originalArray);
      case "All-Not all":
        return this.calculateNodesToShow(formPermission, originalArray);
      case "Not all-Not all":
        const data1 = await this.calculateNodesToShow(locationPermission, originalArray);
        const data2 = await this.calculateNodesToShow(formPermission, data1);
        return data2;
      default:
        console.log("Unrecognized case");
        return [];
    }
  }




  async calculateNodesToShow(permissions: any, originalData: Node[]): Promise<Node[]> {
    let nodeMap = this.enhanceNodeMap(originalData);
    let nodesToShow: Node[] = [];
    permissions && permissions.forEach((permission: string) => {
      const keyText = "text_" + permission;
      const nodes = nodeMap[keyText] || [];

      nodes.forEach((permittedNode: Node) => {
        if (permittedNode && !nodesToShow.includes(permittedNode)) {
          nodesToShow.push(permittedNode);
          this.collectDescendants(permittedNode, nodesToShow, originalData);
          this.markAncestors(permittedNode, nodesToShow, originalData);
        }
      });
    });
    return nodesToShow.filter((v: any, i, a) => a.findIndex((t: any) => t.id === v.id) === i);
  }



  enhanceNodeMap(originalData: Node[]): Record<string, Node[]> {
    let nodeMap: Record<string, Node[]> = {};
    originalData.forEach((node: any) => {
      const textKey = "text_" + node.text;

      if (!nodeMap[textKey]) {
        nodeMap[textKey] = [];
      }
      nodeMap[textKey].push(node);
    });
    return nodeMap;
  }

  collectDescendants(node: any, result: Node[], originalData: Node[]): void {
    let children = originalData.filter((n: any) => n.parent === node.id);
    children.forEach((child) => {
      if (!result.includes(child)) {
        result.push(child);
        this.collectDescendants(child, result, originalData);
      }
    });
  }

  markAncestors(node: any, result: Node[], originalData: Node[]): void {
    if (node.parent !== "#") {
      const parentNode = originalData.find((n: any) => n.id === node.parent);
      if (parentNode && !result.includes(parentNode)) {
        result.push(parentNode);
        this.markAncestors(parentNode, result, originalData);
      }
    }
  }


  onSubmit(event:any){
     
    console.log("Submitted is clicked ",event);
    if(event.type == 'submit' && this.editOperation == false){
      this.createNewNM('')
    }
    else{
      this.updateConfiguration(this.notificationForm.value,'id')
    }
  }



  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deleteNM(id);
  }

  create() {
    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
    this.openModal('')
  }


  edit(P1: any) {
    console.log("Edited username is here ", P1);
    $('#exampleModal').modal('show');
    this.openModal(P1)






    try{
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "Escalation Matrix",
        "Form Name": 'Escalation Matrix',
      "Description": `${P1} Escalation Matrix details were Viewed`,
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



  async addFromService() {

    await this.fetchAllUsers(1,this.SK_clientID+"#user"+"#lookup")

    this.clientNames = this.lookup_users.map((item:any)=>{
      return {PK:item.P1,type:'User',label:item.P1}
    })
   
  }

  initializeDeviceFields() {
    this.selectedForm = ''
    this.notificationForm=this.fb.group({
      PK: ['', Validators.required],
      SK: [''],
      label: ['', Validators.required],
      target: [''],
      form_permission:['', Validators.required],
      totalEscalationLevels: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      createdTime: [''],
      updatedTime:[''],
      //levels: this.fb.array([])
      levels: this.fb.array([])
    });

    this.notificationForm.get('form_permission').patchValue([])
    console.log("INITS:",this.notificationForm)

  }

  onTotalEscalationLevelsChange(event: any) {
    const totalLevels = this.notificationForm.get('totalEscalationLevels').value;
    console.log("TOTAL LEVELS:",totalLevels)
    const number = totalLevels;
    console.log(number)
    if (number < 1 || number > 10) {
      console.log("PREVENT")
      event.preventDefault();
      this.totEscLvl=1
    }
    else{
      this.totEscLvl=0
      console.log("CONTINUE")
      if(totalLevels!= null){
        const currentLevelCount = this.levels.length;
        this.cd.detectChanges()
        if (totalLevels > currentLevelCount) {
          for (let i = currentLevelCount; i < totalLevels; i++) {
            this.levels.push(this.initLevelForm());
            this.cd.detectChanges()
          }
        } else {
          for (let i = currentLevelCount; i > totalLevels; i--) {
            this.levels.removeAt(i - 1);
            this.cd.detectChanges()
          }
        }
        this.cd.detectChanges()
      }
    }
  }

  disableScroll(event: WheelEvent): void {
    event.preventDefault();
  }

  onUserSelectChange(levelIndex: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const options = selectElement.options;
    const selectedUserIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    console.log("USER IDS:",selectedUserIds)
    // Update the form control
    const userIDsControl = (this.levels.at(levelIndex) as FormGroup).get('userIDs');
    userIDsControl?.setValue(selectedUserIds);
  
    // Continue with updating user permissions 
    this.updateUserPermissions(levelIndex, selectedUserIds);
  }

  initLevelForm(): FormGroup {
    return this.fb.group({
      userIDs: [[]],
      escalationTime: [''],
      comments: [''],
      permissions: this.fb.array([])
    });
  }
  /*
  initPermissionsForm(userId: string): FormGroup {
    return this.fb.group({
      userID: [userId],
      enableSMS: [false],
      enableEmail: [false],
      enableTelegram: [false],
      enableType1: [false],
      enableType2: [false],
      enableType3: [false],
      enableType4: [false],
      enableType5: [false],
    });
  }*/
  get levels(): FormArray {
    return this.notificationForm.get('levels') as FormArray;
  }
  getPermissions(levelIndex: number): FormArray {
    //console.log((this.levels.at(levelIndex) as FormGroup).controls['permissions'] as FormArray)
    return ((this.levels.at(levelIndex) as FormGroup).controls['permissions']) as FormArray;
    //return (this.levels.at(levelIndex) as FormGroup).get('permissions') as FormArray;
  }

  async updateUserPermissions(levelIndex: number, selectedUserIds: string[]): Promise<void> {
  const levelFormGroup = this.levels.at(levelIndex) as FormGroup;
  const permissionsArray = levelFormGroup.get('permissions') as FormArray;

  // Clear existing permissions form groups

  console.log("P ARRAY1:",permissionsArray)
  console.log(permissionsArray.value)
  const filteredList = permissionsArray.value.filter((obj: any) => selectedUserIds.includes(obj.userID))
  console.log(filteredList)
  permissionsArray.clear();
  console.log("P ARRAY2:",permissionsArray)
  // Create a new FormGroup for each selected user ID
  selectedUserIds.forEach(userID => {
    if (!filteredList.some((obj: any) => obj.userID === userID)) {
      filteredList.push({
            "userID": userID,
            "enableSMS": false,
            "enableEmail": true,
            "enableTelegram": false,
            "enableType1": false,
            "enableType2": false,
            "enableType3": false,
            "enableType4": false,
            "enableType5": false
        });
    }
});
console.log("FILTERED LIST:",filteredList)
for(let i=0;i<filteredList.length;i++){
  const permissionGroup = this.fb.group(filteredList[i])
  permissionsArray.push(permissionGroup)
}
console.log("PARRAY3:",permissionsArray)

  console.log("CREATE NEW FIELD:", this.notificationForm)
}  

  createNewNM(getValue: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Notification Matrix updated successfully!' : 'Notification Matrix created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };



    var l=this.notificationForm.controls.levels
    var escalationTime=[]
    var comments=[]
    var final_levels=[]
    for(let i=0;i<l.controls.length;i++){
      var level=l.controls[i]
      console.log(level)
      escalationTime.push(level.value['escalationTime'])
      comments.push(level.value['comments'])
      var users=level.value['userIDs']
      var permisions=level.controls['permissions']
      console.log(permisions)
      console.log(escalationTime)
      console.log(comments)
      var fin_perms=[]
      for(let j=0;j<permisions.controls.length;j++){
        var perm=permisions.controls[j]
        fin_perms.push(perm.value)
      }
      final_levels.push({
        'users': users,
        'permissions': fin_perms,
        'escalationTime': level.value['escalationTime'],
        'comments': level.value['comments']
      })
    }
    this.allDatas = {
      label: this.notificationForm.value.label,
      createdTime: `${Math.ceil(((new Date()).getTime())/1000)}`,
      updatedTime: `${Math.ceil(((new Date()).getTime())/1000)}`,
      totalEscalationLevels: this.notificationForm.value.totalEscalationLevels,
      form_permission:this.notificationForm.value.form_permission,
      levels: JSON.stringify(final_levels),
      escalationTime: escalationTime,
      comments: JSON.stringify(comments),
      others: null,
      target:this.notificationForm.value.target
    };

    const tempObj = {
      PK: this.SK_clientID+"#notification#"+this.notificationForm.value.PK+"#main",
      SK: 1,
      metadata:JSON.stringify(this.allDatas)
    }

    console.log("Notification matrix data is here ",this.notificationForm.value);

    console.log('alldata',this.allDatas)
    this.submitted = true;
    console.log('config creation',this.allDatas);
   
    this.api.CreateMaster(tempObj).then(async (value: any)=>{
      console.log("Sending Data")
      // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Add", "Creating new Notification Matrix Config in the Main Table", "1")

      if (value) {

        // this.addFromService();

        //Addition to Lookup Table Dream Board
        var item={
          P1:this.notificationForm.value.PK,
          P2:this.allDatas.label,
          P3:this.allDatas.form_permission,
          P4:Math.ceil(((new Date()).getTime())/1000)
        }

        // var element={
        //   PK:this.allDatas.PK,
        //   label:this.allDatas.label,
        //   createdTime: Math.ceil(((new Date()).getTime())/1000)
        // }

        await this.createLookUpRdt(item,1,this.SK_clientID+"#notification"+"#lookup")
        // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Add", "Creating new Notification Matrix Config in the Lookup Table", "1")



        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "Created",
            "Module Name": "Escalation Matrix",
            "Form Name": 'Escalation Matrix',
          "Description": `${item.P1} Escalation Matrix was Created`,
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

        this.showAlert(successAlert)
        
        // this.toast.open("New Notification Matrix Configuration created successfully", " ", {

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        // })

      }
      else {
        alert('Error in Creating Dashboard Configuration');
      }
    }).catch((err: any) => {
      console.log('err for creation', err);
      this.showAlert(errorAlert)
      // this.toast.open("Error in Creating New Notification Matrix Configuration ", "Check again", {
      //   duration: 5000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      // })
    })
  }



  async showDynamicUserList(){
    console.log("selectedForm ",this.selectedForm);
    const result = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${this.selectedForm}#main`, 1);

    if (result) {
      let tempResult = JSON.parse(result.metadata || '').formFields;
      console.log("All the formFields are here ",tempResult);
      this.selectedFormFields = tempResult.filter((field:any)=>field.validation?.user === true || field.validation?.isDerivedUser === true).map((item:any)=>{return {PK:item.name,type:'isUserList',label:item.label}})
      console.log("All the users fields are here ",this.selectedFormFields);
  
      this.clientNames = [...this.clientNames,...this.selectedFormFields]
    }


    this.cd.detectChanges()
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

  async openModal(getValues: any) {
    this.totEscLvl=0
    this.multiselectModule = [];
    this.notificationForm.reset()
    console.log("CreateNewField:",this.notificationForm)
    //new device configuration (changing of buttons(submit))
    if (getValues == "") {
      this.editOperation = false
      console.log("GET VALUES:",getValues)
      this.notificationForm.get('PK')?.enable();
      this.showModal = false;
      this.showHeading = true;
      this.errorForUniqueLabel = '';
      this.errorForUniqueID = '';

      this.initializeDeviceFields()
    }
    //updated device congifuration(update)
    //else if (getValues && getValues.SK && getValues.SK == "untangleds") {
    else if (getValues) {
      this.editOperation = true
      this.showModal = true;
      this.showHeading = false;
      console.log('values',getValues)
      var pk=getValues
      console.log("PK:",pk)
      //this.createNewField.reset()
      this.initializeDeviceFields()
      console.log("CLEARED:", this.notificationForm)
      

      await this.api.GetMaster(this.SK_clientID+"#notification#"+pk+"#main",1).then(result=>{
        // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "View", "Get Specifc NM Info from Main Table (From UI Table)", "1")
        if (result && result !== undefined) {
          this.data_temp = result;
          console.log('after sending request,fetched from dynamoDB', this.data_temp);
          console.log("RIGHT BEFORE ONCLICK")
          const metaData = JSON.parse(this.data_temp.metadata);
          const levelsData = JSON.parse(metaData.levels);
          this.seletedPK = pk
          this.initializeForm(levelsData, metaData)
          this.duplicate = JSON.parse(JSON.stringify(this.notificationForm.value));
          delete this.duplicate['PK']
          console.log("edit field:",this.notificationForm)
          this.notificationForm.get('PK')?.disable();
          this.showDynamicUserList()
          this.changeDetection();
        }
      }).catch((err) => {
        console.log('cant fetch', err);
      })
    }
  }


  changeDetection() {
    setTimeout(() => {
      this.cd.detectChanges()
    }, 500);
  }

  checkUniqueID(getLabel: any) {
    //console.log('get label', getLabel);
    //console.log(this.listofNMIds)
    this.errorForUniqueLabel = '';
    for (let uniqueID = 0; uniqueID < this.listofNMIds.length; uniqueID++) {
      if (getLabel.toLowerCase() == this.listofNMIds[uniqueID].toLowerCase()) {
        this.errorForUniqueID='id already exists'
        this.errorForUniqueLabel = "ID already exists";
        break
      }
      else{
        this.errorForUniqueID=''
      }
    }
  }
  isButtonDisabled(): boolean{
    console.log(this.duplicate, this.notificationForm.value)
    var check= JSON.stringify(this.duplicate) == JSON.stringify(this.notificationForm.value) ? true : false;
    
    check= check || this.notificationForm.invalid
    return check
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
  

  keyPress(event: any) {
    const pattern = /['1-9'\+\\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    // console.log('inputchar',inputChar);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  updateConfiguration(value: any, getKey: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'Notification Matrix updated successfully!' : 'Notification Matrix created successfully!',
  };
    const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
    };



     var l=this.notificationForm.controls.levels
    var escalationTime=[]
    var comments=[]
    var final_levels=[]
    for(let i=0;i<l.controls.length;i++){
      var level=l.controls[i]
      console.log(level)
      escalationTime.push(level.value['escalationTime'])
      comments.push(level.value['comments'])
      var users=level.value['userIDs']
      var permisions=level.controls['permissions']
      console.log(permisions)
      console.log(escalationTime)
      console.log(comments)
      var fin_perms=[]
      for(let j=0;j<permisions.controls.length;j++){
        var perm=permisions.controls[j]
        fin_perms.push(perm.value)
      }
      final_levels.push({
        'users': users,
        'permissions': fin_perms,
        'escalationTime': level.value['escalationTime'],
        'comments': level.value['comments']
      })
    }
    console.log(this.notificationForm)
    this.allDatas = {
      label: this.notificationForm.value.label,
      updatedTime: `${Math.ceil(((new Date()).getTime())/1000)}`,
      form_permission:this.notificationForm.value.form_permission,
      totalEscalationLevels: this.notificationForm.value.totalEscalationLevels,
      levels: JSON.stringify(final_levels),
      escalationTime: escalationTime,
      comments: JSON.stringify(comments),
      others: null,
    };

    const tempObj = {
      PK:this.SK_clientID+"#notification#"+this.notificationForm.controls.PK.value+"#main",
      SK:1,
      metadata:JSON.stringify(this.allDatas)
    }

    console.log("Update tempObj ",tempObj);

  

    // this.closeModal.nativeElement.click();
    
    this.api.UpdateMaster(tempObj).then(async (value: any) => {
      if (value) {
        
        console.log("VALUE:",value)
        this.cd.detectChanges()
        // this.toast.open("Notification Matrix configuration updated successfully", " ", {

        //   duration: 2000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',

        // })
        // this.addFromService();

        var item={
          P1:this.notificationForm.controls.PK.value,
          P2:this.allDatas.label,
          P3:this.allDatas.form_permission,
          P4:Math.ceil(((new Date()).getTime())/1000)
        }

        console.log("lookup data ",item);
    
        await this.fetchTimeMachineById(1,this.notificationForm.controls.PK.value, 'update', item);


        try{
          const UserDetails = {
            "User Name": this.username,
            "Action": "Edited",
            "Module Name": "Escalation Matrix",
            "Form Name": 'Escalation Matrix',
          "Description": `${item.P1} Escalation Matrix was Edited`,
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











        // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Update", "Updating the Lookup Table", "1")
        this.showAlert(successAlert)
        this.cd.detectChanges()
        this.reloadEvent.next(true)

      }
      else {
        this.showAlert(errorAlert)
        alert('Error in Updating Configuration');
      }

    }).catch(err=>{
      console.log(err)
      this.showAlert(errorAlert)
      // this.toast.open("Error in Updating Configuration ", "Check again", {
  
      //   duration: 5000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',

      // })
    })
  }



  async   fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID+'#notification'+"#lookup";
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
 

  onModuleSelect(levelIndex: number, option: any) {

    if(option.originalEvent && option.originalEvent.selected === true){
      console.log("Multiselecte is selecting",option);

        console.log("Level index is",levelIndex);

        // Get the current values of the userIDs control at this level
        const userIDs = (this.levels.at(levelIndex).get('userIDs')?.value).map((item:any)=>item.PK) || [];
        // Add the new user ID, if it's not already in the array
        
        if (!userIDs.includes(option.itemValue.PK)) {
          userIDs.push(option.itemValue.PK);
          this.levels.at(levelIndex).get('userIDs')?.setValue(userIDs);
        }
        this.updateUserPermissions(levelIndex, userIDs);
    }
    else if(option.originalEvent && option.originalEvent.selected === false){
      this.onDeSelect(levelIndex,option)
    }

    
  }

  
  onDeSelect(levelIndex: number, option: any) {
    // Get the current values of the userIDs control at this level
    const userIDs = (this.levels.at(levelIndex).get('userIDs')?.value).map((item:any)=>item.PK) || [];
    console.log(userIDs)
    // Remove the user ID
    const indexToRemove = userIDs.indexOf(option.itemValue.PK);
    if (indexToRemove !== -1) {
      userIDs.splice(indexToRemove, 1);
      this.levels.at(levelIndex).get('userIDs')?.setValue(userIDs);
    }
    console.log("userIDs", userIDs)
    this.updateUserPermissions(levelIndex, userIDs);
  }
  
  onSelectAll(levelIndex: number, modules: any) {
    // Map the modules to their IDs and set it to the userIDs control
    if(modules.checked == false){
      this.updateUserPermissions(levelIndex, []);
    }
    else{
      console.log("modules ",modules);
      const userIDs = this.clientNames.map((module: { PK: any; }) => module.PK);
      console.log("userIDs", userIDs)
      this.updateUserPermissions(levelIndex, userIDs);
    }
  }
  
  onDeSelectAll(levelIndex: number) {

    console.log("On deselection is here ");
    // Clear the userIDs control at this level
    this.levels.at(levelIndex).get('userIDs')?.setValue([]);
    this.updateUserPermissions(levelIndex, []);
  }

  async showTable() {

    console.log("Show DataTable is called BTW");

    this.datatableConfig = {}
    this.lookup_data_notification = []
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters:any, callback) => {
        this.datatableConfig = {}
        this.lookup_data_notification = []
        this.fetchUserLookupdata(1,this.SK_clientID + "#notification" + "#lookup")
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
          title: 'Notification Matrix ID', 
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
                <span>${full.P2}</span> <!-- Assuming P3 is the email -->
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
          title: 'Label', data: 'P2' // Added a new column for phone numbers
        },
        {
          title: 'Selected Form', data: 'P3' // Added a new column for phone numbers
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
      createdRow: (row, data, dataIndex) => {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      }
  };


      try{
        const UserDetails = {
          "User Name": this.username,
          "Action": "View",
          "Module Name": "Escalation Matrix",
          "Form Name": 'Escalation Matrix',
        "Description": `Escalation Matrix table was Viewed`,
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

  deleteNM(value: any) {
    console.log('inside delete',value);
    this.allPB_details = value;
    

    if (this.allPB_details) {

      let temp = {
        PK: this.SK_clientID+"#notification#"+this.allPB_details+"#main",
        SK: 1
      }

      var item={
        P1:this.allPB_details,
        P2:this.allPB_details.label,
        P3:Math.ceil(((new Date()).getTime())/1000)
      }


          console.log("Inside the deletion:")
          
          try{
             // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Delete", "Deleting the NM in the Lookup Table", "1")
          console.log("DELETING FROM LOOKUP TABLE DONE")
          console.log('NM id', temp);
          
          this.api.DeleteMaster(temp).then(async value => {
            // this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Delete", "Deleting the NM in the Main Table", "1")

            await this.fetchTimeMachineById(1, this.allPB_details, 'delete', item)




          try{
            const UserDetails = {
              "User Name": this.username,
              "Action": "Deleted",
              "Module Name": "Escalation Matrix",
              "Form Name": 'Escalation Matrix',
            "Description": `${item.P1} Escalation Matrix was Deleted`,
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
          })
        
        
      
    }
    catch(err){
      console.log("Error Deleting",err);
    }
    }
  }
  hide_edit_delete(key: any) {
    if (key === 'from_html') {
      this.edit_delete = !this.edit_delete;
    }
    else if (key === 'from_TS') {
      //view
      if (this.hideDeleteButton === false) {
        this.edit_delete = false;
      }
      //update
      else if (this.hideDeleteButton === true) {
        this.edit_delete = true;

      }
    }
  }
  // showSpinner() {
  //   this.spinner.show();
  //   if (this.stopTimer) {
  //     clearTimeout(this.stopTimer);
  //   }
  //   setTimeout(() => {

  //     this.spinner.hide();
  //     // this.cd.detectChanges()
  //   }, 1500);
  // }

  // changeDetection() {
  //   setTimeout(() => {
  //     this.cd.detectChanges()
  //   }, 500);
  // }

  
  getPbTableData(pbData: any, colData: any) {
    // this.pbTableData = $('#datatables').DataTable({
    //   "pagingType": "full_numbers",
    //   //destroys every time before updating value
    //   destroy: true,
    //   lengthChange: true,
    //   data: pbData,
    //   order: [[3, 'asc']],
    //   columnDefs: [
    //     { "type": "date", "targets": 3 }
    //   ],

    //   columns: colData
    // });
    // this.cd.detectChanges();




    try {
      // Check if DataTable instance exists and destroy it before initializing a new one
      if (this.deviceDateTable && ($.fn.DataTable as any).isDataTable('#datatables')) {
        this.deviceDateTable.destroy(); // Destroy existing DataTable instance
      }
      const options:any = {
        "pagingType": "full_numbers",
        "destroy": true,
        "lengthChange": true,
        "responsive": true,
        "data": pbData,
        "ordering": true,
        "order": [[3, 'desc']],
        "columnDefs": [
          {
            "type": "date",
            "targets": 3 // Assuming 'updatedTime' column is at index 4
          }
        ],
        "columns": colData 
      }
      this.deviceDateTable = $('#datatables').DataTable(options);
    }
    catch(err){
      console.log("Error showing Datatable ",err);
    }
  }
  
  // async loading(){
  //   this.spinner.show()
  //   var table =$('datatables').DataTable()
  //   table.destroy()
    
  //   this.nm_table=[]
  //   this.Lookupdata=[]
  //   await this.fetchNMData(1)
  //   this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Page Load", "Getting the NM from Lookup Table", this.listofNMIds.length)
  //   console.log("HIHIHIHIHIIHII")
  //   console.log(this.Lookupdata)
  // }





  initializePermissions(permissionsData: any[]) {
      return this.fb.array(permissionsData.map(perm => this.fb.group({
          userID: [perm.userID],
          enableSMS: [perm.enableSMS],
          enableEmail: [perm.enableEmail],
          enableTelegram: [perm.enableTelegram],
          enableType1: [perm.enableType1],
          enableType2: [perm.enableType2],
          enableType3: [perm.enableType3],
          enableType4: [perm.enableType4],
          enableType5: [perm.enableType5],
      })));
  }
  initializeLevels(levelsData: any[]) {
      const levelsArray = levelsData.map((level, index) => {
          const permissionsArray = this.initializePermissions(level.permissions);
          this.cd.detectChanges()
          console.log("USERS:",level.users)
          var x=[]
          return this.fb.group({
              userIDs: [level.users],
              escalationTime: [level.escalationTime],
              comments:  [level.comments],
              permissions: permissionsArray
          });
      });
      this.cd.detectChanges()
      return this.fb.array(levelsArray);
  }
  initializeForm(levelsData: any, dataFromDb:any) {
    console.log("DATA FROM DB:",dataFromDb)
      const levelsFormArray = this.initializeLevels(levelsData);
      this.cd.detectChanges()
      this.notificationForm.setControl('levels', levelsFormArray);
      this.cd.detectChanges()
      // Set or patch other values as necessary
      this.notificationForm.patchValue({
          PK: this.seletedPK,
          SK: dataFromDb.SK,
          label: dataFromDb.label,
          target: dataFromDb.target,
          form_permission: dataFromDb.form_permission,
          totalEscalationLevels: dataFromDb.totalEscalationLevels,
          escalationTime: dataFromDb.escalationTime,
          comments: dataFromDb.comments,
          createdTime: dataFromDb.createdTime,
          updatedTime: dataFromDb.updatedTime,
      });
      this.cd.detectChanges()
  }



  fetchUserLookupdata(sk:any,pkValue:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(pkValue, sk)
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
                    const { P1, P2, P3 ,P4} = element[key]; // Extract values from the nested object
                    this.lookup_data_notification.push({ P1, P2, P3 ,P4}); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_notification);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_notification.sort((a: { P4: number; }, b: { P4: number; }) => b.P4 - a.P4);
                console.log("Lookup sorting", this.lookup_data_notification);
  
                // Continue fetching recursively
                promises.push(this.fetchUserLookupdata(sk + 1,pkValue)); // Store the promise for the recursive call
                
                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_notification)) // Resolve with the final lookup data
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
            console.log("All the users are here", this.lookup_data_notification);


            this.listofNMIds = this.lookup_data_notification.map((item:any)=>item.P1)

           console.log("All the unique id are here ",this.listofNMIds);

            resolve(this.lookup_data_notification); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }



  fetchAllUsers(sk:any,pkValue:any):any {
    console.log("I am called Bro");
    
    return new Promise((resolve, reject) => {
      this.api.GetMaster(pkValue, sk)
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
                    const { P1, P2, P3 } = element[key]; // Extract values from the nested object
                    this.lookup_users.push({ P1, P2, P3 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_users);
                  } else {
                    break;
                  }
                }
  
                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_users.sort((a: { P5: number; }, b: { P5: number; }) => b.P5 - a.P5);
                console.log("Lookup sorting", this.lookup_users);
  
                // Continue fetching recursively
                promises.push(this.fetchUserLookupdata(sk + 1,pkValue)); // Store the promise for the recursive call
                
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
            console.log("All the users are here", this.lookup_users);
            

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