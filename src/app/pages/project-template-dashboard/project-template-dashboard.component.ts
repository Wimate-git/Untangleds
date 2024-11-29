import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-project-template-dashboard',
    templateUrl: './project-template-dashboard.component.html',
})
export class ProjectTemplateDashboardComponent implements OnInit {
    formList: any[] = [];
    login_detail: any;
    loginDetail_string: any;
    client: any;
    users: any;
    transformedData: any[]=[];
    projectdata: any[];
    projectTemplateData: any[]=[];
    projectTemplate: any[];
    projectgroup: string | null;
    groupData: any;
    project: any[];
    project_Data: any[]=[];
   
    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
    ) { }


    async ngOnInit(): Promise<void> {

        this.route.paramMap.subscribe(params => {
            console.log(this.route)
            this.projectgroup = params.get('projectgroup');

            console.log("ROUTE PROJECTGROUP:", this.projectgroup)
        });

        this.login_detail = localStorage.getItem('userAttributes')

        this.loginDetail_string = JSON.parse(this.login_detail)
        console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

        this.client = this.loginDetail_string.clientID
        this.users = this.loginDetail_string.username
        

        await this.api.GetMaster(this.client+'#folder#'+this.projectgroup+'#main',1).then((group_res)=>{

            this.groupData = JSON.parse(JSON.parse(JSON.stringify(group_res.metadata)))

             console.log("AFTER STRINGIFY:",this.groupData.formList)

        }).catch((error)=>{
              console.log("PROJECT GROUP MAIN TABLE ERROR:",error)
        })

        this.projectTemplate = await this.fetchprojectTemplatelookup(1)

        this.project  = await this.fetchprojectlookup(1)


        console.log("PROJECT LOOKUP DATA:", this.project)

        const filteredData1 = this.projectTemplate.filter(item => this.groupData.formList.includes(item.P1));

        console.log("After Filter Project Template:",filteredData1);


        const p1Values = filteredData1.map(item => item.P1);
        const filteredData = this.project.filter(item => p1Values.includes(item.P12));

         console.log("After filter of Project:",filteredData);


         this.transformedData = filteredData.map(item => ({
            id: item.P1,
            description: item.P2,
            Files: JSON.parse(item.P3).length,
            filedata:JSON.parse(item.P3),
            color: item.P5,
            label_1:item.P9,
            label_2:item.P10,
            label_3:item.P11,
            icon: JSON.parse(item.P4)
          }));
          

          console.log("After creating object :",this.transformedData)
        this.cdr.detectChanges();   

    } 

    async fetchprojectTemplatelookup(sk:number){
        try {
            const response = await this.api.GetMaster(this.client + "#projectTemplate#lookup", sk);
    
            if (response && response.options) {
                // Check if response.options is a string
                if (typeof response.options === 'string') {
                    let data = JSON.parse(response.options);
                    console.log("d1 =", data);
                    if (Array.isArray(data)) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
    
                            if (element !== null && element !== undefined) {
                                // Extract values from each element and push them to formList
                                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                                const { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 } = element[key]; // Extract values from the nested object
                                this.projectTemplateData.push({ P1, P2, P3, P4, P5, P6, P7, P8,P9, P10, P11}); // Push an array containing P1, P2, and P3 values
                                console.log("d2 =", this.projectTemplateData);
                            } else {
                                break;
                            }
                        }
    
                        // Sort formList by P8 in descending order
                        this.projectTemplateData.sort((a: any, b: any) => b.P8 - a.P8);
                        console.log("Folder Lookup sorting", this.projectTemplateData);
    
                        // Continue fetching recursively
                        await this.fetchprojectTemplatelookup(sk + 1);
                    } else {
                        console.error('Invalid data format - not an array.');
                    }
                } else {
                    console.error('response.options is not a string.');
                }
            } else {
                console.log("All the dreamboard id are here ", this.projectTemplateData);
            }
    
            // Return the final formList value
            return this.projectTemplateData;
        } catch (error) {
            console.error('Error:', error);
            // Handle the error as needed and return an empty array
            return [];
        }


    }

    async fetchprojectlookup(sk:number){
        try {
            const response = await this.api.GetMaster(this.client + "#project#lookup", sk);
    
            if (response && response.options) {
                // Check if response.options is a string
                if (typeof response.options === 'string') {
                    let data = JSON.parse(response.options);
                    console.log("d1 =", data);
                    if (Array.isArray(data)) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
    
                            if (element !== null && element !== undefined) {
                                // Extract values from each element and push them to formList
                                const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                                const { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11,P12 } = element[key]; // Extract values from the nested object
                                this.project_Data.push({ P1, P2, P3, P4, P5, P6, P7, P8,P9, P10, P11,P12}); // Push an array containing P1, P2, and P3 values
                                console.log("d2 =", this.project_Data);
                            } else {
                                break;
                            }
                        }
    
                        // Sort formList by P8 in descending order
                        this.project_Data.sort((a: any, b: any) => b.P8 - a.P8);
                        console.log("Folder Lookup sorting", this.project_Data);
    
                        // Continue fetching recursively
                        await this.fetchprojectlookup(sk + 1);
                    } else {
                        console.error('Invalid data format - not an array.');
                    }
                } else {
                    console.error('response.options is not a string.');
                }
            } else {
                console.log("All the dreamboard id are here ", this.project_Data);
            }
    
            // Return the final formList value
            return this.project_Data;
        } catch (error) {
            console.error('Error:', error);
            // Handle the error as needed and return an empty array
            return [];
        }


    }

    onStatusClick(title:any, description:any){


        this.router.navigate([`view-dreamboard/Forms/${title.id}`]);

    }
    
}
