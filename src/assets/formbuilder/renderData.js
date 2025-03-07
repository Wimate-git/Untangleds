
async function getDynamicFormDetails(formName){
  const requestBody = {
    "table_name": "master",
    "PK_value": clientid_ + "#dynamic_form#" + formName + "#main",
    "SK_value": 1,
    "PK_key": "PK",
    "SK_key": "SK",
    "type": "get_request"
  };

    console.log('Request Body:', requestBody);

    const response = await fetch(crudURL, {
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
      // console.log('response Data = '+ JSON.stringify(responseData,null,2));

      const FormData_FromDB = responseData;
      formDynamicFields = FormData_FromDB.metadata.formFields;

      if (formDynamicFields.length > 0) {
        let extract_table_configuration = checkTableConfiguration(formDynamicFields)
       
        if (extract_table_configuration.length > 0) {
        // console.log('extract_table_configuration :', extract_table_configuration);
       
        let formNames = extract_table_configuration.map(item => item.form_name);
       
        await getAllDynamicFormData(formNames).then(results => {
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
    let isDisabled = inputValidation.disabled === true ? 'disabled' : '';
    // let hideClass = inputValidation.hide ? 'd-none' : ''; // Use Bootstrap's d-none class to hide elements
    const canvasStyle = isDisabled ? 'pointer-events: none; opacity: 0.6;' : ''; // Disable canvas interaction if disabled

    const column = document.createElement('div');
    column.className = `${colClass} ${hide_input}`;
    column.id = `column-${input.name}`; // Assign an ID to the column for show/hide

    if (input.type === 'nikhil') {

        // optionConfiguration = false
        // let options = input.options;
        // options.sort()
        // console.log('options_static :', options)
        // if (inputValidation.user) {
        //     // if (array_user_info) {
        //     // optionConfiguration = true
        //     // options = array_user_info.map(user => user[0]); // Assuming user name is at index 0
        //     // console.log('options :', options)
        //     // options.sort()
        //     // options = options.map((city, index) => ({
        //     // key: `key_${index + 1}`,
        //     // value: [city]
        //     // }));
        //     // }
        // }
        // if (inputValidation.lookup) {
        //     options = check_table_configuration(input)
        //     console.log('options_check_table_configuration :', options)
        //     optionConfiguration = true

        //     // options.sort((a, b) => {
        //     // const nameA = Object.values(a)[0].toLowerCase(); // Extracting company name
        //     // const nameB = Object.values(b)[0].toLowerCase(); // Extracting company name
        //     // return nameA.localeCompare(nameB); // Compare names alphabetically
        //     // });

        //     options.sort((a, b) => {
        //         // Get the first value of the objects, which may be undefined or not a string
        //         const valueA = Object.values(a)[0];
        //         const valueB = Object.values(b)[0];

        //         // Ensure the values are strings and fall back to an empty string if undefined or not a string
        //         const nameA = valueA && typeof valueA === 'string' ? valueA.toLowerCase() : '';
        //         const nameB = valueB && typeof valueB === 'string' ? valueB.toLowerCase() : '';

        //         return nameA.localeCompare(nameB); // Compare names alphabetically
        //     });

        //     options = options.map(obj => {
        //         let key = Object.keys(obj)[0]
        //         let value = obj[key]
        //         return {
        //             key,
        //             value
        //         };

        //     });
        // }

        // const isMultiSelect = input.name.startsWith('multi-select');

        // new_options = []
        // operation_type_option = ''

        // if (inputValidation.isUniqueOption) {
        //     if (options.some(item => typeof item === 'object' && item !== null)) {

        //         const seenValues = new Set();

        //         options = options.map(option => {
        //             const filteredValues = option.value.filter(value => {
        //                 if (!seenValues.has(value)) {
        //                     seenValues.add(value);
        //                     return true;
        //                 }
        //                 return false;
        //             });
        //             return {
        //                 ...option,
        //                 value: filteredValues
        //             };
        //         }).filter(option => option.value.length > 0);

                
        //     }

        // }



        // if (isMultiSelect == false) {
        //     // check_option_validation_disable_hide(input.name)
        // }
        // options.sort()
        // console.log("options_configuration :", options);
        // if (new_options.length > 0) {

        //     if (optionConfiguration) {

        //         inputField = `
        //             <select id="${input.name}" name="${input.name}"
        //             class="form-select form-select-solid dynamic-select"
        //             data-control="select2" data-placeholder="Select an option..." data-allow-clear="true"
        //             ${isMultiSelect ? 'multiple' : ''} ${isDisabled}>
        //             ${!isMultiSelect ? '<option value="" selected disabled>Select an option</option>' : ''}

        //             ${options.map(option => {
        //             // Check if the option should be disabled or hidden
        //             let isOptionDisabled = options.includes(option.value) && !new_options.includes(option.value);
        //             let optionTag = `<option value="${option.value}" data-secondary="${option.key}" ${option.value === valueFromDB ? 'selected' : ''}>${option.value}</option>`;

        //             if (operation_type_option === 'disable' && isOptionDisabled) {
        //             // Disable the option if "disable" condition is met
        //             return `<option value="${option.value}" data-secondary="${option.key}" ${option.value === valueFromDB ? 'selected' : ''} disabled>${option.value}</option>`;
        //             }
        //             else if (operation_type_option === 'hide' && isOptionDisabled) {
        //             // Hide the option if "hide" condition is met
        //             return ''; // Return empty string to effectively remove the option
        //             }
        //             return optionTag;
        //             }).join('')}

        //             </select>
        //             <div class="error-message" id="${input.name}-error"></div>
        //             `;
        //                         } else {
        //                             inputField = `
        //             <select id="${input.name}" name="${input.name}"
        //             class="form-select form-select-solid dynamic-select"
        //             data-control="select2" data-placeholder="Select an option..." data-allow-clear="true"
        //             ${isMultiSelect ? 'multiple' : ''} ${isDisabled}>
        //             ${!isMultiSelect ? '<option value="" selected disabled>Select an option</option>' : ''}

        //             ${options.map(option => {
        //             // Check if the option should be disabled or hidden
        //             let isOptionDisabled = options.includes(option) && !new_options.includes(option);
        //             let optionTag = `<option value="${option}" ${option === valueFromDB ? 'selected' : ''}>${option}</option>`;

        //             if (operation_type_option === 'disable' && isOptionDisabled) {
        //             // Disable the option if "disable" condition is met
        //             return `<option value="${option}" ${option === valueFromDB ? 'selected' : ''} disabled>${option}</option>`;
        //             }
        //             else if (operation_type_option === 'hide' && isOptionDisabled) {
        //             // Hide the option if "hide" condition is met
        //             return ''; // Return empty string to effectively remove the option
        //             }

        //             return optionTag;
        //             }).join('')}

        //             </select>
        //             <div class="error-message" id="${input.name}-error"></div>
        //             `;
        //     }
        // } else {

        //     // if (optionConfiguration) {

        //     // inputField = `
        //     // <select id="${input.name}" name="${input.name}"
        //     // class="form-select form-select-solid dynamic-select"
        //     // data-control="select2" data-placeholder="Select an option..." data-allow-clear="true"
        //     // ${isMultiSelect ? 'multiple' : ''} ${isDisabled}>

        //     // ${!isMultiSelect ? '<option value="" selected disabled>Select an option</option>' : ''}

        //     // ${options.map(option => `<option value="${option.value}" data-secondary="${option.key}" ${option.value === valueFromDB ? 'selected' : ''}>${option.value}</option>`).join('')}

        //     // </select>
        //     // <div class="error-message" id="${input.name}-error"></div>
        //     // `;
        //     // }
        //     if (optionConfiguration) {
        //         console.log('data-secondary_options_2nd :', options);
        //         inputField = `
        //           <select id="${input.name}" name="${input.name}" class="form-select form-select-solid dynamic-select"
        //           data-control="select2" data-placeholder="Select an option..." data-allow-clear="true"
        //           ${isMultiSelect ? 'multiple' : ''} ${isDisabled}>
        //           ${!isMultiSelect ? '<option value="" selected disabled>Select an option</option>' : ''}

        //           ${options.map(optionObject => {
        //           // Get the key dynamically
        //           const key = Object.keys(optionObject).find(k => k !== "value");
        //           const keyValue = optionObject[key];

        //           // Extract values (flatten the array if nested)
        //           const values = optionObject.value.flat();

        //           console.log('key:', keyValue); // Debugging: log the dynamic key
        //           console.log('values:', values); // Debugging: log the flattened values

        //           // Generate <option> tags
        //           return values.map(value => `<option value="${value}" data-secondary="${keyValue}" ${value === valueFromDB ? 'selected' : ''}>${value}</option>`).join('');
        //           }).join('')}
        //           </select>
        //           <div class="error-message" id="${input.name}-error"></div>
        //           `;
        //                       } else {
        //                           inputField = `
        //           <select id="${input.name}" name="${input.name}"
        //           class="form-select form-select-solid dynamic-select"
        //           data-control="select2" data-placeholder="Select an option..." data-allow-clear="true"
        //           ${isMultiSelect ? 'multiple' : ''} ${isDisabled}>

        //           ${!isMultiSelect ? '<option value="" selected disabled>Select an option</option>' : ''}

        //           ${options.map(option => `<option value="${option}" ${option === valueFromDB ? 'selected' : ''}>${option}</option>`).join('')}

        //           </select>
        //           <div class="error-message" id="${input.name}-error"></div>
        //           `;
        //     }
        // }
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
    // else if (input.type === 'file') {
    //     inputField = `
    //       <input type="${input.type}" class="input-field form-control file-upload"
    //       placeholder="${input.placeholder}" name="${input.name}" value="${valueFromDB}"
    //       id="${input.name}" data-visit="${input.name}" ${isDisabled} />
    //       <div class="row g-9 mb-7">
    //       <div class="col-md-12 fv-row">
    //       <button type="button" class="btn btn-light-primary me-3 file-download mt-5"
    //       data-visit="${input.name}" name="file_${input.name}">
    //       <i class="ki-duotone ki-arrows-circle fs-2">
    //       <span class="path1"></span><span class="path2"></span>
    //       </i> Files
    //       </button>
    //       <div id="downloadLink${input.name}"></div>
    //       </div>
    //       </div>
    //       <div class="error-message" id="${input.name}-error"></div>
    //       `;
    // }
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
    //  else if (input.type == 'password') {
    //     inputField = `
    //       <div class="position-relative">
    //       <input type="${input.type}" class="input-field form-control pr-5"
    //       placeholder="${input.placeholder}" name="${input.name}"
    //       value="${valueFromDB}" id="${input.name}" ${isDisabled}
    //       style="padding-right: 40px;" />
    //       <i id="${input.name}-icon"
    //       class="bi bi-eye position-absolute"
    //       style="top: 50%; right: 10px; transform: translateY(-50%); cursor: pointer;"
    //       onclick="togglePasswordVisibility('${input.name}')"></i>
    //       </div>
    //       <div class="error-message" id="${input.name}-error"></div>
    //       `;
    // } else if (input.type === 'map') {
    //     const latName = `${input.name}-latitude`;
    //     const lonName = `${input.name}-longitude`;

    //     valueFromDB = data_form_db[lonName] || '';

    //     inputField = `
    //       <div class="d-flex align-items-center gap-2">
    //       <input type="text" class="form-control" id="${latName}" placeholder="Latitude" name="${latName}" value="${data_form_db[latName] || ''}"/>
    //       <input type="text" class="form-control" id="${lonName}" placeholder="Longitude" name="${lonName}" value="${data_form_db[lonName] || ''}"/>
    //       <button type="button" class="btn btn-info btn-lg d-flex align-items-center justify-content-center"
    //       style="height: 43px;" onclick="openMapModal('${latName}', '${lonName}')">
    //       <i class="fas fa-map-marker-alt"></i>
    //       </button>
    //       </div>
    //       <div class="error-message" id="${input.name}-error"></div>
    //       `;
    // } else if (input.type === 'button') {
    //     inputField = `
    //       <button type="button" class="btn btn-${input.validation.btnColor} w-100" id='${input.name}' name='${input.name}' ${isDisabled}>${input.label}</button>
    //       <div class="error-message" id="${input.name}-error"></div>
    //       `;
    // } 
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

        // if (selectElement.length && input.type === 'select') {
        //     const isMultiSelect = input.name.startsWith('multi-select');
        //     selectElement.select2({
        //         placeholder: isMultiSelect ? 'Select options...' : 'Select an option...',
        //         allowClear: true,
        //         multiple: isMultiSelect,
        //         minimumResultsForSearch: Infinity
        //     });

        //     $(`select[name='${input.name}']`).select2({
        //         width: '100%',
        //         dropdownParent: $('#kt_modal_add_customer_form')
        //     });

        //     if (isMultiSelect && data_form_db[input.name]) {
        //         const selectedValues = Array.isArray(data_form_db[input.name]) ?
        //             data_form_db[input.name] :
        //             data_form_db[input.name].split(',');
        //         selectElement.val(selectedValues).trigger('change');
        //     } else if (!isMultiSelect && data_form_db[input.name]) {
        //         selectElement.val(data_form_db[input.name]).trigger('change');
        //         // targetAutoFillOption(input, data_form_db[input.name], editedFieldRules)

        //     }
        // }

        // if (input.type === 'select') {
        //     const element = $(`#${input.name}`);
        //     if (element.length) {
        //         let data = all_data_db[input.name] || '';
        //         document.getElementsByName(input.name)[0].setAttribute("data-previous-status", data);
        //         element.on('change', function(event) {
        //             const name = element.attr('name');
        //             const value = element.val();

        //             console.log('view_changeed_value :', value);

        //             if (value) {
        //                 check_option_validation(name, value);
        //             }
        //             all_data_db[name] = value;

        //             if (input.work_flow_validation) {
        //                 if (createdFieldRules.length > 0 && createdFieldRules[0].actionsList && isAutoFillSelect) {
        //                     applyFieldRulesOnchange(createdFieldRules);
        //                 }
        //             }

        //             if (isAutoFillSelect) {
        //                 auto_fill(name);
        //             }

        //             // if (input.validation && extractTargetValues.length > 0 && isAutoFillSelect) {

        //             // }

        //             targetAutoFillOption(input, value, editedFieldRules)
        //             isAutoFillSelect = true;
        //             validateInput(input, element[0]);
        //         });
        //     }
        // }

        // if (input.type === 'button') {
        //     element.addEventListener('click', function() {
        //         handleButtonClick(input);
        //     });
        // }

        // if (input.name.split("-")[0] === 'signature') {
        //     initializeSignaturePad(input);
        // }

        // if (element && input.type === 'email') {
        //     element.addEventListener('input', function() {
        //         const name = element.name;
        //         const value = element.value;
        //         all_data_db[name] = value;
        //         validateInput(input, element);

        //         if (input.work_flow_validation) {
        //             if (createdFieldRules.length > 0 && createdFieldRules[0].actionsList) {
        //                 applyFieldRulesOnchange(createdFieldRules);
        //             }
        //         }
        //     });
        // }

        if (element && input.type !== 'checkbox' && input.type !== 'email') {
            element.addEventListener('input', function() {
                const name = element.name;
                const value = element.value;
                all_data_db[name] = value;
            
                // validateInput(input, element);
            });
        }

        // const element_textarea = document.getElementById(input.name);
        // if (input.type === 'textarea') {
        //     element_textarea.addEventListener('textarea', function() {
        //         const name = element.name;
        //         const value = element.value;
        //         all_data_db[name] = value;

        //         if (input.work_flow_validation) {
        //             if (editedFieldRules.length > 0 && editedFieldRules[0].actionsList) {
        //                 applyFieldRulesOnchange(editedFieldRules);
        //             }
        //         }
        //         validateInput(input, element_textarea);
        //     });
        // }

        // if (input.type === 'checkbox') {
        //     if (input.options && input.options.length) {
        //         input.options.forEach(option => {
        //             const checkboxName = Object.keys(option)[0];
        //             const checkboxElement = document.getElementById(checkboxName);

        //             if (checkboxElement) {
        //                 checkboxElement.addEventListener('input', function() {
        //                     const name = element.name;
        //                     const value = element.value;
        //                     all_data_db[name] = value;

        //                     if (input.work_flow_validation) {
        //                         if (editedFieldRules.length > 0 && editedFieldRules[0].actionsList) {
        //                             applyFieldRulesOnchange(editedFieldRules);
        //                         }
        //                     }
        //                     validateInput(input, checkboxElement);
        //                 });
        //             }
        //         });
        //     }
        // }

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

        // if (allow_unique_input.includes(input.type)) {
        //     element.addEventListener('input', function() {
        //         const name = element.name;
        //         const value = element.value;
        //     });
        // }

        // if (allow_unique_input.includes(input.type) && input.validation && input.validation.unique) {
        //     element.addEventListener('blur', function() {
        //         const name = element.name;
        //         const value = element.value.trim();

        //         if (value) {
        //             function checkIdAndValue(id, value) {
        //                 return extract_lookup_key_value.some((obj) => obj[id] === value);
        //             }

        //             const isDuplicate = checkIdAndValue(name, value);

        //             if (isDuplicate) {
        //                 element.value = '';
        //                 Swal.fire({
        //                     icon: 'warning',
        //                     title: 'Warning',
        //                     text: 'Duplicate Data Found',
        //                 });
        //             }
        //         }
        //     });
        // }
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

hideLoadingSpinner();
disableAllInputs();
// populateTargetOption()
}

function disableAllInputs() {
  // Get all input, textarea, and button elements inside the #dynamic-form div
  const elements = document.querySelectorAll('#dynamic-form input, #dynamic-form textarea, #dynamic-form button');

  // Loop through each element and disable it
  elements.forEach(element => {
    element.disabled = true;
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
 const actionsCell = document.createElement('td');
 actionsCell.classList.add('d-flex', 'align-items-center');
 actionsCell.innerHTML = `
 <button type="button" class="btn btn-warning btn-sm me-2 d-flex align-items-center justify-content-center"
 onclick="editRow(this, '${tableId}', ${JSON.stringify(fields).replace(/"/g, '&quot;')})">
 <i class="fas fa-edit ps-1"></i>
 </button>
 <button type="button" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
 onclick="removeRow(this, '${tableId}')">
 <i class="fas fa-trash-alt ps-1"></i>
 </button>
 `;
 row.appendChild(actionsCell);

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
 showLoadingSpinner()

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
 hideLoadingSpinner()
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
 hideLoadingSpinner()
 }
 })
 .catch(error => {
 console.error('Error loading form:', error);
 hideLoadingSpinner()
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

async function getAllDynamicFormData(formHeadings) {
 showLoadingSpinner()
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

 try {
 const response = await fetch(crudURL, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'x-api-key': 'p2FIIEi4cA2unoJhRIA137vRdGEuJCCi5hV6Vc11'
 },
 body: JSON.stringify(requestBody)
 });

 const data = await response.json();

 if (data && data.body && data.body[0] && data.body[0].metadata) {
 return data.body[0].metadata; // Return only metadata
 }
 else {
 hideLoadingSpinner()
 console.error(`Failed to get data for ${formHeading}`);
 return null;
 }
 }
 catch (error) {
 hideLoadingSpinner()
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
 hideLoadingSpinner();
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

  hideLoadingSpinner()

}
var table_list_lookup_configuration = [];
var all_configuration_table_data = [];
var all_lookup_configuration_validate = []
//var form_label_id_obj = [];

async function get_lookup_configuration(page_no, form_name, form_label_id, current_form_id) {
  if (page_no === 1) showLoadingSpinner()

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
          hideLoadingSpinner();
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
      hideLoadingSpinner()
      console.error('Error:', error);
      // Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load Items. Please try again.' });
  }
}

