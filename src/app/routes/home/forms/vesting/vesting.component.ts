import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UIStoreService, FormTypes } from '@ui';
import { ApiService } from '@api'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-vesting',
  templateUrl: './vesting.component.html',
  styleUrls: ['./vesting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VestingComponent implements OnInit, OnDestroy {

  public formVesting: FormGroup;
  @Output() formRef: EventEmitter<FormGroup> = new EventEmitter();

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public ui: UIStoreService,
    private api: ApiService,
  ) { }

  ngOnInit() {
    
    this.formVesting = this.fb.group({
      nameFull: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      dateLastRecorded: [null, [Validators.required]],
      trust: [null, [Validators.required]],
      spousalSig: [null, [Validators.required]],
      ownerShipType: [null, [Validators.required]]
    });

    // Load the value currently in the store and then unsub
    // Initial load data is being added to store from route component
    this.ui.formVesting$.subscribe(form => {
      this.formVesting.reset();
      this.formVesting.patchValue(form);
    }).unsubscribe();

    this.subs.push(
      // Watch form changes, update value in UI store
      this.formVesting.valueChanges.subscribe(formNew => {
        this.ui.formChange(FormTypes.vesting, { ...formNew });
      })
    );

    // Pass reference to parent
    this.formRef.emit(this.formVesting);
  }

  /**
   * Change a value in the form
   * @param field
   * @param propNew
   */
  public updateForm(field: string, propNew: string) {
    let valNew = {};
    valNew[field] = propNew;
    this.formVesting.patchValue(valNew);
  }

  ngOnDestroy() {
    if (this.subs.length) { this.subs.forEach(sub => sub.unsubscribe()) }
  }

}
