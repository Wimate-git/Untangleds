import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import { SweetAlertOptions } from 'sweetalert2';
import { Config } from 'datatables.net';
import {
  Validators,
  UntypedFormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { APIService } from 'src/app/API.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SharedService } from '../shared.service';
import { permission } from 'process';

type Tabs = 'Sidebar' | 'Header' | 'Toolbar';
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
  selector: 'app-permission3',
  templateUrl: './permission3.component.html',
  styleUrls: ['./permission3.component.scss'],
})

export class Permission3Component implements OnInit, AfterViewInit, OnDestroy {

  datatableConfig: Config = {};
  activeTab: Tabs = 'Sidebar';
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  users: DataTablesResponse;
  isCollapsed1 = false;
  isCollapsed2 = true;
  dreamBoardIDs: any[] = [];
  dropdownSettings: IDropdownSettings = {
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  dropdownSettings_: IDropdownSettings = {
    singleSelection: true,
    allowSearchFilter: true
  };
  swalOptions: SweetAlertOptions = {};

  roles$: Observable<DataTablesResponse>;

  permissionForm: UntypedFormGroup
  maxlength: number = 1000;

  userModel: { P1: string; P2: string; P3: string; P4: string; };
  login_detail: any;
  lookup_data_user: any = [];
  isLoading = false;
  loginDetail_string: any;
  client: any;
  data_temp: any = [];
  match: boolean;
  update = false
  error: string;
  getLoggedUser: any;
  SK_clientID: any;
  powerboardId: any[] = [];
  magicboardId: any[] = [];
  formList: any[] = [];
  advance_report: any[] = [];
  permissionItem: any;
  listofSK: any;
  updateResponse: any;
  deleteResponse: any;
  dynamicData: any[] = [];
  dynamicForm: any;
  dynamicFields: FormArray<any>;
  form_permission: any[] = [];
  selectedRelatedValue: string | null = null;


  permissionsList = [

    { name: 'Notification Matrix', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Client', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Company', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'User Management', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Permission', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Form Group', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Location Management', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Summary Engine', view: false, update: false, xlsxView: false, xlsxUpdate: false },

    // Add more permissions as needed
  ];
  dynamicFormError: string;
  permissionError: string;
  formgroupIDs: any[] = [];
  selectedFormGroups: any[] = [];
  dynamicform: any;
  formList_: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: APIService,
    private getDiagnostics: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {

    console.log("PERMISSION 3 ONINIT")

    this.initForm()

    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail)
    console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

    this.client = this.loginDetail_string.clientID
    this.users = this.loginDetail_string.username

    this.advance_report = [
      'Mail Permission',
      'All Report ID Access',
      'Value Filter'
    ];

    this.form_permission = [
      'Create',
      'Read',
      'Update',
      'Delete',
    ]

    this.datatableConfig = {}
    this.lookup_data_user = []
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.permissionLookupdata(1)
          .then((resp: any) => {
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
          title: 'Permission ID',
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
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };


    console.log("DATATABLE:", this.datatableConfig)

    await this.fetchdreamboardlookup(1)

    await this.fetchpowerboardlookup(1)

    await this.fetchmagicboardlookup(1)

    await this.fetchFormgrouplookup(1)

    // await this.addFromService()
  }


  onFormGroupSelect(selectedItem: any): void {
    console.log("Selected Form Group:", selectedItem);

    this.selectedFormGroups.push(selectedItem); // Add selected item


    console.log("Current Selected Form Groups:", this.selectedFormGroups);

    this.handleFormGroupSelection(selectedItem);
  }

  async onFormGroupDeSelect(deselectedItem: any){
    console.log("Deselected Form Group:", deselectedItem);

    // Remove deselected item from the array
    this.selectedFormGroups = this.selectedFormGroups.filter((item: any) => item !== deselectedItem);

    console.log("Current Selected Form Groups:", this.selectedFormGroups);


    // this.handleFormGroupsLength(this.selectedFormGroups);

    this.formList=[]

    this.selectedFormGroups.forEach((item: any) => this.handleFormGroupSelection(item));

  }


  // Select at a time all value

  onSelectAll(selectedItems: any): void {
    console.log("All selected Form Groups:", selectedItems);

    if(selectedItems == 'All'){
      this.addFromService()
    }
    // Handle logic for when all items are selected
    selectedItems.forEach((item: any) => this.handleFormGroupSelection(item));

    // this.handleFormOnSelectAll(selectedItems)
  }

  handleFormGroupsLength(value:any) {
    if(value.inculdes("All")){

      this.addFromService()
    }
    else{
      value.length

      console.log("VALUE LENGTH:",value.length)
    }
}



  onDeSelectAll(deselectedItems: any): void {
    console.log("All deselected Form Groups:", deselectedItems);
    this.formList = []
    // Handle logic for when all items are deselected if needed
  }

  async handleFormGroupSelection(value: any): Promise<void> {
    console.log("Handling selection for value:", value);

      const dymanic_form_result = await this.api.GetMaster(this.client + '#formgroup#' + value + '#main', 1)

      console.log("DYNMAIC FORM:", JSON.parse(JSON.stringify(dymanic_form_result)))

      this.dynamicform = JSON.parse(JSON.parse(JSON.stringify(dymanic_form_result.metadata)))

      console.log("DYMAINC FORM :", this.dynamicform.formList)

      for (const form of this.dynamicform.formList) {
        // Assuming form has a property 'value' that you want to push
        if (form && !this.formList.includes(form)) {
          this.formList.push(form);
        }
      }

      this.formList.unshift("All");

      this.formList = Array.from(new Set(this.formList));

      console.log("Unique Form List:", this.formList);


      console.log("Updated Form List:", this.formList);
    }

  async handleFormOnSelectAll(value: any): Promise<void> {


    console.log("FormOnSelectAll:", value)

    if (value.includes("All")) {

      this.addFromService()

    }

  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  get permissionsArray(): FormArray {
    return this.permissionForm.get('permissionsList') as FormArray;
  }
  get dynamicEntries(): FormArray {
    return this.permissionForm.get('dynamicEntries') as FormArray;
  }

  initForm() {
    this.permissionForm = this.fb.group({
      permissionID: ["", Validators.required],
      label: ["", Validators.required],
      description: ["", Validators.required],
      time: ["", Validators.required],
      no_of_request: ["", Validators.required],
      no_of_records: ["", Validators.required],
      size: ["", Validators.required],
      setting: ["", Validators.required],
      user_grade: ["", Validators.required],
      api_enable: [false, Validators.required],
      formgroup: [[]],
      dreamBoardIDs: [[], Validators.required],
      advance_report: [[]],
      powerboardId: [[]],
      magicboardId: [[]],
      permissionsList: this.fb.array([]),
      dynamicEntries: this.fb.array([]),
      dynamicForm: [[]],
      permission: [[]],
      createdTime: [Math.ceil(((new Date()).getTime()) / 1000)],
      updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
    });


    this.addPermissions();
  }


  addDynamicData() {

    // this.addbutton = false
    // Get the values from the form
    const dynamicForm = this.permissionForm.get('dynamicForm')?.value;
    const permission = this.permissionForm.get('permission')?.value;

    const errorAlert_1: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: 'Value is required.',
    };

    const errorAlert_: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: 'This dynamic form has already been added.',
    };
    if (dynamicForm.length > 0 && permission.length > 0) {

      // Check for duplicate entries
      const isDuplicate = this.dynamicEntries.controls.some((entry: any) => {
        const existingDynamicForm = entry.get('dynamicForm')?.value;
        console.log("Comparing with: ", existingDynamicForm); // Log the existing dynamicForm values
        return existingDynamicForm[0] === dynamicForm[0];
      });

      if (isDuplicate) {
        // Show error message for duplicate entry
        // alert('This dynamic form has already been added.');

        this.showAlert(errorAlert_)
      } else {
        // Push a new group to the dynamic entries array if no duplicates
        this.dynamicEntries.push(this.fb.group({
          dynamicForm: [dynamicForm, Validators.required],
          permission: [permission, Validators.required]
        }));

        console.log("ADD DYNAMIC DATA:", this.dynamicEntries);

        // Clear the input fields

      }
      this.permissionForm.get('dynamicForm')?.reset();
      this.permissionForm.get('permission')?.reset();
    }
    else {
      // this.dynamicFormError ='Dymanic form required'
      // this.permissionError = 'Permission required'
      this.showAlert(errorAlert_1)
    }
  }

