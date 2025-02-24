import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-config',
  templateUrl: './image-config.component.html',
  styleUrls: ['./image-config.component.scss']
})
export class ImageConfigComponent implements OnInit{
  selectedTabset: string = 'dataTab';
  ImageFormGroup:FormGroup
  private widgetIdCounter = 0;
  @Input() dashboard: any;
  grid_details: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input() modal :any
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store = new EventEmitter<any[]>();
 
  @Input()isGirdMoved: any;

  isEditMode: boolean;
  editTileIndex: number | null;
  constructor(private cdr:ChangeDetectorRef,private fb:FormBuilder){

  }
  ngOnInit(): void {
    this.initializeTileFields()
  }
  initializeTileFields(): void {

    // Initialize the form group
    this.ImageFormGroup = this.fb.group({
      
          
      imageUrl: ['', Validators.required],
     


    });
  }
  selectedSettingsTab(tab: string) {
    this.selectedTabset = tab;
  }
  validateAndSubmit() {
    if (this.ImageFormGroup.invalid) {
      // ✅ Mark all fields as touched to trigger validation messages
      Object.values(this.ImageFormGroup.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
          control.updateValueAndValidity();
        } else if (control instanceof FormArray) {
          control.controls.forEach((group) => {
            (group as FormGroup).markAllAsTouched();
          });
        }
      });
  
      return; // 🚨 Stop execution if the form is invalid
    }
  
    // ✅ Proceed with saving only if form is valid
    this.addTile('logo');
    this.modal.dismiss();
  }
  addTile(key: any) {

  
    if (key === 'logo') {
      const uniqueId = this.generateUniqueId();
  
      const newTile = {
        id: uniqueId,
        x: 0,
        y: 0,
        rows: 13,
        cols: 25,
        rowHeight: 100,
        colWidth: 100,
        fixedColWidth: true,
        fixedRowHeight: true,
        grid_type: 'logo',
       imageUrl: this.ImageFormGroup.value.imageUrl ||''





      };
  
      if (!this.dashboard) {
        this.dashboard = [];
      }
  
      this.dashboard.push(newTile);
  
      console.log('this.dashboard after adding new tile', this.dashboard);
  
      this.grid_details = this.dashboard; // Update grid_details dynamically
      console.log('this.grid_details checking', this.grid_details);
  
      this.dashboardChange.emit(this.grid_details); // Emit the updated dashboard to parent component or listeners
  
      if (this.grid_details) {
        this.updateSummary('', 'add_logo');
  
        // Use ChangeDetectorRef to update the view dynamically
        this.cdr.detectChanges(); // Ensure changes are reflected in the UI
      }
  
      // Optionally reset the form if needed after adding the tile
      this.ImageFormGroup.patchValue({
        widgetid: uniqueId,
      });
    }
  }
  generateUniqueId(): number {
    this.widgetIdCounter++;
    return Date.now() + this.widgetIdCounter; // Use timestamp and counter for uniqueness
  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }
  updateTile(key: any) {
    console.log('Key checking from update:', key);
    this.isGirdMoved = true;
  
    if (this.editTileIndex !== null) {
     
      const updatedTile = {
        ...this.dashboard[this.editTileIndex],
        imageUrl: this.ImageFormGroup.value.imageUrl,
       

      };
  
      console.log('Updated tile:', updatedTile);
  
      this.dashboard = [
        ...this.dashboard.slice(0, this.editTileIndex),
        updatedTile,
        ...this.dashboard.slice(this.editTileIndex + 1),
      ];
  
      console.log('Updated dashboard:', this.dashboard);
  
      if (this.all_Packet_store?.grid_details) {
        this.all_Packet_store.grid_details[this.editTileIndex] = {
          ...this.all_Packet_store.grid_details[this.editTileIndex],
          ...updatedTile,
        };
      } else {
        console.error('grid_details is undefined or null in all_Packet_store.');
      }
  
      this.grid_details = this.dashboard;
      this.dashboardChange.emit(this.grid_details);
  
      if (this.grid_details) {
        this.updateSummary(this.all_Packet_store, 'update_logo');
      }
  
      this.editTileIndex = null;
    } else {
      console.error('Edit index is null or invalid. Unable to update the tile.');
    }
  }
  openKPIModal(tile: any, index: number) {
    console.log('Index checking:', index); // Log the index
    if (tile) {

      this.editTileIndex = index !== undefined ? index : null;

  
      // Force change detection to update the UI
      this.cdr.detectChanges();
  
  


      this.ImageFormGroup.patchValue({
        imageUrl: tile.imageUrl,
      
       
      });
  

  
    
    } else {

      this.isEditMode = false; // Set to add mode
      this.ImageFormGroup.reset(); // Reset the form for new entry
    }
  
    // Clear the 'selected' state for all themes

  }
}
