import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { ProductCreationService, VariantDraftImage, VariantDraft } from '../../services/ProductCreationService';
import { ProductsStore } from '../../../../stores/ProductManagmentStore/products.store';
import { ProductVariant } from '../../../../stores/ProductManagmentStore/models/product.model';
import { NotificationService } from '../../../../../../core/shared/service/NotificaitonService';

type VariantSubmissionResult = {
  success: boolean;
  variantDraft: VariantDraft;
  createdVariant?: ProductVariant;
  error?: unknown;
};

@Component({
  selector: 'app-step2-variants-creation-component',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './step2-variants-creation-component.html',
  styleUrl: './step2-variants-creation-component.css',
})
export class Step2VariantsCreationComponent {

  protected productCreationService = inject(ProductCreationService);
  private productsStore = inject(ProductsStore);
  private notificationService = inject(NotificationService);




  public SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png" , "image/jpg"];

  
  variants = signal<VariantDraft[]>([]);
  selectedVariant: WritableSignal<VariantDraft | null> = signal(null);

  
  variantAddForm = new FormGroup({
    color_name: new FormControl('', Validators.required),
    color_code: new FormControl('#000000', Validators.required),
  });
  
  isAddFormVisible: WritableSignal<boolean> = signal(false);


  isLoading = signal(false);

  constructor() {
    effect(()=>{
      const variants = this.variants();
      this.productCreationService.setVariants(variants);
    })
  }




  // add new variant logic
  showAddVariantForm() {
    this.isAddFormVisible.set(true);
  }
  
  hideAddVariantForm() {
    this.variantAddForm.reset({
      color_name: '',
      color_code: '#000000'
    });
    this.isAddFormVisible.set(false);
  }

  addVariant() {
    if (this.variantAddForm.invalid) {
      this.variantAddForm.markAllAsTouched();
      return;
    }

    const name = this.variantAddForm.value.color_name!.trim().toLowerCase();
    const exists = this.variants().some(
      v => v.color_name.trim().toLowerCase() === name
    );

    if (exists) {
      // show snackbar (or any feedback)
      this.notificationService.showError('A variant with this color name already exists.');
      return;
    }

    const newVariant: VariantDraft = {
      id: Date.now(), // Generate a unique ID for the new variant
      color_name: this.variantAddForm.value.color_name!,
      color_code: this.variantAddForm.value.color_code!,
      images: [] // Image handling can be implemented later
    };

    this.variants.update(variants => [...variants, newVariant]);  
    this.hideAddVariantForm();
    this.selectedVariant.set(newVariant);
  }



  // left section: select and delete variant logic
  selectVariant(variant: VariantDraft) {
    this.selectedVariant.set(variant);
  }

  deleteVariant(variant: VariantDraft) {
    const selected = this.selectedVariant();

    // clean up object URLs to prevent memory leaks
    for (let image of variant.images) {
      URL.revokeObjectURL(image.url);
    }

    this.variants.update(variants => variants.filter(v => v.id !== variant.id));
    if (selected && selected.id === variant.id) {
      this.selectedVariant.set(null);
      console.log(this.selectedVariant())
    }
  }





  
  // right section : variant images handling
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const selected = this.selectedVariant();

