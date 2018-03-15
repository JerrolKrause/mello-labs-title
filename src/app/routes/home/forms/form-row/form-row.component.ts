import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UIStoreService, FormTypes } from '@ui';

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
  @Input() docTab = 1;
  @Input() ocrValue: string | string[];
  @Input() form: FormGroup;

  public hasFuzzyMatch = false;

  public editing = false;
  
  constructor(
    public ui: UIStoreService
  ) { }

  ngOnInit() {
    if (Array.isArray(this.ocrValue)){
      this.hasFuzzyMatch = true;
    }
    console.log(this)
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    console.log(field,propNew)
    this.editing = false;
    let valNew = {};
    valNew[field] = propNew;
    this.form.patchValue(valNew);
  }

}
