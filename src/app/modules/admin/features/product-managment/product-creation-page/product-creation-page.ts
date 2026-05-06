import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasicProductInfo, ProductCreationService } from '../services/ProductCreationService';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsStore } from '../../../stores/ProductManagmentStore/products.store';
import {ApiException} from '../../../../../core/shared/api/api.responseTypes';


const CREATE_PRODUCT_ERROR_MAP: Record<string, string> = {
  'REQUEST.INVALID': 'Invalid data. Please review your inputs.',
  'AUTH.EXPIRED_TOKEN': 'Your session has expired. Please log in again.',
  'AUTH.UNAUTHORIZED_ACTION': 'You are not allowed to perform this action.',
  'PRODUCT.DUPLICATE_NAME': 'A product with this name already exists.',
  'CATEGORY.NOT_FOUND': 'The selected category does not exist anymore.',
  'CATEGORY.INACTIVE': 'The selected category is inactive. Please choose another one.',
};

const STEP_ROUTE_MAP: Record<number, string> = {
  1: '/admin/products/new/step-1',
  2: '/admin/products/new/step-2',
  3: '/admin/products/new/step-3',
  4: '/admin/products/new/step-4'
};

export type StepState = {
  index: number;
  state : 'pending' | 'completed'| 'current';
}


@Component({
  selector: 'app-product-creation-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './product-creation-page.html',
  styleUrl: './product-creation-page.css',
  providers: [ProductCreationService]
})
export class ProductCreationPage {

  stepsInfos = signal<StepState[]>([
    { index: 1, state: 'current' },
    { index: 2, state: 'pending' },
    { index: 3, state: 'pending' },
    { index: 4, state: 'pending' },
  ]);

  currentStepIndex = signal<number>(1);


  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly productCreationService: ProductCreationService,
    private readonly productsStore: ProductsStore
  ) {
  }

  handleBackNavigation() {
    this.router.navigate(['/admin/products']);
  }



  goNext() {
    // If current step is already completed, just go to next step without any handling
    const currentStep : StepState | undefined = this.stepsInfos().find(s => s.index === this.currentStepIndex());
    if (currentStep!.state === 'completed') {
      this.goNextStep();
      this.showInfo('You have already completed this step. Moving to the next step.');
      return;
    }

    switch (this.currentStepIndex()) {
      case 1:
        //this.handleNextFromStep1();
        this.goNextStep();
        break;
      case 2:
        // handle step2
        console.log('Handling next from step 2');
        this.goNextStep();
        break;
      case 3:
        // handle step3
        console.log('Handling next from step 3');
        this.goNextStep();
        break;
      case 4:
        // handle step4
        console.log('Handling next from step 4');

        break;
      default:
        console.log('No specific handling for this step');
        break;
    }
  }


  private handleNextFromStep1() {
    if (!this.productCreationService.validateStep(1)) {
      this.showError('Please fill in all required fields correctly before proceeding.');
      return;
    }
    const basicInfo: BasicProductInfo = this.productCreationService.getBasicInfo()!;

    const { name, description, price, categoryId } = basicInfo;
  
    this.productsStore.createProduct(name, categoryId!, price ,description).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        this.showSuccess('Product created successfully.');
        this.goNextStep();
      },
      error: (error: ApiException) => {
        console.error('Error creating product:', error);
        this.handleCreateProductError(error);
      }
    });
   
  }


  private goNextStep() {
    const currentIndex = this.currentStepIndex();
    const nextStepIndex = this.currentStepIndex() + 1;
    if (nextStepIndex > 4) return; // No more steps

    // make current step completed 
    // if next step is alredy completed do not change it's state to current
    this.stepsInfos.update(states => {
      const updatedStates : StepState[] = states.map(s => {
        if (s.index === currentIndex && s.state !== 'completed') {
          return { ...s, state: 'completed' };
        } else if (s.index === nextStepIndex && s.state !== 'completed') {
          return { ...s, state: 'current' };
        }
        return s;
      });
      return updatedStates;
    });

    this.currentStepIndex.set(nextStepIndex);


    // handle navigation
    const nextStepRoute = STEP_ROUTE_MAP[nextStepIndex];
    this.router.navigate([nextStepRoute]);
  }


  public goPreviousStep() {
    const currentIndex = this.currentStepIndex();
    if (currentIndex > 1) {
      const previousStepIndex = currentIndex - 1;
      const previousStep = this.stepsInfos().find(s => s.index === previousStepIndex);
      if (previousStep) {
        this.currentStepIndex.set(previousStepIndex);
      } else {
        console.error('Previous step not found');
      }

      // handle navigation
      const previousStepRoute = STEP_ROUTE_MAP[previousStepIndex];
      this.router.navigate([previousStepRoute]);
    } else {
      this.router.navigate(['/admin/products']);
    }
  }



  private handleCreateProductError(error: ApiException) {
    const userFriendlyMessage = CREATE_PRODUCT_ERROR_MAP[error.code];
    if (userFriendlyMessage) {
      this.showError(userFriendlyMessage);
      return;
    }
    // fallback
    this.showError(error.message || 'An unexpected error occurred.');
  }


  
  private showError(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  private showInfo(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
  private showSuccess(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }


}
