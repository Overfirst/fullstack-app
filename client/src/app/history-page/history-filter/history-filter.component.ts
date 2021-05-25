import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialDatePicker, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @Output() onFilter = new EventEmitter;

  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;

  isValid = true;
  order: number;

  start: MaterialDatePicker;
  end: MaterialDatePicker;

  constructor() {}

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  ngAfterViewInit(): void {
   this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
   this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  submitFilter(): void {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }
}
