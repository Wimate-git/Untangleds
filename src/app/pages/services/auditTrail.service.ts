import { Injectable } from '@angular/core';
import { DataTablesResponse } from 'src/app/_fake/services/user-service';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {

web_version = 'v2.0.1'
module_version = 'v1.0.0'
    locationDetails: any;
    UserDetails: any;
    dynamicInputAuditTrail: any[]=[];
    transformedData: any = {}; // ✅ Fixed Initialization

  

  constructor() {
    this.getIPBasedLocation()
   }



//    const UserDetails = {
//     "User Name": loginDetail.username,
//     "Action": "Deleted",
//     "Module Name": "Forms",
//     "Form Name": dynamic_form_heading,
//     "Description": "Record is Deleted",
//     "User Id": loginDetail.userID,
//     "Client Id": loginDetail.clientID,
//     "created_time": Date.now(),
//     "updated_time": Date.now()
// }

  
  mappingAuditTrailData(UserDetails:any,client:any) {


    // this.UserDetails = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));


    console.log("AUDIT TRAIL MAPPING FUNCTION:",UserDetails)


    const Appdetails = {
        "User Agent": navigator.userAgent,
        "App Name": navigator.appName,
        "App Version": navigator.appVersion,
        "Platform": navigator.platform,
        "Screen Width": screen.width,
        "Screen Height": screen.height,
        "Language": navigator.language,
        "Web Version": this.web_version,
        "Module Version": this.module_version,
        "Url": document.referrer,
    };

    const finalLocationDetails =
    {
        "IP": this.locationDetails["ip"] || 'NA',
        "Host Name": this.locationDetails["hostname"] || 'NA',
        "City": this.locationDetails["city"] || 'NA',
        "Region": this.locationDetails["region"] || 'NA',
        "Country": this.locationDetails["country"] || 'NA',
        "Map": this.locationDetails["loc"] || 'NA',
        "Org": this.locationDetails["org"] || 'NA',
        "Postal": this.locationDetails["postal"] || 'NA',
        "Time Zone": this.locationDetails["timezone"] || 'NA',
        "Readme": this.locationDetails["readme"] || 'NA'
    }

    const combinedDetails = {
        ...UserDetails,
        ...Appdetails,
        ...finalLocationDetails
    };

    // let transformedData = {};

    this.dynamicInputAuditTrail.forEach(field => {
        if (field.label === "Map" && combinedDetails["Map"]) {
            // Split the map value into latitude and longitude
            const [latitude, longitude] = combinedDetails["Map"].split(',');
            this.transformedData[`${field.name}-latitude`] = latitude;
            this.transformedData[`${field.name}-longitude`] = longitude;
        } else {
            // Map other fields using their label
            this.transformedData[field.name] = combinedDetails[field.label] || null;
        }
    });
    // console.log('dynamicInputAuditTrail :', dynamicInputAuditTrail);
   this.transformedData["id"] = combinedDetails['created_time']
   this.transformedData["created_time"] = combinedDetails['created_time']
    this.transformedData["updated_time"] = combinedDetails['updated_time']
    // console.log('transformedData :', transformedData);

    // // Setting for DB :

    // let transformed_data:any;
    let transformed_data: any = {};

    for (let key in this.transformedData) {
        if (this.transformedData.hasOwnProperty(key)) {
            transformed_data[key] = this.transformedData[key] ? `${key}#${this.transformedData[key]}` : `${key}#`;
        }
    }

    console.log('transformed_data :', transformed_data);

    transformed_data = this.audit_data_extract_add_lookup(transformed_data)
    console.log('data_extract_add_lookup :', transformed_data);

    let indexed_object = [];
    for (let key in transformed_data) {
        indexed_object.push(key)

    }
    let value_array = Object.values(transformed_data);


    console.log("AUDIT TRAIL VALUE ARRAY:",value_array)

    // console.log("indexed_object_db_main :", indexed_object);

    // console.log('value_array_1 :', value_array);

    // Find the element containing "id#" and move it to the 0th index
    let idIndex = value_array.findIndex(item => (item as string).includes("id#"));
    // console.log('idIndex :', idIndex);


    if (idIndex !== -1) {
        // Remove the "id#" element and add it to the 0th index
        let idElement = value_array.splice(idIndex, 1)[0];
        value_array.unshift(idElement);
    }
    console.log("value_array_db_main :", value_array);

    this.add_request_look_up_main_audit_trail(this.transformedData, indexed_object, value_array, client)
}

 
getIPBasedLocation() {

    fetch('https://ipinfo.io/json')//fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            this.locationDetails = data;
            //  locationDetails = {
            //     country: data.country,
            //     regionName: data.regionName,
            //     city: data.city,
            //     zip: data.zip,
            //     isp: data.isp,
            //     ip: data.query
            // };

            console.log("AUDIT TRAIL LOCATION:",this.locationDetails)

        })
        .catch(error => {
            console.error('Error fetching IP-based location:', error);
        });
}

