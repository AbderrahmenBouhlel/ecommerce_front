import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CategoriesDropdown } from '../../../../../../core/shared/ui/dropdown/categories-dropdown/categories-dropdown';
import { OnInit } from '@angular/core';
import { ProductCreationService} from '../../services/ProductCreationService';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsStore } from '../../../../stores/ProductManagmentStore/products.store';
import { ApiException } from '../../../../../../core/shared/api/api.responseTypes';
import { Product } from '../../../../stores/ProductManagmentStore/models/product.model';
import { NotificationService } from '../../../../../../core/shared/service/NotificaitonService';


@Component({
  selector: 'app-step1-basic-info-component',
  imports: [ReactiveFormsModule, CategoriesDropdown, CommonModule],
  templateUrl: './step1-basic-info-component.html',
  styleUrl: './step1-basic-info-component.css',
})
export class Step1BasicInfoComponent implements OnInit {


  public static STEP_NUMBER = 1;

  private readonly productCreationService = inject(ProductCreationService);
  private readonly productsStore = inject(ProductsStore);
  private readonly notifcationService = inject(NotificationService);


  basicInfosForm :FormGroup ;
  isLoading = signal(false);
  errorMessage = signal('');

  isStepAlreadySubmitted = false;


  ngOnInit() {
    const basicInfo = this.productCreationService.getBasicInfo();
    if (basicInfo?.submitted) {
      // Re-populate if user goes back to step 1
      this.basicInfosForm.setValue({
        name: basicInfo.name,
        description: basicInfo.description,
        price: basicInfo.price,
        categoryId: basicInfo.categoryId,
      });
      this.isStepAlreadySubmitted = true;
    }
  }


  constructor() {
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

  /**
   * Submit basic product info, create product in backend, and navigate to step 2
   */
  next(): void {
    // 1: check if the step alredy done and if yes, prevent resubmission and navigate to next step
    if (this.isStepAlreadySubmitted){
      this.notifcationService.showError('You have already submitted this step. Please proceed to the next step.');
      this.productCreationService.goNextStep();
    }


    // 2:clear any previous error 
    this.errorMessage.set('');

    // 3: validate form and submit
    if (!this.validate()) {
      this.notifcationService.showError('Please fill in all required fields correctly.');
      return;
    }

    // 4: submit data to backend
    this.isLoading.set(true);
    const { name, description, price, categoryId } = this.basicInfosForm.value;
    this.productsStore.createProduct(name, categoryId, price, description).subscribe({
      next: (product: Product) => {
        // Update service so step 2+ can access the created product ID
        this.productCreationService.onSuccessfulBasicInfoSubmission(product);
        this.productCreationService.goNextStep();
        this.notifcationService.showSuccess('Product created successfully.');
        this.isLoading.set(false);
      },
      error: (error: ApiException) => {
        console.error('Error creating product:', error);
        this.handleError(error);
        this.isLoading.set(false);
      }
    });
  }


  previous(): void {
    this.productCreationService.goPreviousStep();
  }

  private handleError(error: ApiException): void {
    const errorMap: Record<string, string> = {
      'REQUEST.INVALID': 'Invalid data. Please review your inputs.',
      'AUTH.EXPIRED_TOKEN': 'Your session has expired. Please log in again.',
      'AUTH.UNAUTHORIZED_ACTION': 'You are not allowed to perform this action.',
      'PRODUCT.DUPLICATE_NAME': 'A product with this name already exists.',
      'CATEGORY.NOT_FOUND': 'The selected category does not exist anymore.',
      'CATEGORY.INACTIVE': 'The selected category is inactive. Please choose another one.',
    };

    const userMessage = errorMap[error.code] || error.message || 'An unexpected error occurred.';
    this.errorMessage.set(userMessage);
    this.notifcationService.showError(userMessage);
  }


  isInvalid(ctrlName: string): boolean {
    const ctrl = this.basicInfosForm.get(ctrlName);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  
  get nameCtrl() {
    return this.basicInfosForm.get('name');
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
