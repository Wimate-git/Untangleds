import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Route } from "@angular/router";

@Component({
    selector: 'app-dashboardForm',
    templateUrl: './dashboardForm.component.html',
    styleUrls: ['./dashboardForm.component.scss'],
})
export class DashboardFormComponent implements OnInit {

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


    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
    ) { }


    async ngOnInit(): Promise<void> {

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

        const permisson_response = await this.api.GetMaster(this.client + '#permission#' + this.permission_data.permission_ID + '#main', 1);

        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

        console.log("GET PERMISSION DATA RESPONSE:", JSON.parse(this.permission_data.dynamicEntries))

        this.permissionForm = JSON.parse(this.permission_data.dynamicEntries)   // Dymaic Entries 

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

        const matchingItems = allowedForms.filter((item: any) => this.groupFormResponse.formList.includes(item));

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
                totalEarnings: data[5] || '',  // Fallback if index 5 is empty
                online: ''  // Placeholder for online status
            }));


        console.log("CARDS ON FORMLIST:", this.cards.length)
        this.cdr.detectChanges();
    }



}