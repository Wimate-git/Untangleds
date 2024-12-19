import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/API.service';
import { LocationPermissionService } from 'src/app/location-permission.service';
import { SharedService } from 'src/app/pages/shared.service';

@Component({
  selector: 'app-title-config',

  templateUrl: './title-config.component.html',
  styleUrl: './title-config.component.scss'
})
export class TitleConfigComponent  implements OnInit{
  editTitleIndex: number | null;
  reloadEvent: any;
  createTitle:FormGroup
  isEditMode: boolean;
  selectedTile: any;
  @Input() modal :any
  @Output() update_PowerBoard_config =  new EventEmitter<any>();
  @Input() dashboard: any;
  grid_details: any;
  @Output() dashboardChange = new EventEmitter<any[]>();
  @Input()  all_Packet_store: any;
  @Output() send_all_Packet_store1 = new EventEmitter<any[]>();

ngOnInit(){
  this.initializeTitleFields()
}

constructor(private summaryConfiguration: SharedService,private api: APIService, private fb: UntypedFormBuilder, private cd: ChangeDetectorRef,
  private toast: MatSnackBar, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private locationPermissionService: LocationPermissionService, private devicesList: SharedService, private injector: Injector,
  private spinner: NgxSpinnerService,private zone: NgZone
){
  
}

ngOnChanges(changes: SimpleChanges): void {
  console.log('dashboardChange',this.all_Packet_store)
}
  openTitleModal( tile?: any, index?: number) {
 
    if (tile) {
      this.selectedTile = tile;
      this.editTitleIndex = index !== undefined ? index : null; // Store the index, default to null if undefined
      console.log('Tile Object:', tile); // Log the tile object

      // Initialize form fields and pre-select values
        this.initializeTitleFields()
      this.createTitle.patchValue({
        customLabel: tile.customLabel,
        fontSize:tile.fontSize,
        fontWeight:tile.fontWeight,
        textColor:tile.textColor,
        themeColor:tile.themeColor,
        fontFamily:tile.fontFamily,
        textAlign:tile.textAlign



        



      });

      this.isEditMode = true; // Set to edit mode
    } else {
      this.selectedTile = null; // No tile selected for adding
      this.isEditMode = false; // Set to add mode
      this.createTitle.reset(); // Reset the form for new entry
    }
    this.themes.forEach(theme => {
      theme.selected = false; // Deselect all themes
    });

    // Find the theme that matches the tile's themeColor
    const matchingTheme = this.themes.find(theme => theme.color === tile?.themeColor);

    // If a matching theme is found, set it as selected
    if (matchingTheme) {
      matchingTheme.selected = true;
      console.log('Matching theme found and selected:', matchingTheme);
    }

    // Open the modal
  
    this.reloadEvent.next(true);
  }

  themes = [
    { color: "#338F74", selected: false },
    { color: "#D66E75", selected: false },
    { color: "#3C8AB0", selected: false },
    { color: "#C6A539", selected: false },
    { color: "#7E6FBF", selected: false }
  ];
  initializeTitleFields(): void {
    // Initialize the form group
    this.createTitle = this.fb.group({
    
      'customLabel': ['', Validators.required], // Title content
      fontFamily: [''], // Font family
      fontSize: [''], // Font size
      textAlign: ['left'], // Text alignment
      themeColor: ['transparent'], // Background color
      fontWeight:[''],
      textColor:['black']
  

    });
  }
  
  duplicateTitle(tile: any, index: number): void {
    // Validate the tile and dashboard before proceeding
    if (!tile || !this.dashboard || index < 0 || index >= this.dashboard.length) {
      console.error('Invalid tile or index for duplication');
      return;
    }
  
    // Clone the title tile with all its attributes
    const clonedTitle = {
      ...tile, // Copy all attributes from the original tile
      id: new Date().getTime(), // Generate a unique ID
      customLabel: tile.customLabel, // Append "Copy" to differentiate the title
      x: 0, // Reset position for the duplicated tile
      y: 0 // Reset position for the duplicated tile
    };
  
    // Add the cloned title to the dashboard at the correct position
    this.dashboard.splice(index + 1, 0, clonedTitle);
  
    // Log the updated dashboard for debugging
    console.log('this.dashboard after duplicating a title:', this.dashboard);
  
    // Trigger UI updates if necessary
    this.cdr.detectChanges();
  
    // Call updateSummary to reflect the addition of the duplicated title
    this.updateSummary('','add_tile')
  }
  updateSummary(data: any, arg2: any) {
    this.update_PowerBoard_config.emit({ data, arg2 });
  }

  // Editor styles
  nameContainerStyle = {
    themeColor: '' // Allows any custom color for the Name container
  };

