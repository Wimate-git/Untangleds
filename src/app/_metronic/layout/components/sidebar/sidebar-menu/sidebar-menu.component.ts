import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { filter, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';


export interface MenuItem {
  title: string;
  link?: string;
  icon?: string;
  subMenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit,OnDestroy {

  lookup_data_user: any[];
  dreamdata: any;
  path: any;
  login_detail: any;
  loginDetail_string: any;
  client: any;
  user: any;
  permission_data: any;

  permission_list: any;
  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  async ngOnInit(): Promise<void> {

    setTimeout(async () => {

      this.login_detail = localStorage.getItem('userAttributes')

      console.log("SIDE MENU ITEM LOGIN DETAIL FROM LOCAL STORAGE:", this.login_detail)

      this.loginDetail_string = JSON.parse(this.login_detail)
      console.log("AFTER JSON STRINGIFY", this.loginDetail_string)

      this.client = this.loginDetail_string.clientID
      this.user = this.loginDetail_string.username
      this.permission_data = this.loginDetail_string.permission_ID

      this.loginDetail_string = JSON.parse(this.login_detail)
      console.log("SIDE ITEM AFTER JSON PARSE", this.loginDetail_string)

      const permisson_response = await this.apiService.GetMaster(this.client + '#permission#' + this.permission_data + '#main', 1);

      console.log("PERMISSION RESPONSE SIDE MENU:", permisson_response)

      if (permisson_response && permisson_response.metadata) {
        this.permission_data = JSON.parse(JSON.parse(JSON.stringify(permisson_response.metadata)))


        console.log("USER PERMISSION DATA:", this.permission_data)

        this.permission_list = this.permission_data.permissionsList



        console.log("PERMISSION LIST:", this.permission_list)

      }


      // console.log("SIDE MENU GET PERMISSION DATA RESPONSE:", this.permission_data.dreamBoardIDs)

      this.generatedreamboard()
    }, 1000);


    this.routerSubscription = this.router.events
    .pipe(
      filter((event: any) => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => {
        // Skip session check for specific routes like login or logout
        const excludedRoutes = ['/auth/login', '/summary-engine','/auth/logout', '/dashboard'];
        return !excludedRoutes.some(route => event.urlAfterRedirects.includes(route));
      })
    )
    .subscribe(() => {
      console.log("Session is called from Init");
      this.authService.checkSession(); // Call your session check method
    });
  }

  dreamboardLookupData(sk: number): Promise<[string, string, string, number][]> {
    console.log("Page Number:", sk)

    return new Promise((resolve, reject) => {
      this.apiService.GetMaster(this.client + '#' + 'dreamboard#lookup', sk)
        .then(response => {
          if (response && response.options) {
            // Check if response.options is a string
            if (typeof response.options === 'string') {
              let data = JSON.parse(response.options);
              console.log("d1 =", data);

              if (Array.isArray(data)) {
                const promises: Promise<any>[] = []; // Array to hold promises for recursive calls
                this.lookup_data_user = [] as [string, string, string, number][]; // Explicitly type the array

                for (let index = 0; index < data.length; index++) {
                  const element = data[index];

                  if (element !== null && element !== undefined) {
                    const key = Object.keys(element)[0]; // Extract the key (e.g., "L1", "L2")
                    const { P1, P2, P3, P4 } = element[key]; // Extract values from the nested object

                    // Push the extracted values into lookup_data_user in the desired format
                    this.lookup_data_user.push([P1, P2, P3, P4]);
                    console.log("Extracted data =", this.lookup_data_user);

                  } else {
                    break;
                  }
                }
                this.path = this.lookup_data_user.map((entry: any[]) => entry[0]);
                console.log('DREAMBOARD ID PATH:', this.path)
                // Continue fetching recursively
                promises.push(this.dreamboardLookupData(sk + 1)); // Store the promise for the recursive call

                // Wait for all promises to resolve
                Promise.all(promises)
                  .then(() => resolve(this.lookup_data_user)) // Resolve with the final lookup data
                  .catch(reject); // Handle any errors from the recursive calls
              } else {
                console.error('Invalid data format - not an array.');
                reject(new Error('Invalid data format - not an array.'));
              }
            } else {
              console.error('response.options is not a string.');
              reject(new Error('response.options is not a string.'));
            }
          } else {
            resolve(this.lookup_data_user); // Resolve with the current lookup data
          }
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error); // Reject the promise on error
        });
    });
  }


  ngOnDestroy(): void {
    console.log('Sidebar Component destroyed.');
    // document.removeEventListener('keydown', this.handleKeyDown);
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      console.log("Unsubscribed from router events");
    }
  }

  async generatedreamboard() {
    const submenu: MenuItem[] = [];

    try {
      // Initialize or clear previous data
      this.path = [];
      this.dreamdata = [];

      // Fetch data for dreamboard
      await this.dreamboardLookupData(1);
      const pathArray = this.path;
      console.log("Path Array:", pathArray);

      // Ensure permission_data.dreamBoardIDs has data
      if (this.permission_data !== 'All') {
        if (Array.isArray(this.permission_data.dreamBoardIDs) && this.permission_data.dreamBoardIDs.length > 0) {

          const includeAll = this.permission_data.dreamBoardIDs.includes('All');
          for (const pathValue of pathArray) {
            // if (this.permission_data.dreamBoardIDs.includes(pathValue)) {
            if (includeAll || this.permission_data.dreamBoardIDs.includes(pathValue)) {
              submenu.push({
                title: `${pathValue}`,
                link: `view-dreamboard/${pathValue}/All`,
                icon: '',
                subMenu: [],
              });
            }
          }
          this.menuItems = [
            {
              title: 'Modules',
              icon: 'element-7',
              subMenu: submenu.length > 0 ? submenu : [{ title: 'No Module Available', link: '' }]
            }
          ];
        }
      }
      else{

        for (const pathValue of pathArray) {
          // if (this.permission_data.dreamBoardIDs.includes(pathValue)) {
          // if (includeAll || this.permission_data.dreamBoardIDs.includes(pathValue)) {
            submenu.push({
              title: `${pathValue}`,
              link: `view-dreamboard/${pathValue}/All`,
              icon: '',
              subMenu: [],
            });
          }
        // }
        this.menuItems = [
          {
            title: 'Modules',
            icon: 'element-7',
            subMenu: submenu.length > 0 ? submenu : [{ title: 'No Module Available', link: '' }]
          }
        ];
      }

      console.log("Updated menuItems:", this.menuItems);

      this.cdRef.detectChanges();

    } catch (error) {
      console.error('Error while generating dreamboard:', error);
    }

    return this.menuItems;
  }


  hasPermission(moduleName: string): boolean {
    if (this.permission_data === 'All') {
      return true; // Grant access to all modules if 'All' exists in the list
    }
    return this.permission_list?.some((item: { name: string; view: any; }) => item.name === moduleName && item.view);
  }

  hasAnyConfigurationPermission(): boolean {
    const configModules = [
      'Report Studio',
      'Communication',
      'Notification Matrix',
      'Client',
      'Company',
      'User Management',
      'Permission',
      'Form Group',
      'Project Configuration',
      'Location Management',
    ];
    return configModules.some((module) => this.hasPermission(module));
  }
  // Your menuItems structure
  menuItems: MenuItem[] = [];


}
