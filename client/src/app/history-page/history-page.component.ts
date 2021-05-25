import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;

  oSub: Subscription;
  tooltip: MaterialInstance;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  isFilterVisible = false;
  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  private fetch(): void {
    const params = Object.assign({}, this.filter, {
     offset: this.offset,
     limit: this.limit
    })

    this.ordersService.fetch(params).subscribe((orders: Order[]) => {
      this.orders = this.orders.concat(orders);
      this.loading = false;
      this.reloading = false;
      this.noMoreOrders = orders.length < STEP;
      this.cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  loadMore(): void {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
