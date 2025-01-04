import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormRecord } from '@angular/forms';

interface LabelPart {
    tableName: string;
    fieldKey: string;
    metadataKey: string;
}

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
    transformedData: any[] = [];
    projectdata: any[];
    projectTemplateData: any[] = [];
    projectTemplate: any[];
    projectgroup: string | null;
    groupData: any;
    project: any[];
    project_Data: any[] = [];
    loading = true;

    iconData: { class1: string; class2: string; label: string; value: string; };
    res: any
    sk: any
    SK: number;
    updatedData: any[] = [];
    remove_data: any[];



    constructor(
        private api: APIService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private spinner: NgxSpinnerService
    ) { }


    async ngOnInit(): Promise<void> {

        this.spinner.show()

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


        await this.api.GetMaster(this.client + '#folder#' + this.projectgroup + '#main', 1).then((group_res) => {

            this.groupData = JSON.parse(JSON.parse(JSON.stringify(group_res.metadata)))

            console.log("AFTER STRINGIFY:", this.groupData.formList)

        }).catch((error) => {
            console.log("PROJECT GROUP MAIN TABLE ERROR:", error)
        })

        this.projectTemplate = await this.fetchprojectTemplatelookup(1)

        this.project = await this.fetchprojectlookup(1)


        console.log("PROJECT LOOKUP DATA:", this.project)

        const filteredData1 = this.projectTemplate.filter(item => this.groupData.formList.includes(item.P1));

        console.log("After Filter Project Template:", filteredData1);


        const p1Values = filteredData1.map(item => item.P1);
        const filteredData = this.project.filter(item => p1Values.includes(item.P12));

        console.log("After filter of Project:", filteredData);


        this.transformedData = filteredData.map(item => ({
            id: item.P1,
            description: item.P2,
            Files: JSON.parse(item.P3).length,
            filedata: JSON.parse(item.P3),
            color: item.P5,
            label_1: item.P9,
            label_2: item.P10,
            label_3: item.P11,
            icon: JSON.parse(item.P4),
            form_record: JSON.parse(item.P13)
        }));

        console.log("After creating object :", this.transformedData)

       await this.processShowData(this.transformedData)


        this.cdr.detectChanges();

        this.loading = false

        this.spinner.hide();

    }



    // processShowData(show_data: any[]) {
    //     show_data.forEach(item => {
    //         // Check if form_record exists and is an array with length > 0
    //         if (item.form_record && Array.isArray(item.form_record) && item.form_record.length > 0) {
    //             item.form_record.forEach(async (record: { [x: string]: any; }) => {
    //                 // Iterate through each record and handle its data
    //                 for (const key in record) {
    //                     // Example: If the key is a known property, you can process it
    //                     console.log(`Processing ${key}:`, record[key]);

    //                     // this.get_request_form_main(this.client+`#${key}#main`, record[key])


    //                     if(record[key] !== null){

    //                     this.get_request_form_main(this.client + `#${key}#main`, record[key])
    //                         .then((response_data: any) => {
    //                             console.log("Data received:", response_data.body[0].metadata);

    //                            const metadata =  response_data.body[0].metadata;

    //                             ['label_1', 'label_2', 'label_3'].forEach(labelKey => {
    //                                 if (item[labelKey]) {
    //                                     const metadataKey = item[labelKey].split('.').pop(); // Extract the metadata key part (e.g., 'text-1733139716863')
    //                                     if (metadata[metadataKey]) {
    //                                         // Replace the value in show_data with the corresponding value from metadata
    //                                         item[labelKey] = metadata[metadataKey];
    //                                     }
    //                                 }
    //                             });

    //                             console.log("Updated show_data:", item);


    //                             this.updatedData.push(item)


    //                             console.log("UPDATED DATA PUSH IN VALUE:",this.updatedData)


    //                             this.remove_data = this.removeDuplicates(this.updatedData)


    //                             console.log("After remove duplicate:",this.remove_data)

    //                             this.cdr.detectChanges();   
    //                         })
    //                         .catch((error: any) => {
    //                             console.error("Error occurred:", error);
    //                         });
    //                     }
    //                     else{
    //                         this.remove_data = this.transformedData
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // }

    async processShowData(showData: any[]) {
        for (const item of showData) {
          if (item.form_record && Array.isArray(item.form_record) && item.form_record.length > 0) {
            await this.replaceLabelData(item); // Ensure labels are updated
          }
        }
      }

    parseLabel(label: string): LabelPart[] {
        const regex = /\$\{([^\.]+)\.([^\.]+)\.([^\}]+)\}/g; // Adjust regex according to your actual format
        let match;
        const parts: LabelPart[] = [];
        while ((match = regex.exec(label))) {
            parts.push({
                tableName: match[1],
                fieldKey: match[2],
                metadataKey: match[3]
            });
        }
        return parts;
    }

    async fetchData(tableName: string, fieldKey: number): Promise<any> {
        // Example API call
        return this.get_request_form_main(this.client + `#${tableName}#main`, fieldKey);
    }

    //    replaceLabelData(item: any) {
    //         ['label_1', 'label_2', 'label_3'].forEach(async labelKey => {
    //             if (item[labelKey]) {
    //                 const labelParts = this.parseLabel(item[labelKey]);
    //                 console.log("LABEL PARTS:",labelParts)

    //                 for (const part of labelParts) {
    //                     try {
    //                         const response = await this.fetchData(part.tableName, parseInt(part.fieldKey));
    //                         const metadataValue = response.body[0].metadata[part.metadataKey];
    //                         item[labelKey] = item[labelKey].replace(`\$\{${part.tableName} ${part.fieldKey} ${part.metadataKey}\}`, metadataValue);
    //                     } catch (error) {
    //                         console.error("Error fetching data:", error);
    //                     }
    //                 }
    //             }
    //         });
    //     }


    // Function to replace label placeholders with actual data
    async replaceLabelData(item: any) {
        const labelsToUpdate = ['label_1', 'label_2', 'label_3'];

        for (const labelKey of labelsToUpdate) {
            if (item[labelKey]) {
                const labelParts = this.parseLabel(item[labelKey]);

                // Process each part of the parsed label
                for (const part of labelParts) {
                    // Find the corresponding form_record entry that matches the tableName
                    const formRecordEntry = item.form_record.find((record: any) => Object.keys(record)[0] === part.tableName);

                    if (formRecordEntry) {
                        // Get the record ID using the table name
                        const recordId = formRecordEntry[part.tableName];

                        try {
                            // Fetch data using the record ID and fieldKey
                            const response = await this.fetchData(part.tableName, recordId);
                            const metadataValue = response.body[0].metadata[part.metadataKey];

                            console.log("METADATA:", metadataValue)

                            // Replace the placeholder in the label with the fetched metadata value
                            item[labelKey] = item[labelKey].replace(`\$\{${part.tableName}.${part.fieldKey}.${part.metadataKey}\}`, metadataValue);

                            console.log("ITEM LABEL:", item[labelKey])
                        } catch (error) {
                            console.error("Error fetching data:", error);
                        }
                    } else {
                        console.error(`No matching form_record found for table name: ${part.tableName}`);
                    }
                }
            }
        }
    }




    removeDuplicates(show_data: any[]) {
        // Using a Map to track unique entries based on the 'id' property
        const uniqueDataMap = new Map();

        const filteredData = show_data.filter(item => {
            if (!uniqueDataMap.has(item.id)) {
                uniqueDataMap.set(item.id, true);
                return true; // Keep this item
            }
            return false; // Skip duplicates
        });

        return filteredData;
    }

    get_request_form_main(pk: string, sk: number) {
        const requestBody = {
            "table_name": 'master',
            "PK_key": "PK",
            "PK_value": pk,
            "SK_key": "SK",
            "SK_value": sk,
            "type": 'query_request_v2'
        };

        console.log("REQUEST:", requestBody);

        // Returning a Promise
        return new Promise((resolve, reject) => {
            fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => {
                    if (!response.ok) {
                        reject('Network response was not ok');
                    }
                    return response.json();
                })
                .then(response_data => {
                    console.log("Response data:", response_data);

                    if (response_data && response_data.statusCode === 200 && response_data.body && response_data.body.length > 0 && response_data.body[0].metadata) {
                        resolve(response_data);  // Resolve with the response data if successful
                    } else if (response_data && response_data.statusCode === 409) {
                        reject('Conflict error - Status 409');
                    } else {
                        reject('Unexpected response data structure');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);  // Reject the promise if an error occurs
                });
        });
    }


    async fetchprojectTemplatelookup(sk: number) {
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
                                this.projectTemplateData.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11 }); // Push an array containing P1, P2, and P3 values
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

    async fetchprojectlookup(sk: number) {
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
                                const { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13 } = element[key]; // Extract values from the nested object
                                this.project_Data.push({ P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13 }); // Push an array containing P1, P2, and P3 values
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

    onStatusClick(title: any, description: any) {


        this.router.navigate([`view-dreamboard/Project Detail/${title.id}`]);

    }

}
