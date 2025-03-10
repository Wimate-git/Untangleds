// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import Swal from 'sweetalert2';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserFormsService {
//   dynamicInputAuditTrail: any[] = [];
//   transformedData: any = {};

//   constructor(private Toast:MatSnackBar) { }


//   getFormInputData(formHeading: string, client: any): Promise<void> {
//     console.log("AUDIT TRAIL FORMNAME:", formHeading);
//     const requestBody = {
//       "table_name": 'master',
//       "PK_key": "PK",
//       "PK_value": client + "#dynamic_form#" + formHeading + "#main",
//       "SK_key": "SK",
//       "SK_value": 1,
//       "type": 'query_request_v2'
//     };

//     return fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
//       },
//       body: JSON.stringify(requestBody)
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data && data.body && data.body[0] && data.body[0].metadata) {
//           this.dynamicInputAuditTrail = data.body[0].metadata.formFields;
//           console.log('User Form Dynamic Fields are here :', this.dynamicInputAuditTrail);
//         }
//       })
//       .catch(error => {
//         console.error('Error loading form:', error);
//       });
//   }

//   async mappingAuditTrailData(UserDetails: any, client: any, userName: any) {
//     try {
//       // Wait for the dynamic form fields to be fetched before proceeding
//       await this.getFormInputData("SYSTEM_USER_CONFIGURATION", client);

//       console.log("AUDIT TRAIL MAPPING FUNCTION:", UserDetails);

//       console.log('User Form Dynamic mappingAuditTrailData :', this.dynamicInputAuditTrail);

//       // Ensure dynamicInputAuditTrail is available before using it
//       if (this.dynamicInputAuditTrail && Array.isArray(this.dynamicInputAuditTrail)) {
//         const dynamicTableData: any = []
//         this.dynamicInputAuditTrail.forEach(field => {
//           console.log("Field is here:", field);


//           if (typeof field.name === 'string' && field.name.startsWith('table')) {


//             if (!this.transformedData["dynamic_table_values"]) {
//               this.transformedData["dynamic_table_values"] = {};
//             }


//             const tableKey = `${field.name}-table`;

//             //Get the data from userFields
//             const tableData = UserDetails[field.label]
//             //create the array to assign it to dynamic_table

//             console.log("Table Data is here ",tableData);

//             tableData && tableData.forEach((item: any) => {
//               dynamicTableData.push({
//                 "created_person": userName,
//                 "created_time": new Date(item[1]).getTime(),
//                 "datetime-local-1741153935185": this.convertEpochToDate(item[1]),
//                 "text-1741153927459": item[0],
//                 "uniqueId": new Date(item[1]).getTime(),
//                 "updated_person": userName,
//                 "updated_time": new Date(item[1]).getTime()
//               })
//             })

//             console.log("After adding Dynamic Table Values are here ",dynamicTableData);

//             if (!this.transformedData["dynamic_table_values"][tableKey]) {
//               this.transformedData["dynamic_table_values"][tableKey] = dynamicTableData;
//             }


//           }
//           else if(typeof field.name === 'string' && field.name.startsWith('checkbox-')){
//             const tableCheckBoxData = UserDetails[field.label]
//             console.log("tableCheckBoxData ",tableCheckBoxData);
//             if(field.options && Array.isArray(field.options) && tableCheckBoxData && Array.isArray(tableCheckBoxData) && field.options.length == tableCheckBoxData.length){
//               for(let ele = 0; ele < field.options.length;ele++){
//                 this.transformedData[Object.keys(field.options[ele])[0]] = tableCheckBoxData[ele]
//               }
//             }
//           }
//           else if(typeof field.name === 'string' && field.name.startsWith('radio-') && field.label != 'Allow User to add new Company'){
//             if(field.options && Array.isArray(field.options) && field.options.length > 0){
//               this.transformedData[Object.keys(field.options[0])[0]] = UserDetails[field.label] != undefined ? UserDetails[field.label].toString() : UserDetails[field.label]
//             }
//           } else {
//             // For other fields, directly map UserDetails to transformedData
//             this.transformedData[field.name] = Array.isArray(UserDetails[field.label]) ? UserDetails[field.label].join(',') : UserDetails[field.label] || null;
//           }
//         });

//         this.transformedData["id"] = new Date(UserDetails.created).getTime()
//         this.transformedData["created_time"] = new Date(UserDetails.created).getTime()
//         this.transformedData["updated_time"] = Date.now()



//         console.log("Final Packet to add in metadata is here:", this.transformedData);


//         let transformed_data: any = {};

//         for (let key in this.transformedData) {
//           if (this.transformedData.hasOwnProperty(key)) {
//             transformed_data[key] = this.transformedData[key] ? `${key}#${this.transformedData[key]}` : `${key}#`;
//           }
//         }

//         console.log('transformed_data :', transformed_data);


//         transformed_data = this.audit_data_extract_add_lookup(transformed_data)
//         console.log('data_extract_add_lookup :', transformed_data);


//         let indexed_object = [];
//         for (let key in transformed_data) {
//           indexed_object.push(key)

//         }
//         let value_array = Object.values(transformed_data);


//         console.log("USer Form VALUE ARRAY:", value_array)

//         let idIndex = value_array.findIndex(item => (item as string).includes("id#"));


//         if (idIndex !== -1) {
//           let idElement = value_array.splice(idIndex, 1)[0];
//           value_array.unshift(idElement);
//         }
//         console.log("value_array_db_main :", value_array);

//         this.add_request_look_up_main_audit_trail(this.transformedData, indexed_object, value_array, client)

//       } else {
//         console.error("Dynamic input audit trail data is not available or invalid.");
//       }

//     } catch (error) {
//       console.error('Error in mapping audit trail data:', error);
//     }
//   }


//   convertEpochToDate(epochTime: any) {

//     const date = new Date(epochTime);

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');


//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   }

//   add_request_look_up_main_audit_trail(transformedData: any, indexed_object: any, value_array: any, clientid_: string) {

//     const requestBody = {
//       "table_name": 'master',
//       "newItem": {
//         "SK": Number(transformedData.created_time),
//         "metadata": transformedData,
//         "options": [],
//         "PK": clientid_ + '#SYSTEM_USER_CONFIGURATION#' + 'main',
//       },

//       "newItem_lookup": {
//         "PK": clientid_ + '#SYSTEM_USER_CONFIGURATION#' + 'lookup',
//         "options": value_array,
//         "metadata": indexed_object
//       },
//       "PK_key": "PK",
//       "SK_key": "SK",
//       "type": "add_request_lookup_main"
//     }
//     // console.log('requestBody_audit_trail :',requestBody);


//     fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
//       },
//       body: JSON.stringify(requestBody)
//     })
//       .then(response => {
//         if (!response.ok) {

//           throw new Error('Network response was not ok');
//         }
//         // // console.log("response:", response);
//         return response.json();
//       })
//       .then(data => {

//         if (data && data.statusCode && data.statusCode == 200) {

//             console.log("User Form Created Successfully ");

//         }

//         else if (data && data.statusCode && data.statusCode == 409) {
//           console.log("SOmething went wrong while creatin user form ");
//         }
//         else {

//         }

//       })
//       .catch(error => {
//         console.error('Error:', error);

//       });

//   }


//   async delete_request_look_up_main_audit_trail(Id:any, clientid_:any, dynamic_form_heading:any) {

//     const requestBody = {
//         "table_name": "master",
//         "deleteItem": {
//             "SK": Number(Id),
//             "PK": clientid_ + "#" + dynamic_form_heading + "#main"
//         },
//         "deleteItem_lookup": {
//             "PK": clientid_ + "#" + dynamic_form_heading + "#lookup",
//             "options": [`id#${Id}`]
//         },
//         "PK_key": "PK",
//         "SK_key": "SK",
//         "type": "delete_request_lookup_main"
//     };

//     try {
//         const response = await fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
//             },
//             body: JSON.stringify(requestBody)
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();

//         if (data && data.statusCode === 200) {
//             console.log("Record Deleted Successfully");

//             console.log("Form Data has been successfully deleted!");

//         } else if (data && data.statusCode === 409) {
//             console.log('Please try again.');
//         } else {
//             console.log('Form Data Failed to delete. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         console.log('Failed to delete Items. Please try again.');
//     }
// }






//   audit_data_extract_add_lookup(transformed_data: Record<string, any>): Record<string, any> {
//     let lookupFields = new Set(
//       this.dynamicInputAuditTrail
//         .filter(item => item.validation?.lookup_table)
//         .map(item => item.name)
//     );

//     let filtered_data: Record<string, any> = {};

//     Object.keys(transformed_data)
//       .filter(key => key === "id" || lookupFields.has(key) || key === 'created_time' || key === 'updated_time')
//       .forEach(key => {
//         filtered_data[key] = transformed_data[key];
//       });

//     return filtered_data;
//   }




// }


import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserFormsService {
  dynamicInputAuditTrail: any[] = [];
  transformedData: any = {};

  constructor(private Toast: MatSnackBar) { }

  async getFormInputData(formHeading: string, client: any): Promise<void> {
    console.log("AUDIT TRAIL FORMNAME:", formHeading);
    const requestBody = {
      "table_name": 'master',
      "PK_key": "PK",
      "PK_value": client + "#dynamic_form#" + formHeading + "#main",
      "SK_key": "SK",
      "SK_value": 1,
      "type": 'query_request_v2'
    };

    try {
      const response = await fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data && data.body && data.body[0] && data.body[0].metadata) {
        this.dynamicInputAuditTrail = data.body[0].metadata.formFields;
        console.log('User Form Dynamic Fields are here :', this.dynamicInputAuditTrail);
      }
    } catch (error) {
      console.error('Error loading form:', error);
    }
  }

  async mappingAuditTrailData(UserDetails: any, client: any, userName: any) {
    try {
      // Wait for the dynamic form fields to be fetched before proceeding
      await this.getFormInputData("SYSTEM_USER_CONFIGURATION", client);

      console.log("AUDIT TRAIL MAPPING FUNCTION:", UserDetails);
      console.log('User Form Dynamic mappingAuditTrailData :', this.dynamicInputAuditTrail);

      // Ensure dynamicInputAuditTrail is available before using it
      if (this.dynamicInputAuditTrail && Array.isArray(this.dynamicInputAuditTrail)) {
        const dynamicTableData: any = [];
        this.dynamicInputAuditTrail.forEach(field => {
          console.log("Field is here:", field);

          if (typeof field.name === 'string' && field.name.startsWith('table')) {
            if (!this.transformedData["dynamic_table_values"]) {
              this.transformedData["dynamic_table_values"] = {};
            }

            const tableKey = `${field.name}-table`;

            // Get the data from userFields
            const tableData = UserDetails[field.label];
            // Create the array to assign it to dynamic_table
            console.log("Table Data is here ", tableData);

            tableData && tableData.forEach((item: any) => {
              dynamicTableData.push({
                "created_person": userName,
                "created_time": new Date(item[1]).getTime(),
                "datetime-local-1741153935185": this.convertEpochToDate(item[1]),
                "text-1741153927459": item[0],
                "uniqueId": new Date(item[1]).getTime(),
                "updated_person": userName,
                "updated_time": new Date(item[1]).getTime()
              });
            });

            console.log("After adding Dynamic Table Values are here ", dynamicTableData);

            // if (!this.transformedData["dynamic_table_values"][tableKey]) {
              this.transformedData["dynamic_table_values"][tableKey] = dynamicTableData;
            

          } else if (typeof field.name === 'string' && field.name.startsWith('checkbox-')) {
            const tableCheckBoxData = UserDetails[field.label];
            console.log("tableCheckBoxData ", tableCheckBoxData);
            if (field.options && Array.isArray(field.options) && tableCheckBoxData && Array.isArray(tableCheckBoxData) && field.options.length == tableCheckBoxData.length) {
              for (let ele = 0; ele < field.options.length; ele++) {
                this.transformedData[Object.keys(field.options[ele])[0]] = tableCheckBoxData[ele];
              }
            }
          } else if (typeof field.name === 'string' && field.name.startsWith('radio-') && field.label != 'Allow User to add new Company') {
            if (field.options && Array.isArray(field.options) && field.options.length > 0) {
              this.transformedData[Object.keys(field.options[0])[0]] = UserDetails[field.label] != undefined ? UserDetails[field.label].toString() : UserDetails[field.label];
            }
          } else {
            // For other fields, directly map UserDetails to transformedData
            this.transformedData[field.name] = Array.isArray(UserDetails[field.label]) ? UserDetails[field.label].join(',') : UserDetails[field.label] || null;
          }
        });

        this.transformedData["id"] = new Date(UserDetails.created).getTime();
        this.transformedData["created_time"] = new Date(UserDetails.created).getTime();
        this.transformedData["updated_time"] = Date.now();

        console.log("Final Packet to add in metadata is here:", this.transformedData);

        let transformed_data: any = {};

        for (let key in this.transformedData) {
          if (this.transformedData.hasOwnProperty(key)) {
            transformed_data[key] = this.transformedData[key] ? `${key}#${this.transformedData[key]}` : `${key}#`;
          }
        }

        console.log('transformed_data :', transformed_data);

        transformed_data = this.audit_data_extract_add_lookup(transformed_data);
        console.log('data_extract_add_lookup :', transformed_data);

        let indexed_object = [];
        for (let key in transformed_data) {
          indexed_object.push(key);
        }
        let value_array = Object.values(transformed_data);

        console.log("User Form VALUE ARRAY:", value_array);

        let idIndex = value_array.findIndex(item => (item as string).includes("id#"));

        if (idIndex !== -1) {
          let idElement = value_array.splice(idIndex, 1)[0];
          value_array.unshift(idElement);
        }
        console.log("value_array_db_main :", value_array);

        await this.add_request_look_up_main_audit_trail(this.transformedData, indexed_object, value_array, client);

      } else {
        console.error("Dynamic input audit trail data is not available or invalid.");
      }

    } catch (error) {
      console.error('Error in mapping audit trail data:', error);
    }
  }

  convertEpochToDate(epochTime: any) {
    const date = new Date(epochTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async add_request_look_up_main_audit_trail(transformedData: any, indexed_object: any, value_array: any, clientid_: string) {
    const requestBody = {
      "table_name": 'master',
      "newItem": {
        "SK": Number(transformedData.created_time),
        "metadata": transformedData,
        "options": [],
        "PK": clientid_ + '#SYSTEM_USER_CONFIGURATION#' + 'main',
      },
      "newItem_lookup": {
        "PK": clientid_ + '#SYSTEM_USER_CONFIGURATION#' + 'lookup',
        "options": value_array,
        "metadata": indexed_object
      },
      "PK_key": "PK",
      "SK_key": "SK",
      "type": "add_request_lookup_main"
    };

    try {
      const response = await fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data && data.statusCode && data.statusCode == 200) {
        console.log("User Form Created Successfully ");
      } else if (data && data.statusCode && data.statusCode == 409) {
        console.log("Something went wrong while creating user form ");
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  async delete_request_look_up_main_audit_trail(Id: any, clientid_: any, dynamic_form_heading: any) {
    const requestBody = {
      "table_name": "master",
      "deleteItem": {
        "SK": Number(Id),
        "PK": clientid_ + "#" + dynamic_form_heading + "#main"
      },
      "deleteItem_lookup": {
        "PK": clientid_ + "#" + dynamic_form_heading + "#lookup",
        "options": [`id#${Id}`]
      },
      "PK_key": "PK",
      "SK_key": "SK",
      "type": "delete_request_lookup_main"
    };

    try {
      const response = await fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data && data.statusCode === 200) {
        console.log("Record Deleted Successfully");
      } else if (data && data.statusCode === 409) {
        console.log('Please try again.');
      } else {
        console.log('Form Data Failed to delete. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Failed to delete Items. Please try again.');
    }
  }

  audit_data_extract_add_lookup(transformed_data: Record<string, any>): Record<string, any> {
    let lookupFields = new Set(
      this.dynamicInputAuditTrail
        .filter(item => item.validation?.lookup_table)
        .map(item => item.name)
    );

    let filtered_data: Record<string, any> = {};

    Object.keys(transformed_data)
      .filter(key => key === "id" || lookupFields.has(key) || key === 'created_time' || key === 'updated_time')
      .forEach(key => {
        filtered_data[key] = transformed_data[key];
      });

    return filtered_data;
  }
}

