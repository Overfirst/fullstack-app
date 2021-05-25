import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  oSub: Subscription;

  isRoot = true;
  pending = false;

  constructor(
    private router: Router,
    public orderService: OrderService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    })
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.oSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open(): void {
    this.modal.open();
  }

  cancel(): void {
    this.modal.close();
  }

  submit(): void {
    this.pending = true;

    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe((newOrder: Order) => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен!`)
        this.orderService.clear();
      }, error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.pending = false;
        this.modal.close();
        this.cdr.detectChanges();
    });
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.remove(orderPosition);
  }
}
