import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { UIStoreService, FormTypes } from '@ui';

declare var require: any


@Component({
  selector: 'app-form-title',
  templateUrl: './form-title.component.html',
  styleUrls: ['./form-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormTitleComponent implements OnInit, OnChanges {

  @Input() ocr:any;
  @Input() formData: any;
  public formTitle: FormGroup;
  public editGlobal: any;
  
  public formView = require('./form-title.view.json');
  public formModel = require('./form-title.model.json');

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService
  ) {
    this.formTitle = this.createFormModel(this.formModel);
  }

  ngOnInit() {
    console.log(this.ocr);
    this.formTitle.valueChanges.subscribe(form => {
      this.ui.formChange(FormTypes.borrower, form, true);
    });
  }

  ngOnChanges() {
    if (this.formData) {
      this.formTitle.patchValue(this.formData);
    }
  }

  /**
   * Automatically generate a form group model complete with controls. Will recurse through nested objects/arrays.
   * @param model - An object of the model. Can contain nested objects and arrays
   * @param defaultRequired - Should all fields be required. Default is false
   */
  private createFormModel(model: any, defaultRequired = false) {
    let formModel:any = {};
    // Loop through all props in the model
    Object.keys(model).forEach(key => {
      // If this is a nested object, recurse to create form group
      if (model[key] && typeof model[key] === 'object' && !Array.isArray(model[key])) {
        formModel[key] = this.createFormModel(model[key]);
      }
      // If this is an array, recurse to create a form array
      else if (model[key] && typeof model[key] === 'object' && Array.isArray(model[key])) {
        let formArray:any = [];
        model[key].forEach((item:any) => formArray.push(this.createFormModel(item)));
        formModel[key] = this.fb.array(formArray);
      }
      // Standard value
      else {
        formModel[key] = defaultRequired ? [null, [Validators.required]] : [null, []];
      }
    });

    return this.fb.group(formModel);
  }

}
