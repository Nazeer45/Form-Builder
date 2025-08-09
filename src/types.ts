export type ValidationRules = {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  passwordRule?: boolean;
};

export type FormField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'checkbox' | 'textarea' | 'select' | 'radio';
  required: boolean;
  defaultValue?: string;
  validation?: ValidationRules;
  isDerived?: boolean;
  derivedFrom?: string[]; 
  formula?: string;      
  options?: string[];    
};