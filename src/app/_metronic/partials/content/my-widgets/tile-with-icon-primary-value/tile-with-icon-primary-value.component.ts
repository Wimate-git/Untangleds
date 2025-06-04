import { Component } from '@angular/core';

@Component({
  selector: 'app-tile-with-icon-primary-value',

  templateUrl: './tile-with-icon-primary-value.component.html',
  styleUrl: './tile-with-icon-primary-value.component.scss'
})
export class TileWithIconPrimaryValueComponent {
  primaryValueDescriptions: { [key: string]: string } = {
    Sum: 'Calculates the total sum of all values in the selected field.',
    Minimum: 'Finds the smallest value from the selected dataset.',
    Maximum: 'Finds the largest value from the selected dataset.',
    Average: 'Calculates the average (mean) of all values.',
    Latest: 'Displays the most recent value available.',
    Previous: 'Displays the value from the previous time period.',
    Constant: 'Uses a fixed constant value defined by the user.',
    Count: 'Counts the total number of records.',
    Equation: 'Applies a custom equation for calculation (e.g., sumArray(${Work Order.Equipment Serial No..single-select-1732773087727})).',
    'Sum Array': 'Sums comma-separated values within a single field. Useful when entries such as equipment serial numbers (e.g., "67890,34578,8907") represent multiple values to be counted or totaled.',
    'Advance Equation': 'Performs advanced calculations using multiple variables and formulas (e.g., latest(${Work Order.dynamic_table_values.table-1732775270521.single-select-1732775396196})).',
    'Sum Difference': 'Calculates the difference between two summed values.',
    'Distance Sum': 'Calculates the total of all distance values.',
  };
  
  
  get primaryValueList() {
    return Object.entries(this.primaryValueDescriptions);
  }

}