  removeDynamicData(index: number) {
    this.dynamicEntries.removeAt(index);
  }

  editEntry(index: number) {
    const entry = this.dynamicEntries.at(index) as FormGroup;
    // Set the values back into the form for editing
    if (entry) {
      console.log("ON CLICK ON EDIT:", entry)
      this.permissionForm.get('dynamicForm')?.setValue(entry.get('dynamicForm')?.value);
      this.permissionForm.get('permission')?.setValue(entry.get('permission')?.value);

    }
    // Optionally, you can remove the entry after loading it for editing
    this.dynamicEntries.removeAt(index);
  }

  addPermissions() {
    // Adding permissions to the FormArray dynamically
    const permissionsFormArray = this.permissionForm.get('permissionsList') as FormArray;

    this.permissionsList.forEach(permission => {
      permissionsFormArray.push(this.fb.group({
        name: [permission.name, Validators.required],
        view: [permission.view],
        update: [permission.update],
      }));
    });
  }
  updatePermissions() {
    // readback permissions to the FormArray dynamically
    const permissionsFormArray = this.permissionForm.get('permissionsList') as FormArray;

    this.data_temp[0].permissionsList.forEach((permission: { name: any; view: any; update: any; }) => {
      permissionsFormArray.push(this.fb.group({
        name: [permission.name, Validators.required],
        view: [permission.view],
        update: [permission.update],
      }));
    });
  }

