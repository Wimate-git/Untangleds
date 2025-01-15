import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal,{ SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, Route } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'app-dashboardForm',
    templateUrl: './dashboardForm.component.html',
    styleUrls: ['./dashboardForm.component.scss'],
})
export class DashboardFormComponent implements OnInit {


  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal')

  noticeSwal: SwalComponent;

    login_detail: any;
    loginDetail_string: any;
    client: any;
    user: any;
    formList: any[] = [];
    cards: any[] = []
    cards_2: any[] = []
    formgroup: any[] = [];
    showCards2 = true;
    permission_data: any;
    helpherObj: any;
    permissionForm: any;
    permissionFormgroup: any;
    form_group: string | null;
    groupFormResponse: any;
    groupForm: any;
    group: any[] = [];
    resultArray:any[] =[];
    loading = true;
  


    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private spinner:NgxSpinnerService
    ) { }


    async ngOnInit(): Promise<void> {

        this.spinner.show()

        this.route.paramMap.subscribe(params => {
            console.log(this.route)
            this.form_group = params.get('formgroup');

            console.log("ROUTE FORMGROUP:", this.form_group)
        });

        this.login_detail = localStorage.getItem('userAttributes')

        this.loginDetail_string = JSON.parse(this.login_detail)
        console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

        this.client = this.loginDetail_string.clientID
        this.user = this.loginDetail_string.username

        const test = await this.api.GetMaster(this.user + '#user#main', 1);
        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

        console.log("PERMISSION DATA:", this.permission_data)

        if(this.permission_data.permission_ID !== 'All'){

        const permisson_response = await this.api.GetMaster(this.client + '#permission#' + this.permission_data.permission_ID + '#main', 1);

        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

        console.log("GET PERMISSION DATA RESPONSE:", JSON.parse(this.permission_data.dynamicEntries))

        this.permissionForm = JSON.parse(this.permission_data.dynamicEntries)   // Dymaic Entries 

        console.log("PERMISSION FORM:",this.permissionForm)

        await this.api.GetMaster(this.client + "#formgroup#" + this.form_group + '#main', 1).then((result: any) => {

            this.groupFormResponse = JSON.parse(result.metadata)


            console.log("FORMGROUP MAIN:", this.groupFormResponse.formList)

            this.groupForm = this.groupFormResponse.formList


        }).catch((error) => {
            console.log("FormGroup Error:", error)
        })

        const allowedForms = this.permissionForm.reduce((acc: string[], permission: any) => {
            return acc.concat(permission.dynamicForm);
        }, []);

        console.log("ALLOW FORMS:", allowedForms)


        await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
            if (result) {
                this.helpherObj = JSON.parse(result.options)

                this.formList = this.helpherObj.map((item: any) => item)

                console.log("DYNAMIC FORMLIST:", this.formList)
            }
        }).catch((error) => {
            console.log("Error:", error)
        })

        let matchingItems = []
        if(allowedForms.includes('All') ){
            matchingItems =this.groupForm.filter((item: any) => this.groupFormResponse.formList.includes(item));
        }
        else{
         matchingItems = allowedForms.filter((item: any) => this.groupFormResponse.formList.includes(item));
        }

       
        console.log("Match Item:", matchingItems)

        // If you want to push the matching items to another array
        this.resultArray =[]
        this.resultArray.push(...matchingItems);

        console.log(this.resultArray);


        this.cards = this.formList
            .filter(data => {
                // Check if the value at index 0 of the formList item matches any value in groupForm
                return this.resultArray.includes(data[0]);
            })
            .map(data => ({
                // Your card structure here
                icon: 'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
                name: data[0],  // Name from formList index 0
                job: data[1],   // Job description from formList index 1
                avgEarnings: data[3] ? new Date(data[3] * 1000).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '',  // Handle cases where values may be empty
                totalEarnings: data[0] || '',  // Fallback if index 5 is empty
                online: ''  // Placeholder for online status
            }));

        }
        else{
            await this.api.GetMaster(this.client + "#formgroup#" + this.form_group + '#main', 1).then((result: any) => {

                this.groupFormResponse = JSON.parse(result.metadata)
    
    
                console.log("FORMGROUP MAIN:", this.groupFormResponse.formList)
    
                this.groupForm = this.groupFormResponse.formList

                this.resultArray = this.groupFormResponse.formList
    
    
            }).catch((error) => {
                console.log("FormGroup Error:", error)
            })

            await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
                if (result) {
                    this.helpherObj = JSON.parse(result.options)
    
                    this.formList = this.helpherObj.map((item: any) => item)
    
                    console.log("DYNAMIC FORMLIST:", this.formList)
                }
            }).catch((error) => {
                console.log("Error:", error)
            })

            this.cards = this.formList
            .filter(data => {
                // Check if the value at index 0 of the formList item matches any value in groupForm
                return this.resultArray.includes(data[0]);
            })
            .map(data => ({
                // Your card structure here
                icon: 'https://dreamboard-dynamic.s3.ap-south-1.amazonaws.com/public/Climaveneta/Live+Contract/liveContract.png',
                name: data[0],  // Name from formList index 0
                job: data[1],   // Job description from formList index 1
                avgEarnings: data[3] ? new Date(data[3] * 1000).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '',  // Handle cases where values may be empty
                totalEarnings: data[0] || '',  // Fallback if index 5 is empty
                online: ''  // Placeholder for online status
            }));
        }


        console.log("CARDS ON FORMLIST:", this.cards.length)

        if(this.cards.length == 0){
            const errorAlert_icon: SweetAlertOptions = {
                icon: 'error',
                title: 'No Forms data available.',
                text: '',
              };
      
              this.showAlert(errorAlert_icon)
        }
        this.loading = false;
        this.spinner.hide()
        this.cdr.detectChanges();
    }

    searchQuery = '';
  get filteredCards() {
    return this.cards.filter(card =>
      card.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      card.job?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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


}