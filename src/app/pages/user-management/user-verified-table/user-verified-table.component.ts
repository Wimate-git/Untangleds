import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicApiService } from '../../dynamic-api.service';
import Swal from 'sweetalert2';
import { AuditTrailService } from '../../services/auditTrail.service';

@Component({
  selector: 'app-user-verified-table',
  templateUrl: './user-verified-table.component.html',
  styleUrls: ['./user-verified-table.component.scss']
})
export class UserVerifiedTableComponent implements OnInit {
  unverifiedUsers: any[] = [];
  filteredUsers: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  searchText: string = '';

  @Input() username: any;
  @Input() SK_clientID: any;

  constructor(
    private DynamicApi: DynamicApiService,
    private auditTrail: AuditTrailService,
    public modal: NgbActiveModal,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("Unverified users are here", this.unverifiedUsers);
    this.filteredUsers = [...this.unverifiedUsers]; // initialize filtered list
  }

  get paginatedUsers() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  filterUsers() {
    const search = this.searchText.toLowerCase();
    this.filteredUsers = this.unverifiedUsers.filter(user =>
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
    this.page = 1;
  }

  async resendCredentials(userName: any) {
    const targetUser = this.unverifiedUsers.find(item => item.username === userName);
    const body = {
      type: "userVerify",
      username: targetUser.username,
      name: targetUser.password,
      email: targetUser.email
    };

    this.DynamicApi.sendData(body).subscribe(response => {
      if (response) {
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: `Credentials mail sent successfully`,
          showConfirmButton: false,
          timer: 1500
        });

        this.unverifiedUsers = this.unverifiedUsers.map(item => {
          if (item.username === userName) {
            return { ...item, sentCredentialMail: true }; // fixed typo
          }
          return item;
        });
        this.filterUsers(); // reapply search and pagination
      }
    }, error => {
      console.error('Error sending credentials:', error);
    });
  }

  async resendVerification(userName: any) {
    const body = {
      type: "cognitoServices",
      event: {
        path: "/resendVerification",
        queryStringParameters: { email: "dummy@wimate.in" },
        username: userName
      }
    };

    try {
      const response = await this.DynamicApi.getData(body);
      if (response?.statusCode === 200) {
        Swal.fire({
          position: "top-right",
          icon: "success",
          title: `Verification mail sent successfully`,
          showConfirmButton: false,
          timer: 1500
        });

        const auditData = {
          "User Name": this.username,
          "Action": "View",
          "Module Name": "User Management",
          "Form Name": 'User Management',
          "Description": `Verification mail sent successfully to ${userName}`,
          "User Id": this.username,
          "Client Id": this.SK_clientID,
          "created_time": Date.now(),
          "updated_time": Date.now()
        };
        this.auditTrail.mappingAuditTrailData(auditData, this.SK_clientID);
      } else {
        Swal.fire({
          position: "top-right",
          icon: "error",
          title: `Error sending verification mail`,
          showConfirmButton: false,
          timer: 1500
        });
      }

      this.unverifiedUsers = this.unverifiedUsers.map(item => {
        if (item.username === userName) {
          return { ...item, sentMail: true };
        }
        return item;
      });
      this.filterUsers(); // reapply search and pagination
      this.cd.detectChanges();

    } catch (error) {
      console.error('Error calling dynamic lambda:', error);
    }
  }
}
