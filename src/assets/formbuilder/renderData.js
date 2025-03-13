
async function getDynamicFormDetails(formName,clientid_){
  const requestBody = {
    "table_name": "master",
    "PK_value": clientid_ + "#dynamic_form#" + formName + "#main",
    "SK_value": 1,
    "PK_key": "PK",
    "SK_key": "SK",
    "type": "get_request"
  };

    console.log('Request Body: from js', requestBody);
    const apiUrl = 'https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'kzUreDYgmB8jUwsniUREa6ggTxIg8bi82zmfjuvZ',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch options for SK=${skValue}`);
    }

    const data = await response.json();

    if (data && data.body) {
      const responseData = JSON.parse(data.body);
      console.log('responseData check from dynamicForm data',responseData)
      // console.log('response Data = '+ JSON.stringify(responseData,null,2));

      const FormData_FromDB = responseData;
      formDynamicFields = FormData_FromDB.metadata.formFields;

      if (formDynamicFields.length > 0) {
        let extract_table_configuration = checkTableConfiguration(formDynamicFields)
       
        if (extract_table_configuration.length > 0) {
        // console.log('extract_table_configuration :', extract_table_configuration);
       
        let formNames = extract_table_configuration.map(item => item.form_name);
        console.log('formNames checking from js dynamic form',formNames)
       
        await getAllDynamicFormData(formNames,clientid_).then(results => {
        // console.log('Fetched_all_data:', results);
        all_form_data_table = results
        console.log('all_form_data_table :', all_form_data_table);
        // hideLoadingSpinner()
        });

       


        // await get_data_main_dynamic_form(formNames);
       
        }
        }

        
      
      console.log('formDynamicFields:', JSON.stringify(formDynamicFields, null, 2));

      
    } else {
      console.log("No body in the response :getDynamicFormDetails" );
    }


}



//----------------------------------------------------------------------------------
//Form UI *************************************************************************
//----------------------------------------------------------------------------------


function getColumnClass(columnWidth) {
  switch (columnWidth) {
  case 1:
  return 'col-md-1 fv-row';
  case 2:
  return 'col-md-2 fv-row';
  case 3:
  return 'col-md-3 fv-row';
  case 4:
  return 'col-md-4 fv-row';
  case 5:
  return 'col-md-5 fv-row';
  case 6:
  return 'col-md-6 fv-row';
  case 7:
  return 'col-md-7 fv-row';
  case 8:
  return 'col-md-8 fv-row';
  case 9:
  return 'col-md-9 fv-row';
  case 10:
  return 'col-md-10 fv-row';
  case 11:
  return 'col-md-11 fv-row';
  case 12:
  return 'col-md-12 fv-row';
  }
 }
 
 
 
