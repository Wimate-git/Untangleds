import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-html-tile-config',

  templateUrl: './html-tile-config.component.html',
  styleUrl: './html-tile-config.component.scss'
})
export class HtmlTileConfigComponent implements OnInit{
  createKPIWidget: FormGroup;

  @Input() modal :any
  selectedTabset: string = 'dataTab';
  formList: any;
  listofDeviceIds: any;
  getLoggedUser: any;
  SK_clientID: any;
  selectedParameterValue: { value: any; text: any; };
  selectedText: any;
  listofDynamicParam: any;
  parameterNameRead: any;
  shoRowData:boolean = false
  showIdField = false;
  @Input() dashboard: any;
  grid_details: any;
  private widgetIdCounter = 0;
  @Input()isGirdMoved: any;
  tooltip: string | null = null;
  isEditMode: boolean;
  htmlPreview: string = '';
  @ViewChild('calendarModal') calendarModal: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();

  @Input()  all_Packet_store: any;

  @Output() send_all_Packet_store = new EventEmitter<any[]>();
  selectedTile: any;
  editTileIndex: number | null;
  @ViewChild('previewFrame', { static: false }) previewFrame!: ElementRef;
  formattedFieldsHTML: any;
  ngOnInit(){
    this.getLoggedUser = this.summaryConfiguration.getLoggedUserDetails()
    console.log('this.getLoggedUser check', this.getLoggedUser)
    // this.getWorkFlowDetails = this.summaryConfiguration.getLoggedUserDetails()
    // console.log('this.getLoggedUser check',this.getWorkFlowDetails)


    this.SK_clientID = this.getLoggedUser.clientID;
    console.log('this.SK_clientID check', this.SK_clientID)
    this.dynamicData()
    this.initializeTileFields()


    this.createKPIWidget.get('htmlTextArea')?.valueChanges.subscribe(value => {
      this.htmlPreview = value;
      this.updatePreview();
    });

    this.htmlPreview = '';

  }


