import { Injectable } from "@angular/core";





export interface VariantDraft {
  color_name: string;
  color_code: string;
}

export type BasicProductInfo = {
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
}

export interface ProductDraft {
  basicInfo?: BasicProductInfo;
  variants?: VariantDraft[];
}


@Injectable() 
export class ProductCreationService {
  private productDraft: ProductDraft = {};
  private stepValidators: Record<number, () => boolean> = {};


  setBasicInfo(info: BasicProductInfo) {
    this.productDraft.basicInfo = info;
  }

  getBasicInfo(): BasicProductInfo | undefined {
    return this.productDraft.basicInfo;
  }


  setVariants(variants: VariantDraft[]) {
    this.productDraft.variants = variants;
  }


  addVariant(variant: VariantDraft) {
    if (!this.productDraft.variants) {
      this.productDraft.variants = [];
    }
    this.productDraft.variants.push(variant);
  }


  getProductDraft(): ProductDraft {
    return this.productDraft;
  }





  registerStepValidator(step: number, fn: () => boolean) {
    this.stepValidators[step] = fn;
  }


  validateStep(step: number): boolean {
    return this.stepValidators[step]?.() ?? true;
  }

}