  // Editor styles
  editorStyle = {
    fontFamily: 'Lato',
    fontSize: '14px',
    textAlign: 'left',
    themeColor: '#ffffff'
  };
// Apply font style
toggleBold(): void {
  const currentWeight = this.createTitle.value.fontWeight;
  this.createTitle.patchValue({ fontWeight: currentWeight === 'bold' ? 'normal' : 'bold' });
}

toggleItalic(): void {
  const currentStyle = this.createTitle.value.fontStyle;
  this.createTitle.patchValue({
    fontStyle: currentStyle === 'italic' ? 'normal' : 'italic',
  });
}

toggleUnderline(): void {
  const currentDecoration = this.createTitle.value.textDecoration;
  this.createTitle.patchValue({
    textDecoration: currentDecoration === 'underline' ? 'none' : 'underline',
  });
}
updateTextColor(event: Event): void {
  const color = (event.target as HTMLInputElement).value;
  this.createTitle.patchValue({ textColor: color });
}


  // Set text alignment
  setTextAlignment(alignment: string): void {
    this.createTitle.patchValue({ textAlign: alignment });
  }

  // Change font family
  onFontChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    console.log('selectElement',selectElement)
    if (selectElement && selectElement.value) {
      this.createTitle.patchValue({ fontFamily: selectElement.value });
    }
  }

  // Change font size
  onFontSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement && selectElement.value) {
      this.createTitle.patchValue({ fontSize: selectElement.value });
    }
  }

  // Update background color
  updateNameContainerColor(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement && inputElement.value) {
      this.createTitle.patchValue({ themeColor: inputElement.value });
    }
  }

  updateCustomLabel(event: Event): void {
    const inputValue = (event.target as HTMLElement).innerText;
    
    // Update the form control value without triggering Angular's change detection unnecessarily
    this.createTitle.patchValue({ customLabel: inputValue }, { emitEvent: false });
  }
  addTile(key: any) {
 if (key === 'title') {
    const titleStyles = this.createTitle.value;
  
    const newTitle = {
      x: 0,
      y: 0,
      cols: 80,
      rows: 20,
      rowHeight: 100,
      colWidth: 100,
      fixedColWidth: true,
      fixedRowHeight: true,
      grid_type: 'title',

      customLabel: this.createTitle.value.customLabel, // User input for the title
      themeColor:this.createTitle.value.themeColor, // Background color
      fontFamily: this.createTitle.value.fontFamily, // Font family
      fontSize: this.createTitle.value.fontSize, // Font size
      textAlign: this.createTitle.value.textAlign, // Text alignment
      fontWeight: this.createTitle.value.fontWeight, // Bold
      textColor:this.createTitle.value.textColor
   

    };
  
    // Initialize the dashboard array if it doesn't exist
    if (!this.dashboard) {
      this.dashboard = [];
    }
  
    // Push the new title widget to the dashboard
    this.dashboard.push(newTitle);
  
    console.log('this.dashboard after adding new title widget', this.dashboard);
  
    // Trigger updates
    this.grid_details = this.dashboard;
    this.dashboardChange.emit(this.grid_details);
    if(this.grid_details)
      {
        this.updateSummary('','add_tile');
      }
  }
}
updateTitle() {
  if (this.editTitleIndex !== null) {
    console.log('this.editTitleIndex check:', this.editTitleIndex);
    console.log('Tile before update:', this.dashboard[this.editTitleIndex]);

    // Extract the updated values from the form
    const updatedTitle = {
      ...this.dashboard[this.editTitleIndex], // Retain existing properties
      customLabel: this.createTitle.value.customLabel,
      themeColor: this.createTitle.value.themeColor,
      fontFamily: this.createTitle.value.fontFamily,
      fontSize: this.createTitle.value.fontSize,
      textAlign: this.createTitle.value.textAlign,
      fontWeight: this.createTitle.value.fontWeight,
      textColor: this.createTitle.value.textColor,
    };

    // Update the dashboard
    this.dashboard[this.editTitleIndex] = updatedTitle;

    // Also update the grid_details array
    this.all_Packet_store.grid_details[this.editTitleIndex] = {
      ...this.all_Packet_store.grid_details[this.editTitleIndex], // Retain existing properties
      ...updatedTitle, // Update with new values
    };

    console.log('Updated Title Details:', this.dashboard[this.editTitleIndex]);
    console.log('Updated all_Packet_store.grid_details:', this.all_Packet_store.grid_details);
    this.grid_details = this.dashboard;
    console.log('this.grid_details check',this.grid_details)
    this.dashboardChange.emit(this.grid_details);

    if(this.grid_details)
      {
        this.updateSummary(this.all_Packet_store,'update_tile');
      }
    // Trigger updates
  // Open the modal for additional actions
  // Notify the system of the update

    // Reset the editTitleIndex
    this.editTitleIndex = null;
  } else {
    console.error('Edit index is null. Unable to update the tile.');
  }
}

}