async function generateFormView(dynamic_input, data_form_db = {}) {

var tabContent
var contentElement
var formContainer

let all_data_db = data_form_db;

Edit_first_load_flag = true

// if (isProjectUrl) {
// tabContent = document.querySelector(`#kt_ecommerce_customer_${form_name_pro.replace(/\s+/g, '_').toLowerCase()}`);
// contentElement = tabContent.querySelector(".fw-bold");
// contentElement.innerHTML = '';
// }

//if (formFlag == true) {
formContainer = document.getElementById('dynamic-form');

formContainer.innerHTML = '';
// }

// console.log('dynamic_input :', dynamic_input);
console.log('data_form_db_view :', data_form_db);

let row = document.createElement('div');
row.classList.add('row', 'g-9', 'mb-7');
let currentWidth = 0;

dynamic_input.forEach((input, index) => {
    // const colClass = getColumnClass(input.columnWidth);

    var colClass
    if (input.type !== 'table') {
        colClass = getColumnClass(input.columnWidth);
    }

    let valueFromDB = data_form_db[input.name] || '';
    const hide_input = input.validation && input.validation.hide ? 'd-none' : '';

    // Calculate the cumulative column width
    currentWidth += input.columnWidth;

    // If the current width exceeds 12, start a new row
    if (currentWidth > 12) {
        formContainer.appendChild(row);
        row = document.createElement('div');
        row.classList.add('row', 'g-9', 'mb-7');
        currentWidth = input.columnWidth; // Reset current width to the current column width
    }

    let inputField = '';
    let inputValidation = input.validation || {};
    let isDisabled = inputValidation.disabled === false ? 'disabled' : '';
    // let hideClass = inputValidation.hide ? 'd-none' : ''; // Use Bootstrap's d-none class to hide elements
    const canvasStyle = isDisabled ? 'pointer-events: none; opacity: 0.6;' : ''; // Disable canvas interaction if disabled

    const column = document.createElement('div');
    column.className = `${colClass} ${hide_input}`;
    column.id = `column-${input.name}`; // Assign an ID to the column for show/hide

    if (input.type === 'nikhil') {

    } else if (input.type === 'checkbox') {
        const optionElements = input.options.map(option => {
            const optionKey = Object.keys(option)[0];
            const optionValue = option[optionKey];
            const isChecked = data_form_db[optionKey] ? 'checked' : '';

            return `
              <div class="form-check mt-3">
              <input class="form-check-input checkbox_${input.name}" type="checkbox" id="${optionKey}" name="${optionKey}" value="${optionValue}" ${isChecked} ${isDisabled}>
              <label class="form-check-label text-gray-800 font-normal" for="${optionKey}">${optionValue}</label>
              </div>
              <div class="error-message" id="${input.name}-error"></div>
              `;
        }).join('');

        inputField = `${optionElements}`;
    } else if (input.type === 'radio') {
        const optionElements = input.options.map(option => {
            const optionKey = Object.keys(option)[0];
            const optionValue = option[optionKey];
            const isChecked = data_form_db[input.name] === optionValue ? 'checked' : '';

            return `
              <div class="form-check mt-3">
              <input class="form-check-input radio_${input.name}" type="radio" id="${optionKey}" name="${input.name}" value="${optionValue}" ${isChecked} ${isDisabled}>
              <label class="form-check-label text-gray-800 font-normal" for="${optionKey}">${optionValue}</label>
              </div>
              <div class="error-message" id="${input.name}-error"></div>
              `;
        }).join('');

        inputField = `${optionElements}`;
    } else if (input.name.split("-")[0] == 'signature') {
        inputField = `
          <div class="container signature-container ${input.name}">
          <canvas id="${input.name}-signature-pad" class="signature-pad" width="${input.columnWidth - 1}50" height="200" style="border: 2px solid #d3d3d3; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); ${canvasStyle}"></canvas>
          <input type="hidden" name="${input.name}" id="${input.name}" ${isDisabled}>
          <button type="button" id="${input.name}-clear-signature" class="btn btn-secondary mt-2" ${isDisabled}>Clear</button>
          </div>
          <div class="error-message" id="${input.name}-error"></div>
          `;
    } else if (input.type === 'textarea') {
        inputField = `
          <textarea class="form-control form-control-solid" id="${input.name}"
          placeholder="${input.placeholder}" name="${input.name}" rows="4"
          style="background-color: #fff; color: #000;" ${isDisabled}>${valueFromDB}</textarea>
          <div class="error-message" id="${input.name}-error"></div>
          `;
    } 

     else if (input.type == 'Empty Placeholder') {
        inputField = `
          <input type="${input.type}" class="input-field form-control"
          placeholder="${input.placeholder}" name="${input.name}" id="${input.name}"
          style="visibility: hidden;"/>
          `;
    }

    // Handle "heading" type
    else if (input.type === 'heading') {

        const fontSize = input.validation.font_size || 'medium';
        const fontStyle = input.validation.font_style || 'normal';
        const alignment = input.validation.alignment_heading || 'left';

        const fontSizeValue =
            fontSize === 'small' ? '1rem' :
            fontSize === 'medium' ? '1.5rem' :
            fontSize === 'large' ? '2rem' : '2.5rem';

        const fontWeight = fontStyle.includes('bold') ? 'bold' : 'normal';
        const fontStyleValue = fontStyle.includes('italic') ? 'italic' : 'normal';
        const textDecoration = fontStyle.includes('underline') ? 'underline' : 'none';

        column.innerHTML = `
<div id="${input.name}" style="
font-size: ${fontSizeValue};
text-align: ${alignment};
font-weight: ${fontWeight};
font-style: ${fontStyleValue};
text-decoration: ${textDecoration};
margin-bottom: 1rem;">
${input.label}
</div>
`;
    } else if (input.type === 'table') {
        column.innerHTML = creatTableInForm(input) // form_table.js
    }
    
    else if (input.type !== 'table' && input.type !== 'map' && input.type !== 'button' && input.type !== 'file') {
        inputField = `
          <input type="text" class="input-field form-control"
          placeholder="${input.placeholder}" name="${input.name}" value="${valueFromDB}"
          id="${input.name}" ${isDisabled} />
          <div class="error-message" id="${input.name}-error"></div>
          `;
    }

    // Wrap the entire column including inputField and error message

    // column.className = `${colClass} ${hideClass} form-group`; // Include Bootstrap column class and d-none if hidden

    if (input.type !== 'table') {
        column.className = `${colClass} ${hide_input}`;
    }
    column.id = `column-${input.name}`;

    if (input.type !== 'Empty Placeholder' && input.type !== 'heading' && input.type !== 'table' &&
        input.type !== 'button') {
        column.innerHTML = `
        <label class="fs-6 fw-semibold mb-2 ${inputValidation.required ? 'required' : ''}">${input.label}</label>
        ${inputField}
        `;
            } else if (input.type == 'Empty Placeholder' || input.type == 'button') {
                column.innerHTML = `
        <label class="fs-6 fw-semibold mb-2" style="visibility: hidden;">${input.label}</label>
        ${inputField}
        `;
    }

    row.appendChild(column);

    // Append row to form container if the row is filled or it's the last element
    if (currentWidth >= 12 || index === dynamic_input.length - 1) {

        // if (formFlag == true) {
        formContainer.appendChild(row);
        //}

        // if (isProjectUrl) {
        // contentElement.appendChild(row);
        // createBtn(contentElement)
        // }

        // row = document.createElement('div');
        // row.classList.add('row', 'g-9', 'mb-7');
        // currentWidth = 0;
    }

});

const allow_unique_input = ['text', 'number', 'email', 'textarea', 'password', 'date', 'time', 'datetime-local']

setTimeout(() => {
    for (let index = 0; index < dynamic_input.length; index++) {
        const input = dynamic_input[index];
        const element = document.getElementById(input.name);
        const selectElement = $(`#${input.name}`);

        

        if (element && input.type !== 'checkbox' && input.type !== 'email') {
            element.addEventListener('input', function() {
                const name = element.name;
                const value = element.value;
                all_data_db[name] = value;
            
                // validateInput(input, element);
            });
        }

       
        if (input.type === 'table') {
            if (Object.keys(data_form_add.dynamic_table_values).length !== 0) {
                const tableData = all_form_data_table.find(
                    (form) => form.formLabel === input.validation.formName_table
                );

                const tableFields = tableData.formFields;
                const tableId = `${input.name}-table`;
                const tableValueData = data_form_add.dynamic_table_values[tableId] || [];

                if (tableValueData.length > 0) {
                    populateTablesFromData(tableId, tableFields, tableValueData);
                }
            }
        }

       
    }

    $('.file-upload').each(function(i, element) {
        $(element).on('change', function(event) {
            var visitType = $(this).data('visit');
            var fileInput = this;
            fileupload_cloud(event, fileInput, visitType);
        });
    });

    $('.file-download').each(function(i, element) {
        $(element).on('click', function(event) {
            var visitType = $(this).data('visit');
            var fileInput = this;
            filedownload_cloud(visitType, fileInput);
        });
    });

}, 100);

// if (trackLocation.length > 0) {
// createHistoryTable()
// }
// const approvalHistory = extractApprovalHistory(all_response_data);

// if (approvalHistory.length > 0) {
// generateApprovelHistoryTable(approvalHistory)
// }
if (all_data_db.trackLocation) {
  trackLocation = all_data_db.trackLocation
}
if (all_data_db.trackHistoryTable) {
  trackHistoryTable = all_data_db.trackHistoryTable
}


if (all_data_db.trackLocation.length > 0) {
  createHistoryTable(all_data_db.trackLocation)
}
if (all_data_db.trackHistoryTable.length > 0) {
  createHistoryTable(all_data_db.trackHistoryTable)
}
const approvalHistory = extractApprovalHistory(all_data_db, "status");
const approvalHistoryNew = extractApprovalHistory(all_data_db, "history");

if (approvalHistory.length > 0) {
  generateApprovelHistoryTable(approvalHistory, 'Status')
}
if (approvalHistoryNew.length > 0) {
  generateApprovelHistoryTable(approvalHistoryNew, 'History')
}
// hideLoadingSpinner();
disableAllInputs();
// populateTargetOption()
}

function disableAllInputs() {
  // Get all input, textarea, and button elements inside the #dynamic-form div
  const elements = document.querySelectorAll('#dynamic-form input, #dynamic-form textarea, #dynamic-form button');
  console.log('elements checking',elements)
  renderDynamicForm(elements);

  // Loop through each element and disable it
  elements.forEach(element => {
    element.disabled = false;
    element.style.color = 'black';  // Set text color to black
    // element.style.backgroundColor = '#f0f0f0'; // Optional: set background color
  });
}


