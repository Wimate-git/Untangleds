import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import { SweetAlertOptions } from 'sweetalert2';
import { Tooltip } from 'bootstrap';

// import moment from 'moment';
// import { IRoleModel, RoleService } from 'src/app/_fake/services/role.service';
import { Config } from 'datatables.net';
import {
    Validators,
    UntypedFormGroup,
    FormBuilder,
  } from "@angular/forms";
 import { APIService } from 'src/app/API.service'; 
 import { ApiCallService } from 'src/app/_fake/services/api-call.service';
import { valHooks } from 'jquery';

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
  selector: 'app-dreamboard',
  templateUrl: './dreamboard.component.html',
  styleUrls: ['./dreamboard.component.scss'],
})
export class DreamboardComponent implements OnInit, AfterViewInit, OnDestroy {

    isCollapsed1 = false;
    isCollapsed2 = true;
  
    isLoading = false;
  
    users: DataTablesResponse;
  
    datatableConfig: Config = {};

    dreamboardForm :UntypedFormGroup
  
    // Reload emitter inside datatable
    reloadEvent: EventEmitter<boolean> = new EventEmitter();
  
    @ViewChild('noticeSwal')
    noticeSwal!: SwalComponent;
  
    swalOptions: SweetAlertOptions = {};
  
    roles$: Observable<DataTablesResponse>;
    files: any;
    dreamboardItem: any;
    maxlength: number = 1000;
    HTML_content: any;
    HTML: string;
    lookup_data_user: any = [];
    userModel: { P1: string; P2: string; P3: string; P4: string; };
    data_temp:any = [];
    match: boolean;
    deleteResponse: any;
    updateResponse: any;
    HTML_code: any;
    login_detail: any;
    loginDetail_string: any;
    client: any;
    update: boolean = false;
    error: string;
  
    constructor(
        // private apiService: UserService, 
        // private roleService: RoleService, 
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private api: APIService,
        private apiCallService : ApiCallService ,        // dreamboard
    )
     { }
  
