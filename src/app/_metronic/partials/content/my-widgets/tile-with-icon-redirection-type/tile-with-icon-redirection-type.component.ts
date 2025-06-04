import { Component } from '@angular/core';

@Component({
  selector: 'app-tile-with-icon-redirection-type',

  templateUrl: './tile-with-icon-redirection-type.component.html',
  styleUrl: './tile-with-icon-redirection-type.component.scss'
})
export class TileWithIconRedirectionTypeComponent {
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