getFormInputData(formHeading: string,client:any) {

    console.log("AUDIT TRAIL FORMNAME:",formHeading)

    // this.UserDetails = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("userAttributes"))));

    // console.log("USER DETIAL AUDIT TRAIL:",this.UserDetails)

    //showLoadingSpinnerm_view()
    const requestBody = {
        "table_name": 'master',
        "PK_key": "PK",
        "PK_value": client + "#dynamic_form#" + formHeading + "#main",
        "SK_key": "SK",
        "SK_value": 1,
        "type": 'query_request_v2'
    };

    fetch('https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.body && data.body[0] && data.body[0].metadata) {
                this.dynamicInputAuditTrail = data.body[0].metadata.formFields
                // console.log('dynamicInputAuditTrail :', dynamicInputAuditTrail);
            }
            else {
              //  hideLoadingSpinnerm_view()
            }

        })
        .catch(error => {
          //  hideLoadingSpinnerm_view()
            console.error('Error loading form:', error);
            alert('Failed to load form data.');
        });
}

  
// audit_data_extract_add_lookup(transformed_data: { [x: string]: any; }) {
//     // Get all names with lookup_table = true
//     let lookupFields = new Set(
//        this.dynamicInputAuditTrail
//             .filter(item => item.validation && item.validation.lookup_table)
//             .map(item => item.name)
//     );

//     // Filter transformed_data
//     let filtered_data = Object.keys(transformed_data)
//         .filter(key => key === "id" || lookupFields.has(key) || key === 'created_time' || key == 'updated_time')
//         .reduce((obj, key) => {
//             obj[key] = transformed_data[key];
//             return obj;
//         }, {});

//     return filtered_data
// }

audit_data_extract_add_lookup(transformed_data: Record<string, any>): Record<string, any> {
    let lookupFields = new Set(
        this.dynamicInputAuditTrail
            .filter(item => item.validation?.lookup_table)
            .map(item => item.name)
    );

    let filtered_data: Record<string, any> = {}; // ✅ Corrected type for object

    Object.keys(transformed_data)
        .filter(key => key === "id" || lookupFields.has(key) || key === 'created_time' || key === 'updated_time')
        .forEach(key => {
            filtered_data[key] = transformed_data[key]; // ✅ No TypeScript error
        });

    return filtered_data;
}


add_request_look_up_main_audit_trail(transformedData:any, indexed_object:any, value_array:any, clientid_: string) {
    
    const requestBody = {
        "table_name": 'master',
        "newItem": {
            "SK": Number(transformedData.created_time),
            "metadata": transformedData,
            "options": [],
            "PK": clientid_ + '#SYSTEM_AUDIT_TRAIL#' + 'main',
        },

        "newItem_lookup": {
            "PK": clientid_ + '#SYSTEM_AUDIT_TRAIL#' + 'lookup',
            "options": value_array,
            "metadata": indexed_object
        },
        "PK_key": "PK",
        "SK_key": "SK",
        "type": "add_request_lookup_main"
    }
    // console.log('requestBody_audit_trail :',requestBody);

 
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

                throw new Error('Network response was not ok');
            }
            // // console.log("response:", response);
            return response.json();
        })
        .then(data => {

            if (data && data.statusCode && data.statusCode == 200) {


            }

            else if (data && data.statusCode && data.statusCode == 409) {
     
            }
            else {

            }

        })
        .catch(error => {
            console.error('Error:', error);

        });
    
}



  


}