    ngAfterViewInit(): void {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);  // Initialize each tooltip
    });
    }

    onFilesSelected(event: any) {
        this.files = event.target.files;
        console.log(this.files)
        this.dreamboardForm.get('HTML')?.setValue('File Select');
      }
      
    initForm() {
        this.dreamboardForm = this.fb.group({
            dreamboardId: ['', Validators.required],
            name: ['', Validators.required],
            description: ['',],
            devices: ['',Validators.required],
            HTML: ['',Validators.required],
            type: [' '],
            settings: [' '],
            rdt: [' '],
            createdTime: [Math.ceil(((new Date()).getTime()) / 1000)],
            updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
        });
      }
  
    ngOnInit(): void {

    this.initForm()

    this.login_detail = localStorage.getItem('userAttributes')

    this.loginDetail_string = JSON.parse(this.login_detail) 
    console.log("AFTER JSON STRINGIFY",this.loginDetail_string)

    this.client=this.loginDetail_string.clientID
    this.users=this.loginDetail_string.username

     this.datatableConfig = {}
     this.lookup_data_user = []
      this.datatableConfig = {
        serverSide: true,
        ajax: (dataTablesParameters: any, callback) => {
            this.dreamboardLookupData(1)
            .then((resp:any) => {
                const responseData = resp || []; // Default to an empty array if resp is null

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
      
                // Prepare the response structure expected by DataTables
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
                title: 'Dreamboard ID',
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
            title: 'Name', data: 'P2', 
          },
          {
            title: 'Desscription', data: 'P3',
          },
          {
            title: 'Updated Time', data: 'P4', render: function (data) {
                // const date = new Date(data * 1000);
                // return `${date.toDateString()} ${date.toLocaleTimeString()}`;
                // const date = new Date(data * 1000);
                // return `${date.toDateString()} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

            //   return moment(data).format('DD MMM YYYY, hh:mm a');;
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
  

      console.log("DATATABLE:",this.datatableConfig )
    //   this.roles$ = this.roleService.getRoles();
    }
  
    delete(P1:any) {
        console.log("DELETE ID:",P1)
            const body = {
                PK: this.client+'#' + 'dreamboard#' + P1 + '#main',
                SK: 1,
            };

        this.api.DeleteMaster(body).then(async (res:any)=>{

           console.log("DELETE DREAMBOARD RESPONSE:",res)

           this.deleteResponse =JSON.parse(res.metadata)

           console.log("AFTER JSON PARSE:",this.deleteResponse)

           this.dreamboardItem = {
            P1: this.deleteResponse.dreamboardId,
            P2: this.deleteResponse.name,
            P3: this.deleteResponse.description,
            P4: this.deleteResponse.updatedTime,
           }

        //    await this.createLookupdreamboard(this.dreamboardItem, 1, 'Test#dreamboard#lookup');

           await this.updatedreamboardlookup(1, P1, 'delete', this.dreamboardItem)

        //    this.reloadEvent.emit(true);

        }).catch((error)=>{
         console.log("DREAMBOARD DELLETE ID ERROR:",error)
        })
    //   this.apiService.deleteUser(id).subscribe(() => {
    //     this.reloadEvent.emit(true);
    //   });
    }
  
    edit(P1:any) {

        this.update = true

        console.log("ID:",P1)
        this.data_temp = []

      this.api.GetMaster(this.client+'#dreamboard#'+P1+'#main',1).then((res:any)=>{

        if(res && res !== undefined){

            this.data_temp.push(JSON.parse(res.metadata));
            console.log("dreamboard", this.data_temp);

            if(this.data_temp){

            var requestData = {
                "bucket_name": "dreamboard-dynamic",
                "bucket_region": "ap-south-1",
                "operation_type": "read",
                "key": this.data_temp[0].HTML,
            };
          
            console.log("UPDATE DATA:", requestData);
          
            this.apiCallService.postData(requestData).subscribe(
                (response) => {
                    console.log('GET request successful:', JSON.parse(response.body));
                    this.HTML_code = JSON.parse(response.body).data;
                    console.log("html", this.HTML_code);
                    this.dreamboardForm.get('HTML')?.setValue( this.HTML_code.replace(/^"(.*)"$/, '$1'))
                },
                (error) => {
                    console.error('Error in POST request:', error);
                }
            );
                this.dreamboardForm = this.fb.group({
                    dreamboardId: [this.data_temp[0].dreamboardId],
                    name: [this.data_temp[0].name],
                    description: [this.data_temp[0].description],
                    devices: [this.data_temp[0].devices],
                    HTML: [this.HTML_code],
                    type: [this.data_temp[0].type],
                    settings: [this.data_temp[0].setting],
                    rdt: [this.data_temp[0].rdt],
                    createdTime: [this.data_temp[0].createdTime],
                    updatedTime: [Math.ceil(((new Date()).getTime()) / 1000)],
                }); 
           }

        }

      }) .catch((error)=>{
         
        console.log('Get MAIN TABLE DATA ERROR:',error)
      }) 
      this.cdr.detectChanges();
    }
  
    create() {         // click on create new 
        this.update = false            // Model heading and button text change flag
      this.initForm()
    }
  
    onSubmit(event: Event) {

        console.log("On CLICK OF Form Submit Event:", event)

        const dreamboardId = this.dreamboardForm.value.dreamboardId;

        const matchingRecord = this.lookup_data_user.find((record: { P1: any; }) => record.P1 === dreamboardId);

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
            text: this.match ? 'Dreamboard updated successfully!' : 'Dreamboard created successfully!',
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
            if (this.dreamboardForm.get('devices')?.value === 'code') {
                // Extract HTML content from the form
                this.HTML_content = this.dreamboardForm.getRawValue().HTML;
                console.log("HTML CONTENT:", this.HTML_content);

                // Set the HTML file path
                this.HTML = `public/${this.client}/${this.dreamboardForm.getRawValue().dreamboardId}/src/index.html`;
                this.dreamboardForm.get('HTML')?.setValue(this.HTML);
                console.log(this.dreamboardForm);

                // Validate form
                if (!this.dreamboardForm.valid) {
                    console.log('Form is not valid:', this.dreamboardForm.errors);
                    return;
                }

                // Form is valid, proceed with submission
                this.isLoading = true;
                const formValue = this.dreamboardForm.value;
                const body = {
                    PK: this.client+'#' + 'dreamboard#' + this.dreamboardForm.value.dreamboardId + '#main',
                    SK: 1,
                    metadata: JSON.stringify(formValue)
                };
                console.log('Form Submitted:', formValue);
                console.log("Body:", body);

                try {
                    const res = await this.api.CreateMaster(body);
                    console.log("ADD RESPONSE:", res);

                    // Build dreamboard item for further operations
                    this.dreamboardItem = {
                        P1: this.dreamboardForm.value.dreamboardId,
                        P2: this.dreamboardForm.value.name,
                        P3: this.dreamboardForm.value.description,
                        P4: this.dreamboardForm.value.updatedTime,
                    };

                    if (this.dreamboardForm.value.devices === 'code') {
                        // Prepare request data for file storage
                        const requestData = {
                            bucket_name: "dreamboard-dynamic",
                            bucket_region: "ap-south-1",
                            operation_type: "store",
                            key: this.dreamboardForm.value.HTML,
                            data: this.HTML_content,
                            contentType: "text/html"
                        };
                        console.log("REQ DATA:", requestData);

                        // POST request for file storage
                        this.apiCallService.postData(requestData).subscribe(
                            (response) => {
                                console.log('POST request successful:', response);
                            },
                            (error) => {
                                console.error('Error in POST request:', error);
                            }
                        );
                    } else {
                        // Handle file upload
                        console.log(this.HTML_content);
                        const key = `public/${this.client}/${this.dreamboardForm.value.dreamboardId}/`;
                        const readFilePromises = [];
                        for (const file of this.HTML_content) {
                            const ch = file.webkitRelativePath;
                            const file_path = key + `${ch}`;
                            console.log("FILEPATH:", file_path);
                            console.log("FILE:", file);

                            readFilePromises.push(this.readFile(file, file_path));
                        }
                        await Promise.all(readFilePromises).catch((err) => {
                            console.error("File upload failed:", err);
                        });
                    }

                    console.log("LOOK UP DREAMBOARD DATA:", this.dreamboardItem);
                    await this.createLookupdreamboard(this.dreamboardItem, 1, this.client+'#dreamboard#lookup');
                    this.showAlert(successAlert);
                    this.reloadEvent.emit(true);

                } catch (error) {
                    console.error("Dreamboard add request error:", error);
                    errorAlert.text = this.extractText(error);
                    this.showAlert(errorAlert);
                } finally {
                    // this.isLoading = false;
                    completeFn();
                }
            } else {
                let folder_name = this.files[0]['webkitRelativePath'];
                folder_name = folder_name.split('/')[0];
                this.HTML = `public/${this.client}/${this.dreamboardForm.getRawValue().dreamboardId}/src/index.html`;
                console.log("HTML:",this.HTML)
                this.dreamboardForm.get('HTML')?.setValue(this.HTML);

                // Validate form
                if (!this.dreamboardForm.valid) {
                    console.log('Form is not valid:', this.dreamboardForm.errors);
                    return;
                }

                // Form is valid, proceed with submission
                this.isLoading = true;
                const formValue = this.dreamboardForm.value;
                const body = {
                    PK: this.client+'#' + 'dreamboard#' + this.dreamboardForm.value.dreamboardId + '#main',
                    SK: 1,
                    metadata: JSON.stringify(formValue)
                };
                console.log('Form Submitted:', formValue);
                console.log("Body:", body);

                try {
                    const res = await this.api.CreateMaster(body);
                    console.log("ADD RESPONSE:", res);

                    // Build dreamboard item for further operations
                    this.dreamboardItem = {
                        P1:this.dreamboardForm.value.dreamboardId,
                        P2:this.dreamboardForm.value.name,
                        P3:this.dreamboardForm.value.description,
                        P4:this.dreamboardForm.value.updatedTime,
                    };

                    if (this.dreamboardForm.value.devices === 'code') {
                        const requestData = {
                            bucket_name: "dreamboard-dynamic",
                            bucket_region: "ap-south-1",
                            operation_type: "store",
                            key: this.dreamboardForm.value.HTML,
                            data: this.HTML_content,
                            contentType: "text/html"
                        };
                        console.log("REQ DATA:", requestData);

                        // POST request for file storage
                        this.apiCallService.postData(requestData).subscribe(
                            (response) => {
                                console.log('POST request successful:', response);
                            },
                            (error) => {
                                console.error('Error in POST request:', error);
                            }
                        );
                    } else {
                        // Handle file upload
                        console.log(this.files);
                        const key = `public/${this.client}/${this.dreamboardForm.value.dreamboardId}/`;
                        const readFilePromises = [];
                        for (const file of this.files) {
                            const ch = file.webkitRelativePath;
                            const file_path = key + `${ch}`;
                            console.log("FILEPATH:", file_path);
                            console.log("FILE:", file);

                            readFilePromises.push(this.readFile(file, file_path));
                        }
                        await Promise.all(readFilePromises).catch((err) => {
                            console.error("File upload failed:", err);
                        });
                    }

                    await this.createLookupdreamboard(this.dreamboardItem, 1, this.client+'#dreamboard#lookup');
                    this.showAlert(successAlert);
                    this.reloadEvent.emit(true);

                } catch (error) {
                    console.error("Dreamboard add request error:", error);
                    errorAlert.text = this.extractText(error);
                    this.showAlert(errorAlert);
                } finally {
                    // this.isLoading = false;
                    completeFn()
                }
            }
        };

        const updateFn = () => {


            // const formValue = this.dreamboardForm.value
            console.log("UPDATED CODE FORM VALUE:",)

            if (this.dreamboardForm.get('devices')?.value === 'code') {
                this.HTML_content = this.dreamboardForm.getRawValue().HTML;
                console.log("HTML CONTENT:", this.HTML_content);

                // Set the HTML file path
                this.HTML = `public/${this.client}/${this.dreamboardForm.getRawValue().dreamboardId}/src/index.html`;
                this.dreamboardForm.get('HTML')?.setValue(this.HTML);
                console.log(this.dreamboardForm);
            }
            else{
                let folder_name = this.files[0]['webkitRelativePath'];
                folder_name = folder_name.split('/')[0];
                this.HTML = `public/${this.client}/${this.dreamboardForm.getRawValue().dreamboardId}/src/index.html`;
                this.dreamboardForm.get('HTML')?.setValue(this.HTML);
            }
            const formValue = this.dreamboardForm.value

            const body = {
                PK: this.client + '#' + 'dreamboard#' + matchingRecord.P1 + '#main',
                SK: 1,
                metadata: JSON.stringify(formValue)
            };
            this.api.UpdateMaster(body).then(async (res: any) => {


                if (this.dreamboardForm.value.devices === 'code') {
                    // Prepare request data for file storage
                    const requestData = {
                        bucket_name: "dreamboard-dynamic",
                        bucket_region: "ap-south-1",
                        operation_type: "store",
                        key: this.dreamboardForm.value.HTML,
                        data: this.HTML_content,
                        contentType: "text/html"
                    };
                    console.log("REQ DATA:", requestData);

                    // POST request for file storage
                    this.apiCallService.postData(requestData).subscribe(
                        (response) => {
                            console.log('POST request successful:', response);
                        },
                        (error) => {
                            console.error('Error in POST request:', error);
                        }
                    );
                } else {
                    // Handle file upload
                    console.log(this.HTML_content);
                    const key = `public/${this.client}/${this.dreamboardForm.value.dreamboardId}/`;
                    const readFilePromises = [];
                    for (const file of this.files) {
                        const ch = file.webkitRelativePath;
                        const file_path = key + `${ch}`;
                        console.log("FILEPATH:", file_path);
                        console.log("FILE:", file);

                        readFilePromises.push(this.readFile(file, file_path));
                    }
                    await Promise.all(readFilePromises).catch((err) => {
                        console.error("File upload failed:", err);
                    });
                }

                console.log("UPDATED RESPONSE:", res)

                this.updateResponse = JSON.parse(res.metadata)

                console.log("AFTER JSON PARSE:", this.updateResponse)

                this.dreamboardItem = {
                    P1: this.updateResponse.dreamboardId,
                    P2: this.updateResponse.name,
                    P3: this.updateResponse.description,
                    P4: Math.ceil(((new Date()).getTime()) / 1000),
                }

                await this.updatedreamboardlookup(1, matchingRecord.P1, 'update', this.dreamboardItem)

                this.showAlert(successAlert);
                this.reloadEvent.emit(true);

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
        } else {
            createFn();
        }
    }

    async readFile(file: Blob, file_path: string) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const fileContent = reader.result as string
            console.log('File content:', fileContent);
            let requestData = {
                "bucket_name": "dreamboard-dynamic",
                "bucket_region": "ap-south-1",
                "operation_type": "store",
                "key": file_path,
                "data": fileContent,
                "contentType": file.type//"text/html"
            }
            console.log("REQ DATA:", requestData)
            this.apiCallService.postData(requestData).subscribe(
                (response) => {
                    console.log('POST request successful:', response);
                    // Handle the response data here
                },
                (error) => {
                    console.error('Error in POST request:', error);
                    // Handle the error here
                }
            );
        };
        reader.readAsText(file)
        //reader.readAsArrayBuffer(file)
    }

    // create dreamboard lookup table

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


    dreamboardLookupData(sk:number){
      console.log("Page Number:",sk)

      return new Promise((resolve, reject) => {
        this.api.GetMaster(this.client+'#'+'dreamboard#lookup', sk)
          .then(response => {
            if (response && response.options) {
              // Check if response.options is a string
              if (typeof response.options === 'string') {
                let data = JSON.parse(response.options);
                console.log("d1 =", data);
                
                if (Array.isArray(data)) {
                  const promises = []; // Array to hold promises for recursive calls
                  this.lookup_data_user=[]
                  for (let index = 0; index < data.length; index++) {
                    const element = data[index];
    
                    if (element !== null && element !== undefined) {
                      // Extract values from each element and push them to lookup_data_user
                      const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                      const { P1, P2, P3, P4} = element[key]; // Extract values from the nested object
                      this.lookup_data_user.push({ P1, P2, P3, P4}); // Push an array containing P1, P2, P3, P4, P5, P6
                      console.log("d2 =", this.lookup_data_user);
                    } else {
                      break;
                    }
                  }

                  // Sort the lookup_data_user array based on P5 values in descending order
                  this.lookup_data_user.sort((a: { P4: number; }, b: { P4: number; }) => b.P4 - a.P4);
                  console.log("Lookup sorting", this.lookup_data_user);
    
                  // Continue fetching recursively
                  promises.push(this.dreamboardLookupData(sk + 1)); // Store the promise for the recursive call
                  
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

        const tempClient = this.client + '#dreamboard' + "#lookup";
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
          if (inputUid.trim() === this.lookup_data_user[uniqueID].P1) {
            this.error = "Dreamboard ID already exists";
            break; // Exit loop if a match is found
          }
        }
    }

}