  constructor(private summaryConfiguration: SharedService, private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
    private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
    private spinner: NgxSpinnerService,private zone: NgZone
  ){
  }

  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }

  async dynamicData(){
    try {
      const result: any = await this.api.GetMaster(this.SK_clientID + "#dynamic_form#lookup", 1);
      if (result) {
        console.log('forms chaecking',result)
        const helpherObj = JSON.parse(result.options);
        console.log('helpherObj checking',helpherObj)
        this.formList = helpherObj.map((item: [string]) => item[0]); // Explicitly define the type
        this.listofDeviceIds = this.formList.map((form: string) => ({ text: form, value: form })); // Explicitly define the type here too
        console.log('listofDeviceIds',this.listofDeviceIds)
        console.log('this.formList check from location', this.formList);
      }
    } catch (err) {
      console.log("Error fetching the dynamic form data", err);
    }
  }

  dynamicparameterValue(event: any): void {
    console.log('Event check for dynamic param:', event);
  
    if (event && event.value && Array.isArray(event.value)) {
      const valuesArray = event.value;
  
      if (valuesArray.length === 1) {
        // Handle single selection
        const singleItem = valuesArray[0];
        const { value, text } = singleItem; // Destructure value and text
        console.log('Single Selected Item:', { value, text });
  
        // Update the form control with the single value (object)
        const filterParameter = this.createKPIWidget.get('filterParameter');
        if (filterParameter) {
          filterParameter.setValue([{ value, text }]); // Store as an array of objects
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        // Store the single selected parameter
        this.selectedParameterValue = { value, text };
      } else {
        // Handle multiple selections
        const formattedValues = valuesArray.map((item: any) => {
          const { value, text } = item; // Destructure value and text
          return { value, text }; // Create an object with value and text
        });
  
        console.log('Formatted Multiple Items:', formattedValues);
  
        // Update the form control with the concatenated values (array of objects)
        const filterParameter = this.createKPIWidget.get('filterParameter');
        if (filterParameter) {
          filterParameter.setValue(formattedValues);
          this.cdr.detectChanges(); // Trigger change detection
        }
  
        // Store the multiple selected parameters
        this.selectedParameterValue = formattedValues;
      }
    } else {
      console.warn('Invalid event structure:', event);
    }
  }

  selectFormParams(event: any) {
    if (event && event[0] && event[0].data) {
      this.selectedText = event[0].data.text;  // Adjust based on the actual structure
      console.log('Selected Form Text:', this.selectedText);
      // this.getFormControlValue(this.selectedText); 

      if (this.selectedText) {
        this.fetchDynamicFormData(this.selectedText);
      }
    } else {
      console.error('Event data is not in the expected format:', event);
    }
  }
  fetchDynamicFormData(value: any) {
    console.log("Data from lookup:", value);

    this.api
      .GetMaster(`${this.SK_clientID}#dynamic_form#${value}#main`, 1)
      .then((result: any) => {
        if (result && result.metadata) {
          const parsedMetadata = JSON.parse(result.metadata);
          const formFields = parsedMetadata.formFields;
          console.log('formFields check',formFields)

          // Initialize the list with formFields labels
          this.listofDynamicParam = formFields.map((field: any) => {
            console.log('field check',field)
            return {
              value: field.name,
              text: field.label
            };
          });

          // Include created_time and updated_time
          if (parsedMetadata.created_time) {
            this.listofDynamicParam.push({
              value: parsedMetadata.created_time.toString(),
              text: 'Created Time' // You can customize the label here if needed
            });
          }

          if (parsedMetadata.updated_time) {
            this.listofDynamicParam.push({
              value: parsedMetadata.updated_time.toString(),
              text: 'Updated Time' // You can customize the label here if needed
            });
          }

          console.log('Transformed dynamic parameters:', this.listofDynamicParam);

          // Trigger change detection to update the view
          this.cdr.detectChanges();
        }
      })
      .catch((err) => {
        console.log("Can't fetch", err);
      });
  }

  parameterValue(event:any){
    console.log('event for parameter check',event)
    this.parameterNameRead = event[0].text

  }
  initializeTileFields(): void {

    // Initialize the form group
    this.createKPIWidget = this.fb.group({

      formlist: ['', Validators.required],
      parameterNameHTML: [[], Validators.required],
      widgetid: [this.generateUniqueId()],
      htmlTextArea: [],
      OperationValue:[''],
      groupByFormat: [''],
      htmlTextArea_processed:['']
     
    


    });
  }

  get groupByFormatControl(): FormControl {
    return this.createKPIWidget.get('groupByFormat') as FormControl; // Cast to FormControl
  }

  addTile(key: any) {

  const getHTMLtext =this.createKPIWidget.value.htmlTextArea
  console.log('getHTMLtext check',getHTMLtext)
    if (key === 'HTMLtile') {
      const uniqueId = this.generateUniqueId();
  
      const newTile = {
        id: uniqueId,
        x: 0,
        y: 0,
        rows: 13,
        cols: 25,
        rowHeight: 100,
        colWidth: 100,
        fixedColWidth: true,
        fixedRowHeight: true,
        grid_type: 'HTMLtile',

        formlist: this.createKPIWidget.value.formlist,
        parameterNameHTML: this.createKPIWidget.value.parameterNameHTML,
        htmlTextArea:this.createKPIWidget.value.htmlTextArea ||'',
        groupByFormat: this.createKPIWidget.value.groupByFormat,
        OperationValue:this.createKPIWidget.value.OperationValue,
        htmlTextArea_processed:''
        
      };
  
      if (!this.dashboard) {
        this.dashboard = [];
      }
  
      this.dashboard.push(newTile);
  
      console.log('this.dashboard after adding new tile', this.dashboard);
  
      this.grid_details = this.dashboard; // Update grid_details dynamically
      console.log('this.grid_details checking', this.grid_details);
  
      this.dashboardChange.emit(this.grid_details); // Emit the updated dashboard to parent component or listeners
  
      if (this.grid_details) {
        this.updateSummary('', 'add_tile');
  
        // Use ChangeDetectorRef to update the view dynamically
        this.cdr.detectChanges(); // Ensure changes are reflected in the UI
      }
  
      // Optionally reset the form if needed after adding the tile
      this.createKPIWidget.patchValue({
        widgetid: uniqueId,
      });
    }
  }

  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }

  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }


  openHTMLtile(tile: any, index: number) {
    console.log('Index checking:', index); // Log the index
  
    if (tile) {
      this.selectedTile = tile;
      this.editTileIndex = index !== undefined ? index : null;
      console.log('Tile object from readback:', tile);
  
    
  
      // ✅ Ensure `htmlTextArea` is a valid string
      let gethtmlTextArea = tile.htmlTextArea;

      
      // ✅ Update `htmlPreview` with parsed HTML
 
 // ✅ Ensure preview updates properly
  
      let parsedParameter = [];
      if (typeof tile.parameterNameHTML === 'string') {
        try {
          parsedParameter = JSON.parse(tile.parameterNameHTML);
        } catch (error) {
          console.error('Error parsing parameterName:', error);
        }
      } else {
        parsedParameter = tile.parameterNameHTML;
      }
  
      // ✅ Update Form Controls with readback values
      this.createKPIWidget.patchValue({
        formlist: tile.formlist,
        parameterNameHTML: parsedParameter,
        OperationValue: tile.OperationValue,
        groupByFormat: tile.groupByFormat,
        htmlTextArea: gethtmlTextArea, // ✅ Ensure this updates the textarea
      });
  

      this.htmlPreview = gethtmlTextArea;
    
      // ✅ Use setTimeout to ensure Angular detects the update
      setTimeout(() => {
        this.updatePreview(); // ✅ Force UI refresh
      }, 100);
      // ✅ Ensure UI updates properly
      this.cd.detectChanges();
      this.isEditMode = true; // Set to edit mode
  
    } else {
      this.selectedTile = null;
      this.isEditMode = false;
      this.createKPIWidget.reset();
    }
  }
  

  updateTile(key: any) {
    console.log('Key checking from update:', key);
    this.isGirdMoved = true;
  
    if (this.editTileIndex !== null && this.editTileIndex >= 0) {
     

  
      const updatedTile = {
        ...this.dashboard[this.editTileIndex],
        formlist: this.createKPIWidget.value.formlist,
        parameterNameHTML: this.createKPIWidget.value.parameterNameHTML,
        OperationValue:this.createKPIWidget.value.OperationValue,
        groupByFormat:this.createKPIWidget.value.groupByFormat,
        htmlTextArea:this.createKPIWidget.value.htmlTextArea


  



      };
  
      console.log('Updated tile:', updatedTile);
  
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated dashboard:', this.dashboard);
  
      if (this.all_Packet_store?.grid_details) {
        this.all_Packet_store.grid_details[this.editTileIndex] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex],
          ...updatedTile,
        };
      } else {
        console.error('grid_details is undefined or null in all_Packet_store.');
      }
  
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store, 'update_tile');
      }
  
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null or invalid. Unable to update the tile.');
    }
  }


  ngAfterViewInit() {
    this.updatePreview();
  }

  // replacePlaceholders(html: string): string {
  //   return html
  //     .replace(/\$\{Company\.single-select-1736229299687\}/g, 'Techno Ceiling Products')
  //     .replace(/\$\{Customer Address Line 1.text-1738508802001\}/g, '123 Business St.')
  //     .replace(/\$\{Customer Address Line 2.text-1738508803852\}/g, 'Suite 500')
  //     .replace(/\$\{Customer Address Line 3.text-1738508805269\}/g, 'Pune, Maharashtra')
  //     .replace(/\$\{Enquiry Code.prefix-text-1736229293987\}/g, 'ENQ-123456')
  //     .replace(/\$\{Submitted Date and Time.datetime-local-1738508742219\}/g, '2025-02-19')
  //     .replace(/\$\{Enquiry Date.datetime-local-1736915048372\}/g, '2025-02-25')
  //     .replace(/\$\{Payment.textarea-1738321835950\}/g, 'Net 30 Days')
  //     .replace(/\$\{Terms of Delivery.textarea-1738321922344\}/g, 'FOB Pune');
  // }

