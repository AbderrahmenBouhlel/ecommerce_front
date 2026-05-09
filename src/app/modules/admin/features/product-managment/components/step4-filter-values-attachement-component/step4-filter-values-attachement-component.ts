import { Component } from '@angular/core';
import {inject, computed, signal, WritableSignal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCreationService } from '../../services/ProductCreationService';
import { CategoryFilterWithMetadataDTO, CategoryFilterValueDTO } from '../../../../stores/CategoryManagementStore/apis/models/getCategoryFilters.api';
import { ProductsStore } from '../../../../stores/ProductManagmentStore/products.store';
import { NotificationService } from '../../../../../../core/shared/service/NotificaitonService';
import { ApiException } from '../../../../../../core/shared/api/api.responseTypes';
import { ProductFilterValue } from '../../../../stores/ProductManagmentStore/models/product.model';
import { CommonModule } from '@angular/common';

type SelectableFilterValue = CategoryFilterValueDTO & { selected: boolean };
type SelectableFilter = Omit<CategoryFilterWithMetadataDTO, 'filter_values'> & { values: SelectableFilterValue[] };

@Component({
  selector: 'app-step4-filter-values-attachement-component',
  imports: [CommonModule],
  templateUrl: './step4-filter-values-attachement-component.html',
  styleUrl: './step4-filter-values-attachement-component.css'
})
export class Step4FilterValuesAttachementComponent {
  private route = inject(ActivatedRoute);
  private readonly productCreationService = inject(ProductCreationService);
  private readonly productStore = inject(ProductsStore);
  private readonly notificationService = inject(NotificationService);


  // Component-friendly filter shape (adds `selected` on values)
  filters: WritableSignal<SelectableFilter[]>;

  isLoading = signal(false);

  constructor(){
    const raw: CategoryFilterWithMetadataDTO[] = this.route.snapshot.data['categoryFiltersWithMetadata'] || [];

    const mapped = raw.map((filter) => ({
      id: filter.id,
      name: filter.name,
      slug: filter.slug,
      description: filter.description ?? null,
      is_active: filter.is_active,
      values: (filter.filter_values || []).map((v: CategoryFilterValueDTO) => ({
        id: v.id,
        value: v.value,
        slug: v.slug,
        is_active: v.is_active,
        selected: false,
      })),
    }));

    this.filters = signal(mapped);
  }


  readonly selectedCount = computed(() =>
    this.filters().reduce((acc, filter) => acc + filter.values.filter(v => v.selected).length, 0),
  );

  toggleValue(filterId: number, valueId: number): void {
    this.filters.update((filters) =>
      filters.map((filter) => {
        if (filter.id !== filterId) return filter;

        return {
          ...filter,
          values: filter.values.map((value) =>
            value.id === valueId ? { ...value, selected: !value.selected } : value,
          ),
        };
      }),
    );
  }



  next(): void {
    const selectedFilterValuesIds = this.filters().flatMap(filter => 
      filter.values.filter(v => v.selected).map(v => v.id)
    );
    const productId = this.productCreationService.getBasicInfo()?.id;
    
    if (selectedFilterValuesIds.length === 0) {
      this.notificationService.showError('Please select at least one filter value to attach to the product.');
      return;
    }

    this.isLoading.set(true);
    this.productStore.createProductFilterValues(productId!, selectedFilterValuesIds).subscribe({
      next: (res: ProductFilterValue[]) => {
        console.log('Filter values attached successfully', res);
        this.notificationService.showSuccess('Selected filter values attached to product successfully.');
        this.productCreationService.finilizeCreation();

        this.isLoading.set(false);  
      },
      error: (err: ApiException) => {
        console.error('Failed to attach filter values to product', err);
        this.notificationService.showError('Failed to attach selected filter values to product. Please try again.');
        
        this.isLoading.set(false);  
      }
    })

  } 

  previous(): void {
    this.productCreationService.goPreviousStep();
  }

}
  