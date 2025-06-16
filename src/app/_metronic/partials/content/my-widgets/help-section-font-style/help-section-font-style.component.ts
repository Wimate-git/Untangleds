import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-font-style',

  templateUrl: './help-section-font-style.component.html',
  styleUrl: './help-section-font-style.component.scss'
})
export class HelpSectionFontStyleComponent {

  fontStyleDescriptions: { [key: string]: string } = {
    'Bold': 'Makes the label text bold and thicker.',
    'Italic': 'Slants the label text to give it an italic appearance.',
    'Underline': 'Adds a line below the label text to emphasize it.'
  };
  
  get fontStyleDescriptionList() {
    return Object.entries(this.fontStyleDescriptions);
  }
  

}