var dynamic_table_values = {};
var editingRowIndex = null; // Declare editingRowIndex globally

var allow_input_type = ['text', 'number', 'email', 'date', 'time', 'password', 'range', 'color',
 'datetime-local', 'textarea', 'select']

function creatTableInForm(input) {
 let tableDatas = '';

 
 // console.log(('creatTableInForm :', input);
 // console.log(('all_form_data_table_form_table :', all_form_data_table);
 const tableData = Array.isArray(all_form_data_table)
 ? all_form_data_table.find((form) => form && form.formLabel === input.validation?.formName_table)
 : null;


 if (tableData) {

 // console.log(('tableData :', tableData);

 const tableFields = tableData.formFields;
 const tableId = `${input.name}-table`;
 let currentWidth = 0;
 let row = '<div class="row g-9">';

 tableFields.forEach((field, index) => {


 const colClass = getColumnClass(field.columnWidth);
 currentWidth += field.columnWidth;

 // Start a new row if currentWidth exceeds 12
 if (currentWidth > 12) {
 row += '</div>';
 tableDatas += row;
 row = '<div class="row g-9 mt-1">';
 currentWidth = field.columnWidth; // Reset currentWidth for the new row
 }

 let fieldHtml = '';
 const isMultiSelect = field.name.startsWith('multi-select');

 if (
 field.type === 'text' ||
 field.type === 'number' ||
 field.type === 'email' ||
 field.type === 'date' ||
 field.type === 'time' ||
 field.type === 'password' ||
 field.type === 'range' ||
 field.type === 'color' ||
 field.type === 'datetime-local'||
 field.type === 'heading'
 ) {
//  fieldHtml = `
//  <input type="${field.type}" class="form-control" 
//  placeholder="${field.placeholder}" id="${tableId}-${field.name}" />
//  `;
 }
 else if (field.type === 'textarea') {
//  fieldHtml = `
//  <textarea class="form-control" id="${tableId}-${field.name}" 
//  placeholder="${field.placeholder}" rows="3"></textarea>
//  `;
 }
 else if (field.type === 'select') {
 let options = field.options;
 let inputValidation = field.validation || {};

 if (inputValidation.lookup) {
//  options = check_table_configuration(field);
 options = options.map(obj => {

 let key = Object.keys(obj)[0]
 let value = obj[key];
 return { key, value };

 });
//  fieldHtml = `
//  <select id="${tableId}-${field.name}" ${isMultiSelect ? 'multiple' : ''} 
//  class="form-select form-select-solid" data-control="select2">
//  ${!isMultiSelect ? '<option value="" selected disabled>Select an option...</option>' : ''}
//  ${options.map(option => `<option value="${option.value}">${option.value}</option>`).join('')}
//  </select>
//  `;
 // console.log(("options_configuration :", options);
 }
 else if (inputValidation.user) {
//  if (array_user_info) {
//  options = array_user_info.map(user => user[0]); // Assuming user name is at index 0

//  options = options.map((city, index) => ({
//  key: `key_${index + 1}`,
//  value: city
//  }));
//  fieldHtml = `
//  <select id="${tableId}-${field.name}" ${isMultiSelect ? 'multiple' : ''} 
//  class="form-select form-select-solid" data-control="select2">
//  ${!isMultiSelect ? '<option value="" selected disabled>Select an option...</option>' : ''}
//  ${options.map(option => `<option value="${option.value}">${option.value}</option>`).join('')}
//  </select>
//  `;
//  }

 }
 else {
 fieldHtml = `
 <select id="${tableId}-${field.name}" ${isMultiSelect ? 'multiple' : ''} 
 class="form-select form-select-solid" data-control="select2">
 ${!isMultiSelect ? '<option value="" selected disabled>Select an option...</option>' : ''}
 ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
 </select>
 `;
 }

 // options.sort()

 }
 // else {
 // fieldHtml = `
 // <input type="text" class="form-control" 
 // placeholder="${field.placeholder}" id="${tableId}-${field.name}" />
 // `;
 // }

 // Add field HTML to the current row

 if (allow_input_type.includes(field.type)) {

//  row += `
//  <div class="${colClass}">
//  <label class="fs-6 fw-semibold mb-2 ${field.validation?.required ? 'required' : ''}">${field.label}</label>
//  ${fieldHtml}
//  </div>
//  `;

 // Append the final row if it's the last field
 if (index === tableFields.length - 1) {
 row += '</div>';
 tableDatas += row;
 }
 }

 });

 tableDatas += `
 <div class="row mt-3">

 </div>

 <label class="fs-6 fw-bold mt-10">${input.label}</label>

 <div class="${getColumnClass(input.columnWidth)}">
 <table id="${tableId}" class="table table-row-dashed border rounded fs-6 gy-5 mt-5">
 <thead>
 <tr>
 ${tableFields
 .map(
 (field) =>
 field.label !== "Empty Placeholder" ?
 `<th class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0 ps-10">${field.label}</th>` : ''
 )
 .join('')}
 </tr>
 </thead>
 <tbody></tbody>
 </table>
 </div>
 `;

 // Initialize Metronic Select2 for multi-select and single-select fields after DOM is updated
 setTimeout(() => {

 tableFields.forEach((field) => {

 const selectElement = $(`#${tableId}-${field.name}`);
 if (selectElement.length && field.type == 'select') {
 selectElement.select2({
 placeholder: field.name.startsWith('multi-select')
 ? 'Select options...'
 : 'Select an option...',
 allowClear: true,
 multiple: field.name.startsWith('multi-select'), // Enable multiple selection if multi-select
 minimumResultsForSearch: Infinity, // Enable search
 });
 }
 });
 }, 100);

 }
 else {
 tableDatas = `
 <label class="fs-6 fw-semibold mb-2">${input.label}</label>
 <p class="text-danger">Table data not found</p>
 `;
 }
 return tableDatas;
}



