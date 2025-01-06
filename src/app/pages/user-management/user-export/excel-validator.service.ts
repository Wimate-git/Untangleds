// excel-validator.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

interface ValidationError {
  row: number;
  column: string;
  columnLetter: string;
  value: any;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelValidatorService {
  private getColumnLetter(index: number): string {
    let letter = '';
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  }

  private isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  private isNumber(value: any): boolean {
    return !isNaN(Number(value)) && typeof value !== 'boolean';
  }

  private isBinary(value: any): boolean {
    return ['0', '1', 0, 1].includes(value);
  }
  private columnValidations: any = {
    'UserName': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        if (/\s/.test(value)) return { isValid: false, error: 'Cannot contain Whitespaces' };
        if (/[A-Z]/.test(value)) return { isValid: false, error: 'Cannot contain uppercase letters' };
        if (value.length < 3) return { isValid: false, error: 'Must be at least 3 characters long' };
        return { isValid: true };
      }
    },
    'Password': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        if (value.length < 8) return { isValid: false, error: 'Must be at least 8 characters long' };
        if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(value)) {
          return { isValid: false, error: 'Must contain letters, numbers, and special characters' };
        }
        return { isValid: true };
      }
    },
    'Client ID': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        // if (Number(value) <= 0) return { isValid: false, error: 'Must be a positive number' };
        return { isValid: true };
      }
    },
    'Company ID': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        // if (Number(value) <= 0) return { isValid: false, error: 'Must be a positive number' };
        return { isValid: true };
      }
    },
    'Email': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return { isValid: false, error: 'Invalid email format' };
        return { isValid: true };
      }
    },
    'User ID': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'Description': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        if (value.length > 500) return { isValid: false, error: 'Must not exceed 500 characters' };
        return { isValid: true };
      }
    },
    'Mobile': {
      required: false,
      validate: (value: any) => {
        // if (!this.isNumber(value)) return { isValid: false, error: 'Must be a number' };
        // const phoneRegex = /^\d{10}$/;
        // if (!phoneRegex.test(value.toString())) return { isValid: false, error: 'Must be exactly 10 digits' };
        return { isValid: true };
      }
    },
    'Mobile Privacy': {
      required: false,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        if (this.isString(value) && ['Visible', 'Invisible'].includes(value) === false) {
          return { isValid: false, error: 'Must be Either Visible or Invisible' };
        }
        return { isValid: true };
      }
    },
    'Telegram Channel ID': {
      required: false,
      validate: (value: any) => {
        if (!value) return { isValid: true };
        if (this.isString(value)) return { isValid: false, error: 'Must be Number if provided' };
        return { isValid: true };
      }
    },
    'Permission ID': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'Location Permission': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'FormID Permission': {
      required: true,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'Start Node': {
      required: false,
      validate: (value: any) => {
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'Default Module': {
      required: false,
      validate: (value: any) => {
        if (!value) return { isValid: true };
        if (!this.isString(value)) return { isValid: false, error: 'Must be text if provided' };
        return { isValid: true };
      }
    },
    'Redirection ID': {
      required: false,
      validate: (value: any) => {
        if (!value) return { isValid: true };
        if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        return { isValid: true };
      }
    },
    'SMS': {
      required: false,
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
        if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
        // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
        return { isValid: true };
      }
    },
    'Telegram': {
      required: false,
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
        // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
        // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
        return { isValid: true };
      }
    },
    'Escalation Email': {
      required: false,
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
        if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
        // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
        return { isValid: true };
      }
    },
    'Escalation SMS': {
      required: false,
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
        if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
        // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
        return { isValid: true };
      }
    },
    'Escalation Telegram': {
      required: false,
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
        if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
        // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
        // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
        return { isValid: true };
      }
    }
    // 'Account': {
    //   required: false,
    //   validate: (value: any) => {
    //     if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
    //     if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
    //     // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
    //     // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
    //     return { isValid: true };
    //   }
    // },
    // 'Cognito Update': {
    //   required: false,
    //   validate: (value: any) => {
    //     if (value === undefined || value === null || value === '') return { isValid: true }; // Allow empty values
    //     if (typeof value != 'boolean') return { isValid: false, error: 'Must be boolean' };
    //     // if (!this.isString(value)) return { isValid: false, error: 'Must be text' };
    //     // if (['true', 'false'].includes(value.toLowerCase()) === false) return { isValid: false, error: 'Must be Either true or false' };
    //     return { isValid: true };
    //   }
    // }
  };
  

  async validateExcelFile(file: File, existingUsernames: string[],uniqueList: any[],adminLogin:any,SK_clientID:any,combinationOfUser:any): Promise<{ isValid: boolean; errors: ValidationError[],createRows:any,updateRows:any }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const errors: ValidationError[] = [];
      const createRows: any = [];
      const updateRows: any = [];


      console.log("Existing Username is here ",existingUsernames);
  
      reader.onload = (e: any) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
          // Validate header row
          const headers = data[0] as string[];
          
          // Check if all required columns are present
          Object.entries(this.columnValidations).forEach(([header, validation]: any) => {
            if (validation.required && !headers.includes(header)) {
              const expectedIndex = Object.keys(this.columnValidations).indexOf(header);
              errors.push({
                row: 1,
                column: header,
                columnLetter: this.getColumnLetter(expectedIndex),
                value: 'Missing',
                error: `Required column "${header}" is missing`
              });
            }
          });
  
          // Validate each data row
          for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {

            const row = data[rowIndex] as any[];

            console.log("Row is here ",row);

            if(row.length == 0){
              break
            }
            
            let editOperation = false;
            headers.forEach((header, colIndex) => {
              const validation = this.columnValidations[header];
              if (validation) {
                const cellValue = row[colIndex];
                const columnLetter = this.getColumnLetter(colIndex);
  
                // Check required fields
                if (validation.required && (cellValue === undefined || cellValue === null || cellValue === '')) {
                  errors.push({
                    row: rowIndex + 1,
                    column: header,
                    columnLetter,
                    value: cellValue,
                    error: `${header} is required`
                  });
                }
  
                // Check for duplicate username
                if (header === 'UserName' && validation.required && existingUsernames.includes(cellValue.toLowerCase())) {
                  editOperation = true
                  console.log("User exisst here so Update this user");

                  if(combinationOfUser && Array.isArray(combinationOfUser)){
                    const tempHolder = combinationOfUser.find((item:any)=>item.user == cellValue.toLowerCase())
                    if(SK_clientID != tempHolder.clientID){
                      errors.push({
                        row: rowIndex + 1,
                        column: header,
                        columnLetter,
                        value: cellValue,
                        error: `Username already present in ${tempHolder.clientID}`
                      });
                    }
                  }
                }


                if(header === 'Client ID' && validation.required && cellValue != SK_clientID){
                  errors.push({
                    row: rowIndex + 1,
                    column: header,
                    columnLetter,
                    value: cellValue,
                    error: `You can Either Add or Update only ${SK_clientID} client Users`
                  });
                }


                // Check for clientID
                if (header === 'Client ID' && validation.required && uniqueList[0].includes(cellValue) == false) {
                  errors.push({
                    row: rowIndex + 1,
                    column: header,
                    columnLetter,
                    value: cellValue,
                    error: `${cellValue} ${header} does not exist `
                  });
                }


                //Check for companyID
                if (header === 'Company ID' && validation.required && uniqueList[1].includes(cellValue) == false) {
                  errors.push({
                    row: rowIndex + 1,
                    column: header,
                    columnLetter,
                    value: cellValue,
                    error: `${header} does not exist `
                  });
                }


                  //Check for Email
                  if (header === 'Email' && validation.required && uniqueList[2].includes(cellValue) == true && !editOperation) {
                    errors.push({
                      row: rowIndex + 1,
                      column: header,
                      columnLetter,
                      value: cellValue,
                      error: `${cellValue} ${header} already exist`
                    });
                  }

                    //Check for companyID
                    if (header === 'User ID' && validation.required && uniqueList[3].includes(cellValue) == true && !editOperation) {
                      errors.push({
                        row: rowIndex + 1,
                        column: header,
                        columnLetter,
                        value: cellValue,
                        error: `${cellValue} ${header} already exist`
                      });
                    }


             
                    //  if (header === 'Mobile' && validation.required && uniqueList[4].includes(cellValue.toString()) == true  && !editOperation) {
                    //   errors.push({
                    //     row: rowIndex + 1,
                    //     column: header,
                    //     columnLetter,
                    //     value: cellValue,
                    //     error: `${cellValue} ${header} already exist `
                    //   });
                    // }


                     //Check for companyID
                     if (header === 'Permission ID' && validation.required && (uniqueList[5]).has(cellValue) == false) {
                      errors.push({
                        row: rowIndex + 1,
                        column: header,
                        columnLetter,
                        value: cellValue,
                        error: `${cellValue} ${header} does not exist `
                      });
                    }
               

  
                // Validate value format if present
                if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
                  const validationResult = validation.validate(cellValue);
                  if (!validationResult.isValid) {
                    errors.push({
                      row: rowIndex + 1,
                      column: header,
                      columnLetter,
                      value: cellValue,
                      error: validationResult.error
                    });
                  }
                }
              }
            });
       
          if (editOperation) {
            updateRows.push(row);
          } else {
            createRows.push(row);
          }

          console.log("Updated rows are here ",updateRows);
          console.log("Created rows are here ",createRows);


          }
  
          resolve({
            isValid: errors.length === 0,
            errors,
            createRows,
            updateRows
          });
        } catch (error: any) {
          reject(`Error processing file: ${error.message}`);
        }
      };
  
      reader.onerror = (error) => {
        reject(`Error reading file: ${error}`);
      };
  
      reader.readAsBinaryString(file);
    });
  }
  

  formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.map(error => 
      `Row ${error.row}, Column ${error.columnLetter} (${error.column}): ${error.error}${error.value ? ` (${error.value})` : ''}`
    );
  }
}