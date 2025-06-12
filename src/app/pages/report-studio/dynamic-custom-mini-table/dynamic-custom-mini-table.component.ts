import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dynamic-custom-mini-table',
  standalone: false,
  templateUrl: './dynamic-custom-mini-table.component.html',
  styleUrl: './dynamic-custom-mini-table.component.scss'
})
export class DynamicCustomMiniTableComponent implements OnInit {
  activeTab: string = 'config';

  @Input() predefinedValue: any;
  @Input() targetTableName: any;
  @Input() miniTableFormBuilderData: any;
  @Input() selectedForms: any;
  @Input() formName: any;
  miniTableLabels: any = [];
  scriptType:any;


  tabs = [
    { id: 'config', label: 'Configuration' },
    { id: 'script', label: 'Generated Script' }
  ];

  formData: any = {
    sourceTableKey: '',
    targetTableKey: '',
    sourceFields: {},
    targetFields: {}
  };

  formFields = [
    { id: 'datetime-local-abc', label: 'Planned From' },
    { id: 'datetime-local-def', label: 'Planned To' },
    { id: 'datetime-local-ghi', label: 'Actual From' },
    { id: 'datetime-local-jkl', label: 'Actual To' },
    { id: 'single-select-xyz', label: 'Engineer ID' },
    { id: 'single-select-mno', label: 'Target Engineer' },
    { id: 'text-111', label: 'Planned Hours' },
    { id: 'text-222', label: 'Actual Hours' },
    { id: 'text-333', label: 'OT Hours' },
    { id: 'text-444', label: 'Sunday Hours' }
  ];

  sourceFields = [
    { key: 'plannedFrom', label: 'Planned From' },
    { key: 'plannedTo', label: 'Planned To' },
    { key: 'actualFrom', label: 'Actual From' },
    { key: 'actualTo', label: 'Actual To' },
    { key: 'engineerId', label: 'Engineer ID' }
  ];

  targetFields = [
    { key: 'targetEngineer', label: 'Target Engineer' },
    { key: 'plannedHours', label: 'Planned Hours' },
    { key: 'actualHours', label: 'Actual Hours' },
    { key: 'otHours', label: 'OT Hours' },
    { key: 'sundayHours', label: 'Sunday Hours' }
  ];

  constructor(public modal: NgbActiveModal, private fb: FormBuilder) {
  }

  dynamicForms: FormGroup;