function populateTablesFromData(tableId, fields, tableValueData) {
 const table = document.getElementById(tableId);
 const tbody = table.querySelector('tbody');
 tbody.innerHTML = ''; // Clear the existing rows to avoid duplication

 // Iterate over each data entry in tableValueData
 tableValueData.forEach((data) => {
 const row = document.createElement('tr'); // Create a new row for each data entry

 // Populate row data for each field
 fields.forEach((field) => {
 const cell = document.createElement('td');
 const inputValue = data[field.name] || ''; // Get the value for the field, default to empty string
 cell.textContent = inputValue; // Set the cell content
 cell.classList.add('ps-10'); // Add padding class
 row.appendChild(cell);
 });

 // Add action buttons for edit and delete
//  const actionsCell = document.createElement('td');
//  actionsCell.classList.add('d-flex', 'align-items-center');
//  actionsCell.innerHTML = `
//  <button type="button" class="btn btn-warning btn-sm me-2 d-flex align-items-center justify-content-center"
//  onclick="editRow(this, '${tableId}', ${JSON.stringify(fields).replace(/"/g, '&quot;')})">
//  <i class="fas fa-edit ps-1"></i>
//  </button>
//  <button type="button" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
//  onclick="removeRow(this, '${tableId}')">
//  <i class="fas fa-trash-alt ps-1"></i>
//  </button>
//  `;
//  row.appendChild(actionsCell);

 // Append the row to the table body
 tbody.appendChild(row);
 });

 // console.log(('dynamic_table_values :', dynamic_table_values);
}


function addRowToTable(tableId, fields) {

 const table = document.getElementById(tableId);
 const tbody = table.querySelector('tbody');
 const rowData = {};
 let isValid = true;

 // Collect values from input fields and validate required fields
 fields.forEach((field) => {
 const inputId = `${tableId}-${field.name}`;
 const inputElement = document.getElementById(inputId);
 const isRequired = field.validation?.required || false;


 if (inputElement) {
 let inputValue;

 if (field.name.startsWith('multi-select')) {
 const selectedValues = $(`#${inputId}`).val() || [];
 inputValue = selectedValues.join(', ');
 }
 else if (field.type === 'select') {
 inputValue = $(`#${inputId}`).val() || '';
 }
 else {
 inputValue = inputElement.value || '';
 }

 if (isRequired && !inputValue.trim()) {
 // Highlight the invalid field
 //inputElement.classList.add('is-invalid');
 isValid = false;
 } else {
 // Remove invalid highlight if valid
 //inputElement.classList.remove('is-invalid');
 }

 rowData[field.name] = inputValue;
 }
 });

 if (!isValid) {
 Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please fill in all required fields.' })
 return; // Stop execution if validation fails
 }

 if (editingRowIndex !== null) {
 // Update existing row if in edit mode
 const row = tbody.children[editingRowIndex];

 let filteredFields = fields.filter(field => field.type !== "Empty Placeholder");

 filteredFields.forEach((field, index) => {

 if (field.label != 'Empty Placeholder') {
 const inputValue = rowData[field.name];
 const cell = row.cells[index];

 if (inputValue) {
 cell.textContent = inputValue;
 dynamic_table_values[tableId][editingRowIndex][field.name] = inputValue;
 }
 }
 });

 Swal.fire({
 icon: 'success',
 title: 'Record Updated Successfully',
 toast: true,
 position: 'top-end',
 showConfirmButton: false,
 timer: 2500,
 timerProgressBar: true,
 });

 editingRowIndex = null;
 }
 else {
 // Add new row if not in edit mode
 const row = document.createElement('tr');

 fields.forEach((field) => {

 if (field.label != 'Empty Placeholder') {
 const inputValue = rowData[field.name];
 row.innerHTML += `<td class="ps-10">${inputValue}</td>`;
 }

 });

 row.innerHTML += `
 <td class="d-flex align-items-center">
 <button type="button" class="btn btn-warning btn-sm me-2 d-flex align-items-center justify-content-center"
 onclick="editRow(this, '${tableId}', ${JSON.stringify(fields).replace(/"/g, '&quot;')})">
 <i class="fas fa-edit ps-1"></i>
 </button>
 <button type="button" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
 onclick="removeRow(this, '${tableId}')">
 <i class="fas fa-trash-alt ps-1"></i>
 </button>
 </td>
 `;

 tbody.appendChild(row);

 if (!dynamic_table_values[tableId]) {
 dynamic_table_values[tableId] = [];
 }
 dynamic_table_values[tableId].push(rowData);

 Swal.fire({
 icon: 'success',
 title: 'Record Added Successfully',
 toast: true,
 position: 'top-end',
 showConfirmButton: false,
 timer: 2500,
 timerProgressBar: true,
 });
 }

 // Clear input fields after adding/updating
 fields.forEach((field) => {
 const inputId = `${tableId}-${field.name}`;
 const input = $(`#${inputId}`);
 if (field.name.startsWith('multi-select') || field.type === 'select') {
 input.val(null).trigger('change'); // Clear multi-select and single-select values
 } else {
 input.val(''); // Clear regular input
 }
 });

 // console.log(('dynamic_table_values :', dynamic_table_values);
}

// Function to edit rows in the table
function editRow(button, tableId, fields) {
 const row = button.closest('tr');
 editingRowIndex = Array.from(row.parentNode.children).indexOf(row);
 const rowData = dynamic_table_values[tableId][editingRowIndex];

 fields.forEach((field) => {
 const inputId = `${tableId}-${field.name}`;
 const input = $(`#${inputId}`);
 if (field.name.startsWith('multi-select') || field.type === 'select') {
 const values = rowData[field.name].split(', ').filter(Boolean);
 input.val(values).trigger('change'); // Set multi-select or single-select values
 } else {
 input.val(rowData[field.name]); // Set regular input value
 }
 });
}

// Function to remove rows from the table
function removeRow(button, tableId) {

 Swal.fire({
 text: "Are you sure you would like to Delete?",
 icon: "warning",
 showCancelButton: true,
 buttonsStyling: false,
 cancelButtonText: "No, return",
 confirmButtonText: "Yes, Delete",
 reverseButtons: true, // This ensures the "No, return" button comes first
 customClass: {
 cancelButton: "btn btn-active-light",
 confirmButton: "btn btn-danger",
 },
 }).then(function (t) {
 if (t.value) {
 const row = button.closest('tr'); // Find the closest table row
 const rowIndex = Array.from(row.parentNode.children).indexOf(row); // Get the row index
 row.remove(); // Remove the row from the DOM

 // Update global data
 if (dynamic_table_values[tableId]) {
 dynamic_table_values[tableId].splice(rowIndex, 1); // Remove the row data from the global array
 }

 // Clear inputs if the deleted row was being edited
 if (editingRowIndex === rowIndex) {
 editingRowIndex = null; // Reset editing index
 }

 Swal.fire({
 icon: 'success',
 title: 'Record Deleted Successfully',
 toast: true,
 position: 'top-end',
 showConfirmButton: false,
 timer: 2500,
 timerProgressBar: true,
 });

 }
 });
}


var input_structure = []
var all_form_data_table = []

var form_inputs_generating_forms = []
var extractTargetValues = []


