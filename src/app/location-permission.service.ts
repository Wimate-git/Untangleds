import { Injectable, OnInit } from '@angular/core';
import { SharedService } from './pages/shared.service';
import { APIService } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class LocationPermissionService implements OnInit {

  getLoggedUser: any;
  SK_clientID: any;
  user_companyID: any;

  locationConfiguration: any;
  companyId: any;
  tempClient: string;
  userClient: string;
  username: string;
  userdetails: any;
  treeData: any;
  metadataObject: any;




  constructor( private companyConfiguration: SharedService,private api: APIService) { }

  ngOnInit(): void {

  }

  async fetchGlobalLocationTree(): Promise<any> {
    let returnValue: any = null;

    try {
      // Get logged user details
      this.getLoggedUser = this.companyConfiguration.getLoggedUserDetails()
      // console.log('getLoggedUser checking',this.getLoggedUser)
      this.SK_clientID = this.getLoggedUser.clientID;
      console.log('this.SK_clientID check',this.SK_clientID)

      this.companyId = this.getLoggedUser.companyID;
      console.log('this.companyId check',this.companyId)
      this.tempClient = this.SK_clientID+"#"+this.companyId+"#location" + "#main";
      this.userdetails = this.getLoggedUser.username;
      this.userClient = this.userdetails +"#user"+"#main"

      // this.SK_clientID = this.getLoggedUser.attributes["custom:clientID"];
      // this.user_companyID = this.getLoggedUser.attributes["custom:companyID"];
      // const userID = this.getLoggedUser.attributes["custom:username"];

      console.log("this.tempClient PK:", this.tempClient);
      console.log("this.SK_clientID:", this.SK_clientID);

      // Fetch user management data
      const data = await this.api.GetMaster(this.userClient, 1);
      // console.log('data checking',data)
      const metadataString: string | null | undefined = data.metadata;

      // Check if metadataString is a valid string before parsing
      if (typeof metadataString === 'string') {
          try {
              // Parse the JSON string into a JavaScript object
              this.metadataObject = JSON.parse(metadataString);
              console.log('Parsed Metadata Object:', this.metadataObject);
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
      } else {
          console.log('Metadata is not a valid string:', metadataString);
      }
      if (this.metadataObject) {
        const keyLocation = this.metadataObject.location_permission?.length === 1 && this.metadataObject.location_permission[0] === "All" ? "All" : "Not all";
        // const keyReadingDeviceType = data.device_type_permission?.length === 1 && data.device_type_permission[0] === "All" ? "All" : "Not all";
        const keyDevices = this.metadataObject.form_permission?.length === 1 && this.metadataObject.form_permission[0] === "All" ? "All" : "Not all";

        // Fetch location configuration
        const result: any = await this.api.GetMaster(this.tempClient, 1);
        console.log('result checking',result)
        if (result && result.metadata !== undefined) {
          const temp: any = JSON.parse(result.metadata);
          console.log('temp data checking',temp)
          // const treeData = JSON.parse(temp);
          const treeString = temp[0].tree;

          try {
              // Parse the JSON string into a JavaScript object
              this.treeData = JSON.parse(treeString);
              console.log('Parsed Tree Data:', this.treeData);
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
       

          // Modify list if necessary
          if (`${keyLocation}-${keyDevices}` !== "All-All") {
            try {
              returnValue = await this.modifyList(this.metadataObject.location_permission, this.metadataObject.form_permission, this.treeData);
              console.log("jsonModified in service", returnValue);
            } catch (modifyError) {
              console.error('Error modifying JSON data', modifyError);
              returnValue = this.treeData;
            }
          } else {
            returnValue = this.treeData;
          }
        } else {
          throw new Error("Tree data is undefined");
        }
      }
    } catch (err) {
      console.error('Cannot fetch or process data', err);
      // Return a fallback value or handle error appropriately
    } finally {
      return returnValue;
    }
  }


  async modifyList(location_permission: any, form_permissions: any, original_array: any): Promise<any> {
    // Determine the permission type for location and devices
    const keyLocation = location_permission.length === 1 && location_permission[0] === "All" ? "All" : "Not all";
    const keyDevices = form_permissions.length === 1 && form_permissions[0] === "All" ? "All" : "Not all";
    
    console.log("modify", `${keyLocation}-${keyDevices}`);

    // Concatenate data based on the keys
    switch (`${keyLocation}-${keyDevices}`) {
        case "All-All":
            return []; // Return an empty array if all permissions are granted

        case "Not all-All":
            // If location is not all but devices are all, filter based on location
            return await this.calculateNodesToShow(location_permission, original_array);

        case "All-Not all":
            // If locations are all but devices are not, filter based on devices
            return await this.calculateNodesToShow(form_permissions, original_array);

        case "Not all-Not all":
            // Filter based on both location and device permissions
            const data_tempA1 = await this.calculateNodesToShow(location_permission, original_array);
            console.log("data_tempA1", data_tempA1);
            const data_tempA2 = await this.calculateNodesToShow(form_permissions, data_tempA1);
            console.log("data_tempA2", data_tempA2);
            return data_tempA2;

        default:
            console.log("Unrecognized case");
            return [];
    }
}


  private collectDescendants(node: { id: any; }, result: any[], originalData: any[]) {
    let children = originalData.filter((n: { parent: any; }) => n.parent === node.id);
    children.forEach((child: any) => {
      if (!result.includes(child)) {
        result.push(child);
        this.collectDescendants(child, result, originalData);
      }
    });
  }

  enhanceNodeMap(originalData: any[]) {
    let nodeMap: any = {};
    originalData.forEach(node => {
      let textKey = 'text_' + node.text;
      // let rtdKey = node.RDT ? 'RTD_' + node.RDT : null;

      if (!nodeMap[textKey]) {
        nodeMap[textKey] = [];
      }
      nodeMap[textKey].push(node);

      // if (rtdKey) {
      //   if (!nodeMap[rtdKey]) {
      //     nodeMap[rtdKey] = [];
      //   }
      //   nodeMap[rtdKey].push(node);
      // }
    });
    return nodeMap;
  }
  async calculateNodesToShow(permissions: string[], originalData: any[]) {
    // Enhance the original data into a node map
    let nodeMap = this.enhanceNodeMap(originalData);
    let nodesToShow: any[] = [];

    // Iterate through each permission
    permissions.forEach(permission => {
        let keyText = 'text_' + permission; // Create the key for text permissions
        let nodes = nodeMap[keyText] || []; // Get nodes based on the permission

        // Process each permitted node
        nodes.forEach((permittedNode: any) => {
            if (permittedNode && !nodesToShow.includes(permittedNode)) {
                nodesToShow.push(permittedNode); // Add the permitted node to nodesToShow
                this.collectDescendants(permittedNode, nodesToShow, originalData); // Collect descendants
                this.markAncestors(permittedNode, nodesToShow, originalData); // Mark ancestors
            }
        });
    });

    // Remove duplicates based on the node ID
    return nodesToShow.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
}


  private markAncestors(node: { parent: string; }, result: any[], originalData: any[]) {
    if (node.parent !== '#') {
      let parentNode = originalData.find((n: { id: any; }) => n.id === node.parent);
      if (parentNode && !result.includes(parentNode)) {
        result.push(parentNode);
        this.markAncestors(parentNode, result, originalData);
      }
    }
  }
}

