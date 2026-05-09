import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BrandNavbar } from '../../../../../core/shared/ui/navbar/brand-navbar/brand-navbar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, MatIconModule, CommonModule, BrandNavbar],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage {
  readonly isSidebarOpen = signal(true);
  readonly isTaxonomyOpen = signal(true);

  readonly sideBarItems = [
    { route: '/admin/products', icon: 'inventory_2', label: 'Products' },
    { route: '/admin/orders', icon: 'receipt_long', label: 'Orders' },
    { route: '/admin/customers', icon: 'groups', label: 'Customers' }
  ]
  readonly taxonomyItems = [
    { route: '/admin/taxonomy/filters', icon: 'filter_alt', label: 'Filters' },
    { route: '/admin/taxonomy/categories', icon: 'category', label: 'Categories' }
  ]

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  toggleTaxonomy(): void {
    this.isTaxonomyOpen.update((isOpen) => !isOpen);
  }
}
