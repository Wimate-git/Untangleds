import { Component, Input, OnInit } from '@angular/core';
import { IconUserModel } from '../icon-user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
})
export class Card2Component implements OnInit{
  @Input() componentSource: string = '';
  @Input() icon: string = '';
  @Input() badgeColor: string = '';
  @Input() status: string = '';
  @Input() statusColor: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() date: string = '';
  @Input() budget: string = '';
  @Input() progress: number = 50;
  @Input() formgroup: string = '';
  @Input() users: Array<IconUserModel> = [];
  id: string;

  constructor(private router: Router) {}


  ngOnInit(): void {
    console.log("CARD2 LOAD")

    console.log("COMPONENT:",this.componentSource)

  }

  onStatusClick(title: any) {

    this.id = 'Form Viewing'


    if(this.componentSource == 'dashboard'){

      
       this.router.navigate([`dashboard/dashboardFrom/${title.title}`]);

    }
    else if(this.componentSource == 'dashboardForm'){

      this.router.navigate([`view-dreamboard/${this.id}/${title.title}`]);
     

      console.log('NAVIGATE:',title)
    }

  }

  
}
