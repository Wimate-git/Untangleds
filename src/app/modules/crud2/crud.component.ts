import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { Api, Config } from 'datatables.net';

@Component({
  selector: 'app-crud-user',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class Crud2Component implements OnInit, AfterViewInit, OnDestroy{

  @Input() datatableConfig: any = {};
  @Input() componentSource: string = '';
  @Input() permissionAll:any;
  @Input() route: string = '/';

  // Reload emitter inside datatable
  @Input() reload: EventEmitter<boolean>;

  @Input() modal: TemplateRef<any>;

  @Output() deleteEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>(); 
  @Output() createEvent = new EventEmitter<boolean>();


  modalConfig: NgbModalOptions = {
    // modalDialogClass: 'modal-dialog modal-dialog-centered mw-1000px',
    modalDialogClass: 'modal-dialog modal-fullscreen p-9'
  };

  dtOptions: Config = {};

  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  private idInAction: number;

  // modalConfig: NgbModalOptions = {
  //   modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  // };

  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  private modalRef: NgbModalRef;

  private clickListener: () => void;
  filterSearch: string = 'filter';

  constructor(private renderer: Renderer2, private router: Router, private modalService: NgbModal,private cd:ChangeDetectorRef) { }




  ngOnInit(): void {


    if(this.componentSource == 'app-configuration'){
      this.filterSearch = 'matrix_filter'
    }
    else if(this.componentSource == 'client-configuration'){
      this.filterSearch = 'client_filter'
    }
    else if(this.componentSource == 'app-connection-settings'){
      this.filterSearch = 'company_filter'
    }






    this.dtOptions = {
      dom: "<'row'<'col-sm-12'tr>>" +
      "<'d-flex align-items-baseline justify-content-between'<'col-sm-12 col-md-5'i><'d-flex align-items-baseline justify-content-between'p>>",
      processing: true,
      order:true,
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Loading...'
      },
      search: true,
      "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
      lengthChange:true,
    pageLength: 10, // Default number of rows to show
      ...this.datatableConfig
    };
    
    this.renderActionColumn();
    this.setupSweetAlert();
    
    if (this.reload) {
      this.reload.subscribe(data => {
        this.modalService.dismissAll();
        this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.ajax.reload());
      });
    }
    
  }


  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      title: 'Actions',
      render: (data: any, type: any, full: any) => {
        const editButton = `
          <button class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="edit" data-id="${full.P1}">
            <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
          </button>`;

        const deleteButton = `
          <button class="btn btn-icon btn-active-light-danger w-30px h-30px" data-action="delete" data-id="${full.P1}">
            <i class="ki-duotone ki-trash fs-3">
              <span class="path1"></span><span class="path2"></span>
              <span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
          </button>`;

        const buttons = [];

        if (this.editEvent.observed) {
          buttons.push(editButton);
        }

       
        if(this.componentSource == 'app-client'){
          if(this.deleteEvent.observed && this.permissionAll && this.permissionAll.update){
            buttons.push(deleteButton);
          }
        }
        else if (this.deleteEvent.observed) {
          buttons.push(deleteButton);
        }

        return buttons.join('');
      },
    };

    if (this.dtOptions.columns) {
      this.dtOptions.columns.push(actionColumn);
    }


  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      
      console.log("Clicked event is here b ",event);

      const closestBtn = event.target.closest('.btn,.clicable-href');

      console.log("Clicked event is here ",closestBtn);
     
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;

        switch (action) {
          case 'view':
            this.router.navigate([`${this.route}/${id}`]);
            break;

          case 'create':
            this.createEvent.emit(true);
            this.modalRef = this.modalService.open(this.modal, {
              ...this.modalConfig, // Keep existing modal configuration if any
              backdrop: 'static' });
            break;

          case 'edit':
            this.editEvent.emit(this.idInAction);
               // Open the modal and prevent closing on outside click
              this.modalRef = this.modalService.open(this.modal, {
                ...this.modalConfig, // Keep existing modal configuration if any
                backdrop: 'static'
            });
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
    this.reload.unsubscribe();
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  triggerDelete() {
    this.deleteEvent.emit(this.idInAction);
  }

  triggerFilter() {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        debounceTime(50),
        map(event => {
          const target = event.target as HTMLElement;
          const action = target.getAttribute('data-action');
          const value = (target as HTMLInputElement).value?.trim().toLowerCase();

          return { action, value };
        })
      )
      .subscribe(({ action, value }) => {
        if (action === this.filterSearch) {
          console.log("Data table for user ",this.datatableElement.dtInstance);
          this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.search(value).draw());

          console.log("After draw ",this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.search(value).draw()));
        }
      });
  }

  setupSweetAlert() {
    this.swalOptions = {
      buttonsStyling: false,
    };
  }
}
