import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CategoriesDropdown } from '../../../../../../core/shared/ui/dropdown/categories-dropdown/categories-dropdown';
import { OnInit } from '@angular/core';
import { ProductCreationService, BasicProductInfo} from '../../services/ProductCreationService';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-step1-basic-info-component',
  imports: [ReactiveFormsModule, CategoriesDropdown, CommonModule],
  templateUrl: './step1-basic-info-component.html',
  styleUrl: './step1-basic-info-component.css',
})
export class Step1BasicInfoComponent implements OnInit {
  public static STEP_NUMBER = 1;


  basicInfosForm :FormGroup ;

  ngOnInit() {
    const draft = this.productCreationService.getProductDraft();
    if (draft.basicInfo) {
      this.basicInfosForm.setValue({
        name: draft.basicInfo.name,
        description: draft.basicInfo.description,
        price: draft.basicInfo.price,
        categoryId: draft.basicInfo.categoryId
      });
    }

    this.productCreationService.registerStepValidator(Step1BasicInfoComponent.STEP_NUMBER, () => this.validate());

    this.basicInfosForm.valueChanges.subscribe(value => {
      const basicInfo: BasicProductInfo = {
        name: value.name,
        description: value.description,
        price: value.price ?? 0,
        categoryId: value.categoryId ?? null
      };
      this.productCreationService.setBasicInfo(basicInfo);
    });
  }


  constructor(private productCreationService: ProductCreationService) {
    this.basicInfosForm = new FormGroup({

      /*
        in case of somthing invalid : formControl.errors =
        {
          minlength: {
            requiredLength: 4,
            actualLength: 2
          },
          required: true
        }
      */
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)]
      }),

      description: new FormControl<string>('', {
        nonNullable: true 
      }),

      price: new FormControl<number | null>(0, {
        validators: [Validators.required , Validators.min(0)]
      }),

      categoryId: new FormControl<number | null>(null, {
        validators: [Validators.required]
      })
    });
  }

  public validate(): boolean {
    if (this.basicInfosForm.invalid) {
      this.basicInfosForm.markAllAsTouched();
      return false;
    } 
    return true;
  }



  get nameCtrl() {
    return this.basicInfosForm.get('name');
  }




  isInvalid(ctrlName: string): boolean {
    const ctrl = this.basicInfosForm.get(ctrlName);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  get descriptionCtrl() {
    return this.basicInfosForm.get('description');
  }

  get priceCtrl() {
    return this.basicInfosForm.get('price');
  }

  get categoryIdCtrl() {
    return this.basicInfosForm.get('categoryId');
  }

  


}
