import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-predefined',

  templateUrl: './help-section-predefined.component.html',
  styleUrl: './help-section-predefined.component.scss'
})
export class HelpSectionPredefinedComponent {
  primaryValueDescriptions: { [key: string]: string } = {
    Progress: 'When "Progress" is selected, the Equation/HTML field should contain HTML code for a progress bar (e.g., using <progress> or styled <div> elements). The output in the table will render the progress bar directly.',
  
    Rating: 'When "Rating" is selected, the Equation/HTML field should include HTML representing a rating component (e.g., star icons). This allows you to visually display ratings in the table.',
    
    HTML: 'When "HTML" is selected, the content entered in the Equation/HTML field will be rendered as raw HTML inside the table cell. Useful for custom layouts, styled text, or images.',
    
    None: 'When "None" is selected, the Equation/HTML field will be treated as a formula or expression. The value is computed dynamically based on selected form fields.'
  };

  get primaryValueList() {
    return Object.entries(this.primaryValueDescriptions);
  }

}
