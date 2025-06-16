import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-equation-tiles',

  templateUrl: './help-section-equation-tiles.component.html',
  styleUrl: './help-section-equation-tiles.component.scss'
})
export class HelpSectionEquationTilesComponent {
  // Inside your component class
  equationDescription: string = 'Displays a formatted equation using the selected form, fields, and operations. The equation is auto-generated based on your configuration.';
  equationExample: string = '(Count(${Work Order.Status.single-select-1732769559973}), Count(${Customer Type.Market Segment Type.text-1732684968171}))';
  

}