  populateDynamicEntries(dynamicEntriesData: any[]) {
    const dynamicEntriesArray = this.permissionForm.get('dynamicEntries') as FormArray;

    console.log("POPULATE DYNAMIC ENTRY:", dynamicEntriesArray)

    // Loop through each entry in dynamicEntriesData and add to the form array
    dynamicEntriesData.forEach(entry => {
      dynamicEntriesArray.push(this.fb.group({
        dynamicForm: [entry.dynamicForm, Validators.required],
        permission: [entry.permission, Validators.required]
      }));
    });
  }

  delete(P1: any) {
    console.log("DELETE ID:", P1)
    const body = {
      PK: this.client + '#' + 'permission#' + P1 + '#main',
      SK: 1,
    };

    this.api.DeleteMaster(body).then(async (res: any) => {

      console.log("DELETE PERMISSION RESPONSE:", res)

      this.deleteResponse = JSON.parse(res.metadata)

      console.log("AFTER JSON PARSE:", this.deleteResponse)

      this.permissionItem = {
        P1: this.deleteResponse.permissionID,
        P2: this.deleteResponse.label,
        P3: this.deleteResponse.updatedTime,
      }

      await this.updatepermissionlookup(1, P1, 'delete', this.permissionItem)

    }).catch((error) => {
      console.log("DREAMBOARD DELLETE ID ERROR:", error)
    })
  }

  edit(P1: any) {

    this.update = true
    console.log("EDIT ID:", P1)
    this.data_temp = []

    this.api.GetMaster(this.client + '#permission#' + P1 + '#main', 1).then((res: any) => {

      if (res && res !== undefined) {

        this.data_temp.push(JSON.parse(res.metadata));
        console.log("Permission data on edit", this.data_temp);


        this.onSelectAll(this.data_temp[0].formgroup)

        if (this.data_temp) {

          this.permissionForm = this.fb.group({
            permissionID: [this.data_temp[0].permissionID],
            label: [this.data_temp[0].label],
            description: [this.data_temp[0].description],
            time: [this.data_temp[0].time],
            no_of_request: [this.data_temp[0].no_of_records],
            no_of_records: [this.data_temp[0].no_of_request],
            size: [this.data_temp[0].size],
            setting: [this.data_temp[0].setting],
            user_grade: [this.data_temp[0].user_grade],
            api_enable: [this.data_temp[0].api_enable],
            formgroup: [this.data_temp[0].formgroup],
            dreamBoardIDs: [this.data_temp[0].dreamBoardIDs],
            advance_report: [this.data_temp[0].advance_report],
            powerboardId: [this.data_temp[0].powerboardId],
            magicboardId: [this.data_temp[0].magicboardId],
            dynamicForm: [this.data_temp[0].dynamicForm],
            permission: [this.data_temp[0].permission],
            permissionsList: this.fb.array([]),
            dynamicEntries: this.fb.array([]),
            createdTime: [this.data_temp[0].createdTime],
            updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
          });

          
          this.updatePermissions();

          this.populateDynamicEntries(JSON.parse(this.data_temp[0].dynamicEntries))
        }

      }

    }).catch((error) => {

      console.log('Get MAIN TABLE DATA ERROR:', error)
    })

  }

  create() {         // click on create new 
    this.update = false
    this.error = '';       // Model heading and button text change flag
    this.initForm()
  }

