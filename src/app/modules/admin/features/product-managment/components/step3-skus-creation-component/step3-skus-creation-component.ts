import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { ProductCreationService} from '../../services/ProductCreationService';
import { VariantDraft , VariantSku  ,Result} from '../../services/ProductCreationService.types';
import { NotificationService } from '../../../../../../core/shared/service/NotificaitonService';
import { ProductsStore } from '../../../../stores/ProductManagmentStore/products.store';
import { map, of , catchError, forkJoin , Observable} from 'rxjs';

type VariantSkusSubmissionResult = {
  success: boolean;
  variantId: number;
  createdSkus?: VariantSku[];
  error?: unknown;
};

@Component({
  selector: 'app-step3-skus-creation-component',
  imports: [],
  templateUrl: './step3-skus-creation-component.html',
  styleUrl: './step3-skus-creation-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step3SkusCreationComponent {
  private productStore = inject(ProductsStore); 
  private productCreationService = inject(ProductCreationService);
  private notificationService = inject(NotificationService);

  readonly variants: Signal<VariantDraft[]> = computed(() => {
    return this.productCreationService.variantsState$().items
  });

  readonly selectedVariantId = signal<number>(this.variants()[0]?.id ?? 0);

  readonly selectedVariant = computed(() => {
    console.log(this.variants())
    return this.variants().find(v => v.id === this.selectedVariantId()) || null;
  });



  isLoading = signal(false);


  selectVariant(variantId: number): void {
    this.selectedVariantId.set(variantId);
  }

  addNewSkuRow(): void {
    const selectedVariant = this.selectedVariant();
    if (!selectedVariant) {
      return;
    }

    const newSku :VariantSku = {
      id: Date.now(), // Unique ID for the SKU
      size: '',
      stock: 0,
    }

    const updatedSkus = [...selectedVariant.skus, newSku];
    this.productCreationService.setVariantSkus(selectedVariant.id, updatedSkus);
  }


  updateSkuValue(skuId: number, field: 'size' | 'stock', event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value ?? '';
    const selectedVariant = this.selectedVariant();

    if (!selectedVariant) {
      return;
    }
    if (field === 'size') {
      const res: Result<void> = this.productCreationService.updateSkuSize(selectedVariant.id, skuId, value);
      if (!res.success) {
        this.notificationService.showError(res.error ?? 'A SKU with this size already exists.');
        target.value = ""; // reset to empty or previous valid value
      }
    } else {
      const stock = parseInt(value, 10) || 0;
      this.productCreationService.updateSkuStock(selectedVariant.id, skuId, stock);
    }
  }

  deleteRow(skuId: number): void {
    const selectedVariant = this.selectedVariant();

    if (!selectedVariant) {
      return;
    }
    this.productCreationService.removeSkuFromVariant(selectedVariant.id, skuId);
  }





  next(): void {
    if (this.isLoading()) {
      return;
    }

    const requests: Observable<VariantSkusSubmissionResult>[] = [];
    for (const variant of this.variants()) {
      const skus = variant.skus.map(sku => ({
        size: sku.size,
        stock: sku.stock
      }));

      if (skus.length === 0) continue;

      requests.push(
        this.productStore.createProductVariantSkus(variant.id, skus).pipe(
          map(createdSkus => ({
            success: true,
            variantId: variant.id,
            createdSkus
          })),
          catchError(error =>{
              console.error(`Failed to create SKUs for variant ${variant.id}:`, error);
              return of({
                success: false,
                variantId: variant.id,
                error
              })
            }
          )
        )
      );
    }

    forkJoin(requests).subscribe({
      next: (results: VariantSkusSubmissionResult[]) =>{
        const successful = results.filter(r => r.success && r.createdSkus);
        const failed = results.filter(r => !r.success);
        
        if (successful.length > 0) {
          this.notificationService.showSuccess(`${successful.length} / ${this.variants().length} variant(s) SKUs created successfully.`);
          this.productCreationService.goNextStep();
          return;
        }

        this.notificationService.showError('Failed to create SKUs for all variants. Please try again.');
      },
    });
  }

  previous(): void {
    if (this.isLoading()) {
      return;
    }

    this.productCreationService.goPreviousStep();
  }



}
