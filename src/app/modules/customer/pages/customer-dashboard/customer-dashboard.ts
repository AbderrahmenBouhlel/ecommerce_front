import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandNavbar } from '../../../../core/shared/ui/navbar/brand-navbar/brand-navbar';
import { CustomerSidebarComponent } from '../../components/customer-sidebar/customer-sidebar';
import { ActivatedRoute } from '@angular/router';
import { LightCategoryDTO } from '../../../admin/stores/CategoryManagementStore/apis/models/getCategoriesLight.api';



export type CategoryGender = 'MALE' | 'FEMALE';

export type CategoriesByGender = {
  MALE: LightCategoryDTO[];
  FEMALE: LightCategoryDTO[];
};


@Component({
  selector: 'app-customer-dashboard',
  imports: [BrandNavbar, CustomerSidebarComponent],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDashboard {
  categoriesByGender: CategoriesByGender;

  constructor(private route: ActivatedRoute) {
    const categories: LightCategoryDTO[] = this.route.snapshot.data['categories'];

    this.categoriesByGender = {
      MALE: categories.filter(c => c.gender === 'MALE'),
      FEMALE: categories.filter(c => c.gender === 'FEMALE')
    };

    console.log(this.categoriesByGender);
  }

}
