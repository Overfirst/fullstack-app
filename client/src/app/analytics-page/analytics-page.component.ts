import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  ViewChild
} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart, registerables} from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;

  average: number = 0;
  pending = true;

  constructor(
    private service: AnalyticsService,
    private cdr: ChangeDetectorRef
    ) {}

  ngAfterViewInit(): void {
    Chart.register(...registerables);

    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)',
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)',
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.pending = false;
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      const gainContext = this.gainRef.nativeElement.getContext('2d');
      gainContext.canvas.height = '300px';

      const orderContext = this.orderRef.nativeElement.getContext('2d');
      orderContext.canvas.height = '300px';

      new Chart(gainContext, createChartConfig(gainConfig));
      new Chart(orderContext, createChartConfig(orderConfig));

      this.cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.aSub?.unsubscribe();
  }
}

function createChartConfig(config: any): any {
  return {
    type: 'line',
    options: { responsive: true },
    data: {
      labels: config.labels,
      datasets: [
        {
          label: config.label,
          data: config.data,
          borderColor: config.color,
          steppedLine: false,
          fill: false,
        },
      ],
    }
  };
}
