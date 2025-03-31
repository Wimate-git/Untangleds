import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fromEvent, debounceTime, map } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-crud-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SweetAlert2Module,
    DataTablesModule,
  ],
  templateUrl: './crud-summary.component.html',
  styleUrls: ['./crud-summary.component.scss'],
})
export class CrudSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() datatableConfig: any = {};
  @Input() route: string = '/';
  @Input() reload: EventEmitter<boolean>;
  @Input() modal: TemplateRef<any>;

  @Output() deleteEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() createEvent = new EventEmitter<boolean>();
  @Input() summaryDashboardUpdate:any
  @Input() summaryDashboardView:any
  @Input() userPermission:any
  

  dtOptions: Config = {};

  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;

  @ViewChild('deleteSwal') public deleteSwal!: SwalComponent;
  @ViewChild('successSwal') public successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  private modalRef: NgbModalRef;
  private clickListener: () => void;
  idInAction: number | undefined;
  modalConfig: NgbModalOptions = {
    // modalDialogClass: 'modal-dialog modal-dialog-centered mw-1000px',
       modalDialogClass: 'modal-dialog modal-fullscreen p-9',

  };

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom: `<"row"<"col-sm-6"l><"col-sm-6"f>>` +
        `<"row"<"col-sm-12"tr>>` +
        `<"row"<"col-sm-12"p>>`,
        
      processing: true,
      language: {
        processing: `<span class="spinner-border spinner-border-sm align-middle"></span> Loading...`
      },
      ...this.datatableConfig,
      buttons: [
        { extend: 'colvis', text: 'Column Visibility', className: 'btn btn-secondary' },
        { extend: 'excel', text: 'Export to Excel', className: 'btn btn-success' }
      ],
    order:false,
      ordering: false,
    };

    this.renderActionColumn();
    this.setupSweetAlert();

    if (this.reload) {
      this.reload.subscribe(() => {
        this.modalService.dismissAll();
        this.datatableElement.dtInstance.then((dtInstance) => dtInstance.ajax.reload());
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('summaryDashboardUpdate check from crudSummary',this.summaryDashboardUpdate)
    console.log('summaryDashboardView check from crudSummary',this.summaryDashboardView)
  }

  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      sorting: false,
      title: '<span style="color: black;">Actions</span>',
      render: (data: any, type: any, full: any) => {
        // Convert values to booleans if they are strings
        const summaryDashboardUpdate = this.summaryDashboardUpdate === 'true' || this.summaryDashboardUpdate === true;
        const summaryDashboardView = this.summaryDashboardView === 'true' || this.summaryDashboardView === true;
        const userPermission = this.userPermission; // Assuming userPermission is a string
  
        // Debugging logs
        console.log('summaryDashboardUpdate:', summaryDashboardUpdate);
        console.log('summaryDashboardView:', summaryDashboardView);
        console.log('userPermission:', userPermission);
  
        const editButton = `
          <button class="btn btn-icon btn-active-light-primary" data-action="edit" data-id="${full.P1}">
            <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
          </button>`;
  
        let deleteButton = ''; // Default to hidden
  
        // Condition to show delete button if:
        // 1. summaryDashboardUpdate === true AND summaryDashboardView === true
        // 2. OR userPermission === 'all'
        if ((summaryDashboardUpdate === true && summaryDashboardView === true) || userPermission === 'All') {
          deleteButton = `
            <button class="btn btn-icon btn-active-light-primary" data-action="delete" data-id="${full.P1}">
              <i class="ki-duotone ki-trash fs-3">
                <span class="path1"></span><span class="path2"></span>
                <span class="path3"></span><span class="path4"></span><span class="path5"></span>
              </i>
            </button>`;
        }
  
        console.log('Delete Button:', deleteButton); // Check if it’s being created correctly
  
        return `${editButton} ${deleteButton}`;
      }
    };
  
    if (this.dtOptions.columns) {
      this.dtOptions.columns.push(actionColumn);
    }
  }
  
  
  
  

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
     
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;

        switch (action) {
          case 'view':
            this.router.navigate([`${this.route}/${id}`]);
            break;

          case 'create':
            this.createEvent.emit(true);
            this.modalRef = this.modalService.open(this.modal, this.modalConfig);
            break;

          case 'edit':
            this.editEvent.emit(this.idInAction);
            this.modalRef = this.modalService.open(this.modal, this.modalConfig);
            break;

          case 'delete':
            this.deleteSwal.fire().then((clicked) => {
              if (clicked.isConfirmed) {
                this.successSwal.fire();
              }
            });
            break;
        }
      }
    });

    this.triggerFilter();
  }

  ngOnDestroy(): void {
    if (this.reload) {
      this.reload.unsubscribe();
    }
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  triggerDelete(): void {
    console.log('this.idInAction checking',this.idInAction)
    this.deleteEvent.emit(this.idInAction);
  }

  triggerFilter(): void {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        debounceTime(300),
        map((event) => (event.target as HTMLInputElement).value.trim().toLowerCase())
      )
      .subscribe((value) => {
        this.datatableElement.dtInstance.then((dtInstance) => {
          dtInstance.search(value).draw();
        });
      });
  }

  setupSweetAlert(): void {
    this.swalOptions = {
      buttonsStyling: false,
    };
  }
}
