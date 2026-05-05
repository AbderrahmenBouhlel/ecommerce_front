import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Category } from '../../../../stores/CategoryManagementStore/models/Category.model';

@Component({
  selector: 'app-category-card-component',
  imports: [CommonModule],
  templateUrl: './category-card-component.html',
  styleUrl: './category-card-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly MAX_ALLOWED_FILTERS_TO_SHOW = 5;

  readonly description = computed(() => this.category().description?.trim() || 'No description');


  readonly visibleAllowedFilters = computed(() =>
    this.category().allowedFilters.slice(0, this.MAX_ALLOWED_FILTERS_TO_SHOW),
  );


  
  readonly hiddenAllowedFiltersCount = computed(() =>
    Math.max(0, this.category().allowedFilters.length - this.MAX_ALLOWED_FILTERS_TO_SHOW),
  );
}
