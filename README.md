# Dev Centre – E-commerce Services Cards Page

A small full-stack assignment that exposes e-commerce service offerings via a REST API (Node.js + PostgreSQL) and renders them in a responsive services cards page (Angular 17 + TailwindCSS).

The goal is to demonstrate:

- Clean separation between **data layer**, **API layer**, and **UI layer**
- Typed, documented API surface
- Modern Angular 17 standalone component architecture
- Simple but realistic e-commerce domain model (services, technology stack, FAQs)

---

## 1. High-Level Architecture

### Overview

```text
PostgreSQL
    ▲
    │ (SQL, seed script)
    ▼
Node.js / Express API  (backend/)
    - db.js (pg Pool)
    - routes/api.js
    - index.js (Express app, CORS, error handling)
    ▲
    │  JSON over HTTP
    ▼
Angular 17 Frontend (frontend/)
    - Standalone components
    - EcommerceApiService (HttpClient)
    - Services / Tech Stack / FAQ sections