  ngOnInit(): void {

    console.log("Table data is here ", this.miniTableFormBuilderData);
    console.log("Table name is here ", this.targetTableName);
    console.log("predefinedValue text is here ", this.predefinedValue);
    console.log("selected forms are here ", this.selectedForms);
    console.log("formName is here ", this.formName);


    if (this.miniTableFormBuilderData) {
      this.miniTableLabels = Object.keys(this.miniTableFormBuilderData)
    }


    this.dynamicForms = this.fb.group({
      sourceMinitable: ['', Validators.required],
      singleDate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysAgo: ['', Validators.required]
    });

  }


  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }


  @Output() dynamicScriptSaved = new EventEmitter<any>();


  saveToScriptFilter() {
    this.dynamicScriptSaved.emit(this.generatedScript);
    this.modal.close()
  }


  generatedScript = '';



  generateScriptAdditional() {
    const getFormNameData = this.selectedForms.find((item: any) => item.formName == this.formName)
    if (getFormNameData && getFormNameData.dynamicForm) {
      const tempTargetLabel = getFormNameData.dynamicForm.find((ele: any) => ele.validation.formName_table == this.targetTableName)
      const tempSourceLabel = getFormNameData.dynamicForm.find((ele: any) => ele.validation.formName_table == this.formData.sourceTableKey)
      if (tempTargetLabel && tempSourceLabel && this.scriptType) {
        console.log("tempTargetLabel tempSourceLabel ",tempSourceLabel,tempTargetLabel);
        this.formData.targetTableKey = tempTargetLabel.name + '-table'
        this.formData.sourceTableKey = tempSourceLabel.name + '-table'
      }
      else {
        return Swal.fire({
          title: "Script Type, Target and Source Table Name Required"
        })
      }
    }


    const { sourceTableKey, targetTableKey, sourceFields, targetFields } = this.formData;
    const FIELD = { ...sourceFields, ...targetFields };

    const fieldString = JSON.stringify(FIELD, null, 2);

    this.generatedScript = `
    

function toDateSafe(str) {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function splitByDay(startStr, endStr, isPlanned = false) {
  const start = toDateSafe(startStr);
  const end = toDateSafe(endStr);
  if (!start || !end || end <= start) return { base: 0, ot: 0, sunday: 0 };

  let base = 0, ot = 0, sunday = 0;
  let current = new Date(start);

  while (current < end) {
    const dayEnd = new Date(current);
    dayEnd.setHours(23, 59, 59, 999);
    const segmentEnd = new Date(Math.min(dayEnd.getTime(), end.getTime()));
    const hours = (segmentEnd - current) / (1000 * 60 * 60);
    const day = current.getDay();

    if (isPlanned) {
      base += hours; // ✅ Always count full time for planned
    } else {
      if (day === 0) {
        sunday += hours; // ✅ Actual time on Sunday → sunday hours
      } else {
        base += Math.min(8, hours);
        ot += Math.max(0, hours - 8);
      }
    }

    current = new Date(dayEnd.getTime() + 1000);
  }

  return { base, ot, sunday };
}

function formatHoursMins(decimal) {
  let hours = Math.floor(decimal);
  let minutes = Math.round((decimal - hours) * 60);

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  return hours + 'h ' + minutes + 'm';
}

function main(){
    const sourceTableKey = "${sourceTableKey}";
    const targetTableKey = "${targetTableKey}";
      
    const FIELD = ${fieldString};
    const sourceRows = \${SourceTable.${sourceTableKey}};
const engineerMap = {};

let id = ''

sourceRows.forEach(row => {
  const engineer = (row[FIELD.engineerId] || "N/A").toString();

  if (!engineerMap[engineer]) {
    engineerMap[engineer] = { planned: 0, actual: 0, ot: 0, sunday: 0 };
  }
  
   if(sourceRows && row["id"]){
     id = row["id"]
  }

  const planned = splitByDay(row[FIELD.plannedFrom], row[FIELD.plannedTo], true);
  const actual = splitByDay(row[FIELD.actualFrom], row[FIELD.actualTo], false);

  engineerMap[engineer].planned += planned.base;
  engineerMap[engineer].actual += actual.base;
  engineerMap[engineer].ot += actual.ot;
  engineerMap[engineer].sunday += actual.sunday;
});

const targetRows = Object.entries(engineerMap).map(([engineer, totals]) => ({
       id:id,
  [FIELD.targetEngineer]: engineer,
  [FIELD.plannedHours]: formatHoursMins(totals.planned),
  [FIELD.actualHours]: formatHoursMins(totals.actual),
  [FIELD.otHours]: formatHoursMins(totals.ot),
  [FIELD.sundayHours]: formatHoursMins(totals.sunday),
  uniqueId: Date.now() + Math.floor(Math.random() * 10000)
}));

console.log("Final Additional Engineer Working Hours (Formatted):", targetRows);
return targetRows;

}

main()`.trim();

    this.setActiveTab('script');
  }


  generateScript() {

    const getFormNameData = this.selectedForms.find((item: any) => item.formName == this.formName)
    if (getFormNameData && getFormNameData.dynamicForm) {
      const tempTargetLabel = getFormNameData.dynamicForm.find((ele: any) => ele.validation.formName_table == this.targetTableName)
      const tempSourceLabel = getFormNameData.dynamicForm.find((ele: any) => ele.validation.formName_table == this.formData.sourceTableKey)
      if (tempTargetLabel && tempSourceLabel && this.scriptType) {
        this.formData.targetTableKey = tempTargetLabel.name + '-table'
        this.formData.sourceTableKey = tempSourceLabel.name + '-table'
      }
      else {
        return Swal.fire({
        title: "Script Type, Target and Source Table Name Required"
        })
      }
    }


    const { sourceTableKey, targetTableKey, sourceFields, targetFields } = this.formData;
    const FIELD = { ...sourceFields, ...targetFields };

    const fieldString = JSON.stringify(FIELD, null, 2);


    this.generatedScript = `
      function toDateSafe(str) {
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
      }
      
      function splitByDay(startStr, endStr, isPlanned = false) {
        const start = toDateSafe(startStr);
        const end = toDateSafe(endStr);
        if (!start || !end || end <= start) return { base: 0, ot: 0, sunday: 0 };
      
        let base = 0, ot = 0, sunday = 0;
        let current = new Date(start);
      
        while (current < end) {
          const dayEnd = new Date(current);
          dayEnd.setHours(23, 59, 59, 999);
          const segmentEnd = new Date(Math.min(dayEnd.getTime(), end.getTime()));
          const hours = (segmentEnd - current) / (1000 * 60 * 60);
          const day = current.getDay();
      
          if (day === 0) {
            if (isPlanned) {
              base += hours;
            } else {
              sunday += hours;
            }
          } else {
            if (isPlanned) {
              base += hours;
            } else {
              base += Math.min(8, hours);
              ot += Math.max(0, hours - 8);
            }
          }
      
          current = new Date(dayEnd.getTime() + 1000);
        }
      
        return { base, ot, sunday };
      }
      
      function convertDecimalToDisplayTime(decimal) {
        let hours = Math.floor(decimal);
        let minutes = Math.round((decimal - hours) * 60);
      
        if (minutes >= 60) {
          hours += Math.floor(minutes / 60);
          minutes = minutes % 60;
        }
      
        return hours + 'h ' + minutes + 'm';
      }
      
      function main() {
        const sourceTableKey = "${sourceTableKey}";
        const targetTableKey = "${targetTableKey}";
      
        const FIELD = ${fieldString};
      
        const sourceTableData = \${SourceTable.${sourceTableKey}};
        const engineerMap = {};
      
        let id = '';
      
        sourceTableData.forEach(row => {
          const engineer = (row[FIELD.engineerId] || "N/A").toString();
      
          if (!engineerMap[engineer]) {
            engineerMap[engineer] = { planned: 0, actual: 0, ot: 0, sunday: 0 };
          }
      
          if (sourceTableData && row["id"]) {
            id = row["id"];
          }
      
          const planned = splitByDay(row[FIELD.plannedFrom], row[FIELD.plannedTo], true);
          const actual = splitByDay(row[FIELD.actualFrom], row[FIELD.actualTo], false);
      
          engineerMap[engineer].planned += planned.base;
          engineerMap[engineer].actual += actual.base;
          engineerMap[engineer].ot += actual.ot;
          engineerMap[engineer].sunday += actual.sunday;
        });
      
        const transformedRows = Object.entries(engineerMap).map(([engineer, totals]) => ({
          id: id,
          [FIELD.targetEngineer]: engineer,
          [FIELD.plannedHours]: convertDecimalToDisplayTime(totals.planned),
          [FIELD.actualHours]: convertDecimalToDisplayTime(totals.actual),
          [FIELD.otHours]: convertDecimalToDisplayTime(totals.ot),
          [FIELD.sundayHours]: convertDecimalToDisplayTime(totals.sunday),
          uniqueId: Date.now() + Math.floor(Math.random() * 10000)
        }));
      
        console.log("Present Assigned Engineer Working Hours (Formatted):", transformedRows);
        return transformedRows;
      }
      
      main();`.trim();

    this.setActiveTab('script');
  }
}