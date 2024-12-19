import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-clone-dashboard',
 
  templateUrl: './clone-dashboard.component.html',
  styleUrl: './clone-dashboard.component.scss'
})
export class CloneDashboardComponent implements OnInit {
  @Input() modal :any
  @Input() all_Packet_store:any
  @Output() duplicateDashboardData =  new EventEmitter<any>()
  @Input() lookup_data_summary1:any
  duplicateForm: FormGroup;
  existingSummaryIds: any;
  getLoggedUser: any;
  SK_clientID: any;

  isDuplicate: boolean = false;
  lookup_data_summaryCopy: any;
  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){
    this.duplicateForm = this.fb.group({
      summaryId: ['', [Validators.required, this.uniqueIdValidator.bind(this)]],
      summaryName: ['', Validators.required],
      summaryDescription: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)

    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
 
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('lookup_data_summary1 check from ngchanges',this.lookup_data_summary1)
    console.log('all_Packet_store check from clone',this.all_Packet_store)
   
    if (changes['all_Packet_store'] && changes['all_Packet_store'].currentValue) {
      const packet = this.all_Packet_store;

      this.duplicateForm.patchValue({
        summaryName: packet.summaryName || '',
        summaryDescription: packet.summaryDesc || ''
      });
    }

   
  }

  uniqueIdValidator(control: any) {
    const existingSummaryIds = ['BranchWise', 'Dashboard123']; // Example of existing IDs
    if (existingSummaryIds.includes(control.value)) {
      return { uniqueId: true };
    }
    return null;
  }
  onSubmit() {
    if (this.duplicateForm.valid) {
      // Prepare duplicate dashboard data
      const duplicateDashboardData = {
        ...this.all_Packet_store, // Original data
        summaryID: this.duplicateForm.value.summaryId,
        summaryName: this.duplicateForm.value.summaryName,
        summaryDesc: this.duplicateForm.value.summaryDescription,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      // Emit data to the parent component
      this.duplicateDashboardData.emit(duplicateDashboardData);

      // Close modal if required
      if (this.modal) {
        this.modal.dismiss();
      }
    }
  }



  fetchCompanyLookupdataOnit(sk: any): any {
    console.log("I am called snn");
    console.log('this.SK_clientID check lookup', this.SK_clientID);

    return new Promise((resolve, reject) => {
      this.api.GetMaster(this.SK_clientID + "#summary" + "#lookup", sk)
        .then(response => {
          if (response && response.options) {
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);

              if (Array.isArray(data)) {
                const promises = [];

                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  console.log('element check', element);

                  if (element !== null && element !== undefined) {
                    const key = Object.keys(element)[0];
                    const { P1, P2, P3, P4, P5, P6, P7, P8, P9 } = element[key];
                    this.lookup_data_summary1.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9 });
                    console.log("summary lookup data check", this.lookup_data_summary1);
                  } else {
                    break; // This may need refinement based on your data structure
                  }
                }

                // Recursive call to fetch more data
                if (data.length > 0) { // Ensure there is data to fetch recursively
                  promises.push(this.fetchCompanyLookupdataOnit(sk + 1));
                }

                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_summary1))
                  .catch(reject);
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            console.log("this.lookup_data_summary1 checking", this.lookup_data_summary1);
            resolve(this.lookup_data_summary1); // Resolve if no valid response
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    });
  }
  checkDuplicateSummaryId(): void {
    const enteredID = this.duplicateForm.get('summaryId')?.value?.trim();
    console.log('enteredID checking',enteredID)
  
    if (!enteredID) {
      // Reset errors if the input is empty
      this.duplicateForm.get('summaryId')?.setErrors(null);
      return;
    }
    console.log("summary lookup data check from", this.lookup_data_summary1);
    const isDuplicateID = this.lookup_data_summary1.some((item: { P1: any; }) => item.P1 === enteredID);
    
    console.log('isDuplicateID checking',isDuplicateID)
  
    if (isDuplicateID) {
      this.isDuplicate = true;
      this.duplicateForm.get('summaryId')?.setErrors({ duplicate: true }); // Set the duplicate error
    } else {
      const control = this.duplicateForm.get('summaryId');
      if (control?.errors) {
        const errors = { ...control.errors }; // Spread the existing errors into a new object
        delete errors['duplicate']; // Remove the duplicate error
        control.setErrors(Object.keys(errors).length ? errors : null); // Reset errors or clear them if empty
      }
    }
  }
  
  



}
