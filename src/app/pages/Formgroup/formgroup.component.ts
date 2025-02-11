import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import { SweetAlertOptions } from 'sweetalert2';
import { Tooltip } from 'bootstrap';
// import moment from 'moment';
// import { IRoleModel, RoleService } from 'src/app/_fake/services/role.service';
import { Config } from 'datatables.net';
import { AuditTrailService } from '../services/auditTrail.service';
import {
  Validators,
  UntypedFormGroup,
  FormBuilder,
} from "@angular/forms";
import { APIService } from 'src/app/API.service';
import { ApiCallService } from 'src/app/_fake/services/api-call.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { computeStyles } from '@popperjs/core';

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
  selector: 'app-formgroup',
  templateUrl: './formgroup.component.html',
  styleUrls: ['./formgroup.component.scss'],
})
export class FormgroupComponent implements OnInit, AfterViewInit, OnDestroy {

  isCollapsed1 = false;
  isCollapsed2 = true;

  isLoading = false;

  users: DataTablesResponse;

  datatableConfig: Config = {};

  formgroupForm: UntypedFormGroup

  dropdownSettings: IDropdownSettings = {
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  roles$: Observable<DataTablesResponse>;

  maxlength: number = 1000;

  lookup_data_user: any = [];
  userModel: { P1: string; P2: string; P3: string; P4: string; };
  data_temp: any = [];
  match: boolean;

  login_detail: any;
  loginDetail_string: any;
  client: any;
  update: boolean = false;
  error: string;
  formList: any[] = [];
  formgroupItem: any;
  updateResponse: any;
  deleteResponse: any;
  selectedImage: string | ArrayBuffer | null = null;
  url: any;
  uploadnew: boolean=false;
  previewObjDisplay:any=null;
  selectedType: string;

  constructor(
    // private apiService: UserService, 
    // private roleService: RoleService, 
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: APIService,
    private auditTrail: AuditTrailService
  ) { }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);  // Initialize each tooltip
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];  // Get the selected file
    const maxSizeInKB = 100;  // Maximum allowed size in KB
    const maxSizeInBytes = maxSizeInKB * 1024;  // Convert to bytes
    const errorAlert_icon: SweetAlertOptions = {
      icon: 'error',
      title: 'File size should be 100 KB. Please upload a smaller file.',
      text: '',
    };
    if (file) {
      if (file.size > maxSizeInBytes) {  // Check if file size exceeds the limit
        this.showAlert(errorAlert_icon)

        return;  // Stop further execution
      }

      const reader = new FileReader();  // Create a new FileReader
      reader.onload = () => {
        this.selectedImage = reader.result as string;  // Store the base64-encoded image

        const base64Content = this.selectedImage.split(',')[1];

        console.log("IMAGESELECTEDVALUE:", this.selectedImage);

        if (this.update == true) {

          this.uploadnew = true

          var formData_ = {
            "bucket_name": "dreamboard-dynamic",
            "bucket_region": "ap-south-1",
            "operation_type": "delete",
            "key": this.data_temp[0].selectedImage,
          }
          fetch('https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket', { // Replace with your server endpoint
            method: 'POST',
            body: JSON.stringify(formData_)
          })
            .then(response => response.json())
            .then(data => {

              console.log(data)

            })
            .catch(error => {

              console.error('Error:', error)


            });
        }

        var formData = {
          "bucket_name": "dreamboard-dynamic",
          "bucket_region": "ap-south-1",
          "operation_type": "store_base64",//"operation_type" :  "store",
          "key": 'public/' + this.client + '/fileuploads/formgroup/' + this.formgroupForm.value.formgroupId + '/' + file.name,
          "data": base64Content,//"data": file,
          "contentType": file.type
        }

        console.log('Request FORMDATA:', formData)

        this.formgroupForm.value.selectedImage = 'public/' + this.client + '/fileuploads/formgroup/' + this.formgroupForm.value.formgroupId + '/' + file.name,
          //  showLoadingSpinnerm();
          fetch('https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket', { // Replace with your server endpoint
            method: 'POST',
            body: JSON.stringify(formData)
          })
            .then(response => response.json())
            .then(data => {

              console.log(data)
              // hideLoadingSpinnerm();
              //Swal.fire({icon: 'success', title: 'Success', text: 'File Uploaded.'});


            })
            .catch(error => {
              // hideLoadingSpinnerm();
              console.error('Error:', error)


            });


      };
      reader.readAsDataURL(file);  // Convert the file to base64 data URL
    }
  }


  // Method to cancel and remove the image preview
  cancelImage() {
    this.selectedImage = null;  // Clear the image preview
  }

  iconsList:any = [
    { value: 'toggle-on', label: 'Toggle On', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'toggle-on-circle', label: 'Toggle On Circle', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'toggle-off', label: 'Toggle Off', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
      { value: 'category', label: 'Category', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'setting', label: 'Setting', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'toggle-off-circle', label: 'Toggle Off Circle', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'more-2', label: 'More 2', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
      { value: 'setting-4', label: 'Setting 4', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'setting-2', label: 'Setting 2', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
      { value: 'setting-3', label: 'Setting 3', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'eraser', label: 'Eraser', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'paintbucket', label: 'Paintbucket', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'add-item', label: 'Add Item', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'design-2', label: 'Design 2', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
      { value: 'brush', label: 'Brush', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'size', label: 'Size', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
      { value: 'design', label: 'Design', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'copy', label: 'Copy', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'text', label: 'Text', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'design-frame', label: 'Design Frame', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
      { value: 'bucket', label: 'Bucket', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'glass', label: 'Glass', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
      { value: 'feather', label: 'Feather', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'pencil', label: 'Pencil', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'colors-square', label: 'Colors Square', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'design-mask', label: 'Design Mask', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'bucket-square', label: 'Bucket Square', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
      { value: 'copy-success', label: 'Copy Success', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'color-swatch', label: 'Color Swatch', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'instagram', label: 'Instagram', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'snapchat', label: 'Snapchat', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
      { value: 'classmates', label: 'Classmates', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'facebook', label: 'Facebook', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'whatsapp', label: 'WhatsApp', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
      { value: 'social-media', label: 'Social Media', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
      { value: 'youtube', label: 'YouTube', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
      { value: 'dribbble', label: 'Dribbble', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
      { value: 'twitter', label: 'Twitter', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
      { value: 'tiktok', label: 'TikTok', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" }
    // { value: 'abstract-33', label: 'Abstract 33', class1: "fs-2x text-danger", class2:"symbol-label bg-light-danger"},
    // { value: 'abstract-27', label: 'Abstract 27', class1: "fs-2x text-success" ,class2:"symbol-label bg-light-success" },
    // { value: 'abstract-25', label: 'Abstract 25', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-19', label: 'Abstract 19', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-21', label: 'Abstract 21', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract-35', label: 'Abstract 35', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    //   { value: 'abstract-34', label: 'Abstract 34', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    //   { value: 'abstract-20', label: 'Abstract 20', class1: "fs-2x text-muted", class2: "symbol-label bg-light-muted" },
    //   { value: 'abstract-36', label: 'Abstract 36', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-22', label: 'Abstract 22', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    //   { value: 'abstract-23', label: 'Abstract 23', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    //   { value: 'abstract-37', label: 'Abstract 37', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-44', label: 'Abstract 44', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract', label: 'Abstract', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    //   { value: 'abstract-45', label: 'Abstract 45', class1: "fs-2x text-dark", class2: "symbol-label bg-light-dark" },
    //   { value: 'abstract-47', label: 'Abstract 47', class1: "fs-2x text-muted", class2: "symbol-label bg-light-muted" },
    //   { value: 'abstract-46', label: 'Abstract 46', class1: "fs-2x text-danger", class2: "symbol-label bg-light-danger" },
    //   { value: 'abstract-42', label: 'Abstract 42', class1: "fs-2x text-info", class2: "symbol-label bg-light-info" },
    //   { value: 'abstract-43', label: 'Abstract 43', class1: "fs-2x text-warning", class2: "symbol-label bg-light-warning" },
    //   { value: 'abstract-41', label: 'Abstract 41', class1: "fs-2x text-success", class2: "symbol-label bg-light-success" },
    //   { value: 'abstract-40', label: 'Abstract 40', class1: "fs-2x text-primary", class2: "symbol-label bg-light-primary" },
    //   { value: 'abstract-27', label: 'Abstract 27', class1: "fs-2x text-secondary", class2: "symbol-label bg-light-secondary" },
    // { value: 'abstract-26', label: 'Abstract 26', class: `ki-duotone ki-abstract-26 ${this.getRandomColor()}` },
    // { value: 'abstract-32', label: 'Abstract 32', class: `ki-duotone ki-abstract-32 ${this.getRandomColor()}` },
    // { value: 'abstract-18', label: 'Abstract 18', class: `ki-duotone ki-abstract-18 ${this.getRandomColor()}` },
    // { value: 'abstract-24', label: 'Abstract 24', class: `ki-duotone ki-abstract-24 ${this.getRandomColor()}` },
    // { value: 'abstract-30', label: 'Abstract 30', class: `ki-duotone ki-abstract-30 ${this.getRandomColor()}` },
    // { value: 'abstract-8', label: 'Abstract 8', class: `ki-duotone ki-abstract-8 ${this.getRandomColor()}` },
    // Add more icons as needed...
  ];


  initForm() {
    this.formgroupForm = this.fb.group({
      formgroupId: ['', Validators.required],
      label: ['', Validators.required],
      description: ['', Validators.required],
      formList: [[], Validators.required],
      createdUser: [' '],
      updatedUser: [' '],
      filterOption: [''],
      selectedImage: [''],
      iconSelect:['',Validators.required],
      iconObject:[''],
      createdTime: [Math.ceil(((new Date()).getTime()) / 1000)],
      updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
    });
  }

  previewIcon(event: any) {
    // Find the icon based on the selected value
    const selectedIcon = this.iconsList.find((packet: any) => {
        return packet.value === this.formgroupForm.get('iconSelect')?.value;
    });
  
    // Perform a deep copy if selectedIcon is found
    if (selectedIcon) {
        this.previewObjDisplay = JSON.parse(JSON.stringify(selectedIcon)); // Deep copy
        console.log(" this.previewObjDisplay ", this.previewObjDisplay);
    } else {
        console.warn("No matching icon found.");
    }
    this.cdr.detectChanges()
  }

  async ngOnInit(): Promise<void> {

    this.initForm()
    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail)
    console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

    this.client = this.loginDetail_string.clientID
    this.users = this.loginDetail_string.username

    this.datatableConfig = {}
    this.lookup_data_user = []
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.formgroupLookupData(1)
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
            // callback({
            //   draw: dataTablesParameters.draw, // Echo the draw parameter
            //   recordsTotal: responseData.length, // Total number of records
            //   recordsFiltered: responseData.length, // Filtered records (you may want to adjust this)
            //   data: responseData // The actual data array
            // });

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
          title: 'Form Group ID',
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
          title: 'Label', data: 'P2',
        },
        {
          title: 'Desscription', data: 'P3',
        },
        {
          title: 'Updated Time', data: 'P7', render: function (data) {
            // const date = new Date(data * 1000);
            // // return `${date.toDateString()} ${date.toLocaleTimeString()}`;
            // return `${date.toDateString()} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
            // //   return moment(data).format('DD MMM YYYY, hh:mm a');;

            const date = new Date(data * 1000).toLocaleDateString() + " " + new Date(data * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            // const date = new Date(data * 1000);
            // return `${date.toDateString()} ${date.toLocaleTimeString()}`; // Format the date and time
            return date
          }
        }
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };


    console.log("DATATABLE:", this.datatableConfig)

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.client)
    //   this.roles$ = this.roleService.getRoles();

    // await this.addFromService()

    // await this.addCalenderService()
  }

  delete(P1: any) {
    console.log("DELETE ID:", P1)

    const body = {
      PK: this.client + '#' + 'formgroup#' + P1 + '#main',
      SK: 1,
    };

    this.api.DeleteMaster(body).then(async (res: any) => {

      console.log("DELETE DREAMBOARD RESPONSE:", res)

      this.deleteResponse = JSON.parse(res.metadata)

      console.log("AFTER JSON PARSE:", this.deleteResponse)


      // var formData_ = {
      //   "bucket_name": "dreamboard-dynamic",
      //   "bucket_region": "ap-south-1",
      //   "operation_type": "delete",
      //   "key": this.deleteResponse.selectedImage,
      // }
      // fetch('https://3luwbeeuk0.execute-api.ap-south-1.amazonaws.com/s1/s3Bucket', { // Replace with your server endpoint
      //   method: 'POST',
      //   body: JSON.stringify(formData_)
      // })
      //   .then(response => response.json())
      //   .then(data => {

      //     console.log(data)

      //   })
      //   .catch(error => {

      //     console.error('Error:', error)


      //   });

      this.formgroupItem = {
        P1: this.deleteResponse.formgroupId,
        P2: this.deleteResponse.label,
        P3: this.deleteResponse.description,
        P4: this.deleteResponse.selectedImage,
        P5: this.deleteResponse.createdUser,
        P6: this.deleteResponse.updatedUser,
        P7: this.deleteResponse.updatedTime
      };

      //    await this.createLookupdreamboard(this.dreamboardItem, 1, 'Test#dreamboard#lookup');

      await this.updatedreamboardlookup(1, P1, 'delete', this.formgroupItem)

      //    this.reloadEvent.emit(true);

    }).catch((error) => {
      console.log("DREAMBOARD DELLETE ID ERROR:", error)
    })

    const UserDetails = {
      "User Name": this.users,
      "Action": "Deleted",
      "Module Name": "FormGroup",
      "Form Name": "FormGroup",
      "Description": "Record is Deleted",
      "User Id": this.users,
      "Client Id": this.client,
      "created_time": Date.now(),
      "updated_time": Date.now()
    }

    this.auditTrail.mappingAuditTrailData(UserDetails,this.client)


  }

  edit(P1: any) {
    this.update = true
     this.error=''
    this.previewObjDisplay = '';
    console.log("EDIT ID:", P1)
    this.data_temp = []

    this.api.GetMaster(this.client + '#formgroup#' + P1 + '#main', 1).then((res: any) => {

      if (res && res !== undefined) {

        this.data_temp.push(JSON.parse(res.metadata));
        console.log("Permission data on edit", this.data_temp);

        if (this.data_temp) {

          this.previewObjDisplay = this.data_temp[0].iconObject

          this.formgroupForm = this.fb.group({
            formgroupId: [this.data_temp[0].formgroupId],
            label: [this.data_temp[0].label],
            description: [this.data_temp[0].description],
            formList: [this.data_temp[0].formList],
            selectedImage: [this.selectedImage],
            iconSelect:[this.data_temp[0].iconSelect],
            iconObject:[this.data_temp[0].iconObject],
            createdUser: [this.data_temp[0].createdUser],
            updatedUser: [this.data_temp[0].updatedUser],
            createdTime: [this.data_temp[0].createdTime],
            filterOption:[this.data_temp[0].filterOption],
            updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
          });

          this.onTypeChange(this.data_temp[0].filterOption)
        }

      }

    }).catch((error) => {

      console.log('Get MAIN TABLE DATA ERROR:', error)
    })


  }

  create() {         // click on create new 
    this.update = false
    this.error=''
    this.selectedImage = null;  
    this.previewObjDisplay = '';  
    this.selectedType =''     // Model heading and button text change flag
    this.initForm()
  }

  onSubmit(event: Event) {

    console.log("On CLICK OF Form Submit Event:", event)

    const formgroupId = this.formgroupForm.value.formgroupId;

    const matchingRecord = this.lookup_data_user.find((record: { P1: any; }) => record.P1 === formgroupId);

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
      text: this.match ? 'FormGroup updated successfully!' : 'FormGroup created successfully!',
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

       this.error = ''

      if (!this.formgroupForm.valid) {
        console.log('Form is not valid:', this.formgroupForm.errors);
        return;
      }
      this.isLoading = true;

      const formValue = this.formgroupForm.value;

      this.formgroupForm.value.iconObject = this.previewObjDisplay

      console.log("CREATE FORMGROUP:",formValue)

      this.formgroupForm.value.createdUser = this.users

      // if(this.selectedImage){
      //   this.formgroupForm.value.selectedImage = this.selectedImage
      // }

      const body = {
        PK: this.client + '#' + 'formgroup#' + this.formgroupForm.value.formgroupId + '#main',
        SK: 1,
        metadata: JSON.stringify(formValue)
      };


      console.log('Form Submitted:', formValue);
      console.log("Body:", body);

      try {
        const res = await this.api.CreateMaster(body);
        console.log("ADD RESPONSE:", res);

        // Build dreamboard item for further operations
        this.formgroupItem = {
          P1: this.formgroupForm.value.formgroupId,
          P2: this.formgroupForm.value.label,
          P3: this.formgroupForm.value.description,
          P4: JSON.stringify(this.formgroupForm.value.iconObject),
          P5: this.formgroupForm.value.createdUser,
          P6: this.formgroupForm.value.updatedUser,
          P7: this.formgroupForm.value.updatedTime,
          P8: this.selectedType
        };

        console.log("LOOK UP DREAMBOARD DATA:", this.formgroupItem);
        await this.createLookupdreamboard(this.formgroupItem, 1, this.client + '#formgroup#lookup');
        this.showAlert(successAlert);
        this.reloadEvent.emit(true);

        const UserDetails = {
          "User Name": this.users,
          "Action": "Added",
          "Module Name": "FormGroup",
          "Form Name": "FormGroup",
          "Description": "Record is Added",
          "User Id": this.users,
          "Client Id": this.client,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }
  
        this.auditTrail.mappingAuditTrailData(UserDetails,this.client)
  

      } catch (error) {
        console.error("Dreamboard add request error:", error);
        errorAlert.text = this.extractText(error);
        this.showAlert(errorAlert);
      } finally {
        // this.isLoading = false;
        completeFn();
      }

    };

    const updateFn = () => {

      const formValue = this.formgroupForm.value

      this.formgroupForm.value.iconObject = this.previewObjDisplay

      console.log("FORM USER:",formValue)

      if(this.uploadnew == false){

      this.formgroupForm.value.selectedImage = this.data_temp[0].selectedImage
      
      }

      this.formgroupForm.value.updatedUser = this.users

      const body = {
        PK: this.client + '#' + 'formgroup#' + matchingRecord.P1 + '#main',
        SK: 1,
        metadata: JSON.stringify(formValue)
      };

      this.api.UpdateMaster(body).then(async (res: any) => {

        console.log("UPDATED RESPONSE:", res)

        this.updateResponse = JSON.parse(res.metadata)

        console.log("AFTER JSON PARSE:", this.updateResponse)

        this.formgroupItem = {
          P1: this.updateResponse.formgroupId,
          P2: this.updateResponse.label,
          P3: this.updateResponse.description,
          // P4: this.formgroupForm.value.selectedImage,
          P4: JSON.stringify(this.updateResponse.iconObject),
          P5: this.updateResponse.createdUser,
          P6: this.updateResponse.updatedUser,
          // P7: this.updateResponse.updatedTime,
          P7: Math.ceil(((new Date()).getTime()) / 1000),
          P8: this.selectedType

        };

        await this.updatedreamboardlookup(1, matchingRecord.P1, 'update', this.formgroupItem)

        this.showAlert(successAlert);
        this.reloadEvent.emit(true);

        const UserDetails = {
          "User Name": this.users,
          "Action": "Edited",
          "Module Name": "FormGroup",
          "Form Name": "FormGroup",
          "Description": "Record is Edited",
          "User Id": this.users,
          "Client Id": this.client,
          "created_time": Date.now(),
          "updated_time": Date.now()
        }
  
        this.auditTrail.mappingAuditTrailData(UserDetails,this.client)
  

      }).catch((error) => {
        console.log('UPDATE WORK ORDER ERROR:', error)
        errorAlert.text = this.extractText(error.error);
        this.showAlert(errorAlert);
        this.isLoading = false;
      })
      completeFn();

    };

    if (this.match == true) {
      updateFn();
      this.error = ''
    } else {
      createFn();
       this.error = ''
    }
  }


  // create dreamboard lookup table


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


  formgroupLookupData(sk: number) {
    console.log("Page Number:", sk)

    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.client + '#' + 'formgroup#lookup', sk)
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
                    const { P1, P2, P3, P4, P5, P6, P7 ,P8} = element[key]; // Extract values from the nested object
                    this.lookup_data_user.push({ P1, P2, P3, P4, P5, P6, P7,P8 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    console.log("d2 =", this.lookup_data_user);
                  } else {
                    break;
                  }
                }

                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_data_user.sort((a: { P7: number; }, b: { P7: number; }) => b.P7 - a.P7);
                console.log("Lookup sorting", this.lookup_data_user);

                // Continue fetching recursively
                promises.push(this.formgroupLookupData(sk + 1)); // Store the promise for the recursive call

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

            //   console.log("All the users are here", this.lookup_data_user);
            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }

  async updatedreamboardlookup(sk: any, id: any, type: any, item: any) {

    const tempClient = this.client + '#formgroup' + "#lookup";
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
          await this.updatedreamboardlookup(sk + 1, id, type, item); // Retry with next SK

        }
        this.reloadEvent.emit(true);
      } else { // If response or listOfItems is null
        console.log("LOOKUP ID NOT FOUND")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  checkUniqueUid(getUid: any) {
    this.error = '';
    const inputUid = getUid.target.value;

    // Iterate over each object in the uid array
    for (let uniqueID = 0; uniqueID < this.lookup_data_user.length; uniqueID++) {
      if (inputUid === this.lookup_data_user[uniqueID].P1) {
        this.error = "Formgroup ID already exists";
        break; // Exit loop if a match is found
      }
    }
  }

  async addFromService() {
    try {
      await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options)


          console.log("HELPER OBJECT:", helpherObj)

          this.formList = helpherObj.map((item: any) => item[0])

          // this.formList = helpherObj.map((item: any) => {
          //   // Check if item[1] is not empty and concatenate with item[0]
          //   return item[1] ? `${item[0]}-${item[1]}` : item[0];
          // });


          console.log("FORMGORUP COMPONENT FETCH FORM LIST:", this.formList)
        }
      })
    }
    catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }

  }
  async addCalendarService() {
    try {
      await this.api.GetMaster(this.client + "#systemCalendarQuery#lookup", 1).then((result: any) => {
        if (result) {
          const helpherObj = JSON.parse(result.options)


          console.log("HELPER OBJECT:", helpherObj)

          this.formList = helpherObj.map((item: any) => item[0])

          // this.formList = helpherObj.map((item: any) => {
          //   // Check if item[1] is not empty and concatenate with item[0]
          //   return item[1] ? `${item[0]}-${item[1]}` : item[0];
          // });


          console.log("FORMGORUP COMPONENT FETCH FORM LIST:", this.formList)
        }
      })
    }
    catch (err) {
      console.log("Error fetching the dynamic form data ", err);
    }

  }

  // async onTypeChange(event: Event): Promise<void> {
  //   const target = event.target as HTMLInputElement;
  //   this.selectedType = target.value; // Update the selected type

  //   if(this.selectedType == 'form'){
  //     this.formList =[]
  //     await this.addFromService()
  //   }
  //   if(this.selectedType == 'Calendar'){
  //     this.formList =[]
  //     await this.addCalendarService()
  //   }
  // }

  async onTypeChange(eventOrType: Event | string): Promise<void> {
    let selectedType: string;
  
    if (typeof eventOrType === 'string') {
      // If the input is a string, use it directly
      selectedType = eventOrType;
    } else {
      // Otherwise, extract the value from the event
      const target = eventOrType.target as HTMLInputElement;
      selectedType = target.value;
    }
  
    this.selectedType = selectedType; // Update the selected type
  
    if (this.selectedType === 'form') {
      this.formList = [];
      await this.addFromService();
    }
  
    if (this.selectedType === 'Calendar') {
      this.formList = [];
      await this.addCalendarService();
    }
  }
  


  async createLookupdreamboard(item: any, pageNumber: number, dreamboardIdPk: any) {
    try {
      console.log("iam a calleddd dude", item, pageNumber);
      const response = await this.api.GetMaster(dreamboardIdPk, pageNumber);

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
          PK: dreamboardIdPk,
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
          PK: dreamboardIdPk,
          options: JSON.stringify(newdata),
        };

        console.log(Look_data);

        const createResponse = await this.api.CreateMaster(Look_data);
        console.log(createResponse);
      } else {
        await this.createLookupdreamboard(item, pageNumber + 1, dreamboardIdPk);
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  }


}
