import { ChangeDetectionStrategy, Component, computed, input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesByGender , CategoryGender } from '../../pages/customer-dashboard/customer-dashboard';
import { LightCategoryDTO } from '../../../admin/stores/CategoryManagementStore/apis/models/getCategoriesLight.api';


@Component({
  selector: 'app-customer-sidebar',
  imports: [CommonModule],
  templateUrl: './customer-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSidebarComponent {
  readonly genders = ['MALE', 'FEMALE'] as const;


  readonly categoriesByGender =input.required<CategoriesByGender>();

  readonly selectedGender = signal<CategoryGender>('MALE');


  readonly filteredCategories :Signal<LightCategoryDTO[]> = computed(() => {
    console.log(this.categoriesByGender())
    const gender = this.selectedGender();
    return this.categoriesByGender()[gender] || [];
  });



  selectGender(g: CategoryGender) {
    this.selectedGender.set(g);
  }


  onSelectCategory(categoryId: number) {
    // TODO: navigate or emit event to parent
    console.log('selected category', categoryId);
  }
}