  onSubmit(event: Event) {

    console.log("On CLICK OF Form Submit Event:", event)

    const permissionId = this.permissionForm.value.permissionID;

    const matchingRecord = this.lookup_data_user.find((record: { P1: any; }) => record.P1 === permissionId);

    if (matchingRecord) {
      console.log('Match found:', matchingRecord);

      this.match = true
      // Do whatever you need with the matching record
    } else {
      console.log('No match found');
      this.match = false
    }

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.match ? 'Permission updated successfully!' : 'Permission created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };



    const completeFn = () => {
      this.isLoading = false;
    };

    const createFn = async () => {

      console.log("FORMS VALUE:", this.permissionForm.value)

      if (!this.permissionForm.valid) {
        console.log('Form is not valid:', this.permissionForm.errors);
        return;
      }

      this.isLoading = true;
      const formValue = this.permissionForm.value;

      const dynamicEntries = formValue.dynamicEntries

      const stringifyDynamic = JSON.stringify(dynamicEntries)

      formValue.dynamicEntries = stringifyDynamic


      const body = {
        PK: this.client + '#' + 'permission#' + this.permissionForm.value.permissionID + '#main',
        SK: 1,
        metadata: JSON.stringify(formValue)
      };

      console.log("CREATE FUNCTION BODY:", body)

      try {
        const res = await this.api.CreateMaster(body);
        console.log("ADD RESPONSE:", res);

        // Build dreamboard item for further operations
        this.permissionItem = {
          P1: this.permissionForm.value.permissionID,
          P2: this.permissionForm.value.label,
          P3: this.permissionForm.value.updatedTime,
        };

        console.log("LOOK UP DREAMBOARD DATA:", this.permissionItem);
        await this.createLookuppermission(this.permissionItem, 1, this.client + '#permission#lookup');
        this.showAlert(successAlert);
        this.reloadEvent.emit(true);

      } catch (error) {
        console.error("Dreamboard add request error:", error);
        errorAlert.text = this.extractText(error);
        this.showAlert(errorAlert);
      } finally {
        this.isLoading = false;
        completeFn();
      }
    }

    const updateFn = () => {

      const formValue = this.permissionForm.value

      const dynamicEntries = formValue.dynamicEntries

      const stringifyDynamic = JSON.stringify(dynamicEntries)

      formValue.dynamicEntries = stringifyDynamic

      console.log("FORM VALUE ON UPDATE:", formValue)

      const body = {
        PK: this.client + '#' + 'permission#' + matchingRecord.P1 + '#main',
        SK: 1,
        metadata: JSON.stringify(formValue)
      };

      console.log("UPDATE FUNCTION BOADY:", body)

      this.api.UpdateMaster(body).then(async (res: any) => {

        console.log("UPDATED RESPONSE:", res)

        this.updateResponse = JSON.parse(res.metadata)

        console.log("AFTER JSON PARSE:", this.updateResponse)

        this.permissionItem = {
          P1: this.updateResponse.permissionID,
          P2: this.updateResponse.label,
          P3: [Math.ceil(((new Date()).getTime()) / 1000)],
        }

        await this.updatepermissionlookup(1, matchingRecord.P1, 'update', this.permissionItem)

        this.showAlert(successAlert);
        this.reloadEvent.emit(true);

      }).catch((error) => {
        console.log('UPDATE WORK ORDER ERROR:', error)
        errorAlert.text = this.extractText(error.error);
        this.showAlert(errorAlert);
        this.isLoading = false;
      })
      completeFn();

    }


    if (this.match == true) {
      updateFn();
    } else {
      createFn();
    }

  }


  ngAfterViewInit(): void {

  }

  async createLookuppermission(item: any, pageNumber: number, permissionIdPk: any) {
    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(permissionIdPk, pageNumber);

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
          PK: permissionIdPk,
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
          PK: permissionIdPk,
          options: JSON.stringify(newdata),
        };

        console.log(Look_data);

