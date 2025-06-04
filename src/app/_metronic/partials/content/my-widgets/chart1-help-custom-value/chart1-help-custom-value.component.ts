import { Component } from '@angular/core';

@Component({
  selector: 'app-chart1-help-custom-value',

  templateUrl: './chart1-help-custom-value.component.html',
  styleUrl: './chart1-help-custom-value.component.scss'
})
export class Chart1HelpCustomValueComponent {

  categoryValueDescriptions: { [key: string]: string } = {
    'Count': 'Counts the number of records for the selected category and displays the total inside the donut chart.',
    'Sum': 'Calculates the sum of values for the selected category and shows the result at the center of the donut chart.',
    'Minimum': 'Finds the minimum value from the selected data and displays it in the center of the donut chart.',
    'Maximum': 'Shows the highest (maximum) value from the selected data inside the donut chart.',
    'Average': 'Computes the average of the selected values and displays it at the center of the donut chart.',
    'Latest': 'Displays the most recent value (latest entry) for the selected category inside the donut chart.'
  };
  
  get categoryValueList() {
    return Object.entries(this.categoryValueDescriptions);
  }
  

}
