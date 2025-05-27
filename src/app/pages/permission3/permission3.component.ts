import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable, using } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Config } from 'datatables.net';
import { AuditTrailService } from '../services/auditTrail.service';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicApiService } from '../dynamic-api.service';

type Tabs = 'Sidebar' | 'Header' | 'Toolbar' | 'User';
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
    allowSearchFilter: true,
  };

  dropdownSettings_: IDropdownSettings = {
    singleSelection: true,
    allowSearchFilter: true,
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
  disabled = false;


  permissionsList = [
    { name: 'Dashboard', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Project', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Dream Board', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Modules', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Summary Dashboard', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Report Studio', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Communication', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Notification Matrix', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Client', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Company', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'User Management', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Permission', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'MQTT', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Form Group', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Location Management', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    { name: 'Project Configuration', view: false, update: false, xlsxView: false, xlsxUpdate: false },
    // { name: 'Summary Engine', view: false, update: false, xlsxView: false, xlsxUpdate: false },

    // Add more permissions as needed
  ];
  dynamicFormError: string;
  permissionError: string;
  formgroupIDs: any[] = [];
  selectedFormGroups: any[] = [];
  dynamicform: any;
  formList_: any;
  formData: any;
  formfieldData: any;
  dynamic_field: any;
  cloneUserOperation: boolean = false;
  editOperation: boolean;
  userList: any[] = [];
  populateFormBuilder: any;
  conditionflag: boolean;
  selectedFilterOption: string = ''; // Default value
  formName: any;
  formfieldData_: any;
  dropdown: boolean;
  Items: any;
  allOptions: any[] = [];
  // extractedValues: any[];
  extractedValues: any[] = [];
  fieldUserList: any[];
  fieldList: any[];

  addItem: boolean = false
  loading: boolean = false;
  formSelect: any;
  summaryList: any[] = [];
  List: any[];
  userStorList: any[];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: APIService,
    private spinner: NgxSpinnerService,
    private auditTrail: AuditTrailService,
    private DynamicApi: DynamicApiService
  ) { }

  async ngOnInit(): Promise<void> {

    console.log("PERMISSION 3 ONINIT")

    this.initForm()

    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail)
    console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

    this.client = this.loginDetail_string.clientID
    this.users = this.loginDetail_string.username


    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.client)

    this.advance_report = [
      'Mail Permission',
      'All Report ID Access',
      'Value Filter'
    ];

    this.form_permission = [
      'All',
      'Create',
      'Read',
      'Update',
      'Delete',
      'Create draft',
      'Update draft',
      'Xlsx template download',
      'Xlsx data upload',
      'Xlsx data download',
      'Choose',
      'Download QR code',
      'None',

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
              <div class="d-flex flex-column" >
                <a href="javascript:;" data-action="view" class="text-gray-800 text-hover-primary mb-1 view-item" data-id="${full.id}">${data}</a>
              </div>
            `;

            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                <a href="javascript:; class="view-item">
                  ${symbolLabel}
                </a>
              </div>
              ${nameAndEmail}
            `;

            // return nameAndEmail
          }
        },
        {
          title: 'Label', data: 'P2' // Added a new column for phone numbers
        },
        {
          title: 'Updated', data: 'P3', render: function (data) {
            // const date = new Date(data * 1000);
            // // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
            // return `${date.toDateString()} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
            const date = new Date(data * 1000).toLocaleDateString() + " " + new Date(data * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            // const date = new Date(data * 1000);
            // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
            return date
          }
        }
      ],
      createdRow: (row, data: any, dataIndex) => {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
        $(row).find('.view-item').on('click', () => {
          console.log("Event triggered ");
          this.edit(data.P1)
        });
      },
    };


    console.log("DATATABLE:", this.datatableConfig)

    await this.fetchdreamboardlookup(1)

    await this.fetchpowerboardlookup(1)

    await this.fetchmagicboardlookup(1)

    await this.fetchFormgrouplookup(1)

    await this.fetchUserList(1)

    await this.fetchSummaryList(1)


    const UserDetails = {
      "User Name": this.users,
      "Action": "View",
      "Module Name": "Permission",
      "Form Name": "Permission",
      "Description": "Table is Viewed",
      "User Id": this.users,
      "Client Id": this.client,
      "created_time": Date.now(),
      "updated_time": Date.now()
    }

    this.auditTrail.mappingAuditTrailData(UserDetails, this.client)


  }

  onModuleSelect(option: any) {
    const selectedValues = this.permissionForm.get('summaryList')?.value;

    if (selectedValues.includes('All')) {
      this.permissionForm.get('summaryList')?.setValue(['All'])
    }

    if (selectedValues.includes('None')) {
      this.permissionForm.get('summaryList')?.setValue(['None'])
    }
  }

  onDreamboardSelect(option: any) {
    const selectedValues = this.permissionForm.get('dreamBoardIDs')?.value;

    if (selectedValues.includes('All')) {
      this.permissionForm.get('dreamBoardIDs')?.setValue(['All'])
    }
  }

  onUserSelect(option: any) {
    const selectedValues = this.permissionForm.get('userList')?.value;

    if (selectedValues.includes('All')) {
      this.permissionForm.get('userList')?.setValue(['All'])
    }

    if (selectedValues.includes('None')) {
      this.permissionForm.get('userList')?.setValue(['None'])
    }
  }



  async dynamicFormSelect(selectForm: any): Promise<void> {

    this.formfieldData = []

    // this.permissionForm.get('fieldValue')?.reset();
    console.log("SELECTION OF FORMS:", selectForm)

    this.formName = selectForm

    this.api.GetMaster(this.client + '#dynamic_form#' + selectForm + '#main', 1).then((formres: any) => {

      // console.log("FORMS MAIN TABLE:",(formres.metadata))

      this.formData = JSON.parse((JSON.parse(JSON.stringify(formres.metadata))))

      this.formfieldData = this.formData.formFields

      this.formfieldData_ = this.formData.formFields

      this.formfieldData = this.formfieldData.filter((field: any) => field.validation.lookup_table === true);

      // this.formfieldData_ = this.formfieldData.filter((field: any) => field.validation.lookup === true);

      this.formfieldData.unshift({
        "name": "",
        "options": [],  // Assuming no options required
        "columnWidth": 3,  // Assuming a default column width
        "label": "System.Username",
        "placeholder": "Enter System Username",  // Example placeholder
        "type": "text",  // Assuming it's a text input
        "validation": {
          "lookup": false,
          "formName_table": null,
          "font_size": null,
          "minLength": null,
          "font_style": null,
          "required": false,
          "alignment_heading": null,
          "hide": false,
          "field": null,
          "form": null,
          "lookup_table": false,
          "unique": false,
          "disabled": false,
          "user": false,
          "maxLength": null
        }
      });

      console.log("Filtered Form Fields Advance:", this.formfieldData);

      console.log("Filtered Form Fields Default:", this.formfieldData_);

      this.formfieldData_ = this.formData.formFields.filter((field: any) => field.label !== "Empty Placeholder");
      this.formfieldData_ = this.formData.formFields.filter((field: any) => field.type !== "heading");

      // console.log("FORMS AFTER STRINGIFY:", this.formfieldData);

    }).catch((error) => {

      console.log("ERRROR:", error)
    })

  }

  populateFilterEquation(): void {

    const errorAlertform: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: 'This option is already added.',
    };
    // Get the selected field value
    const selectedField = this.permissionForm.get('field')?.value;

    if (selectedField) {

      const currentValue = this.permissionForm.get('fieldValue')?.value || '';

      //   if (currentValue.includes(`\${${selectedField}}`)) {
      //     // this.permissionError = 'This field is already added.';
      //     this.showAlert(errorAlertform)
      // } else {
      // Append the new field value with a space separator
      const updatedValue = currentValue
        ? `${currentValue} \${${selectedField}}`
        : `\${${selectedField}}`;

      // Set the formatted value in the Filter Equation field
      this.permissionForm.patchValue({
        fieldValue: updatedValue
      });
      // }
    } else {
      // Optionally, show an error or notification if no field is selected
      // this.permissionError = 'Please select a Field Label first.';
    }
    this.permissionForm.patchValue({
      field: '',
    });
  }



  onSelectAllChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    this.permissionsArray.controls.forEach(control => {
      // Set both 'view' and 'update' checkboxes to match the "Select All" checkbox
      control.get('view')?.setValue(isChecked);
      control.get('update')?.setValue(isChecked);
    });
  }



  onFormGroupSelect(selectedItem: any): void {
    console.log("Selected Form Group:", selectedItem);

    this.selectedFormGroups.push(selectedItem); // Add selected item

    console.log("Current Selected Form Groups:", this.selectedFormGroups);

    if (selectedItem == 'All') {
      this.DynamicFormlist()
    }
    else {

      this.handleFormGroupSelection(selectedItem);
    }
  }

  async onFormGroupDeSelect(deselectedItem: any) {
    console.log("Deselected Form Group:", deselectedItem);

    // Remove deselected item from the array
    this.selectedFormGroups = this.selectedFormGroups.filter((item: any) => item !== deselectedItem);

    console.log("Current Selected Form Groups:", this.selectedFormGroups);


    // this.handleFormGroupsLength(this.selectedFormGroups);

    this.formList = []

    this.selectedFormGroups.forEach((item: any) => this.handleFormGroupSelection(item));

  }


  // Select at a time all value

  onSelectAll(selectedItems: any): void {
    console.log("All selected Form Groups:", selectedItems);

    if (selectedItems == 'All') {
      this.addFromService()
    }
    // Handle logic for when all items are selected
    selectedItems.forEach((item: any) => this.handleFormGroupSelection(item));

    // this.handleFormOnSelectAll(selectedItems)
  }

  handleFormGroupsLength(value: any) {
    if (value.inculdes("All")) {

      this.addFromService()
    }
    else {
      value.length

      console.log("VALUE LENGTH:", value.length)
    }
  }

  onDeSelectAll(deselectedItems: any): void {
    console.log("All deselected Form Groups:", deselectedItems);
    this.formList = []
    // Handle logic for when all items are deselected if needed
  }

  async DynamicFormlist() {
    try {
      await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options)

          this.formList = helpherObj.map((item: any) => item[0])

          console.log("FORMGORUP COMPONENT FETCH FORM LIST:", this.formList)

          this.formList.unshift("All");
        }
      })
    }
    catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }

  }

  async handleFormGroupSelection(value: any): Promise<void> {
    console.log("Handling selection for value:", value);

    this.formSelect = value.split('-')

    const dymanic_form_result = await this.api.GetMaster(this.client + '#formgroup#' + this.formSelect[0] + '#main', 1)

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
      time: ["",],
      filterOption: ['advance', Validators.required],
      no_of_request: ["",],
      no_of_records: ["",],
      size: ["",],
      setting: ["",],
      user_grade: ["",],
      api_enable: [false,],
      formgroup: [[], Validators.required],
      dreamBoardIDs: [[], Validators.required],
      advance_report: [[]],
      powerboardId: [[]],
      magicboardId: [[]],
      userList: [[]],
      summaryList: [[]],
      permissionsList: this.fb.array([], Validators.required),
      dynamicEntries: this.fb.array([]),
      conditions: this.fb.array([]),
      dynamicForm: [[]],
      field: [],
      fieldValue: [],
      operator: [],
      value: [],
      permission: [[]],
      createdTime: [Math.ceil(((new Date()).getTime()) / 1000)],
      updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
    });


    this.addPermissions();
    this.addCondition();
    this.selectedFilterOption = 'advance'
  }

  get conditions(): FormArray {
    return this.permissionForm.get('conditions') as FormArray;
  }

  addCondition() {


    if (this.addItem == false) {


      // const conditionGroup = this.fb.group({
      //   field: [''],
      //   operator: [''],
      //   value: [''],
      //   operatorBetween: [''],
      //   dropdown: [false],
      // });

      const conditionGroup = this.fb.group({
        // field: ['', Validators.required],
        // operator: ['', Validators.required],
        // value: ['', Validators.required],
        field: [''],
        operator: [''],
        value: [''],
        operatorBetween: [''],
        dropdown: [false],
      });

      this.conditions.push(conditionGroup);
    }

    console.log("ADD CONDITION:", this.conditions)

    this.updateFieldValue();
  }

  get isConditionsValid(): boolean {
    return this.conditions.valid;
  }

  updateFieldValue() {
    // Build the string from the conditions array
    const conditionStrings = this.conditions.controls.map((condition: any, index: number) => {
      const { field, operator, value, operatorBetween } = condition.value;

      if (!field || !operator || !value) {
        return '';
      }

      // Format current condition
      const conditionStr = `\${${field}} ${operator} "${value}"`;

      // Append operatorBetween only if not the last condition
      return index < this.conditions.length - 1 ? `${conditionStr} ${operatorBetween}` : conditionStr;
    });

    // Join all condition strings
    const finalFieldValue = conditionStrings.join(' ');

    console.log("Value", finalFieldValue)

    // Update the `fieldValue` form field
    this.permissionForm.patchValue({ fieldValue: finalFieldValue });
  }

  removeCondition(condIndex: number) {
    if (this.conditions.length > 0) {
      this.conditions.removeAt(condIndex);
    } else {
      alert('At least one condition must be present.');
    }
  }

  async onFormSelection(event: any, index: number) {

    console.log("EVENT:", event.target.value)

    const field = (event.target.value).split('.')


    console.log("FIELD:", field)

    console.log("SELECT OF FORM FIELD:", this.formfieldData_)

    const matchedField = this.formfieldData_.find((item: { label: any; }) => item.label === field[0]);

    const condition = this.conditions.at(index);


    console.log("MATCH FIELD:", matchedField)

    if (matchedField.validation.lookup === true && matchedField.type == 'select') {
      //  this.dropdown = true
      condition.get('dropdown')?.setValue(true);
      //  const fieldData = await this.api.GetMaster(this.client+'#'+matchedField.validation.form+'#lookup',1)

      this.fieldList = await this.fieldlookup(1, matchedField.validation.form)

      console.log("FIELD LIST:", this.fieldList)


      this.extractedValues[index] = this.fieldList
        .map((record) => {
          const match = record.find((item: string) => item.startsWith(matchedField.validation.field));
          return match ? match.split('#')[1] : null;
        })
        .filter((value) => value !== null);

      console.log("FIELD EXTRACT VALUE:", this.extractedValues[index]);
    }
    else if (matchedField.validation.user === true && matchedField.type == 'select') {

      condition.get('dropdown')?.setValue(true);

      this.fieldList = this.fieldUserList

      this.extractedValues[index] = this.fieldList

    }
    else if (matchedField.type == 'select' && matchedField.options.length > 0) {

      condition.get('dropdown')?.setValue(true);

      this.fieldList = matchedField.options

      this.extractedValues[index] = this.fieldList


    }
    else {
      this.dropdown = false
      this.fieldList = []

      condition.get('dropdown')?.setValue(false);
    }

  }


  async fieldlookup(sk: number, fieldform: string) {

    const response = await this.api.GetMaster(this.client + '#' + fieldform + "#lookup", sk);
    console.log("RESPONSE:", (JSON.parse(JSON.parse(JSON.stringify(response.options)))))

    this.Items = (JSON.parse(JSON.parse(JSON.stringify(response.options))))

    if (this.Items && this.Items.length > 0) {

      this.allOptions.push(...this.Items);


      if (this.Items.length === 500) {
        // Call the function recursively if 500 items are fetched
        await this.fieldlookup(sk + 1, fieldform);
      }

    }

    return this.allOptions

  }

  async onCloneUser() {
    this.cloneUserOperation = true

    this.permissionForm.get('permissionID')?.reset()

    this.update = false


    Swal.fire({
      toast: true,
      position: 'bottom',
      icon: 'success', // or another icon like 'info', 'error', etc.
      title: 'Permission Configuration Cloned Successfully',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

  }

  addDynamicData() {

    this.formName = ''


    this.permissionForm.markAsDirty();

    if (this.selectedFilterOption == 'default') {

      this.addItem = true
      this.addCondition()
    }
    // this.addbutton = false
    // Get the values from the form

    this.addItem = false
    const dynamicForm = this.permissionForm.get('dynamicForm')?.value;
    const permission = this.permissionForm.get('permission')?.value;
    const fieldValue = this.permissionForm.get('fieldValue')?.value;

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
    if (dynamicForm?.length > 0 && permission?.length > 0) {



      // Check for duplicate entries
      const isDuplicate = this.dynamicEntries.controls.some((entry: any) => {
        const existingDynamicForm = entry.get('dynamicForm')?.value;
        console.log("Comparing with: ", existingDynamicForm); // Log the existing dynamicForm values
        return existingDynamicForm[0] === dynamicForm[0];
      });

      if (isDuplicate) {
        // Show error message for duplicate entry

        this.showAlert(errorAlert_)
      } else {
        // Push a new group to the dynamic entries array if no duplicates
        this.dynamicEntries.push(this.fb.group({
          dynamicForm: [dynamicForm, Validators.required],
          permission: [permission, Validators.required],
          fieldValue: [fieldValue],
        }));

        console.log("ADD DYNAMIC DATA:", this.dynamicEntries);

        // Clear the input fields

      }
      this.permissionForm.get('dynamicForm')?.reset();
      this.permissionForm.get('permission')?.reset();
      this.permissionForm.get('fieldValue')?.reset();


      if (this.selectedFilterOption == 'default') {
        while (this.conditions.length > 0) {
          this.conditions.removeAt(0);
        }
      }


      this.formfieldData = []
    }
    else {

      this.formfieldData = []
      this.showAlert(errorAlert_1)
    }
  }

  removeDynamicData(index: number) {
    this.dynamicEntries.removeAt(index);
    this.permissionForm.markAsDirty();
  }

  async editEntry(index: number) {

    if (this.selectedFilterOption !== '') {
      const entry = this.dynamicEntries.at(index) as FormGroup;
      this.permissionForm.markAsDirty();
      // Set the values back into the form for editing
      if (entry) {
        console.log("ON CLICK ON EDIT:", entry)
        const dynamicFormValue = entry.get('dynamicForm')?.value;
        this.permissionForm.get('dynamicForm')?.setValue(entry.get('dynamicForm')?.value);
        this.permissionForm.get('permission')?.setValue(entry.get('permission')?.value);
        this.permissionForm.get('fieldValue')?.setValue(entry.get('fieldValue')?.value); // Set fieldValue

        await this.dynamicFormSelect(dynamicFormValue)


        if (this.selectedFilterOption == 'default') {

          this.spinner.show()

          setTimeout(async () => {
            console.log('This message is delayed by 2 seconds');

            while (this.conditions.length > 0) {
              this.conditions.removeAt(0);
            }
            const fieldValue = entry.get('fieldValue')?.value;
            if (fieldValue) {
              const conditionRegex = /\${(.*?)}\s*(==|!=|<=|>=|<|>)\s*"(.*?)"/g;
              let match;

              while ((match = conditionRegex.exec(fieldValue)) !== null) {
                const [_, field, operator, value] = match;
                const conditionGroup = this.fb.group({
                  field: [field.trim(), Validators.required],
                  operator: [operator.trim(), Validators.required],
                  value: [value.trim(), Validators.required],
                  operatorBetween: [''], // We'll handle AND/OR separately below
                  dropdown: [field.includes("single-select")], // Determine dropdown based on field format
                });
                this.conditions.push(conditionGroup);


                const fieldEvent = { target: { value: field.trim() } }; // Mock the field selection event
                await this.onFormSelection(fieldEvent, this.conditions.length - 1);
              }

              // Handle AND/OR operators between conditions
              const operatorBetweenRegex = /(&&|\|\|)/g;
              const operators = fieldValue.match(operatorBetweenRegex);
              if (operators) {
                this.conditions.controls.forEach((condition, index) => {
                  if (index < operators.length) {
                    condition.get('operatorBetween')?.setValue(operators[index]);
                  }
                });
              }
            }
          }, 2000);
          this.spinner.hide();
        }
      }

      // Optionally, you can remove the entry after loading it for editing
      this.dynamicEntries.removeAt(index);

    }
    else {
      const errorAlert_1: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: 'Please Select filter option.',
      };
      this.showAlert(errorAlert_1)


    }
  }

  parseConditions(fieldValue: string): any[] {
    const conditions: any[] = [];
    const conditionStrings = fieldValue.split('&&').map((str) => str.trim());

    conditionStrings.forEach((condition) => {
      const match = condition.match(/\${(.*?)}\s*(==|!=|>|<|>=|<=)\s*"(.*?)"/);
      if (match) {
        conditions.push({
          field: match[1],
          operator: match[2],
          value: match[3],
          dropdown: false, // Default value; adjust as needed
          operatorBetween: match[4], // Optional
        });
      }
    });

    return conditions;
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
    const permissionsFormArray = this.permissionForm.get('permissionsList') as FormArray;

    // First populate the FormArray
    this.permissionsList.forEach((permission: { name: any; view: any; update: any; }) => {
      permissionsFormArray.push(this.fb.group({
        name: [permission.name, Validators.required],
        view: [false], // Initialize as false or null
        update: [false],
      }));
    });

    console.log('permissionsFormArray :>> ', permissionsFormArray);

    // Now update the controls directly from data_temp
    permissionsFormArray.controls.forEach((control: any) => {
      const name = control.get('name')?.value;
      const obj = this.data_temp[0].permissionsList.find((element: any) => element.name === name);

      if (obj) {
        control.get('view')?.setValue(obj.view);
        control.get('update')?.setValue(obj.update);
      } else {
        control.get('view')?.setValue(false);
        control.get('update')?.setValue(false);
      }
    });
  }


  //   updatePermissions() {//legacy old code 
  //   // readback permissions to the FormArray dynamically
  //   const permissionsFormArray = this.permissionForm.get('permissionsList') as FormArray;

  //   this.data_temp[0].permissionsList.forEach((permission: { name: any; view: any; update: any; }) => {
  //     permissionsFormArray.push(this.fb.group({
  //       name: [permission.name, Validators.required],
  //       view: [permission.view],
  //       update: [permission.update],
  //     }));
  //   });
  // }

  populateDynamicEntries(dynamicEntriesData: any[]) {
    const dynamicEntriesArray = this.permissionForm.get('dynamicEntries') as FormArray;

    console.log("POPULATE DYNAMIC ENTRY:", dynamicEntriesArray)

    // Loop through each entry in dynamicEntriesData and add to the form array
    dynamicEntriesData.forEach(entry => {
      dynamicEntriesArray.push(this.fb.group({
        dynamicForm: [entry.dynamicForm, Validators.required],
        permission: [entry.permission, Validators.required],
        fieldValue: [entry.fieldValue],
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

      const UserDetails = {
        "User Name": this.users,
        "Action": "Deleted",
        "Module Name": "Permission",
        "Form Name": "Permission",
        "Description": `Record ${this.deleteResponse.permissionID} is Deleted`,
        "User Id": this.users,
        "Client Id": this.client,
        "created_time": Date.now(),
        "updated_time": Date.now()
      }

      this.auditTrail.mappingAuditTrailData(UserDetails, this.client)

    }).catch((error) => {
      console.log("DREAMBOARD DELLETE ID ERROR:", error)
    })
  }

  edit(P1: any) {

    this.initForm()
    this.formName = ''
    this.update = true
    // this.selectedFilterOption = ''
    console.log("EDIT ID:", P1)
    this.data_temp = []
    this.fieldList = []
    this.addItem = false

    this.addCondition()

    this.api.GetMaster(this.client + '#permission#' + P1 + '#main', 1).then((res: any) => {

      if (res && res !== undefined) {

        this.data_temp.push(JSON.parse(res.metadata));
        console.log("Permission data on edit", this.data_temp);


        this.onSelectAll(this.data_temp[0].formgroup)

        this.selectedFilterOption = this.data_temp[0]?.filterOption ?? 'advance'
        if (this.data_temp) {
          console.log('this.data_temp :>> ', this.data_temp);
          this.permissionForm = this.fb.group({
            permissionID: [this.data_temp[0].permissionID],
            label: [this.data_temp[0].label],
            description: [this.data_temp[0].description],
            time: [this.data_temp[0].time],
            no_of_request: [this.data_temp[0].no_of_records],
            no_of_records: [this.data_temp[0].no_of_request],
            size: [this.data_temp[0].size],
            setting: [this.data_temp[0].setting],
            filterOption: [this.data_temp[0]?.filterOption ?? 'advance'],
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
            conditions: this.fb.array([]),
            field: this.data_temp[0].field,
            userList: [this.data_temp[0].userList],
            summaryList: [this.data_temp[0].summaryList],
            fieldValue: this.data_temp[0].fieldValue,
            createdTime: [this.data_temp[0].createdTime],
            updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
          });

          // alert(this.permissionForm.invalid)
          this.updatePermissions();

          this.populateDynamicEntries(JSON.parse(this.data_temp[0].dynamicEntries))

          const UserDetails = {
            "User Name": this.users,
            "Action": "View",
            "Module Name": "Permission",
            "Form Name": "Permission",
            "Description": `Record ${this.deleteResponse.permissionID} is Viewed`,
            "User Id": this.users,
            "Client Id": this.client,
            "created_time": Date.now(),
            "updated_time": Date.now()
          }

          this.auditTrail.mappingAuditTrailData(UserDetails, this.client)
        }

        // this.selectedFilterOption = this.data_temp[0]?.filterOption ?? 'advance'

      }

    }).catch((error) => {

      console.log('Get MAIN TABLE DATA ERROR:', error)
    })

  }

  create() {         // click on create new 
    this.update = false
    this.selectedFilterOption = ''
    this.error = '';
    this.formList = []   // Model heading and button text change flag
    this.formfieldData = []
    this.formName = ''
    this.initForm()
  }

  onSubmit(event: Event) {

    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched(); // trigger validation messages

      Swal.fire({
        icon: 'warning',
        title: 'Permission Configuration is incomplete',
        text: 'Please fill all required fields before submitting.',
        confirmButtonColor: '#fc1900'
      });

      return;
    }


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


        const UserDetails = {
          "User Name": this.users,
          "Action": "Created",
          "Module Name": "Permission",
          "Form Name": "Permission",
          "Description": `Record ${this.permissionForm.value.permissionID} is Created`,
          "User Id": this.users,
          "Client Id": this.client,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }

        this.auditTrail.mappingAuditTrailData(UserDetails, this.client)

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

      const errorAlert_1: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: 'Please Click on Add button',
      };


      const dynamicForm = this.permissionForm.get('dynamicForm')?.value;
      const permission = this.permissionForm.get('permission')?.value;
      const fieldValue = this.permissionForm.get('fieldValue')?.value;

      if (dynamicForm?.length > 0 || permission?.length > 0 || fieldValue?.length > 0) {

        this.showAlert(errorAlert_1)

        return;

      }

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
          P3: Math.ceil(((new Date()).getTime()) / 1000),
        }

        await this.updatepermissionlookup(1, matchingRecord.P1, 'update', this.permissionItem)

        this.showAlert(successAlert);
        this.reloadEvent.emit(true);
        const UserDetails = {
          "User Name": this.users,
          "Action": "Edited",
          "Module Name": "Permission",
          "Form Name": "Permission",
          "Description": `Record ${this.updateResponse.permissionID} is Edited`,
          "User Id": this.users,
          "Client Id": this.client,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }

        this.auditTrail.mappingAuditTrailData(UserDetails, this.client)

        const Cognitobody = {
          "type": "cognitoServices",
          "event": {
            "path": "/timeoutPermissionSession",
            "queryStringParameters": {
              "permissionID": this.updateResponse.permissionID,
              "clientID": this.client
            }
          }
        }


        try {
          const response = await this.DynamicApi.getData(Cognitobody);
          console.log("Cognito Revoke successfull  ", JSON.parse(response.body));

        } catch (error) {
          console.error('Error calling dynamic lambda:', error);
        }


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

  onFilterChange(event: Event, type: string): void {


    const target = event.target as HTMLInputElement;
    this.selectedFilterOption = target.value;
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


        // this.formgroupIDs = this.formgroupIDs.map((item: any) => item.P1)

        this.formgroupIDs = this.formgroupIDs.map((item: any) => {
          // Check if item[1] is not empty and concatenate with item[0]
          return `${item.P1}-${item.P2}`
        });

        this.formgroupIDs.unshift("All");

        console.log("All the formgroup Id are here ", this.formgroupIDs);

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }

  async fetchUserList(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#user#lookup", sk);

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
                const { P1, P2, P3, P4, P5, P6, P7 } = element[key]; // Extract values from the nested object
                this.userList.push({ P1, P2, P3, P4, P5, P6, P7 }); // Push an array containing P1, P2, and P3 values
                console.log("d2 =", this.userList)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.userList.sort((a: any, b: any) => {
              return b.P4 - a.P4; // Compare P5 values in descending order
            });
            console.log("Lookup sorting", this.userList);
            // Continue fetching recursively
            await this.fetchUserList(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.userList = this.userList.map((item: any) => item.P1)

        this.fieldUserList = this.userList

        const element_remove = ['Logged-in User', 'All', 'None']

        this.fieldUserList = this.fieldUserList.filter(item => !element_remove.includes(item));

        this.userList.unshift("Logged-in User")


        this.userList.unshift("All");

        this.userList.unshift("None");

        console.log("All the formgroup Id are here ", this.userList);

        this.userStorList = this.userList

      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error as needed
    }
  }

  async fetchSummaryList(sk: any) {
    try {
      const response = await this.api.GetMaster(this.client + "#summary#lookup", sk);

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
                const { P1, P2, P3, P4, P5, P6, P7 } = element[key]; // Extract values from the nested object
                this.summaryList.push({ P1, P2, P3, P4, P5, P6, P7 }); // Push an array containing P1, P2, and P3 values
                // console.log("d2 =", this.summaryList)
              } else {
                break;
              }
            }
            //this.lookup_data_temp1.sort((a, b) => b.P5 - a.P5);
            this.summaryList.sort((a: any, b: any) => {
              return b.P5 - a.P5; // Compare P5 values in descending order
            });
            // console.log("Lookup sorting", this.summaryList);
            // Continue fetching recursively
            await this.fetchSummaryList(sk + 1);
          } else {
            console.error('Invalid data format - not an array.');
          }
        } else {
          console.error('response.listOfItems is not a string.');
        }
      } else {


        this.summaryList = this.summaryList.map((item: any) => item.P1)

        // this.fieldUserList = this.userList

        // const element_remove = ['Logged-in User', 'All', 'None']

        // this.fieldUserList = this.fieldUserList.filter(item => !element_remove.includes(item));

        // this.userList.unshift("Logged-in User")


        this.summaryList.unshift("All");

        this.summaryList.unshift("None");

        console.log("All the formgroup Id are here ", this.summaryList);

        this.List = this.summaryList

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