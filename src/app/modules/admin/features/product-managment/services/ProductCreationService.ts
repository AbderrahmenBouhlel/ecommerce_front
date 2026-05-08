import { Injectable, signal, WritableSignal } from "@angular/core";
import { Product, ProductVariant } from "../../../stores/ProductManagmentStore/models/product.model";
import { Router } from "@angular/router";
import { VariantCreationState,BasicProductInfo, VariantDraft, VariantDraftImage, VariantSku ,Result } from "./ProductCreationService.types";

@Injectable() 
export class ProductCreationService {

  private currentStep = signal(4);
  public currentStep$ = this.currentStep.asReadonly();



  constructor(private router: Router) {}


  private basicInfo : BasicProductInfo = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    categoryId: null,
    submitted: false
  };

  private variantsState :WritableSignal<VariantCreationState> = signal({
    items: [],
    step_2_submitted: false,
    step_3_submitted: false
  });



  public variantsState$ = this.variantsState.asReadonly();


  


  // step navigation methods
  private goToStep(stepNumber: number) {
    this.currentStep.set(stepNumber);
    this.router.navigate([`/admin/products/new/step-${stepNumber}`]);
  }

  public goNextStep() {
    console.log(`Going to next step from step ${this.currentStep()} to step ${Math.min(this.currentStep() + 1, 4)}`);
    this.goToStep(Math.min(this.currentStep() + 1, 4));
  }

  public goPreviousStep() {
    this.goToStep(Math.max(this.currentStep() - 1, 1));
  }







  // basic info methods
  setBasicInfo(info: BasicProductInfo) {
    this.basicInfo = info;
  }
  getBasicInfo(): BasicProductInfo | undefined {
    return this.basicInfo;
  }

  onSuccessfulBasicInfoSubmission(product: Product) {
    this.basicInfo = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      submitted: true
    };
  }

  getMockBaisicInfo(): BasicProductInfo {
    return {
      id: 1,
      name: "Mock Product",
      description: "This is a mock product used for testing purposes.",
      price: 99.99,
      categoryId: 1,
      submitted: true
    };
  }



  // varaints methods
  addVariant(variant: VariantDraft): void {
    const newVariant: VariantDraft = {
      ...variant,
      id: Date.now(), // Unique ID for the variant draft
      skus: [] // Initialize with empty SKUs
    };
    this.variantsState.update(state => ({
      ...state,
      items: [...state.items, newVariant]
    }));
  }

  deleteVariant(variantId: number): void {
    const variantToDelete = this.getVariantById(variantId);
    if (!variantToDelete) {
      return;
    }
    for (const img of variantToDelete.images) {
      URL.revokeObjectURL(img.url);
    }

    this.variantsState.update(state => ({
      ...state,
      items: state.items.filter(v => v.id !== variantId)
    }));
  }
  updateVariant(variantId: number, patch: Partial<VariantDraft>): void {
    this.variantsState.update(state => ({
      ...state,
      items: state.items.map(v => v.id === variantId ? { ...v, ...patch } : v)
    }));
  }

  setVariants(variants: VariantDraft[]) {
    this.variantsState.set({
      ...this.variantsState(),
      items: variants
    });
  }
  
  getVariantsItems(): VariantDraft[] {
    return this.variantsState().items;
  }

  onSuccessfulVariantSubmission(variants: ProductVariant[]) {
    const updatedDrafts: VariantDraft[] = variants.map((variant) => {
      console.log(variant)
      const updatedImages: VariantDraftImage[] = variant.images.map((img) => ({
        id: img.id,
        url: img.image_url,
        image: null
      }));
      
      return {
        id: variant.id,
        color_name: variant.color_name,
        color_code: variant.color_code,
        images: updatedImages,
        skus: []// Skus will be handled in the next step
      };
    });

    this.variantsState.set({
      items: updatedDrafts,
      step_2_submitted: true,
      step_3_submitted: false
    });
  }


  getVariantById(variantId: number): VariantDraft | undefined {
    return this.variantsState().items.find(v => v.id === variantId);
  }




  // sku handling methods

  setVariantSkus(variantId: number, skus: VariantSku[]): void {
    this.variantsState.set({
      ...this.variantsState(),
      items: this.variantsState().items.map((variant) =>
        variant.id === variantId ? { ...variant, skus } : variant,
      ),
    });
  }

  getVariantSkus(variantId: number): VariantSku[] {
    const v = this.getVariantById(variantId);
    return v ? v.skus ?? [] : [];
  }

  addSkuToVariant(variantId: number, sku: VariantSku): void {
    const current = this.getVariantSkus(variantId);
    this.setVariantSkus(variantId, [...current, sku]);
  }


  updateSkuSize(variantId: number, skuId: number, size: string): Result<void> {
    const normalized = size.trim().toLowerCase();
    if (!normalized) {
      this.updateSkuInVariantSilent(variantId, skuId, { size: '' });
      return { success: true };
    }


    // in case of  duplicate sizes , inform the user
    const skus = this.getVariantSkus(variantId);
    const duplicate = skus.some(s => s.id !== skuId && s.size.trim().toLowerCase() === normalized);

    if (duplicate) {
      return { success: false, error: 'A SKU with the same size already exists for this variant.' };
    }

    this.updateSkuInVariantSilent(variantId, skuId, { size });
    return { success: true };
  }


  updateSkuStock(variantId: number, skuId: number, stock: number): void {
    this.updateSkuInVariantSilent(variantId, skuId, { stock });
  }

  removeSkuFromVariant(variantId: number, skuId: number): void {
    const filtered = this.getVariantSkus(variantId).filter(s => s.id !== skuId);
    this.setVariantSkus(variantId, filtered);
  }

  // internal helper to update SKU without validation and without returning Result
  private updateSkuInVariantSilent(variantId: number, skuId: number, patch: Partial<VariantSku>): void {
    const updated = this.getVariantSkus(variantId).map(s => s.id === skuId ? { ...s, ...patch } : s);
    this.setVariantSkus(variantId, updated);
  }

}