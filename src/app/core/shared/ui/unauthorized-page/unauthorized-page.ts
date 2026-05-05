import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized-page',
  imports: [RouterLink],
  templateUrl: './unauthorized-page.html',
  styleUrl: './unauthorized-page.css',
})
export class UnauthorizedPage {


  constructor(private router: Router) {}


  goBack() {
    this.router.navigate(['/']);
  }

}
