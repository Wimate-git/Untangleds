import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-advance-equation',

  templateUrl: './help-section-advance-equation.component.html',
  styleUrl: './help-section-advance-equation.component.scss'
})
export class HelpSectionAdvanceEquationComponent {
  filterGuideDescription: string = 'Displays a formatted equation using the selected mini-table fields. The equation is auto-generated based on your selections.';

  filterGuideExample: string = 'Count MultiplePram(${Personal Info.dynamic_table_values.table-1736939655825.text-1730976463331})';
  
}
