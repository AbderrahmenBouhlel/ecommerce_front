import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandNavbarComponent } from '../../../../core/shared/ui/navbar/brand-navbar/brand-navbar';

@Component({
  selector: 'app-customer-dashboard',
  imports: [BrandNavbarComponent],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDashboard {

}
