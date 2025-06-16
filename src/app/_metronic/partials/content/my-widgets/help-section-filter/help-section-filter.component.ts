import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-filter',

  templateUrl: './help-section-filter.component.html',
  styleUrl: './help-section-filter.component.scss'
})
export class HelpSectionFilterComponent {
  filterGuideDescription: string = `Displays the generated filter equation based on selected fields.
  Field values are inserted dynamically in the format: Field Name - \${fieldId}.`;
  
  filterGuideExample: string = `Customer Name-\${text-1732773051881} && Status-\${single-select-1732769559973}`;
  
}