function get_data_main_dynamic_form(formHeading) {
//  showLoadingSpinner()

 const requestBody = {
 "table_name": 'master',
 "PK_key": "PK",
 "PK_value": clientid_ + '#dynamic_form#' + formHeading + "#main",
 "SK_key": "SK",
 "SK_value": 1,
 "type": 'query_request_v2'
 };

 fetch(crudURL, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
 },
 body: JSON.stringify(requestBody)
 })
 .then(response => response.json())
 .then(data => {
 if (data && data.body && data.body[0] && data.body[0].metadata) {
 const formData = data.body[0].metadata;
 // console.log('formData_main_table :', formData);

 input_structure = formData.formFields

 console.log('input_structure_1st :', input_structure);

 if (input_structure && input_structure.length > 0) {
 // Extrating Data to Auto fill from one select tag to another select tag
 extractTargetValues = input_structure
 .filter(item => item.validation.isTarget) // Filter only items with isTarget true
 .reduce((acc, item) => {
 // Check if the form_name already exists
 const targetInputs = item.validation.targetCurrentFormLabel || []; // Safeguard against undefined
 const existingForm = acc.find(f => f.form_name === item.validation.targetAllForm);

 if (existingForm) {
 // If the form exists, add the relevant data
 existingForm.source_name.push(item.validation.targetSourceFormSelect);
 existingForm.populate_input.push(item.name);
 }
 else {
 // If the form does not exist, create a new entry
 acc.push({
 form_name: item.validation.targetAllForm,
 source_name: [item.validation.targetSourceFormSelect],
 target_input: targetInputs,
 populate_input: [item.name],
 checked: false
 });
 }
 return acc;
 }, []);

 }
 if (!input_structure) {
//  hideLoadingSpinner()
 }

 // if (input_structure.length > 0) {
 // // Extrating Data to Auto fill from one select tag to another select tag
 // extractTargetValues = input_structure
 // .filter(item => item.validation.isTarget) // Filter only items with isTarget true
 // .reduce((acc, item) => {
 // // Check if the form_name already exists
 // const targetInputs = item.validation.targetCurrentFormLabel || []; // Safeguard against undefined

 // console.log('item.validation.targetCurrentFormLabel :', item.validation.targetCurrentFormLabel);
 // const existingForm = acc.find(f => f.form_name === item.validation.targetAllForm);

 // if (existingForm) {
 // // If the form exists, add the relevant data
 // existingForm.source_name.push(item.validation.targetSourceFormSelect);
 // existingForm.populate_input.push(item.name);
 // existingForm.target_input.push(item.validation.targetCurrentFormLabel);

 // }
 // else {
 // // If the form does not exist, create a new entry
 // acc.push({
 // form_name: item.validation.targetAllForm,
 // source_name: [item.validation.targetSourceFormSelect],
 // target_input: item.validation.targetCurrentFormLabel,
 // populate_input: [item.name],
 // checked: false
 // });
 // }
 // return acc;
 // }, []);

 // }

 console.log('extractTargetValues :', extractTargetValues);

 // code is added by swapnil 22-Oct-2023

 const formEvent = new CustomEvent('formDataReady', { detail: formData });
 window.dispatchEvent(formEvent);

 // code is added by swapnil 22-Oct-2023

 if (formData.formFields) {

 table_list_dynamic_form_values_look_up = []

 // console.log('formData_formFields :', formData.formFields);



 if (isWithoutlogin) {

 var joining_form_inputs = [...formData.formFields];
 if (all_form_data_table.length > 0) {
 // Combine the data
 all_form_data_table.forEach((table) => {
 if (table) {
 table.formFields.forEach((field) => {
 joining_form_inputs.push(field);
 });
 }
 });
 }

 let user_configuration = checkUserValidation(joining_form_inputs)
 let isDerivedUser_configuration = checkUserValidationDerivedUser(joining_form_inputs)

 console.log('joining_form_inputs :', joining_form_inputs);
 generate_configuration_table(joining_form_inputs)

 if (user_configuration || isDerivedUser_configuration) {
 get_request_lookup_user_table(1)
 }
 }

 // if (!isWithoutlogin) {
 get_lookup_form_values(1, formHeading, formData.formFields)
 // }

 form_inputs_generating_forms = formData.formFields

 }
 else {
 const formContainer = document.getElementById('dynamic-form');

 formContainer.innerHTML = '';

 form_inputs_generating_forms = []

 const tableBody = document.getElementById('dynamic-data');
 const tableHead = document.querySelector('#kt_customers_table thead tr'); // Selecting the table header row

 // Clear previous table content
 tableBody.innerHTML = ''; // Clear previous table body data
 tableHead.innerHTML = ''; // Clear previous table header content
 }

 // hideLoadingSpinner()
 }
 else {
 // Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to Get Form Details' });
//  hideLoadingSpinner()
 }
 })
 .catch(error => {
 console.error('Error loading form:', error);
//  hideLoadingSpinner()
 Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to Get Form Details' });
 });
}

function checkTableConfiguration(formFields) {
 let result = formFields
 .filter(field => field.type === "table" && field.validation.formName_table)
 .map(field => ({
 table_name: field.label,
 form_name: field.validation.formName_table
 }));
 return result
}

async function getAllDynamicFormData(formHeadings,clientid_) {
//  showLoadingSpinner()
 // Function to fetch form data for a single form heading
 const fetchFormData = async (formHeading) => {
 const requestBody = {
 table_name: 'master',
 PK_key: "PK",
 PK_value: `${clientid_}#dynamic_form#${formHeading}#main`,
 SK_key: "SK",
 SK_value: 1,
 type: 'query_request_v2'
 };
 const apiUrl = 'https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud';
 try {
 const response = await fetch(apiUrl, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
 },
 body: JSON.stringify(requestBody)
 });

 const data = await response.json();
 console.log('data checking from getAllDynamicFormData',data)

 if (data && data.body && data.body[0] && data.body[0].metadata) {
 return data.body[0].metadata; // Return only metadata
 }
 else {
//  hideLoadingSpinner()
 console.error(`Failed to get data for ${formHeading}`);
 return null;
 }
 }
 catch (error) {
//  hideLoadingSpinner()
 console.error(`Error fetching data for ${formHeading}:`, error);
 return null;
 }
 };

 // Fetch all form data in parallel
 try {
 const results = await Promise.all(formHeadings.map(fetchFormData));

 // Log or process all results
 results.forEach((data, index) => {
 const formHeading = formHeadings[index];
 if (data) {
 // console.log(`Data for ${formHeading}:`, data);
 }
 else {
 console.error(`No data available for ${formHeading}`);
 }
 });

 // hideLoadingSpinner();
 // Return all results if needed elsewhere
 return results;
 }
 catch (error) {
 console.error('Error fetching form data:', error);
//  hideLoadingSpinner();
 Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to Get All Form Details' });
 }
}

