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
  selector: 'app-crud-report',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudreportComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() datatableConfig: any = {};
  @Input() componentSource: string = '';

  @Input() route: string = '/';

  // Reload emitter inside datatable
  @Input() reload: EventEmitter<boolean>;

  @Input() modal: TemplateRef<any>;

  @Output() deleteEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() createEvent = new EventEmitter<boolean>();

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-1000px',
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

  constructor(private renderer: Renderer2, private router: Router, private modalService: NgbModal,private cd:ChangeDetectorRef) { }




  ngOnInit(): void {

    this.dtOptions = {
     
      // dom: "<'row'<'col-sm-12'tr>>" +
      // "<'d-flex align-items-baseline justify-content-between'<'col-sm-12 col-md-5'i><'d-flex align-items-baseline justify-content-between'p>>",
      dom: `<"row"<"col-sm-6"><"col-sm-6"f>>` +
      `<"row"<"col-sm-12"tr>>` +
      `<"row"<"col-sm-12"p>>`,
      processing: true,

      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Loading...'
      },
      search:true,
      ...this.datatableConfig,
      order:[4],
      ordering:true
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
          <button class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="editQueryTable" data-id="${full.P1}">
            <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
          </button>`;

        const deleteButton = `
          <button class="btn btn-icon btn-active-light-danger w-30px h-30px" data-action="deleteQueryTable" data-id="${full.P1}">
            <i class="ki-duotone ki-trash fs-3">
              <span class="path1"></span><span class="path2"></span>
              <span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
          </button>`;

        const buttons = [];

        if (this.editEvent.observed) {
          buttons.push(editButton);
        }

        if (this.deleteEvent.observed) {
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
      const closestBtn = event.target.closest('.btn');
     
      if (closestBtn ) {
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

          case 'editQueryTable':
            console.log("Edit is triggerd");
            this.editEvent.emit(this.idInAction);
            // this.modalRef = this.modalService.open(this.modal, this.modalConfig);
            break;

          case 'deleteQueryTable':
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

    // this.clearDataTable()

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

        console.log("Data table value is here ",value);

        if (action === 'company_filter') {
          console.log("Data table instance is here ", this.datatableElement.dtInstance);
          this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.search(value).draw());
        }
      });
  }


  private clearDataTable(): void {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy(); // Destroy the current DataTable instance
      }).catch(error => {
        console.error('Error destroying DataTable instance:', error);
      });
    }
  }

  setupSweetAlert() {
    this.swalOptions = {
      buttonsStyling: false,
    };
  }
}