    if (file && selected){
      const object_url =  URL.createObjectURL(file) ;
      const newImage: VariantDraftImage = {
        id: Date.now(), 
        image: file,
        url: object_url
      };

      // update variant to include the new image
      const updatedVariant: VariantDraft = {
        ...selected,
        images: [...selected.images, newImage]
      };
      this.selectedVariant.set(updatedVariant);
      this.variants.update(variants => variants.map(v => v.id === updatedVariant.id  ? updatedVariant : v));
    }
  }

  moveImage(fromIndex: number, toIndex: number) {
    const selected = this.selectedVariant();
    if (!selected) return;
    const images = [...selected.images];
    const [movedImage] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, movedImage);

    const updatedVariant: VariantDraft = {
      ...selected,
      images: images
    };
    this.selectedVariant.set(updatedVariant);
    this.variants.update(variants => variants.map(v => v.id === updatedVariant.id  ? updatedVariant : v));
  }

  removePhoto(variant: VariantDraft, image: VariantDraftImage) {
    const updatedImages = variant.images.filter(img => img.url !== image.url);
    const updatedVariant: VariantDraft = {
      ...variant,
      images: updatedImages
    };
    this.variants.update(variants => variants.map(v => v.id === updatedVariant.id ? updatedVariant : v));

    // if the removed image belongs to the currently selected variant, update it as well
    if (this.selectedVariant()?.id === variant.id) {
      this.selectedVariant.set(updatedVariant);
    }

    // clean up object URL to prevent memory leaks
    URL.revokeObjectURL(image.url);
  }

  drop(event: CdkDragDrop<VariantDraftImage[]>) {
    this.moveImage(event.previousIndex, event.currentIndex);
  }

 

  // next / previous 
  next(): void {

    this.productCreationService.goNextStep();
    return ;

    
    // if (this.isLoading()) {
    //   return;
    // }

    // const basicInfo = this.productCreationService.getBasicInfo();
    // const variantsDraft = this.variants();

    // if (!basicInfo?.submitted || !basicInfo.id) {
    //   this.notificationService.showError('Please complete the basic product information first.');
    //   this.productCreationService.goPreviousStep();
    //   return;
    // }

    // if (!variantsDraft.length) {
    //   this.notificationService.showError('Please add at least one variant before proceeding.');
    //   return;
    // }

    // this.isLoading.set(true);

    // const requests: Observable<VariantSubmissionResult>[] = variantsDraft.map((variant) => {
    //   const files = variant.images
    //     .map((image) => image.image)
    //     .filter((file): file is File => file !== null);

    //   return this.productsStore.createProductVariant(basicInfo.id,variant.color_name,variant.color_code,files,).pipe(
    //     map((createdVariant) => ({
    //       success: true,
    //       variantDraft: variant,
    //       createdVariant,
    //     })),
    //     catchError((error: unknown) => of({
    //       success: false,
    //       variantDraft: variant,
    //       error,
    //     })),
    //   );
    // });

    // forkJoin(requests).subscribe({
    //   next: (results) => {
    //     const successfulResults = results.filter((result) => result.success && result.createdVariant);
    //     const failedResults = results.filter((result) => !result.success);

    //     if (successfulResults.length > 0) {
    //       this.productCreationService.onSuccessfulVariantSubmission(
    //         successfulResults.map((result) => result.createdVariant!),
    //       );

    //       // clean up object URLs for successfully created variants to prevent memory leaks
    //       this.revokeObjectUrls(variantsDraft);
    //       this.notificationService.showSuccess(`${successfulResults.length}/${variantsDraft.length} variants generated successfully.`);
    //       this.isLoading.set(false);
    //       this.productCreationService.goNextStep();

    //       return;
    //     }

    //     this.notificationService.showError(
    //       `Failed to create any variants. You can update the  drafts in Colors & Photos. and try submitting again.`,
    //     );
    //     this.isLoading.set(false);
    //   },
    //   error: () => {
    //     this.isLoading.set(false);
    //     this.notificationService.showError('Unexpected error occurred while creating variants.');
    //   },
    // });
  }

  previous(): void {
    if (this.isLoading()) {
      return;
    }

    this.productCreationService.goPreviousStep();
  }


  // Helper : check if a form control is invalid and touched
  isInvalidAndTouched(controlName: string): boolean {
    const control = this.variantAddForm.get(controlName);
    if (!control) return false;
    return control.invalid && (control.touched);
  }

  private revokeObjectUrls(variants: VariantDraft[]): void {
    variants.forEach((variant) => {
      variant.images.forEach((image) => URL.revokeObjectURL(image.url));
    });
  }

}