function check_table_configuration(input) {
  // console.log('all_configuration_table_data_options :', all_configuration_table_data);
  console.log('all_configuration_table_data :', all_configuration_table_data)
  let result = all_configuration_table_data.find(obj => obj[input.name])?.[input.name] || [];
  return result
}


async function generate_configuration_table(table_heading_data) {

  for (const record of table_heading_data) {
      if (record.validation && record.validation.lookup) {
          // checking_form_name_for_configuration.push(record.validation.form);
          await get_lookup_configuration(1, record.validation.form, record.validation.field, record.name);
      }
  }
  // // console.log('checking_form_name_for_configuration:', checking_form_name_for_configuration);
  console.log('all_configuration_table_data:', all_configuration_table_data);

//   hideLoadingSpinner()

}
var table_list_lookup_configuration = [];
var all_configuration_table_data = [];
var all_lookup_configuration_validate = []
//var form_label_id_obj = [];

async function get_lookup_configuration(page_no, form_name, form_label_id, current_form_id) {
  if (page_no === 1) {
    // showLoadingSpinner()
  }

  const requestBody = {
      "table_name": 'master',
      "PK_key": "PK",
      "PK_value": `${clientid_}#${form_name}#lookup`,
      "SK_key": 'SK',
      "SK_value": page_no,
      "type": 'get_request'
  };

  // console.log('requestBody_lookup_lookup_data:', requestBody);

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
          },
          body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        //   hideLoadingSpinner();
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.body) {
          let response_data;
          try {
              response_data = JSON.parse(data.body);
          } catch (e) {
              // console.log("Error parsing response body:", e);
              return;
          }

          if (response_data && response_data.PK && response_data.SK) {
              if (response_data.options && response_data.options.length > 0) {
                  // console.log('response_data_metadata:', response_data.metadata);
                  //  form_label_id_obj = response_data.metadata;
                  table_list_lookup_configuration = [
                      ...table_list_lookup_configuration,
                      ...response_data.options
                  ];

                  // Recursive call to fetch next page data
                  await get_lookup_configuration(page_no + 1, form_name, form_label_id, current_form_id);
              }
          }
      }
      else {
          //  var find_index = form_label_id_obj[form_label_id];
          console.log('table_list_lookup_configuration:', table_list_lookup_configuration);

          all_lookup_configuration_validate.push(table_list_lookup_configuration)
              / console.log('form_label_id :', form_label_id);
          // console.log('current_form_id :', current_form_id);

          // let result = table_list_lookup_configuration.map(row => {
          //     let match = row.find(item => item.startsWith(form_label_id));
          //     return match ? match.split(/#(.+)/)[1] : null;
          // }).filter(Boolean);


          // let result = table_list_lookup_configuration.map(row => {
          //     let id = row.find(item => item.startsWith('id#'));
          //     let text = row.find(item => item.startsWith(form_label_id));
          //     console.log('text_data :',text);

          //     if (id && text) {
          //         return { [id.split('#')[1]]: text.split(/#(.+)/)[1] };
          //     }
          // }).filter(Boolean);

          let result = table_list_lookup_configuration.map(row => {
              let id = row.find(item => item.startsWith('id#'));
              let text = row.find(item => item.startsWith(form_label_id));

              if (id && text) {
                  let idValue = id.split('#')[1];
                  let textValues;

                  // Check if the form_label_id starts with 'multi-select'
                  if (form_label_id.startsWith('multi-select')) {
                      textValues = text.split('#')[1].split(','); // Split into array for multi-select
                  } else {
                      textValues = [text.split('#')[1]]; // Wrap in array for other types
                  }

                  return { [idValue]: textValues };
              }
          }).filter(Boolean); // Filter out undefined results

          console.log('result_new_data :', result);

          all_configuration_table_data.push({ [current_form_id]: result });
          table_list_lookup_configuration = []
      }

      // console.log("Response data:", data);

  }
  catch (error) {
    //   hideLoadingSpinner()
      console.error('Error:', error);
      // Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load Items. Please try again.' });
  }



  window.renderDynamicForm = function(container) {
    container.innerHTML = '<h1>Dynamic Form Loaded</h1>';
    console.log('✅ renderDynamicForm executed successfully!');
  };
  
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 DOM Loaded - Adding event listeners to cards");
    // handleCardClick();
  
    // Select all elements that need a click event
    const cards = document.querySelectorAll(".dynamic-card");

  
    // // Attach event listener to each card
    // cards.forEach((card) => {
    //   const option = card.getAttribute("data-option"); // Ensure data is available
    //   card.addEventListener("click", function () {
    //     console.log("🔹 Card Clicked - Calling handleCardClick");
    //     if (typeof handleCardClick !== "undefined") {
     
    //     } else {
    //       console.warn("⚠️ handleCardClick is not defined!");
    //     }
    //   });
    // });
  });
  
// ✅ Listen for PK & SK from Angular via postMessage
window.addEventListener("message", (event) => {
    if (event.data.pk && event.data.sk) {
        window.pk = event.data.pk;
        window.sk = event.data.sk;
        console.log("✅ Received PK from Angular:", window.pk);
        console.log("✅ Received SK from Angular:", window.sk);
        handleCardClick(event)
    } else {
        console.warn("⚠️ Received message but PK or SK is missing:", event.data);
    }
});

