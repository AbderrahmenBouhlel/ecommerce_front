import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-page',
  imports: [],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage {



  constructor(actiavatedRoute: ActivatedRoute) {
    const slug = actiavatedRoute.snapshot.paramMap.get('slug');
    console.log('Category slug:', slug);
  }

}
