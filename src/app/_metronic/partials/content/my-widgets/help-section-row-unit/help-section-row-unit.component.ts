import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-row-unit',

  templateUrl: './help-section-row-unit.component.html',
  styleUrl: './help-section-row-unit.component.scss'
})
export class HelpSectionRowUnitComponent {
  primaryValueDescriptions: { [key: string]: string } = {
    'Rupee with Value': 'Formats the final value with the ₹ symbol and comma separators (e.g., ₹1,200.00). Ideal for Indian currency.',
    'Dollar with Value': 'Formats the final value with the $ symbol and comma separators (e.g., $1,200.00). Useful for USD or international currency.',
    'Coma with Unit': 'Applies comma formatting to the number (e.g., 1,200.00) and appends a unit label (e.g., 1,200.00 kg). Best for generic measurements or quantities.'
  };

  get primaryValueList() {
    return Object.entries(this.primaryValueDescriptions);
  }

}
