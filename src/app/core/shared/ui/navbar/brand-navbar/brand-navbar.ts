import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-navbar',
  imports: [RouterLink],
  templateUrl: './brand-navbar.html',
  styleUrl: './brand-navbar.css',
})
export class BrandNavbar {

  readonly homeLink = input<string>('/');
  readonly brandName = input<string>('Shoply');
}
