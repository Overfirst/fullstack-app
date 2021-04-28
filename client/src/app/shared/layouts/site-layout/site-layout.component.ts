import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MaterialService } from "../../classes/material.service";


@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef;

  links = [
    { url: '/overview', name: 'Обзор' },
    { url: '/analytics', name: 'Аналитика' },
    { url: '/history', name: 'История' },
    { url: '/order', name: 'Добавление заказа' },
    { url: '/categories', name: 'Ассортимент' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    MaterialService.initFloatingButton(this.floatingRef);
  }

  logout(event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
