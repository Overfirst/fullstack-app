import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef: ElementRef;

  tapTarget: MaterialInstance;
  yesterday = new Date();


  data$: Observable<OverviewPage>

  constructor(private service: AnalyticsService) {}

  ngOnInit(): void {
    this.data$ = this.service.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo(): void {
    this.tapTarget.open();
  }
}
