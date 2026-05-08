import { Injectable, signal, WritableSignal } from "@angular/core";
import { Product, ProductVariant } from "../../../stores/ProductManagmentStore/models/product.model";
import { Router } from "@angular/router";



export interface VariantDraftImage {
  id: number;
  url: string;
  image: File | null;
}

export type VariantDraft = {
  id:  number;
  color_name: string;
  color_code: string;
  images: VariantDraftImage[];
}

export type BasicProductInfo = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  submitted: boolean; // To track if the basic info has been submitted successfully
}

export type VariantCreationState = {
  items : VariantDraft[];
  submitted: boolean;
}

@Injectable() 
export class ProductCreationService {

  private currentStep = signal(1);
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

  private variantsState : VariantCreationState = {
    items: [],
    submitted: false
  };


  


  // step navigation methods
  private goToStep(stepNumber: number) {
    this.currentStep.set(stepNumber);
    this.router.navigate([`/admin/products/new/step-${stepNumber}`]);
  }

  public goNextStep() {
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
    this.goNextStep();
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
  setVariants(variants: VariantDraft[]) {
    this.variantsState = {
      items: variants,
      submitted: false
    };
  }
  getVariantsItems(): VariantDraft[] {
    return this.variantsState.items;
  }
  onSuccessfulVariantSubmission(variants: ProductVariant[]) {
    const updatedDrafts = variants.map((variant) => {
      const updatedImages: VariantDraftImage[] = variant.images.map((img) => ({
        id: Number(img.id), // Coerce to number since VariantDraftImage.id is number
        url: img.image_url,
        image: null // No file after submission
      }));
      
      return {
        id: Number(variant.id), // Coerce to number
        color_name: variant.color_name,
        color_code: variant.color_code,
        images: updatedImages
      };
    });

    this.setVariants(updatedDrafts);
  }


  getMockVariantsDraft(): VariantDraft[]{
    
  }
}