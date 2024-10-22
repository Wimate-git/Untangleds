import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Config } from 'datatables.net';
import { Crud2Module } from "../../modules/crud2/crud.module";
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connection-settings',
  standalone: false,
  templateUrl: './connection-settings.component.html',
  styleUrl: './connection-settings.component.scss'
})
export class ConnectionSettingsComponent implements OnInit{

  constructor(private fb:FormBuilder){}
  
  swalOptions: SweetAlertOptions = {};
  isLoading:boolean = false
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  datatableConfig: Config = {};
  createConnectionField: UntypedFormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isCollapsed1 = false;
  editOperation = false;
  errorForUniqueID: any = '';
  listofSK: any = [];


  ngOnInit(): void {
    this.initializeForm()
  }


  initializeForm(){
    this.createConnectionField = this.fb.group({
      contnID:['',Validators.required]
    })
  }


  delete(id: number) {
    // console.log("Deleted username will be", id);
    // this.deleteCompany(id);
  }

  create() {
    // console.log("Add is clicked");
    // this.openModal('')
  }


  edit(P1: any) {
    // console.log("Edited username is here ", P1);
    // $('#companyModal').modal('show');
    // this.openModalHelpher(P1)
  }


  checkUniqueIdentifier(getID: any) {
    console.log('getID', getID);
    this.errorForUniqueID = '';
    for (let uniqueID = 0; uniqueID < this.listofSK.length; uniqueID++) {
      if (getID.target.value == this.listofSK[uniqueID]) {
        this.errorForUniqueID = "Company ID already exists";
      }
    }
  }




  onSubmit(event:any){
     
    // console.log("Submitted is clicked ",event);
    // if(event.type == 'submit' && this.editOperation == false){
    //   this.createNewCompany('')
    // }
    // else{
    //   this.updateCompany(this.createCompanyField.value,'editCompany')
    // }
  }

}
