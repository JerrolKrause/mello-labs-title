import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UIStoreService, FormTypes } from '@ui';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-row',
  templateUrl: './form-row.component.html',
  styleUrls: ['./form-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormRowComponent implements OnInit {

  @Input() label: string;
  @Input() field: string;
  @Input() fieldType: 'input' | 'textarea' | 'radio';
  @Input() fieldModel: any[];
  @Input() docTab:number = 1;
  @Input() ocrValue: string | string[];
  @Input() form: FormGroup;

  public hasFuzzyMatch = false;
  public docID: string;
  public editing = false;

  public valuePrev: string;
  
  constructor(
    public ui: UIStoreService
  ) { }

  ngOnInit() {
    
    this.docID = _.shuffle(['ccsw9c8a9c8s', 'b23b423b4', 'm85mfhvgf', 'dcv125bb5', 'ddfds4674asd'])[0];

    // Hold initial value
    this.valuePrev = this.form.value[this.field];
    // Check if fuzzy match
    if (Array.isArray(this.ocrValue)){
      this.hasFuzzyMatch = true;
    }
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    console.log('updateForm', field, propNew);
    this.editing = false;
    let valNew = {};
    valNew[field] = propNew;
    this.form.patchValue(valNew);
  }

}
