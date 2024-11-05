import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-card3',
  templateUrl: './card3.component.html',
})
export class Card3Component {
  @Input() color: string = '';
  @Input() avatar: string = '';
  @Input() online: boolean = false;
  @Input() name: string = '';
  @Input() job: string = '';
  @Input() avgEarnings: string = '';
  @Input() totalEarnings: string = '';
  @HostBinding('class') class = 'card';

  constructor() {}

  // getCardGradientStyle(color: string): { [key: string]: string } {
  //   switch (color) {
  //     case 'danger':
  //       return { 'background': 'linear-gradient(45deg, red, orange)', 'border-radius': '15px', 'padding': '15px' };
  //     case 'success':
  //       return { 'background': 'linear-gradient(45deg, green, lightgreen)', 'border-radius': '15px', 'padding': '15px' };
  //     case 'info':
  //       return { 'background': 'linear-gradient(45deg, blue, lightblue)', 'border-radius': '15px', 'padding': '15px' };
  //     // Add more cases for other colors
  //     default:
  //       return { 'background': 'linear-gradient(45deg, gray, lightgray)', 'border-radius': '15px', 'padding': '15px' };
  //   }
  // }

  // linear-gradient(0deg, rgba(34,195,162,0.9794511554621849) 0%, rgba(231,255,9,1) 100%);

  

  getCardGradientStyle(color: string): { [key: string]: string } {
    return {
      // 'background': 'linear-gradient(90deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px'
      // 'background-color': '#FAACA8',
      // 'background-image': 'linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px'

      // 'background-image': 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px',
      // 'background-color': '#8EC5FC',
      // 'background-image': 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px'
      // 'background-image': 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px'

      // 'background-image': 'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)',
      // 'border-radius': '15px',
      // 'padding': '15px'
      'background-image': 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)',
      'border-radius': '15px',
      'padding': '15px'
    };
   
  }
}
