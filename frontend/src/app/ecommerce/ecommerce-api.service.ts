import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, Technology, Faq } from './models';

@Injectable({ providedIn: 'root' })
export class EcommerceApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/services`);
  }

  getTechStack(): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.baseUrl}/tech-stack`);
  }

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/faqs`);
  }
}