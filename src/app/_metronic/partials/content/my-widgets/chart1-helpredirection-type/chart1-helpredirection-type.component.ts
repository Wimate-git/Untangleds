import { Component } from '@angular/core';

@Component({
  selector: 'app-chart1-helpredirection-type',

  templateUrl: './chart1-helpredirection-type.component.html',
  styleUrl: './chart1-helpredirection-type.component.scss'
})
export class Chart1HelpredirectionTypeComponent {
  redirectionTypeDescriptions: { [key: string]: string } = {
    'New Tab': 'Opens the target dashboard in a new tab within the same browser.',
    'Modal(Pop Up)': 'Opens the target dashboard in a popup modal on the current page.',
    'Same Page Redirect': 'Redirects to the target dashboard within the same page.',
    'Drill Down': 'Opens a modal displaying a detailed data table for drill-down analysis.'
  };
  get redirectionTypeList() {
    return Object.entries(this.redirectionTypeDescriptions);
  }
  

}
