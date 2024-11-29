import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/API.service';

@Component({
    selector: 'app-project-dashboard',
    templateUrl: './project-dashboard.component.html',
})
export class ProjectDashboardComponent implements OnInit {
    formList: any[] = [];
    login_detail: any;
    loginDetail_string: any;
    client: any;
    users: any;
    transformedData: any[]=[];
    projectdata: any[];
    projectTemplateData: any[]=[];
    projectTemplate: any[];
   
    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef
    ) { }


    async ngOnInit(): Promise<void> {

        this.login_detail = localStorage.getItem('userAttributes')

        this.loginDetail_string = JSON.parse(this.login_detail)
        console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

        this.client = this.loginDetail_string.clientID
        this.users = this.loginDetail_string.username
        
          this.projectdata = await this.fetchprojectgrouplookup(1);


          console.log("PROJECT GROUP RETURN DATA:",this.projectdata)

          this.transformedData = this.projectdata.map(item => ({
            id: item.P1,
            description: item.P2,
            Files: JSON.parse(item.P3).length,
            filedata:JSON.parse(item.P3)
          }));

          console.log("After creating object :",this.transformedData)


        this.cdr.detectChanges();


       this.projectTemplate =  await this.fetchprojectTemplatelookup(1)


       console.log("Project Template Lookup Return Data:",this.projectTemplate)
    }

    async fetchprojectgrouplookup(sk: any): Promise<any[]> {
        try {
            const response = await this.api.GetMaster(this.client + "#folder#lookup", sk);
    
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
                                const { P1, P2, P3, P4, P5, P6, P7, P8 } = element[key]; // Extract values from the nested object
                                this.formList.push({ P1, P2, P3, P4, P5, P6, P7, P8}); // Push an array containing P1, P2, and P3 values
                                console.log("d2 =", this.formList);
                            } else {
                                break;
                            }
                        }
    
                        // Sort formList by P8 in descending order
                        this.formList.sort((a: any, b: any) => b.P8 - a.P8);
                        console.log("Folder Lookup sorting", this.formList);
    
                        // Continue fetching recursively
                        await this.fetchprojectgrouplookup(sk + 1);
                    } else {
                        console.error('Invalid data format - not an array.');
                    }
                } else {
                    console.error('response.options is not a string.');
                }
            } else {
                console.log("All the dreamboard id are here ", this.formList);
            }
    
            // Return the final formList value
            return this.formList;
        } catch (error) {
            console.error('Error:', error);
            // Handle the error as needed and return an empty array
            return [];
        }
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


    
    
}
