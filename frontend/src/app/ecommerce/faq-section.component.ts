import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Faq } from './models';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html'
})
export class FaqSectionComponent {
  @Input() faqs: Faq[] = [];
  expandedFaqId: number | null = null;

  toggleFaq(id: number): void {
    this.expandedFaqId = this.expandedFaqId === id ? null : id;
  }
}