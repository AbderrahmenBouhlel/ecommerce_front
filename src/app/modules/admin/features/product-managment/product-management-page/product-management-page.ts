import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router ,RouterModule} from '@angular/router';



@Component({
  selector: 'app-product-management-page',
  imports: [CommonModule,RouterModule],
  templateUrl: './product-management-page.html',
  styleUrl: './product-management-page.css',
})
export class ProductManagementPage {

  constructor(private router: Router) {}


  createProduct() {
    // navigate to the product creation page
    this.router.navigate(['/admin/products/new']);
  }


}
