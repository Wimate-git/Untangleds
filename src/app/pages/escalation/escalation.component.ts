//import { EventEmitter, Inject, Input, Output } from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiSearch, Config } from 'datatables.net';
import { APIService } from 'src/app/API.service';



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


  constructor(private fb: FormBuilder,
    public router: Router,private toast: MatSnackBar,
    private cd: ChangeDetectorRef,private api:APIService) { 
      this.initializeDeviceFields()
    }






  async ngOnInit() {
    //this.initializeDeviceFields();
    this.Lookupdata=[]


    this.api.GetMaster('Asad#user#main',1).then((result)=>{
      console.log(result);
    })
    
    this.addFromService()

    this.showDatatable(this.tableData)
   
  }



  delete(id: number) {
    console.log("Deleted username will be", id);
    // this.deleteUser(id, 'delete');
  }

  create() {
    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
  }


  edit(P1: any) {
    console.log("Edited username is here ", P1);
    // $('#openModal1').modal('show');
    // this.openModalHelpher(P1)
  }



  addFromService() {

 
   
  }

  initializeDeviceFields() {
    this.notificationForm=this.fb.group({
      PK: ['', Validators.required],
      SK: [''],
      label: ['', Validators.required],
      target: ['', Validators.required],
      totalEscalationLevels: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      createdTime: [''],
      updatedTime:[''],
      //levels: this.fb.array([])
      levels: this.fb.array([])
    });
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
            "enableEmail": false,
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
    
  }

  async openModal(getValues: any) {
    this.totEscLvl=0
    this.multiselectModule = [];
    this.notificationForm.reset()
    console.log("notificationForm:",this.notificationForm)
    //new device configuration (changing of buttons(submit))
    if (getValues == "") {
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
      this.showModal = true;
      this.showHeading = false;
      console.log('values',getValues)
      var pk=getValues.PK
      console.log("PK:",pk)
      //this.notificationForm.reset()
      this.initializeDeviceFields()
      console.log("CLEARED:", this.notificationForm)
      
    }
  }

  checkUniqueID(getLabel: any) {
    //console.log('get label', getLabel);
    //console.log(this.listofNMIds)
    this.errorForUniqueLabel = '';
    for (let uniqueID = 0; uniqueID < this.listofNMIds.length; uniqueID++) {
      if (getLabel == this.listofNMIds[uniqueID]) {
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
  updateConfiguration(value: any, getKey: any) {
    
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

    console.log("modules ",modules);
    const userIDs = this.clientNames.map((module: { PK: any; }) => module.PK);
    console.log("userIDs", userIDs)
    this.updateUserPermissions(levelIndex, userIDs);
  }
  
  onDeSelectAll(levelIndex: number) {
    // Clear the userIDs control at this level
    this.levels.at(levelIndex).get('userIDs')?.setValue([]);
    this.updateUserPermissions(levelIndex, []);
  }

  showDatatable(getVaues: any) {

  }

  // deleteNM(value: any) {
  //   console.log('inside delete',value);
  //   this.allPB_details = value;
    

  //   if (this.allPB_details && this.allPB_details.PK) {

  //     let temp = {
  //       PK: this.allPB_details.PK,
  //       SK: this.SK_clientID
  //     }

  //     var item=[
  //       this.allPB_details.PK,
  //       this.allPB_details.label,
  //       Math.ceil(((new Date()).getTime())/1000)
  //     ]

  //     Swal.fire({
  //       position: 'center',
  //       title: 'Are you sure?',
  //       text: 'You wont get these details back again',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       allowOutsideClick: false,////prevents outside click
  //       confirmButtonText: 'Yes, go ahead.',
  //       cancelButtonText: 'No, let me think'
  //     }).then(async (result) => {


  //       if (result.dismiss !== Swal.DismissReason.cancel) {

  //         console.log("Inside the deletion:")
  //         await this.fetchNMById(1, this.allPB_details.PK, 'delete', item)
  //         this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Delete", "Deleting the NM in the Lookup Table", "1")
  //         console.log("DELETING FROM LOOKUP TABLE DONE")
  //         console.log('NM id', temp);
          
  //         this.api.DeleteNotificationMatrix(temp).then(value => {
  //           this.auditTrialServices.audit_trail('2.1', "Notification Matrix", "Delete", "Deleting the NM in the Main Table", "1")
  //           this.addFromService();
  //           this.loading()
  //           console.log(value," REMOVED FROM MAIN TABLE")
  //           if (value) {
  //             console.log('confirmButtonText', value);
  //             Swal.fire(
  //               'Removed!',
  //               'Notification Matrix Entry Removed Successfully.',
  //               'success'
  //             )
  //           }

  //         }).catch(err => {
  //           //console.log('error for deleting', err);
  //         })
  //       }
  //       else if (result.dismiss === Swal.DismissReason.cancel) {
  //         //console.log('confirmButtonText ');
  //         Swal.fire(
  //           'Cancelled',
  //           'Notification Matrix Entry Not Removed',
  //           'error'
  //         )
  //       }
  //     })
  //   }

  // }
  // hide_edit_delete(key: any) {
  //   if (key === 'from_html') {
  //     this.edit_delete = !this.edit_delete;
  //   }
  //   else if (key === 'from_TS') {
  //     //view
  //     if (this.hideDeleteButton === false) {
  //       this.edit_delete = false;
  //     }
  //     //update
  //     else if (this.hideDeleteButton === true) {
  //       this.edit_delete = true;

  //     }
  //   }
  // }
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
          PK: dataFromDb.PK,
          SK: dataFromDb.SK,
          label: dataFromDb.label,
          target: dataFromDb.target,
          totalEscalationLevels: dataFromDb.totalEscalationLevels,
          escalationTime: dataFromDb.escalationTime,
          comments: dataFromDb.comments,
          createdTime: dataFromDb.createdTime,
          updatedTime: dataFromDb.updatedTime,
      });
      this.cd.detectChanges()
  }
}