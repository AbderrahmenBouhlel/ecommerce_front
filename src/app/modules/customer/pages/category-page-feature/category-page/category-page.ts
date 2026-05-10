import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryCatalogStore } from '../../../stores/CategoryCatalogManagment/categoryCatalog.store';
import { CategoryCatalogFilterValue, CategoryCatalogProduct } from '../../../stores/CategoryCatalogManagment/models/categoryCatalog.model';

@Component({
  selector: 'app-category-page',
  imports: [CommonModule],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage implements OnInit {
  protected readonly MEDIA_BASE_URL = 'http://localhost:8000';
  
  private readonly categoryCatalogStore = inject(CategoryCatalogStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly vm = this.categoryCatalogStore.vm$;

  protected readonly selectedFilterSlug = signal<string | null>(null);

  protected readonly filters = computed(() => {
    const currentVm = this.vm();

    if (currentVm.status !== 'success') {
      return [];
    }

    return currentVm.data.filterValues;
  });

  protected readonly products = computed(() => {
    const currentVm = this.vm();

    if (currentVm.status !== 'success') {
      return [];
    }

    return currentVm.data.products;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (!slug) return;

      this.categoryCatalogStore
        .loadCategoryCatalog(slug)
        .subscribe();
    });
  }

  protected selectFilter(slug: string) {
    if (this.selectedFilterSlug() === slug) {
      this.selectedFilterSlug.set(null);
      return;
    }

    this.selectedFilterSlug.set(slug);
  }

  protected trackByProduct(
    _: number,
    product: CategoryCatalogProduct,
  ) {
    return product.id;
  }

  protected trackByFilter(
    _: number,
    filter: CategoryCatalogFilterValue,
  ) {
    return filter.id;
  }
}