        const createResponse = await this.api.CreateMaster(Look_data);
        console.log(createResponse);
      } else {
        await this.createLookuppermission(item, pageNumber + 1, permissionIdPk);
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  }

  async fetchdreamboardlookup(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#dreamboard#lookup", sk);

      if (response && response.options) {
        // Check if response.listOfItems is a string
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data)
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                // Extract values from each element and push them to lookup_data_temp1
                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object
                this.dreamBoardIDs.push({ P1, P2, P3, P4 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =", this.dreamBoardIDs)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.dreamBoardIDs.sort((a: any, b: any) => {
              return b.P4 - a.P4; // Compare P5 values in descending order
            });
            console.log("Lookup sorting", this.dreamBoardIDs);
            // Continue fetching recursively
            await this.fetchdreamboardlookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.dreamBoardIDs = this.dreamBoardIDs.map((item: any) => item.P1)

        this.dreamBoardIDs.unshift("All");

        console.log("All the dreamboard id are here ", this.dreamBoardIDs);

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }
  async fetchFormgrouplookup(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#formgroup#lookup", sk);

      if (response && response.options) {
        // Check if response.listOfItems is a string
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data)
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                // Extract values from each element and push them to lookup_data_temp1
                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object
                this.formgroupIDs.push({ P1, P2, P3, P4 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =", this.formgroupIDs)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.formgroupIDs.sort((a: any, b: any) => {
              return b.P4 - a.P4; // Compare P5 values in descending order
            });
            console.log("Lookup sorting", this.formgroupIDs);
            // Continue fetching recursively
            await this.fetchFormgrouplookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.formgroupIDs = this.formgroupIDs.map((item: any) => item.P1)

        this.formgroupIDs.unshift("All");

        console.log("All the formgroup Id are here ", this.formgroupIDs);

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }

  async fetchpowerboardlookup(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#powerboard#lookup", sk);

      if (response && response.options) {
        // Check if response.listOfItems is a string
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data)
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                // Extract values from each element and push them to lookup_data_temp1
                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object
                this.powerboardId.push({ P1, P2, P3, P4 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =", this.powerboardId)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.powerboardId.sort((a: any, b: any) => {
              return b.P4 - a.P4; // Compare P5 values in descending order
            });
            console.log("Lookup sorting", this.powerboardId);
            // Continue fetching recursively
            await this.fetchpowerboardlookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.powerboardId = this.powerboardId.map((item: any) => item.P1)

        this.powerboardId.unshift("All");

        console.log("All the powerboard id are here ", this.powerboardId);

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }

  async fetchmagicboardlookup(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#magicboard#lookup", sk);

      if (response && response.options) {
        // Check if response.listOfItems is a string
        if (typeof response.options === 'string') {
          let data = JSON.parse(response.options);
          console.log("d1 =", data)
          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element !== null && element !== undefined) {
                // Extract values from each element and push them to lookup_data_temp1
                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object
                this.magicboardId.push({ P1, P2, P3, P4 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =", this.magicboardId)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.magicboardId.sort((a: any, b: any) => {
              return b.P4 - a.P4; // Compare P5 values in descending order
            });
            console.log("Lookup sorting", this.magicboardId);
            // Continue fetching recursively
            await this.fetchmagicboardlookup(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.magicboardId = this.magicboardId.map((item: any) => item.P1)

        this.magicboardId.unshift("All");
        

        console.log("All the magicboard id are here ", this.magicboardId);

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }

  async updatepermissionlookup(sk: any, id: any, type: any, item: any) {

    const tempClient = this.client + '#permission' + "#lookup";
    // console.log("Temp client is ", tempClient);
    // console.log("Type of client", typeof tempClient);
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
          await this.updatepermissionlookup(sk + 1, id, type, item); // Retry with next SK

        }
        this.reloadEvent.emit(true);
      } else { // If response or listOfItems is null
        console.log("LOOKUP ID NOT FOUND")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        // If the value is a string, add it to the 'textArray'
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        // If the value is an object, recursively call the function and concatenate the results
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    // Use a Set to remove duplicates and convert back to an array
    var uniqueTextArray = Array.from(new Set(textArray));

    // Convert the uniqueTextArray to a single string with line breaks
    var text = uniqueTextArray.join('\n');

    return text;
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
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }


  ngOnDestroy(): void {
    this.reloadEvent.unsubscribe();
  }


  checkUniqueUid(getUid: any) {
    this.error = '';
    const inputUid = getUid.target.value;

    // Iterate over each object in the uid array
    for (let uniqueID = 0; uniqueID < this.lookup_data_user.length; uniqueID++) {
      if (inputUid.trim() === this.lookup_data_user[uniqueID].P1) {
        this.error = "Permission ID already exists";
        break; // Exit loop if a match is found
      }
    }
  }

  async addFromService() {
    try {
      await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options)

          this.formList = helpherObj.map((item: any) => item[0])

          this.formList.unshift("All");
        }
      })
    }
    catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }

  }

  permissionLookupdata(sk: any): any {
    console.log("I am called Bro");

    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.client + "#permission" + "#lookup", sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);

              if (Array.isArray(data)) {
                const promises = []; // Array to hold promises for recursive calls
                this.lookup_data_user = []
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];

                  if (element !== null && element !== undefined) {
                    // Extract values from each element and push them to lookup_data_user
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3 } = element[key]; // Extract values from the nested object
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
                promises.push(this.permissionLookupdata(sk + 1)); // Store the promise for the recursive call

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


            this.listofSK = this.lookup_data_user.map((item: any) => item.P1);

            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }



}