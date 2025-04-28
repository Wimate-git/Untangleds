import { ChangeDetectorRef, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Config } from 'datatables.net';
import { UserService } from 'src/app/_fake/services/user-service';
import { SharedService } from '../shared.service';
import { APIService } from 'src/app/API.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AuditTrailService } from '../services/auditTrail.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

interface ListItem {
  [key: string]: {
    P1: any;
    P2: any;
    P3: any;
  };
}

@Component({
  selector: 'app-mqtt',
  standalone: false,
  templateUrl: './mqtt.component.html',
  styleUrl: './mqtt.component.scss'
})
export class MqttComponent {
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  createMQTTField: FormGroup;
  editOperation: boolean = false
  isCollapsed1: boolean = false
  SK_clientID: any;
  getLoggedUser: any;
  Allpermission: boolean;
  lookup_mqtt_user: any = [];
  uniqueKeyFounded: boolean;
  PKList: any = [];
  maxlength: number = 500;
  username: any;
  isLoading: any;


  constructor(private apiService: UserService, private configService: SharedService, private fb: FormBuilder
    , private cd: ChangeDetectorRef, private api: APIService, private toast: MatSnackBar, private spinner: NgxSpinnerService, private modalService: NgbModal, private auditTrail: AuditTrailService) { }


  ngOnInit() {
    this.createMQTTField = this.fb.group({
      mqttId: ['', Validators.required],
      mqttName: ['', Validators.required],
      mqttHost: ['', Validators.required],
      mqttHostUrl: ['', Validators.required],
      mqttPort: ['', Validators.required],
      mqttTopic: ['', Validators.required],
      mqttTopicSend: ['', Validators.required],
      mqttUsername: ['', Validators.required],
      mqttPassword: ['', Validators.required],
      mqttsslOrtls: ['',],
      mqttcertificate: ['',],
      mqttCAFileString: ['',],
      mqttClientCertificate: ['',],
      mqttClientkey: ['',],
    })

    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    this.username = this.getLoggedUser.username

    this.auditTrail.getFormInputData('SYSTEM_AUDIT_TRAIL', this.SK_clientID)


    this.showTable()

  }

