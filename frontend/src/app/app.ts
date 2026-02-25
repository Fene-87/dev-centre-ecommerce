import { Component } from '@angular/core';
import { EcommercePageComponent } from './ecommerce/ecommerce-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EcommercePageComponent],
  template: `<app-ecommerce-page></app-ecommerce-page>`
})
export class App {}