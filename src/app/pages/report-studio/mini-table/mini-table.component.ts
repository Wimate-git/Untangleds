import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, Column, GridOptions, ColumnState, ColumnMovedEvent } from 'ag-grid-community';
import { APIService } from 'src/app/API.service';
import { SharedService } from '../../shared.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mini-table',
  standalone: true,
  imports: [AgGridAngular,CommonModule,NgxSpinnerModule],
  templateUrl: './mini-table.component.html',
  styleUrl: './mini-table.component.scss'
})
export class MiniTableComponent {
  showTable:boolean = false
  @Input() tableBody:any;
  @Input() dynamicFormData:any;
  @Input() formName:any;
  tableDataWithFormFilters:any = []
  pageSizeOptions = [10, 25, 50, 100];
  SK_clientID: any;
  getLoggedUser: any;

  constructor(private spinner:NgxSpinnerService,public modal: NgbActiveModal, private cdr: ChangeDetectorRef,private api:APIService,private configService:SharedService){}

  ngOnInit() {
    this.getLoggedUser = this.configService.getLoggedUserDetails()
    this.SK_clientID = this.getLoggedUser.clientID;
    console.log("Table body is here ",this.tableBody);
    console.log("Table form is here ",this.formName);
    console.log("Table Dynamic Form Data is here ",this.dynamicFormData);

    this.processData(this.tableBody)
  }


  async processData(tableBody: any) {
    // this.spinner.show()
    this.tableDataWithFormFilters = [];
  
    // Use a for...of loop to handle async correctly
    for (const key of Object.keys(tableBody)) {
      const filterDynamicForm = this.dynamicFormData.find((element: any) => Object.keys(element)[0] == this.formName);
      
      if (filterDynamicForm && filterDynamicForm[this.formName]) {
        const tempDataHolder = filterDynamicForm[this.formName].find((item: any) => key.startsWith(item.name));
  
        if (tempDataHolder && tempDataHolder.type == 'table') {
          const formFilter = tempDataHolder.validation.formName_table;
          const formData = tableBody[key];
          
          try {
            // Wait for API call to complete
            const res = await this.api.GetMaster(`${this.SK_clientID}#dynamic_form#${formFilter}#main`, 1);
            let dynamicMetadata: any;
            
            if (res && res.metadata) {
              dynamicMetadata = JSON.parse(res.metadata).formFields;
            }
  
            // Wait for mapLabels to complete
            const rows = await this.mapLabels(formData, dynamicMetadata);
  
            // Push the result into tableDataWithFormFilters
            this.tableDataWithFormFilters.push({ formFilter: formFilter, rows: rows });
  
          } catch (error) {
            // this.spinner.hide()
            console.error('Error while processing table data:', error);
          }
        }
      }
    }
  
    // Log the final table data after all async operations are complete
    console.log("Filtered Mini table rows are here ", this.tableDataWithFormFilters);

    this.showTable = true
    // this.spinner.hide()
  
    // Trigger change detection (Angular specific)
    this.cdr.detectChanges();
  }
  





  async mapLabels(responses:any, metadata:any) {
    const mappedResponses = responses.map((response: any) => {
      const mappedResponse = { ...response };
  
      metadata.forEach((field: any) => {
        const fieldName = field.name;   
        const label = field.label;
        
      

  
        if (mappedResponse.hasOwnProperty(fieldName)) {
          // If the field name contains 'signature', process as an image
          if (fieldName.toLowerCase().includes('signature')) {
            mappedResponse[label] = mappedResponse[fieldName];
          }
          else {
            mappedResponse[label] = mappedResponse[fieldName];
          }
          delete mappedResponse[fieldName];
        } 
        else {
          mappedResponse[label] = 'N/A';
        }
      });
    
      
  
      if (mappedResponse.hasOwnProperty('created_time')) {
        const createdDate = new Date(mappedResponse.created_time);
        mappedResponse['Created Date'] = createdDate.toLocaleString();
        delete mappedResponse.created_time;
      }
  
      if (mappedResponse.hasOwnProperty('updated_time')) {
        const updatedDate = new Date(mappedResponse.updated_time);
        mappedResponse['Updated Date'] = updatedDate.toLocaleString();
        delete mappedResponse.updated_time;
      }
  
      // delete mappedResponse.id;
  
     
      return mappedResponse;
    });
  
    return mappedResponses;
  }



  createColumnDefs(rowData: any[], formName: string): ColDef[] {
    const columns: ColDef[] = [];
  
    if (rowData.length > 0) {

      columns.push({
        headerName: 'Form Filter',
        field: 'formFilter',
        flex: 1,
        filter: true,
        minWidth: 150,
        hide: true,
    
        valueGetter: (params: any) => params.data.formFilter
      });
  
      const sampleRow = rowData[0]; 
  
 
      Object.keys(sampleRow).forEach((key) => {
        if (key !== 'formFilter' && key !== 'PK' && key !== 'SK' && key !== 'Updated Date' && key !== 'id') {
          columns.push({
            headerName: this.formatHeaderName(key), 
            field: key,
            flex: 1,
            minWidth: 150,
            filter: true,
            sortable: true,
            cellRenderer: null, 
            cellRendererParams: {
              context: this 
            }
          });
        }
      });
  
  
      if (sampleRow.hasOwnProperty('Updated Date')) {
        columns.push({
          headerName: 'Updated Date',
          field: 'Updated Date',
          flex: 1,
          filter: 'agDateColumnFilter',
          sortable: true,
          minWidth: 200,
          sort: 'desc',
        });
      }
    }
  
    return columns;
  }
  

  
  



  formatHeaderName(key: string): string {
    return key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
}

