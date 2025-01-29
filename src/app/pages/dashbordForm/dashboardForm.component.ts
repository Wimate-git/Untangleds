import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { APIService } from 'src/app/API.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, Route } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
interface Node {
    id: string;
    parent: string;
    text: string;
    node_type:string;
}

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
    resultArray: any[] = [];
    loading = true;
    id: string | null;
    formIDPermission: any;
    locationPermission: any;
    filtermatchedData: any;
    tree_reponse: any[] =[]
    tree_response_1: any;
    filteredFormValueTree: string[];



    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService
    ) { }


    async ngOnInit(): Promise<void> {

        this.spinner.show()

        this.route.paramMap.subscribe(params => {
            console.log(this.route)
            this.form_group = params.get('formgroup');
            this.id = params.get('id')

            console.log("ROUTE FORMGROUP:", this.form_group)
        });

        this.login_detail = localStorage.getItem('userAttributes')

        this.loginDetail_string = JSON.parse(this.login_detail)
        console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

        this.client = this.loginDetail_string.clientID
        this.user = this.loginDetail_string.username
    

        console.log("FORM ID PERMISSION:",this.formIDPermission)
        console.log("LOCATION PERMISSION:",this.locationPermission )

        const test = await this.api.GetMaster(this.user + '#user#main', 1);
        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(test.metadata)))

        console.log("PERMISSION DATA:", this.permission_data)
        this.formIDPermission = this.permission_data.form_permission
        this.locationPermission = this.permission_data.location_permission
        console.log("FORM ID PERMISSION:",this.formIDPermission)
        console.log("LOCATION PERMISSION:",this.locationPermission )

        if (this.permission_data.permission_ID !== 'All') {

            const permisson_response = await this.api.GetMaster(this.client + '#permission#' + this.permission_data.permission_ID + '#main', 1);

            this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))

            console.log("GET PERMISSION DATA RESPONSE:", JSON.parse(this.permission_data.dynamicEntries))

            this.permissionForm = JSON.parse(this.permission_data.dynamicEntries)   // Dymaic Entries 

            console.log("PERMISSION FORM:", this.permissionForm)

            await this.api.GetMaster(this.client + "#formgroup#" + this.form_group + '#main', 1).then(async (result: any) => {

                this.groupFormResponse = JSON.parse(result.metadata)


                console.log("FORMGROUP MAIN:", this.groupFormResponse.formList)

                this.groupForm = this.groupFormResponse.formList

                if(this.locationPermission.includes('All')){

                    if(!this.formIDPermission.includes('All')){

                        console.log(this.formIDPermission)

                       this.filtermatchedData = this.formIDPermission.filter((item: any) => this.groupForm.includes(item));

                    }
                    else{
                        this.filtermatchedData = this.groupForm 
                    }
                }
                else{
                    // this.filtermatchedData = this.groupForm 

                    // console.log(`${this.client}#${this.loginDetail_string.companyID}#location#main`)

                   await this.api.GetMaster(`${this.client}#${this.loginDetail_string.companyID}#location#main`,1).then(async (result)=>{
                    if(result){
                        console.log("TREE RESPONSE:",JSON.parse(JSON.parse(JSON.stringify(result.metadata))))

                        this.tree_reponse = JSON.parse(JSON.parse(JSON.stringify(result.metadata)))

                        console.log("TREE RESPONSE 2:",JSON.parse(JSON.parse(JSON.stringify(this.tree_reponse[0].tree))))

                        this.tree_response_1 = JSON.parse(JSON.parse(JSON.stringify(this.tree_reponse[0].tree)))

                        const keyLocation = this.locationPermission.length === 1 && this.locationPermission[0] === "All" ? "All" : "Not all";
                        const keyDevices = this.formIDPermission.length === 1 && this.formIDPermission[0] === "All" ? "All" : "Not all";

                        if(`${keyLocation}-${keyDevices}` !== "All-All"){

                            const returnValueTree = await this.modifyList(this.locationPermission, this.formIDPermission,this.tree_response_1 );

                            console.log("FilterValuetreee",returnValueTree)

                            if (returnValueTree.length > 0) {
                                // Extracting text for nodes with node_type "device"
                                this.filtermatchedData = returnValueTree
                                    .filter(node => node.node_type === "device")
                                    .flatMap(node => node.text || []);
                                    console.log("jsonModified_in_service_final", this.filtermatchedData);
                            }
                            if (returnValueTree.length == 0){
                                this.filtermatchedData = []
                            }

                        }
                        console.log("GROUP LIST:",this.filtermatchedData)
                    }
                   })

                }

               


            }).catch((error) => {
                console.log("FormGroup Error:", error)
            })

            // permission dynamic Entries
            const allowedForms = this.permissionForm.reduce((acc: string[], permission: any) => {
                return acc.concat(permission.dynamicForm);
            }, []);

            console.log("ALLOW FORMS:", allowedForms)

            if (this.id == 'Calendar') {
                await this.api.GetMaster(this.client + "#systemCalendarQuery#lookup", 1).then((result: any) => {
                    if (result) {
                        this.helpherObj = JSON.parse(result.options)

                        this.formList = this.helpherObj.map((item: any) => item)

                        console.log("DYNAMIC FORMLIST:", this.formList)
                    }
                }).catch((error) => {
                    console.log("Error:", error)
                })
            }
            else {


                await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
                    if (result) {
                        this.helpherObj = JSON.parse(result.options)

                        this.formList = this.helpherObj.map((item: any) => item)

                        console.log("DYNAMIC FORMLIST:", this.formList)
                    }
                }).catch((error) => {
                    console.log("Error:", error)
                })
            }
             setTimeout(()=>{

            
            let matchingItems = []
            if (allowedForms.includes('All')) {      //dynamicEntrie selected all 
                matchingItems = this.filtermatchedData.filter((item: any) => this.groupFormResponse.formList.includes(item));
            }
            else {
                // matchingItems = allowedForms.filter((item: any) => this.groupFormResponse.formList.includes(item));

                matchingItems = this.filtermatchedData.filter((item: any) => this.groupFormResponse.formList.includes(item));
            }


            console.log("Match Item:", matchingItems)

            // If you want to push the matching items to another array
            this.resultArray = []
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
                    online: this.id  // Placeholder for online status
                }));

                console.log("CARD 259:",this.cards)

                if (this.cards.length == 0) {
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

            },2000)

        }
        else {

            await this.api.GetMaster(this.client + "#formgroup#" + this.form_group + '#main', 1).then((result: any) => {

                this.groupFormResponse = JSON.parse(result.metadata)


                console.log("FORMGROUP MAIN:", this.groupFormResponse.formList)

                this.groupForm = this.groupFormResponse.formList

                this.resultArray = this.groupFormResponse.formList

                if(this.locationPermission.includes('All')){

                    if(!this.formIDPermission.includes('All')){

                        console.log("FORMId PERMISSION")

                        // this.filtermatchedData = this.formIDPermission

                        this.filtermatchedData = this.formIDPermission.filter((item: any) => this.groupForm.includes(item));

                        console.log("PERMISSION NOT ALL:",this.filtermatchedData)


                    }
                    else{
                        this.filtermatchedData = this.groupFormResponse.formList
                    }
                }
                else{
                    // this.filtermatchedData = this.groupFormResponse.formList

                    this.api.GetMaster(`${this.client}#${this.loginDetail_string.companyID}#location#main`,1).then(async (result)=>{
                        if(result){
                            console.log("TREE RESPONSE:",JSON.parse(JSON.parse(JSON.stringify(result.metadata))))
    
                            this.tree_reponse = JSON.parse(JSON.parse(JSON.stringify(result.metadata)))
    
                            console.log("TREE RESPONSE 2:",JSON.parse(JSON.parse(JSON.stringify(this.tree_reponse[0].tree))))
    
                            this.tree_response_1 = JSON.parse(JSON.parse(JSON.stringify(this.tree_reponse[0].tree)))
    
                            const keyLocation = this.locationPermission.length === 1 && this.locationPermission[0] === "All" ? "All" : "Not all";
                            const keyDevices = this.formIDPermission.length === 1 && this.formIDPermission[0] === "All" ? "All" : "Not all";
    
                            if(`${keyLocation}-${keyDevices}` !== "All-All"){
    
                                const returnValueTree = await this.modifyList(this.locationPermission, this.formIDPermission,this.tree_response_1 );
    
                                console.log("FilterValuetreee",returnValueTree)
    
                                if (returnValueTree.length > 0) {
                                    // Extracting text for nodes with node_type "device"
                                    this.filtermatchedData = returnValueTree
                                        .filter(node => node.node_type === "device")
                                        .flatMap(node => node.text || []);
                                        console.log("jsonModified_in_service_final", this.filtermatchedData);
                                }
                                if (returnValueTree.length == 0){
                                    this.filtermatchedData = []
                                }
    
                            }
                        }
                       })

                    console.log("PERMISSION ALL:",this.filtermatchedData)
                }


            }).catch((error) => {
                console.log("FormGroup Error:", error)
            })

            if (this.id == 'Calendar') {
                await this.api.GetMaster(this.client + "#systemCalendarQuery#lookup", 1).then((result: any) => {
                    if (result) {
                        this.helpherObj = JSON.parse(result.options)

                        this.formList = this.helpherObj.map((item: any) => item)

                        console.log("DYNAMIC FORMLIST:", this.formList)
                    }
                }).catch((error) => {
                    console.log("Error:", error)
                })
            }
            else {


                await this.api.GetMaster(this.client + "#dynamic_form#lookup", 1).then((result: any) => {
                    if (result) {
                        this.helpherObj = JSON.parse(result.options)

                        this.formList = this.helpherObj.map((item: any) => item)

                        console.log("DYNAMIC FORMLIST:", this.formList)
                    }
                }).catch((error) => {
                    console.log("Error:", error)
                })
            }
            setTimeout(()=>{

            this.cards = this.formList
                .filter(data => {
                    // Check if the value at index 0 of the formList item matches any value in groupForm
                    // return this.resultArray.includes(data[0]);

                    return this.filtermatchedData.includes(data[0]);
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

                if (this.cards.length == 0) {
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

    ),2000}

        console.log("CARDS ON FORMLIST:", this.cards.length)

        // if (this.cards.length == 0) {
        //     const errorAlert_icon: SweetAlertOptions = {
        //         icon: 'error',
        //         title: 'No Forms data available.',
        //         text: '',
        //     };

        //     this.showAlert(errorAlert_icon)
        // }
        // this.loading = false;
        // this.spinner.hide()
        // this.cdr.detectChanges();
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
   
    async modifyList(locationPermission: any, formPermission: any, originalArray: Node[]): Promise<Node[]> {
        const keyLocation = locationPermission.length === 1 && locationPermission[0] === "All" ? "All" : "Not all";
        const keyDevices = formPermission.length === 1 && formPermission[0] === "All" ? "All" : "Not all";
    
        console.log("modifyList:", `${keyLocation}-${keyDevices}`);
    
        switch (`${keyLocation}-${keyDevices}`) {
            case "All-All":
                return [];
            case "Not all-All":
                return this.calculateNodesToShow(locationPermission, originalArray);
            case "All-Not all":
                return this.calculateNodesToShow(formPermission, originalArray);
            case "Not all-Not all":
                const data1 = await this.calculateNodesToShow(locationPermission, originalArray);
                const data2 = await this.calculateNodesToShow(formPermission, data1);
                return data2;
            default:
                console.log("Unrecognized case");
                return [];
        }
      }
    
      async calculateNodesToShow(permissions: any, originalData: Node[]): Promise<Node[]> {
        let nodeMap = this.enhanceNodeMap(originalData);
        let nodesToShow: Node[] = [];
        permissions.forEach((permission: string) => {
            const keyText = "text_" + permission;
            const nodes = nodeMap[keyText] || [];
    
            nodes.forEach((permittedNode: Node) => {
                if (permittedNode && !nodesToShow.includes(permittedNode)) {
                    nodesToShow.push(permittedNode);
                    this.collectDescendants(permittedNode, nodesToShow, originalData);
                    this.markAncestors(permittedNode, nodesToShow, originalData);
                }
            });
        });
        return nodesToShow.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
      }
    
      enhanceNodeMap(originalData: Node[]): Record<string, Node[]> {
        let nodeMap: Record<string, Node[]> = {};
        originalData.forEach((node) => {
            const textKey = "text_" + node.text;
    
            if (!nodeMap[textKey]) {
                nodeMap[textKey] = [];
            }
            nodeMap[textKey].push(node);
        });
        return nodeMap;
      }
    
      collectDescendants(node: Node, result: Node[], originalData: Node[]): void {
        let children = originalData.filter((n) => n.parent === node.id);
        children.forEach((child) => {
            if (!result.includes(child)) {
                result.push(child);
                this.collectDescendants(child, result, originalData);
            }
        });
      }
    
      markAncestors(node: Node, result: Node[], originalData: Node[]): void {
        if (node.parent !== "#") {
            const parentNode = originalData.find((n) => n.id === node.parent);
            if (parentNode && !result.includes(parentNode)) {
                result.push(parentNode);
                this.markAncestors(parentNode, result, originalData);
            }
        }
      }
    

}