//   getDefaultHTML(): string {
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <style>
//         .logo-container img {
//             max-width: 200px;
//             max-height: 100px;
//             object-fit: contain;
//         }
//         body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             padding: 20px;
//             background-color: #f3f4f7;
//         }
//         .container {
//             background: linear-gradient(135deg, #d4e9e2, #ffffff);
//             padding: 30px;
//             border-radius: 12px;
//             max-width: 100%;
//             margin: auto;
//             box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
//         }
//         h1 {
//             color: #096b58;
//             text-align: center;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <header style="display: flex; justify-content: space-between; align-items: center;">
//             <div class="logo-container">
//                 <img src="https://assets-untangleds.s3.ap-south-1.amazonaws.com/Techno_logo.png">
//             </div>
//             <div style="text-align: right;">
//                 <p style="font-size: 20px; font-weight: bold;">Techno Ceiling Products</p>
//                 <p>S NO 723 724 726 Plot NO 5, Gadewadi Urawde<br>
//                 TAL Mulshi DIST Pune - 412108, Maharashtra<br>
//                 GSTIN: 27AACFT1658F1Z7</p>
//             </div>
//         </header>
//         <h1>Quotation</h1>
//         <section style="display: flex; justify-content: space-between;">
//             <div>
//                 <strong>Issued to:</strong>
//                 <p>${this.formattedFieldsHTML}</p> <!-- ✅ Dynamically Injected -->
//             </div>
//             <div>
//                 <p><strong>Quotation #: </strong> \${Enquiry Code.prefix-text-1736229293987} </p>
//                 <p><strong>Quotation Date: </strong> \${Submitted Date and Time.datetime-local-1738508742219}</p>
//                 <p><strong>Due Date: </strong> \${Enquiry Date.datetime-local-1736915048372}</p>
//             </div>
//         </section>
//         <h3>Payment Terms: \${Payment.textarea-1738321835950}</h3>
//         <h3>Delivery Terms: \${Terms of Delivery.textarea-1738321922344}</h3>
//         <h3>Bank Details:</h3>
//         <p>Account Name: TECHNO CEILING PRODUCTS</p>
//         <p>Bank Name: UNION BANK OF INDIA</p>
//     </div>
// </body>
// </html>`;
//   }

  updatePreview() {
    if (this.previewFrame && this.previewFrame.nativeElement) {
      const iframeDoc =
        this.previewFrame.nativeElement.contentDocument ||
        this.previewFrame.nativeElement.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(this.htmlPreview); // ✅ Use updated `htmlPreview`
      iframeDoc.close();
    }
  }
  

