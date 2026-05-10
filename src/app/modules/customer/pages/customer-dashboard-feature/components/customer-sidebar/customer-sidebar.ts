import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesByGender, CategoryGender } from '../../customer-dashboard/customer-dashboard';
import { LightCategoryDTO } from '../../../../../admin/stores/CategoryManagementStore/apis/models/getCategoriesLight.api';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-customer-sidebar',
  imports: [CommonModule],
  templateUrl: './customer-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSidebarComponent {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  readonly categoriesByGender =input.required<CategoriesByGender>();

  readonly genders = ['MALE', 'FEMALE'] as const;

 
  readonly selectedGender = signal<CategoryGender>('MALE');

  readonly filteredCategories :Signal<LightCategoryDTO[]> = computed(() => {
    const gender = this.selectedGender();
    return this.categoriesByGender()[gender] || [];
  });

  readonly selectedCategorySlug = toSignal(
    this.route.children[0]?.paramMap.pipe(
      map(params => params.get('slug'))
    ) ?? of(null),
    { initialValue: null }
  );

  constructor(){
    effect(() => {
      const slug = this.selectedCategorySlug();
      console.log('Selected category slug in sidebar:', slug);
    })
  }



  selectGender(g: CategoryGender) {
    this.selectedGender.set(g);
  }


  onSelectCategory(categorySlug: string) {
    this.router.navigate(['category', categorySlug], {relativeTo: this.route});
  }
}