  async showTable() {
    console.log("Show DataTable is called BTW");

    this.datatableConfig = {};
    this.lookup_mqtt_user = [];

    this.datatableConfig = {
      ajax: (dataTablesParameters: any, callback) => {
        this.datatableConfig = {};
        this.lookup_mqtt_user = [];

        this.fetchUserLookupdata(1)
          .then((resp: any) => {
            const responseData = resp || []; // Default to empty array if resp is null

            callback({
              draw: dataTablesParameters.draw,
              recordsTotal: responseData.length,
              recordsFiltered: responseData.length,
              data: responseData,
            });

            console.log("Response is in this form ", responseData);
            this.PKList = this.lookup_mqtt_user.map((item: any) => item.P1)
          })
          .catch((error: any) => {
            console.error("Error fetching user lookup data:", error);
            callback({
              draw: dataTablesParameters.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          });
      },
      columns: [
        {
          title: "ID",
          data: "P1",
          render: function (data, type, full) {
            const colorClasses = ["success", "info", "warning", "danger"];
            const randomColorClass =
              colorClasses[Math.floor(Math.random() * colorClasses.length)];

            const initials = data[0].toUpperCase();
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;

            const nameAndEmail = `
              <div class="d-flex flex-column">
                <a href="javascript:;" class="clicable-href text-gray-800 text-hover-primary mb-1 view-item" data-action="edit" data-id="${full.P1}">
                  ${data}
                </a>
              </div>
            `;

            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                <a href="javascript:;" class="view-item" data-action="edit">
                  ${symbolLabel}
                </a>
              </div>
              ${nameAndEmail}
            `;
          },
        },
        {
          title: "Label",
          data: "P2",
        },
        {
          title: "Updated",
          data: "P3",
          render: function (data) {
            const date =
              new Date(data * 1000).toLocaleDateString() +
              " " +
              new Date(data * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            return date;
          },
        },
      ],
      createdRow: (row, data: any) => {
        $("td:eq(0)", row).addClass("d-flex align-items-center");

        // Ensure the click event is bound correctly to `P1`
        $(row)
          .find(".view-item")
          .on("click", () => {
            console.log("Event is triggered for:", data.P1);
            this.edit(data.P1); // `this` now correctly refers to the component
          });
      },
    };
  }


  fetchUserLookupdata(sk: any): any {
    console.log("I am called Bro");

    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#mqtt" + "#lookup", sk)
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
                    const { P1, P2, P3, P4, P5, P6, P7 } = element[key]; // Extract values from the nested object
                    this.lookup_mqtt_user.push({ P1, P2, P3, P4, P5, P6, P7 }); // Push an array containing P1, P2, P3, P4, P5, P6
                    // console.log("d2 =", this.lookup_data_user);
                  } else {
                    break;
                  }
                }

                // Sort the lookup_data_user array based on P5 values in descending order
                this.lookup_mqtt_user.sort((a: { P7: number; }, b: { P7: number; }) => b.P7 - a.P7);
                console.log("Lookup sorting", this.lookup_mqtt_user);

                // Continue fetching recursively
                promises.push(this.fetchUserLookupdata(sk + 1)); // Store the promise for the recursive call

                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_mqtt_user)) // Resolve with the final lookup data
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
            console.log("All the users are here", this.lookup_mqtt_user);
            resolve(this.lookup_mqtt_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }


  uniquePKValue(value: any) {
    this.uniqueKeyFounded = false;

    for (let uniqueID = 0; uniqueID < this.PKList.length; uniqueID++) {
      if (value.toLowerCase() == this.PKList[uniqueID].toLowerCase()) {
        this.uniqueKeyFounded = true
      }
    }
  }



  SLLTLSEvent(event: Event) {
    let value = (event.target as HTMLInputElement).value
    if (value === 'on') {
      console.log("on")
      this.createMQTTField.get('mqttcertificate')?.valueChanges
        .subscribe((data: any) => {
          if (data === 'self_Signed') {
            this.createMQTTField.get('mqttCAFileString')?.setValidators([Validators.required]);
            this.cd.detectChanges()
          } else {
            this.createMQTTField.get('mqttCAFileString')?.clearValidators();
            this.cd.detectChanges()
          }
          this.createMQTTField.get('mqttCAFileString')?.updateValueAndValidity();
          this.cd.detectChanges()

        });
    } else {

      this.createMQTTField.get('mqttCAFileString')?.clearValidators();
      this.createMQTTField.get('mqttCAFileString')?.updateValueAndValidity();
      this.cd.detectChanges()
    }
  }



  delete(id: number) {
    console.log("Deleted username will be", id);
    this.deleteNM(id);

  }

  create() {

    this.uniqueKeyFounded = false

    // this.userModel = { P1: '', P2: '', P3: '',P4:0,P5:'' };
    this.createMQTTField = this.fb.group({
      mqttId: ['', Validators.required],
      mqttName: ['', Validators.required],
      mqttHost: ['', Validators.required],
      mqttHostUrl: ['', Validators.required],
      mqttPort: ['', Validators.required],
      mqttTopic: ['', Validators.required],
      mqttTopicSend: ['', Validators.required],
      mqttUsername: ['', Validators.required],
      mqttPassword: ['', Validators.required],
      mqttsslOrtls: ['',],
      mqttcertificate: ['',],
      mqttCAFileString: ['',],
      mqttClientCertificate: ['',],
      mqttClientkey: ['',],
    })

    this.editOperation = false
    // this.openModal('','')
  }


  edit(P1: any) {

    this.openModalHelpher(P1)

    try {
      const UserDetails = {
        "User Name": this.username,
        "Action": "View",
        "Module Name": "MQTT",
        "Form Name": 'MQTT',
        "Description": `${P1} MQTT details were Viewed`,
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



  openModalHelpher(getData: any) {

    try {
      this.api
        .GetMaster(this.SK_clientID + "#" + getData + "#mqtt" + "#main", 1)
        .then((result: any) => {
          if (result && result !== undefined) {
            const data = JSON.parse(result.metadata);
            if (data) {
              this.createMQTTField.get('mqttId')?.disable()

              if (data.mqttsslOrtls != null && data.mqttsslOrtls != '') {

                this.createMQTTField.patchValue({
                  mqttId: data?.mqttId,
                  mqttName: data?.mqttName,
                  mqttHost: data?.mqttHost,
                  mqttHostUrl: data?.mqttHostUrl,
                  mqttPort: data?.mqttPort,
                  mqttTopic: data?.mqttTopic,
                  mqttTopicSend: data?.mqttTopicSend,
                  mqttUsername: data?.mqttUsername,
                  mqttPassword: data?.mqttPassword,
                  mqttsslOrtls: data?.mqttsslOrtls,
                  mqttcertificate: data?.mqttcertificate,
                  mqttCAFileString: data?.mqttCAFileString,
                  mqttClientCertificate: data?.mqttClientCertificate,
                  mqttClientkey: data?.mqttClientkey,
                });
              }
              else {

                this.createMQTTField.patchValue({
                  mqttId: data?.mqttId,
                  mqttName: data?.mqttName,
                  mqttHost: data?.mqttHost,
                  mqttHostUrl: data?.mqttHostUrl,
                  mqttPort: data?.mqttPort,
                  mqttTopic: data?.mqttTopic,
                  mqttTopicSend: data?.mqttTopicSend,
                  mqttUsername: data?.mqttUsername,
                  mqttPassword: data?.mqttPassword,
                  mqttsslOrtls: '',
                  mqttcertificate: '',
                  mqttCAFileString: '',
                  mqttClientCertificate: '',
                  mqttClientkey: '',
                });

              }
            }
          }
        })
    }
    catch (error) {
      console.log("Error in fetching mqtt ", error);
    }
    this.editOperation = true
    this.cd.detectChanges()
  }



  deleteNM(value: any) {
    if (value) {

      let temp = {
        PK: this.SK_clientID +"#"+ value + "#mqtt"+ "#main",
        SK: 1
      }

      var item = {
        P1: value,
        P2: this.lookup_mqtt_user.find((item:any)=>item.P1 == value).P2,
        P3: Math.ceil(((new Date()).getTime()) / 1000)
      }

      console.log("MAin table deleted ",temp);

      console.log("Deleted Lookup is here ",item);

      try {
        this.api.DeleteMaster(temp).then(async value => {

          await this.fetchTimeMachineById(1, item.P1, 'delete', item)
        

          try {
            const UserDetails = {
              "User Name": this.username,
              "Action": "Deleted",
              "Module Name": "MQTT Configuration",
              "Form Name": 'MQTT Configuration',
              "Description": `${item.P1} MQTT was Deleted`,
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
          this.reloadEvent.next(true)
        })
      }
      catch (err) {
        console.log("Error Deleting", err);
      }
    }
  }







  onSubmit(event: any) {

    if (this.createMQTTField.invalid || this.uniqueKeyFounded) {
      this.markAllFieldsTouched(this.createMQTTField);
      return;
    }

    console.log("Submitted is clicked ", event);
    if (event.type == 'submit' && this.editOperation == false) {
      this.createNewMQTT('', 'html')
    }
    else {
      this.updateMQTT(this.createMQTTField.value, 'editUser')
    }
  }


  markAllFieldsTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFieldsTouched(control);
      }
    });
  }


  async createNewMQTT(getNewFields: any, key: any) {

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.editOperation ? 'MQTT updated successfully!' : 'MQTT created successfully!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    let tempObj: any = {}

    //create new MQTT
    if (key == 'html') {
      let selected = this.createMQTTField.get('mqttsslOrtls')?.value
      let MqttArrayofJson: any
      if (selected == 'on') {
        MqttArrayofJson = {
          mqttId: this.createMQTTField.get('mqttId')?.value,
          mqttName: this.createMQTTField.get('mqttName')?.value,
          mqttHost: this.createMQTTField.get('mqttHost')?.value,
          mqttHostUrl: this.createMQTTField.get('mqttHostUrl')?.value,
          mqttPort: this.createMQTTField.get('mqttPort')?.value,
          mqttTopic: this.createMQTTField.get('mqttTopic')?.value,
          mqttTopicSend: this.createMQTTField.get('mqttTopicSend')?.value,
          mqttUsername: this.createMQTTField.get('mqttUsername')?.value,
          mqttPassword: this.createMQTTField.get('mqttPassword')?.value,
          mqttsslOrtls: this.createMQTTField.get('mqttsslOrtls')?.value,
          mqttcertificate: this.createMQTTField.get('mqttcertificate')?.value,
          mqttCAFileString: this.createMQTTField.get('mqttCAFileString')?.value,
          mqttClientCertificate: this.createMQTTField.get('mqttClientCertificate')?.value,
          mqttClientkey: this.createMQTTField.get('mqttClientkey')?.value,
        }
      }
      else {
        MqttArrayofJson = {
          mqttId: this.createMQTTField.get('mqttId')?.value,
          mqttName: this.createMQTTField.get('mqttName')?.value,
          mqttHost: this.createMQTTField.get('mqttHost')?.value,
          mqttHostUrl: this.createMQTTField.get('mqttHostUrl')?.value,
          mqttPort: this.createMQTTField.get('mqttPort')?.value,
          mqttTopic: this.createMQTTField.get('mqttTopic')?.value,
          mqttTopicSend: this.createMQTTField.get('mqttTopicSend')?.value,
          mqttUsername: this.createMQTTField.get('mqttUsername')?.value,
          mqttPassword: this.createMQTTField.get('mqttPassword')?.value,
          mqttsslOrtls: this.createMQTTField.get('mqttsslOrtls')?.value,
          mqttcertificate: '',
          mqttCAFileString: '',
          mqttClientCertificate: '',
          mqttClientkey: '',
        }
      }
      let dateInSeconds = Math.floor(new Date().valueOf() / 1000);

      const item = {
        P1: MqttArrayofJson.mqttId,
        P2: this.createMQTTField.value.mqttName,
        P3: dateInSeconds,
      };

      tempObj = {
        PK: this.SK_clientID + "#" + MqttArrayofJson.mqttId + "#mqtt" + "#main",
        SK: 1,
        metadata: JSON.stringify(MqttArrayofJson)
      }

      this.spinner.show()

      this.api.CreateMaster(tempObj).then(async value => {

        if (value) {

          await this.createLookUpRdt(item, 1, this.SK_clientID + "#mqtt" + "#lookup")


          try {
            const UserDetails = {
              "User Name": this.username,
              "Action": "Created",
              "Module Name": "MQTT",
              "Form Name": 'MQTT',
              "Description": `${item.P1} MQTT was Created`,
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


          this.datatableConfig = {}
          this.lookup_mqtt_user = []

          this.showAlert(successAlert)
          this.reloadEvent.next(true)

          this.spinner.hide()
        }
        else {
          Swal.fire({
            customClass: {
              container: 'swal2-container'
            },
            position: 'center',
            icon: 'warning',
            title: 'Error in adding MQTT Configuration',
            showCancelButton: true,
            allowOutsideClick: false,////prevents outside click
          })
          //alert('Error in adding User Configuration');
        }

      }).catch(err => {
        this.spinner.hide()
        console.log('err for creation', err);

        this.showAlert(errorAlert)
      })
    }


  }



  updateMQTT(value: any, key: any) {
    console.log("value", value)

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

    let MqttArrayofJson = {
      mqttId: this.createMQTTField.get('mqttId')?.value,
      mqttName: this.createMQTTField.get('mqttName')?.value,
      mqttHost: this.createMQTTField.get('mqttHost')?.value,
      mqttHostUrl: this.createMQTTField.get('mqttHostUrl')?.value,
      mqttPort: this.createMQTTField.get('mqttPort')?.value,
      mqttTopic: this.createMQTTField.get('mqttTopic')?.value,
      mqttTopicSend: this.createMQTTField.get('mqttTopicSend')?.value,
      mqttUsername: this.createMQTTField.get('mqttUsername')?.value,
      mqttPassword: this.createMQTTField.get('mqttPassword')?.value,
      mqttsslOrtls: this.createMQTTField.get('mqttsslOrtls')?.value,
      mqttcertificate: this.createMQTTField.get('mqttcertificate')?.value,
      mqttCAFileString: this.createMQTTField.get('mqttCAFileString')?.value,
      mqttClientCertificate: this.createMQTTField.get('mqttClientCertificate')?.value,
      mqttClientkey: this.createMQTTField.get('mqttClientkey')?.value,
    }

    const date = Math.ceil(((new Date()).getTime()) / 1000)
    const items = {
      P1: MqttArrayofJson.mqttId,
      P2: MqttArrayofJson.mqttName,
      P3: date
    }

    const tempObj = {
      PK: this.SK_clientID + "#" + MqttArrayofJson.mqttId + "#mqtt" + "#main",
      SK: 1,
      metadata: JSON.stringify(MqttArrayofJson)
    }

    this.api.UpdateMaster(tempObj).then(async value => {

      this.spinner.show()

      if (value) {
        await this.fetchTimeMachineById(1, items.P1, 'update', items);

        this.datatableConfig = {}
        this.lookup_mqtt_user = []

        try {
          const UserDetails = {
            "User Name": this.username,
            "Action": "Edited",
            "Module Name": "MQTT Configuration",
            "Form Name": 'MQTT Configuration',
            "Description": `${items.P1} MQTT details were Edited`,
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

        this.showAlert(successAlert)
        this.reloadEvent.next(true)

        this.spinner.hide();
      }
      else {
        alert('Error in updating mqtt Configuration');
      }

    }).catch(err => {
      this.showAlert(errorAlert)
      console.log('error for updating', err);
      this.spinner.hide()
    })

  }



  async fetchTimeMachineById(sk: any, id: any, type: any, item: any) {
    const tempClient = this.SK_clientID + '#mqtt' + "#lookup";
    console.log("Temp client is ", tempClient);
    console.log("Type of client", typeof tempClient);
    try {
      const response = await this.api.GetMaster(tempClient, sk);

      if (response && response.options) {
        let data: ListItem[] = await JSON.parse(response.options);

        // Find the index of the item with the matching id
        let findIndex = data.findIndex((obj) => obj[Object.keys(obj)[0]].P1 == id);

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











  swalOptions: SweetAlertOptions = {};
  //Swal need to be added
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
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








}
