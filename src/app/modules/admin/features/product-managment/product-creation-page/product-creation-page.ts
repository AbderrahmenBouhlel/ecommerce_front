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


export type stepState = {
  index: number;
  state : 'pending' | 'completed' | 'current';
}

export type AllStepStates = {
  step1: stepState;
  step2: stepState;
  step3: stepState;
  step4: stepState;
}


@Component({
  selector: 'app-product-creation-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './product-creation-page.html',
  styleUrl: './product-creation-page.css',
  providers: [ProductCreationService]
})
export class ProductCreationPage {
  static STEP_MAP : Record<string, number> = {
    'step-1': 1,
    'step-2': 2,
    'step-3': 3,
    'step-4': 4,
  };

  stepStates = signal<AllStepStates>({
    step1: { index: 1, state: 'current' },
    step2: { index: 2, state: 'pending' },
    step3: { index: 3, state: 'pending' },
    step4: { index: 4, state: 'pending' },
  });
  stepOrder = ['step1', 'step2', 'step3', 'step4'] as const;


  currentStep = computed(() => {
    const states = this.stepStates();
    const current = Object.values(states).find(s => s.state === 'current');
    return current ? current.index : 1;
  });


  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly productCreationService: ProductCreationService,
    private readonly productsStore: ProductsStore
  ) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed() // Automatically unsubscribe when the component is destroyed
    ).subscribe((event: NavigationEnd) => {
      this.handleNavigationEnd(event);
    });
  }

  handleNavigationEnd(event: NavigationEnd) {
    const url = event.urlAfterRedirects;
    const stepSegment = url.split('/').pop();
    const stepMap: Record<string, number> = ProductCreationPage.STEP_MAP;
  }

  handleBackNavigation() {
    this.router.navigate(['/admin/products']);
  }


  private showError(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }


  goBack() {
    if (this.currentStep() > 1) {
      const previousStepIndex = this.currentStep() - 1 >= 1 ? this.currentStep() - 1 : 1;
      const previousStep = Object.values(this.stepStates()).find(s => s.index === previousStepIndex);
      this.stepStates.update(states => {
        
        return states;
      });
    } else {
      this.router.navigate(['/admin/products']);
    }
  }

  goNext() {
    switch (this.currentStep()) {
      case 1:
        this.handleNextFromStep1();
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
        this.stepStates.update(states => {
          return {
            ...states,
            step1: { ...states.step1, state: 'completed' },
            step2: { ...states.step2, state: 'current' },
          };
        });
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.showError('Failed to create product. Please try again.');
      }
    });
   
  }



  private goNextStep() {
    const nextStepIndex = this.currentStep() + 1;
    if (nextStepIndex > 4) return; // No more steps
    this.stepStates.update(states => {
      const newStates = { ...states };
      for (const key of this.stepOrder) {
        const step = newStates[key];
        let stepStats = "peding" ;
        if (step.state === 'completed') {
          stepStats = 'completed';
        }
        if (step.index < nextStepIndex) {
          stepStats = 'completed';
        } else if (step.index === nextStepIndex) {
          stepStats = 'current';
        }
        newStates[key] = {
          ...step,
          state: stepStats as 'pending' | 'completed' | 'current'
        };
      }
      return newStates;
    })
  }

}
