import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TechGroup } from './models';

@Component({
  selector: 'app-tech-stack-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack-section.component.html'
})
export class TechStackSectionComponent {
  @Input() techGroups: TechGroup[] = [];
}