import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'

declare var require: any


@Component({
  selector: 'app-form-title',
  templateUrl: './form-title.component.html',
  styleUrls: ['./form-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormTitleComponent implements OnInit, OnChanges {

  @Input() ocr;
  @Input() formData;
  public formTitle: FormGroup;
  public editGlobal;
  
  public formView = require('./form-title.view.json');
  public formModel = require('./form-title.model.json');

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService
  ) {
    this.formTitle = this.createFormModel(this.formModel);
  }

  ngOnInit() {
    this.formTitle.valueChanges.subscribe(form => {
      this.ui.formChange(FormTypes.borrower, form, true);
    });
  }

  ngOnChanges(model) {
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
    let formModel = {};
    // Loop through all props in the model
    Object.keys(model).forEach(key => {
      // If this is a nested object, recurse to create form group
      if (model[key] && typeof model[key] === 'object' && !Array.isArray(model[key])) {
        formModel[key] = this.createFormModel(model[key]);
      }
      // If this is an array, recurse to create a form array
      else if (model[key] && typeof model[key] === 'object' && Array.isArray(model[key])) {
        let formArray = [];
        model[key].forEach(item => formArray.push(this.createFormModel(item)));
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
