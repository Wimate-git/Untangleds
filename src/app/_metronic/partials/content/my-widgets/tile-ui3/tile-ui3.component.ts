import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tile-ui3',

  templateUrl: './tile-ui3.component.html',
  styleUrl: './tile-ui3.component.scss'
})
export class TileUi3Component {
  @Input() item:any
  @Input() index:any
  @Input() isEditModeView:any;
  @Output() customEvent = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent1 = new EventEmitter<{ arg1: any; arg2: number }>();
  @Output() customEvent2 = new EventEmitter<{ arg1: any; arg2: number }>();
  edit_each_tileUI(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
    console.log('data checkingt',data)
  this.customEvent.emit(data); // Emitting an event with two arguments

  }
  edit_each_duplicate(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
  this.customEvent1.emit(data); // Emitting an event with two arguments

  }
  deleteTile(value1: any,value2: number) {
    const data = { arg1: value1, arg2: value2 }; // Two arguments
  this.customEvent2.emit(data); // Emitting an event with two arguments

  }

}