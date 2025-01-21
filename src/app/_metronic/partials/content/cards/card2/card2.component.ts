import { Component, input, Input, OnInit } from '@angular/core';
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
  @Input() online: string;
  @Input() formgroup: string = '';
  @Input() users: Array<IconUserModel> = [];
  @Input() icon_: { value: string; label: string; class1: string; class2: string };
 

  id: string;

  constructor(private router: Router) {}


  ngOnInit(): void {
    console.log("CARD2 LOAD")

    console.log("COMPONENT:",this.componentSource)

  }

  onStatusClick(data: { title: string; id: string }): void {

    console.log("ID:", data.id)

    if(data.id == 'Calendar'){
      this.id = 'Calendar'
    }
    else{

    this.id = 'Forms'
    }

    // this.id = 'Calendar'

    console.log("ID:",this.id)


    if(this.componentSource == 'dashboard'){

      
       this.router.navigate([`dashboard/dashboardFrom/${this.id}/${data.title}`]);

    }
    else if(this.componentSource == 'dashboardForm'){

      

      this.router.navigate([`view-dreamboard/${this.id}/${data.title}`]);
     

      // console.log('NAVIGATE:',title)
    }

  }

  
}
