export interface Technology {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  is_featured: boolean;
  technologies: Technology[];
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface TechGroup {
  category: string;
  items: Technology[];
}