onAdd() {
  const getFormName = this.createKPIWidget.get('formlist')?.value || ''; // ✅ Default value to avoid undefined

  const eventCheck = this.createKPIWidget.get('parameterName')?.value || []; // ✅ Ensure array
  const getOperationValue = this.createKPIWidget.get('OperationValue')?.value || ''

  if (eventCheck.length === 0) {
    this.formattedFieldsHTML = '<p>No parameters selected</p>'; // ✅ Handle empty case
  } else {
    this.formattedFieldsHTML = eventCheck
      .map((field: { text: any; value: any; }) => `${getOperationValue}(\${${getFormName}.${field.text}.${field.value}})`)
      .join('<br>');
  }

  console.log('Formatted Fields:', this.formattedFieldsHTML);
  const updatedHTML = '';
  this.createKPIWidget.patchValue({ htmlTextArea: updatedHTML });

  // Ensure preview updates correctly
  this.htmlPreview = updatedHTML;
  this.updatePreview(); // ✅ Ensure preview updates correctly
}

  
  parameterValueCheck(eventCheck:any){
    console.log('eventCheck',eventCheck)



  }


  showValues = [
    { value: 'sum', text: 'Sum' },
    { value: 'min', text: 'Minimum' },
    { value: 'max', text: 'Maximum' },
    { value: 'average', text: 'Average' },
    { value: 'latest', text: 'Latest' },
    { value: 'previous', text: 'Previous' },

    { value: 'Constant', text: 'Constant' },
   
    { value: 'Count', text: 'Count' },
    { value: 'Count Dynamic', text: 'Count Dynamic' },
    { value: 'Equation', text: 'Equation' },
    { value: 'Count MultiplePram', text: 'Count Multiple Parameter' },
    { value: 'Sum MultiplePram', text: 'Sum Multiple Parameter' },
    { value: 'Average Multiple Parameter', text: 'Average Multiple Parameter' },
    { value: 'sumArray', text: 'SumArray' },
    { value: 'Advance Equation', text: 'Advance Equation' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'sum_difference', text: 'Sum Difference' },
    { value: 'distance_sum', text: 'Distance Sum' },
    
    

    

  ]

  openModalCalender() {
    const modalRef = this.modalService.open(this.calendarModal);
    modalRef.result.then(
      (result) => {
        console.log('Closed with:', result);
        this.handleModalClose(result); // Handle logic when modal closes
      },
      (reason) => {
        console.log('Dismissed with:', reason);
      }
    );
  }

  handleModalClose(selectedValue: string) {
    // Logic to handle what happens after the modal closes
    console.log('Handling post modal close logic with value:', selectedValue);
    // You can update your UI or state here based on the selectedValue
  }

  selectValue(value: string, modal: any) {
    console.log('Selected value:', value);

    // Set the value to the form control
    this.groupByFormatControl.setValue(value);

    // Close the modal after selection
    this.closeModal(modal);
  }

  hideTooltip() {
    this.tooltip = null;
  }
  showTooltip(item: string) {
    this.tooltip = item;
  }
  closeModal(modal: any) {
    if (modal) {
      modal.close(); // Close the modal
    } else {
      console.error('Modal reference is undefined');
    }
  }
}
