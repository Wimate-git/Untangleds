import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section-date-type',

  templateUrl: './help-section-date-type.component.html',
  styleUrl: './help-section-date-type.component.scss'
})
export class HelpSectionDateTypeComponent {
  dateTypeDescriptions = [
    { label: 'is', description: 'Filters records that exactly match the selected date. Example: Show data only for 01-Jun-2025.' },
    { label: '>=', description: 'Includes records on or after the selected date. Example: Show data from 01-Jun-2025 onward.' },
    { label: '<=', description: 'Includes records on or before the selected date. Example: Show data up to and including 01-Jun-2025.' },
    { label: 'between', description: 'Filters records within a selected date range (start to end date). Example: Show data between 01-May-2025 and 31-May-2025.' },
    { label: 'between time', description: 'Filters records within a selected date-time range. Example: Show data between 01-Jun-2025 09:00 and 01-Jun-2025 18:00.' },
    { label: 'less than days ago', description: 'Filters records that occurred less than the specified number of days ago. Example: Show data from the last 3 days if 3 is entered.' },
    { label: 'more than days ago', description: 'Filters records that occurred more than the specified number of days ago. Example: Show data older than 7 days if 7 is entered.' },
    { label: 'in the past', description: 'Filters records from the past specified number of days. Example: Show data from the past 15 days including today.' },
    { label: 'days ago', description: 'Filters records from exactly the specified number of days ago. Example: Show data from exactly 5 days ago.' },
    { label: 'today', description: 'Filters records that match today’s date. Example: Show only today’s data.' },
    { label: 'yesterday', description: 'Filters records from the previous calendar day. Example: Show only data from 03-Jun-2025 if today is 04-Jun-2025.' },
    { label: 'this week', description: 'Includes records from the current week (starting from Sunday or Monday depending on locale). Example: If today is Wednesday, include data from Sunday/Monday to today.' },
    { label: 'last week', description: 'Includes records from the previous full calendar week. Example: Show data from last Monday to Sunday.' },
    { label: 'last 2 weeks', description: 'Includes records from the last two full calendar weeks. Example: Show data from the last two weeks before this one.' },
    { label: 'this month', description: 'Includes records from the current calendar month. Example: Show data from 01-Jun-2025 to today.' },
    { label: 'last month', description: 'Includes records from the previous calendar month. Example: If today is 04-Jun-2025, show data from 01-May-2025 to 31-May-2025.' },
    { label: 'this year', description: 'Includes records from the current calendar year. Example: Show all data from 01-Jan-2025 to today.' },
    { label: 'any', description: 'No filtering is applied. Includes all available records regardless of date.' },
    { label: 'latest 10', description: 'Displays the 10 most recent records sorted by date. Example: Show the latest 10 entries regardless of selected date range.' }
  ];
  
  get dateTypeList() {
    return this.dateTypeDescriptions;
  }
  
  

}
