import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Service } from './models';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.component.html'
})
export class ServicesSectionComponent {
  @Input() services: Service[] = [];
}