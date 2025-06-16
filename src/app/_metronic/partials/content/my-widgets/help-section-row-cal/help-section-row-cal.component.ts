import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-row-cal',

  templateUrl: './help-section-row-cal.component.html',
  styleUrl: './help-section-row-cal.component.scss'
})
export class HelpSectionRowCalComponent {
  primaryValueDescriptions: { [key: string]: string } = {
    Sum: 'Calculates the total of all values in the selected field.',
    Minimum: 'Returns the smallest value from the selected data set.',
    Maximum: 'Returns the largest value from the selected data set.',
    Average: 'Calculates the average (mean) of all values.',
    Latest: 'Displays the most recently recorded value.',
    Previous: 'Displays the value from the previous time interval.',

  };

  get primaryValueList() {
    return Object.entries(this.primaryValueDescriptions);
  }

}
