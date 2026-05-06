import { Component, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';

export interface VariantImage {
  image: File;
  url: string;
}

export type Variant = {
  uuid:  number;
  product_id: number;
  color_name: string;
  color_code: string;
  images: VariantImage[];
}


@Component({
  selector: 'app-step2-variants-creation-component',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './step2-variants-creation-component.html',
  styleUrl: './step2-variants-creation-component.css',
})
export class Step2VariantsCreationComponent {

  public SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png" , "image/jpg"];

  
  variants = signal<Variant[]>([]);

  selectedVariant: WritableSignal<Variant | null> = signal(null);

  
  variantAddForm = new FormGroup({
    color_name: new FormControl('', Validators.required),
    color_code: new FormControl('#000000', Validators.required),
  });


  isAddFormVisible: WritableSignal<boolean> = signal(false);

  constructor() {
    // this.variantAddForm.valueChanges.subscribe(value => {
    //   console.log('Variant Form Value Changed:', value);
    // });
  }

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

    const newVariant: Variant = {
      uuid: Date.now(), // Generate a unique ID for the new variant
      product_id: 0, // This should be set to the actual product ID when integrating with backend
      color_name: this.variantAddForm.value.color_name!,
      color_code: this.variantAddForm.value.color_code!,
      images: [] // Image handling can be implemented later
    };
    this.variants.update(variants => [...variants, newVariant]);  
    this.hideAddVariantForm();
    this.selectedVariant.set(newVariant);
  }


  selectVariant(variant: Variant) {
    this.selectedVariant.set(variant);
  }

  deleteVariant(variant: Variant) {
    const selected = this.selectedVariant();
    this.variants.update(variants => variants.filter(v => v.uuid !== variant.uuid));
    if (selected && selected.uuid === variant.uuid) {
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
      const newImage: VariantImage = {
        image: file,
        url: object_url
      };

      // update variant to include the new image
      const updatedVariant: Variant = {
        ...selected,
        images: [...selected.images, newImage]
      };
      this.selectedVariant.set(updatedVariant);
      this.variants.update(variants => variants.map(v => v.uuid === updatedVariant.uuid ? updatedVariant : v));
    }
  }

  moveImage(fromIndex: number, toIndex: number) {
    const selected = this.selectedVariant();
    if (!selected) return;
    const images = [...selected.images];
    const [movedImage] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, movedImage);

    const updatedVariant: Variant = {
      ...selected,
      images: images
    };
    this.selectedVariant.set(updatedVariant);
    this.variants.update(variants => variants.map(v => v.uuid === updatedVariant.uuid ? updatedVariant : v));
  }

  removePhoto(variant: Variant, image: VariantImage) {
    const updatedImages = variant.images.filter(img => img.url !== image.url);
    const updatedVariant: Variant = {
      ...variant,
      images: updatedImages
    };
    this.variants.update(variants => variants.map(v => v.uuid === updatedVariant.uuid ? updatedVariant : v));

    // if the removed image belongs to the currently selected variant, update it as well
    if (this.selectedVariant()?.uuid === variant.uuid) {
      this.selectedVariant.set(updatedVariant);
    }
  }




  drop(event: CdkDragDrop<VariantImage[]>) {
    this.moveImage(event.previousIndex, event.currentIndex);
  }









  // Helper : check if a form control is invalid and touched
  isInvalidAndTouched(controlName: string): boolean {
    const control = this.variantAddForm.get(controlName);
    if (!control) return false;
    return control.invalid && (control.touched);
  }


}
