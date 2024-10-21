import { Component, Input, OnInit } from '@angular/core';
import { IconUserModel } from '../icon-user.model';
import { Router } from '@angular/router';
import { DreamIdComponent } from 'src/app/pages/dream-id/dream-id.component';

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
  @Input() users: Array<IconUserModel> = [];
  id: string;

  constructor(private router: Router) {}


  ngOnInit(): void {
    console.log("CARD2 LOAD")



  }


  onStatusClick(title: any) {

    this.id = 'Form Viewing'

    // localStorage.setItem('title',title.title)

      console.log('NAVIGATE:',title)
      // this.router.navigate([`view-dreamboard/${this.id}/?formId=${title.title}`]); // Customize your route as needed
      this.router.navigate([`view-dreamboard/${this.id}/${title.title}`]);
    
  }

  
}
