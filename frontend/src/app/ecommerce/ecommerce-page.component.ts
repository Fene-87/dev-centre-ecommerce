import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EcommerceApiService } from './ecommerce-api.service';
import { Service, TechGroup, Technology, Faq } from './models';
import { ServicesSectionComponent } from './services-section.component';
import { TechStackSectionComponent } from './tech-stack-section.component';
import { FaqSectionComponent } from './faq-section.component';

@Component({
  selector: 'app-ecommerce-page',
  standalone: true,
  imports: [
    CommonModule,
    ServicesSectionComponent,
    TechStackSectionComponent,
    FaqSectionComponent
  ],
  templateUrl: './ecommerce-page.component.html'
})
export class EcommercePageComponent implements OnInit {
  services: Service[] = [];
  techGroups: TechGroup[] = [];
  faqs: Faq[] = [];

  error: string | null = null;

  constructor(private api: EcommerceApiService) {}

  ngOnInit(): void {
    // SERVICES
    this.api.getServices().subscribe({
      next: (services: Service[]) => {
        console.log('[services]', services);
        this.services = services;
      },
      error: (err) => {
        console.error('Error loading services', err);
        this.error = 'Failed to load services. Please try again.';
      }
    });

    // TECH STACK
    this.api.getTechStack().subscribe({
      next: (tech: Technology[]) => {
        console.log('[tech]', tech);
        this.techGroups = this.groupTechByCategory(tech);
      },
      error: (err) => {
        console.error('Error loading tech stack', err);
      }
    });

    // FAQ
    this.api.getFaqs().subscribe({
      next: (faqs: Faq[]) => {
        console.log('[faqs]', faqs);
        this.faqs = faqs;
      },
      error: (err) => {
        console.error('Error loading FAQs', err);
      }
    });
  }

  private groupTechByCategory(tech: Technology[]): TechGroup[] {
    const map = new Map<string, Technology[]>();
    tech.forEach(t => {
      const key = t.category || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }
}