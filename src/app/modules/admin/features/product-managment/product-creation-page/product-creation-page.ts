import { Component, inject, Signal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCreationService } from '../services/ProductCreationService';
import { VariantDraft } from '../services/ProductCreationService.types';
import { Router } from '@angular/router';
import { catchError, filter, forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsStore } from '../../../stores/ProductManagmentStore/products.store';



export type StepState = {
  index: number;
  state : 'pending' | 'completed'| 'current';
}


@Component({
  selector: 'app-product-creation-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './product-creation-page.html',
  styleUrl: './product-creation-page.css'
})
export class ProductCreationPage {

  private readonly productCreationService = inject(ProductCreationService);

  currentStep: Signal<number> = this.productCreationService.currentStep$;

  constructor(
    private readonly router: Router
  ) {
    
  }

  handleBackNavigation() {
    this.router.navigate(['/admin/products']);
  }



}
