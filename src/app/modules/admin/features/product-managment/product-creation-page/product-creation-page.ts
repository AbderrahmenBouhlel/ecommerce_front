import { Component, inject, Signal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCreationService } from '../services/ProductCreationService';
import { VariantDraft } from '../services/ProductCreationService.types';
import { Router } from '@angular/router';
import { catchError, filter, forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsStore } from '../../../stores/ProductManagmentStore/products.store';


import { map , of } from 'rxjs';


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

  private readonly productCreationService = inject(ProductCreationService);

  currentStep: Signal<number> = this.productCreationService.currentStep$;


  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly productsStore: ProductsStore
  ) {
    
  }

  handleBackNavigation() {
    this.router.navigate(['/admin/products']);
  }



  // todo: this needs to be refactored
  // private handleNextFromStep2() {
  //   const variants: VariantDraft[] = this.productCreationService.getVariantsItems();
  //   const productId = this.productCreationService.getBasicInfo()!.id;

  //   if (!variants.length) {
  //     this.showError('Please add at least one variant before proceeding.');
  //     return;
  //   }

  //   const createVariantObservables = variants.map(variant => {
  //     const filesArray: File[] = variant.images
  //       .map(img => img.image)
  //       .filter((file): file is File => file !== null);

  //     return this.productsStore.createProductVariant(productId, variant.color_name, variant.color_code, filesArray)
  //       .pipe(
  //         map(createdVariant => ({
  //           success: true,
  //           variantDraft: variant,
  //           createdVariant
  //         })),
  //         catchError(error => {
  //           console.error(`Failed creating variant ${variant.color_name}`, error);
  //           return of({
  //             success: false,
  //             variantDraft: variant,
  //             error
  //           });
  //         })
  //       );
  //   });

  //   forkJoin(createVariantObservables).subscribe({
  //     next: results => {
  //       const successResults = results.filter(r => r.success );
  //       const failedResults = results.filter(r => !r.success);

  //       // Update service with only successful variants
  //       // this.productCreationService.onSuccessfulVariantSubmission(
  //       //   successResults.map(r => r.createdVariant)
  //       // );

  //       this.snackBar.open(
  //         `${successResults.length} variants created, ${failedResults.length} failed.`,
  //         'Close',
  //         { duration: 5000 }
  //       );

  //       if (successResults.length > 0) {
  //         this.goNextStep();
  //       } else {
  //         this.showError('All variants failed to create. Please review and try again.');
  //       }
  //     },
  //     error: err => {
  //       console.error(err);
  //       this.showError('Unexpected error occurred.');
  //     }
  //   });
  // }



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
