import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { UIStoreService } from '@ui';
import * as _ from 'lodash';

export interface ViewModel {
  label: string;
  field: string;
  fieldType: 'input' | 'textarea' | 'radio' | 'date';
  fieldModel: string[];
  radioFreeform: boolean;
  required: boolean;
}

export interface OcrModel {
  Id: string;
  docId: string;
  pageNumber: number;
  field: string;
  label: string;
  value: string;
  bounds: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

@Component({
  selector: 'app-form-row',
  templateUrl: './form-row.component.html',
  styleUrls: ['./form-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRowComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() viewModel: ViewModel | null;
  @Input() ocrValue: string | string[];
  @Input() ocrModel: OcrModel;
  @Input() editing = false;

  public hasFuzzyMatch = false;
  public docID: string;

  public valuePrev: string;

  constructor(public ui: UIStoreService) {}

  ngOnInit() {

    const val = this.viewModel ? this.form.get(this.viewModel.field) : null;
    // If viewmodel specifies required, set required in form
    if (this.form && val && this.viewModel && this.viewModel.required && this.viewModel.field && Validators) {
      val.setValidators([Validators.required]);
    }

    this.docID = _.shuffle(['ccsw9c8a9c8s', 'b23b423b4', 'm85mfhvgf', 'dcv125bb5', 'ddfds4674asd'])[0];

    if (this.viewModel && this.form && this.viewModel.field) {
      // Hold initial value
      this.valuePrev = this.form.value[this.viewModel.field];
    }

    // Check if fuzzy match
    if (Array.isArray(this.ocrValue)) {
      this.hasFuzzyMatch = true;
    }
  }

  /**
   * Toggle Editing of this field
   * @param $event
   */
  public editToggle($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.editing = !this.editing;
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    this.editing = false;
    const valNew: any = {};
    valNew[field] = propNew;
    if (this.form) {
      this.form.patchValue(valNew);
    }
  }

  /**
   * When a date is changed, update the form model
   * @param field
   * @param date
   */
  public dateChanged(field: string, date: any) {
    this.updateForm(field, date.month + '/' + date.day + '/' + date.year);
    this.editing = true;
  }

  /**
   * Add a condition
   * @param $event
   */
  public conditionAdd() {}
}
