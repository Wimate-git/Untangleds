import { Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card4',
  templateUrl: './card4.component.html',
})
export class Card4Component {
  @Input() componentSource: string = '';
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @HostBinding('class') class = 'card h-100';
  id: string;
  login_detail: any;
  loginDetail_string: any;
  client: any;
  users: any;
  res: any;

  constructor(private router: Router) {}


  onStatusClick(title:any, description:any){
    console.log("CLICK EVENT")

     this.id = 'Forms'

    console.log("COMPONENT:",this.componentSource)

    if(this.componentSource == 'project-dashboard'){

      this.router.navigate([`project-dashboard/project-template-dashboard/${title.title}`]);


    }
    // else if(this.componentSource == 'project-template'){

    //   // this.router.navigate([`view-dreamboard/${this.id}/All`]);

    //   this.router.navigate([`view-dreamboard/${this.id}/${title.title}`]);
    // }

    // this.router.navigate([`project-dashboard/project-template-dashboard/${title.title}`]);
  }
}
