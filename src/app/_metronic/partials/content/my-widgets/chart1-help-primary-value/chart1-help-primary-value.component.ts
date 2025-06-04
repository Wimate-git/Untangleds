import { Component } from '@angular/core';

@Component({
  selector: 'app-chart1-help-primary-value',

  templateUrl: './chart1-help-primary-value.component.html',
  styleUrl: './chart1-help-primary-value.component.scss'
})
export class Chart1HelpPrimaryValueComponent {

  primaryValueDescriptions: { [key: string]: string } = {
    'Count Multiple Parameter': 'Calculates the count of each status from multiple parameters (e.g., Open, In Progress, Closed). Useful for aggregating status distribution across different fields.',
'Sum Multiple Parameter': 'Sums values based on a grouping field (e.g., branch-wise totals). One field is used for grouping, and another for summing.',

'Average Multiple Parameter': 'Calculates averages based on a grouping field (e.g., branch-wise averages). One field is used for grouping, and another for averaging.',

    'count with sum MultipleParameter': 'Provides both the count of records and the sum of values across multiple parameters. Helps track totals along with data volume.',
    'sum with count MultipleParameter': 'Performs sum operations and also includes count metrics, but emphasizes summation as the primary metric.',
'SumArray': 'Sums comma-separated values within a single field. Useful when entries like equipment serial numbers (e.g., "67890,34578,8907") represent multiple values to be counted or totaled.',

    'Advance Equation': 'Allows creation of complex formulas using multiple parameters, supporting advanced calculations beyond standard math operations.'
  };
  
  get primaryValueList() {
    return Object.entries(this.primaryValueDescriptions);
  }
  

}
