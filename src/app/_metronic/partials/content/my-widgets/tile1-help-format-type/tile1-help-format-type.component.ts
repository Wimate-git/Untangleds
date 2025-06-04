import { Component } from '@angular/core';

@Component({
  selector: 'app-tile1-help-format-type',

  templateUrl: './tile1-help-format-type.component.html',
  styleUrl: './tile1-help-format-type.component.scss'
})
export class Tile1HelpFormatTypeComponent {
  formatTypeDescriptions: { [key: string]: string } = {
    Default: 'Shows the original value without applying any formatting.',

    Rupee: 'Formats the final output as an amount in Indian Rupees (₹).',
    Distance: 'Displays the value as a distance unit (e.g., kilometers or meters).',
    Minutes: 'Formats the value as time in minutes (e.g., 45 minutes).',
    Hours: 'Formats the value as time in hours (e.g., 3 hours).',
    Days: 'Converts and displays the value in number of days.',
    'Days & Hours': 'Splits the output into combined days and hours (e.g., 2 days 4 hours).',
    Months: 'Formats the value to represent duration in months.',
    Years: 'Displays the final output in years.',
    'Label With Value': 'Shows the output value along with its corresponding label (e.g., Completed: 95%).',
    Percentage: 'Formats the value as a percentage (e.g., 78%).'
  };
  
  get formatTypeList() {
    return Object.entries(this.formatTypeDescriptions);
  }
  

}