// ✅ Ensure `handleCardClick()` Waits for PK & SK
  async function handleCardClick(eventData) {
    console.log('eventData checking',eventData)

 
     
        console.log('window.sk checking',window.sk)
        console.log('eventData checking inside try',eventData)
     
        let pkFromAngular =eventData.data.pk
        let skFromAngular = eventData.data.sk
        console.log('pk checking',pk)

    

        // ✅ Wait until PK & SK are set in the Blob
        let retryCount = 0;
        while (!window.pk || !window.sk) {
            console.warn(`⏳ Waiting for PK & SK... Attempt ${retryCount + 1}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Wait 300ms
            retryCount++;
            if (retryCount > 10) {  // Stop after 3 seconds
                console.error("❌ PK & SK are not available in the Blob iframe!");
                // hideLoadingSpinner();
                return;
            }
        }

        // ✅ Fetch PK & SK from the Blob window
        let pkDetails = eventData.data.pk;
        console.log('window.sk checking',pkDetails)
        
        let skDetails = eventData.data.sk;

        console.log("✅ Retrieved PK from Blob iframe: " + pkDetails);
        console.log("✅ Retrieved SK from Blob iframe: " + skDetails);

        var splittedPk = pkFromAngular.split('#');
        console.log('splittedPk checking',splittedPk)
        var formName = splittedPk[1];

        console.log("✅ Extracted formName from PK: " + formName);

        let ClientId= eventData.data.clientId
        // ✅ Fetch Form & Approval Data
        await getDynamicFormDetails(formName,ClientId);
        await getApprovalMainPkDetails(pkFromAngular, skFromAngular);
        
  
};




async function getApprovalMainPkDetails(pkDetails,skDetails){

    const skValue = Number(skDetails); // Convert skDetails to a number
    console.log('skValue checking',skValue)
  
    const requestBody = {
      "table_name": "master",
      "PK_value": pkDetails,
      "SK_value": skValue,
      "PK_key": "PK",
      "SK_key": "SK",
      "type": "get_request"
    };

  
    console.log('Request Body: approval', requestBody);
    const apiUrl = 'https://iy5kihshy9.execute-api.ap-south-1.amazonaws.com/s1/crud';
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'kzUreDYgmB8jUwsniUREa6ggTxIg8bi82zmfjuvZ',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch options for SK=${skValue}`);
    }
  
    const data = await response.json();
  
    if (data && data.body) {
      const responseData = JSON.parse(data.body);
      currentSelectedPendingTask = responseData; // pending task from the pk
      // console.log('response Data = '+ JSON.stringify(responseData,null,2));
  
      console.log('response of getApprovalMainPkDetails', JSON.stringify(responseData,null,2));
  
      const metadata = responseData.metadata;  // Get the metadata from the response
      data_form_add = metadata;
      const labels = {};  // Object to store the matched labels and values
  
      // Iterate through formDynamicFields to match the name with metadata keys
      // formDynamicFields.forEach(field => {
      //   const fieldName = field.name; // Get the 'name' from formDynamicFields
        
      //   // Check if the field name matches any key in metadata
      //   if (metadata.hasOwnProperty(fieldName)) {
      //     const label = field.label; // Get the label for the matched field
      //     const value = metadata[fieldName] || ''; // Get the value from metadata (empty if undefined)
          
      //     // Store in the format 'name: value'
      //     labels[label] = value; 
      //   }
      // });
  
      // // Log the labels of matched fields
      // console.log('Matched Labels:', labels);
  
      //  // Populate the table in the modal with the matched labels and values
      //  const tableBody = document.querySelector('#kt_pendingTask_table tbody');
      //  tableBody.innerHTML = ''; // Clear previous rows if any
   
      //  // Create a row for each matched field and append it to the table
      // for (let label in labels) {
      //   const row = document.createElement('tr');
  
      //   // Create label and value columns
      //   const labelCell = document.createElement('td');
      //   labelCell.innerText = label;
  
      //   const valueCell = document.createElement('td');
      //   valueCell.innerText = labels[label];
  
      //   // Append the label and value cells to the row
      //   row.appendChild(labelCell);
      //   row.appendChild(valueCell);
  
      //   // Append the row to the table body
      //   // tableBody.appendChild(row);
      // }
  
      await generateFormView(formDynamicFields,data_form_add);
      
    } else {
      console.log("No body in the response : getApprovalMainPkDetails" );
      Swal.fire('Error!', 'Record Not Found.', 'error').then(() => {
        // After SweetAlert closes, hide the modal
        document.getElementById('kt_modal_add_customer').setAttribute('data-bs-dismiss', 'modal');
          document.getElementById('kt_modal_add_customer').click();
          document.getElementById('kt_modal_add_customer').removeAttribute('data-bs-dismiss'); 
  
          const deleteRequest = {
            "table_name": "master",
            "deleteItem_lookup": {
              "PK":  clientid_ + "#pendingapprovals#lookup",
              "options": lookupOption
            },
            "PK_key": "PK",
            "SK_key": "SK",
            "type": "delete_request_lookup_duplicate"
          }
          console.log("data = " + JSON.stringify(deleteRequest));
        
          // Sending the POST request using fetch
          fetch(crudURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'kzUreDYgmB8jUwsniUREa6ggTxIg8bi82zmfjuvZ'
            },
            body: JSON.stringify(deleteRequest)
          })
          .then(response => {
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
          })
          .then(responseData => {
            console.log("Response Data:", responseData);
            location.reload();
          })
          .catch((error) => {
            console.error("Error:", error);
            // Swal.fire('Error!', error.message, 'error'); // Show an error message
          });
      });
  
      
  
  
      
      
    }
  
  
  }


  function extractApprovalHistory(data, type) {
    // Check if 'options' exists and is an object
    if (data.options && typeof data.options === 'object' && type == 'status') {
        if (Array.isArray(data.options.approval_history)) {
            return data.options.approval_history;
        }
    }
    else if (data.options && typeof data.options === 'object' && type == 'history') {
        if (Array.isArray(data.options.approvalHistoryNew)) {
            return data.options.approvalHistoryNew;
        }
    }
    // Return empty array if conditions are not met
    return [];
  }
  
  
  
  function generateApprovelHistoryTable(approvalHistoryData, headingType) {
    console.log('approvalHistoryData :', approvalHistoryData);
    const formContainer = document.getElementById('dynamic-form');
  
    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('mt-10'); // Adding the class for margin-top
  
    // Create table heading
    const tableHeading = document.createElement('h3');
    tableHeading.textContent = `Approval ${headingType}`;
    tableContainer.appendChild(tableHeading);
  
    // Create table
    const table = document.createElement('table');
    table.className = "table table-row-dashed border rounded fs-6 gy-5 mt-5";
  
    // Create table header row
    const headerRow = document.createElement('tr');
    const headers = ["", headingType, "Comment", "Date and Time"];
  
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = "8px";
        th.style.textAlign = "left";
        th.className = "text-start text-gray-500 fs-7 text-uppercase fw-bold gs-0";
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    // Create table rows
    approvalHistoryData.forEach((data, index) => {
        const row = document.createElement('tr');
  
        // Serial No
        const serialNoCell = document.createElement('td');
        serialNoCell.textContent = index + 1;
        serialNoCell.style.padding = "8px";
        row.appendChild(serialNoCell);
  
        // Extract Status (removing the comment part)
        const splitText = data[0].split('-');
        const statusText = splitText[0].trim(); // Extract only the first part before '-'
        const commentText = splitText.length > 1 ? splitText.slice(1).join('-').trim() : "N/A"; // Join rest as comment
  
        // Status Column
        const historyCell = document.createElement('td');
        historyCell.textContent = statusText // Only Status without Comment
        historyCell.style.padding = "8px";
        row.appendChild(historyCell);
  
        // Comment Column
        const commentCell = document.createElement('td');
        commentCell.textContent = commentText || 'N/A' // Only Comment
        commentCell.style.padding = "8px";
        row.appendChild(commentCell);
  
        // Date and Time
        const dateCell = document.createElement('td');
        const date = new Date(data[1] * 1000); // Convert UNIX timestamp to JavaScript Date object
        dateCell.textContent = date.toLocaleString(); // Format date and time
        dateCell.style.padding = "8px";
        row.appendChild(dateCell);
  
        table.appendChild(row);
    });
  
    tableContainer.appendChild(table);
    formContainer.appendChild(tableContainer);
  }
  
  
  
  function createHistoryTable(historyData) {
  
    const groupedData = {};
   
    // Group by label_id and prepare datas array
    historyData.forEach((item) => {
    const labelId = item.label_id;
   
    if (!groupedData[labelId]) {
    groupedData[labelId] = {
    label_id: labelId,
    label_name: item.label_name,
    datas: [],
    };
    }
    groupedData[labelId].datas.push(item);
   
    // Update label_name to the latest one based on Date_and_time
    const currentDate = new Date(item.Date_and_time);
    const existingDate = groupedData[labelId].latestDate
    ? new Date(groupedData[labelId].latestDate)
    : null;
   
    if (!existingDate || currentDate > existingDate) {
    groupedData[labelId].label_name = item.label_name;
    groupedData[labelId].latestDate = item.Date_and_time;
    }
    });
    // console.log('groupedData :', groupedData);
    // Remove temporary latestDate key and convert to array
    const finalData = Object.values(groupedData).map(({ latestDate, ...rest }) => rest);
   
    if (finalData) {
   
    const formContainer = document.getElementById('dynamic-form');
   
    finalData.forEach((tableData) => {
    // Create table container
   
    let isShow = checkShowHistory(tableData.label_id)
   
    if (isShow) {
   
    const tableContainer = document.createElement('div');
    tableContainer.style.marginBottom = "20px";
   
    // Create table heading
    const tableHeading = document.createElement('h3');
    tableHeading.textContent = tableData.label_name + ' History'
   
    if (tableData.label_id.startsWith('table-')) {
    tableHeading.textContent = tableData.label_name + ' Table History'
    }
    tableContainer.appendChild(tableHeading);
   
    // Create table
    const table = document.createElement('table');
    table.className = "table table-row-dashed border rounded fs-6 gy-5 mt-5";
   
    // Create table header row
    const headerRow = document.createElement('tr');
    const headers = ["User Name", "Type", "Date and Time"];
    headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.style.padding = "8px";
    th.style.textAlign = "left";
    headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
   
    // Create table rows
    // Create table rows
    tableData.datas.forEach((data) => {
    const row = document.createElement('tr');
   
    // User Name
    const userNameCell = document.createElement('td');
    userNameCell.textContent = data.name;
    userNameCell.style.padding = "8px";
    row.appendChild(userNameCell);
   
    // Type, handle newline characters to show multiple lines in the same cell
    const typeCell = document.createElement('td');
    typeCell.style.padding = "8px";
    // Split the type data by newline and create a separate text node and <br> for each line
    const typeLines = data.type.split('\n');
    typeLines.forEach((line, index) => {
    if (index > 0) typeCell.appendChild(document.createElement('br'));
    typeCell.appendChild(document.createTextNode(line));
    });
    row.appendChild(typeCell);
   
    // Date and Time 
    const dateTimeCell = document.createElement('td');
    var date_time = data.Date_and_time;
    
    if (typeof data.Date_and_time === 'number' || data.created_epoch) {
    
    const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // Ensures 12-hour time format with AM/PM
    };
    var getCorrectEpoch = 0
    if (data.created_epoch) {
    getCorrectEpoch = data.created_epoch
    }
    else if (!data.created_epoch) {
    getCorrectEpoch = data.Date_and_time
    }
   
    const dateObj = new Date(getCorrectEpoch);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
   
    // Rearranging the date format
    const [month, day, year] = formattedDate.split(', ')[0].split('/');
    const time = formattedDate.split(', ')[1];
   
    date_time = `${day}/${month}/${year}, ${time}`;
    console.log('date_time :', date_time);
    }
   
    else if (typeof data.Date_and_time != 'number') {
    date_time = data.Date_and_time;
    }
   
    dateTimeCell.textContent = date_time;
    dateTimeCell.style.padding = "8px";
    row.appendChild(dateTimeCell);
   
    // Location button
    // const locationCell = document.createElement('td');
    // const locationButton = document.createElement('button');
    // locationButton.type = "button";
    // locationButton.className = "btn btn-info btn-lg d-flex align-items-center justify-content-center";
    // locationButton.style.height = "43px";
    // locationButton.onclick = () => openMapModalHistory(data.latitude, data.longitude);
   
    // Add icon to the button
    // const locationIcon = document.createElement('i');
    // locationIcon.className = "fas fa-map-marker-alt";
    // locationButton.appendChild(locationIcon);
   
    // locationCell.style.padding = "8px";
    // locationCell.appendChild(locationButton);
    // row.appendChild(locationCell);
   
    table.appendChild(row);
    });
    
    tableContainer.appendChild(table);
    formContainer.appendChild(tableContainer);
    }
   
    });
    }
   
   }
  
   function checkShowHistory(labelName) {
    const isTrackHistoryTrue = formDynamicFields.some(item => item.name === labelName && item.validation?.isTrackHistory === true);
    return isTrackHistoryTrue
  }
  
  // Function to open the map modal
  function openMapModalHistory(lat, lon) {
    // Ensure the modal exists
    if (!document.getElementById('mapModal')) {
        createMapModalHistory();
    }
  
    // Show the modal
    const mapModal = new bootstrap.Modal(document.getElementById('mapModal'), {
        backdrop: 'static',
    });
    mapModal.show();
  
    // Initialize the map once the modal is shown
    mapModal._element.addEventListener('shown.bs.modal', () => {
        initMapHistory(lat, lon);
    });
  }
  
  // Create the modal structure for the map
  function createMapModalHistory() {
    const modalHTML = `
        <div class="modal fade" id="mapModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Location</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="map-container" style="height: 400px; width: 100%;"></div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  // Initialize the map inside the modal
  function initMapHistory(lat, lon) {
    // Clear the map container to prevent conflicts
    const mapElement = document.getElementById('map-container');
    mapElement.innerHTML = '';
  
    // Map options
    const mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
  
    // Create the map
    const mapInstance = new google.maps.Map(mapElement, mapOptions);
  
    // Add a marker
    new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: mapInstance,
    });
  }

