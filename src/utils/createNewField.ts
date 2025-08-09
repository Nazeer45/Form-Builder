import type { FormField } from '../types';

let fieldCounter = 1;

export function createNewField(type: FormField['type']): FormField {
  const id = `field_${Date.now()}_${fieldCounter++}`;
  const defaultLabel = `${capitalize(type)} Field ${fieldCounter}`;

  return {
    id,
    label: defaultLabel,
    type,
    required: false,
    defaultValue: '',
    validation: {},
    options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1'] : undefined,
    isDerived: false,
    derivedFrom: [],
    formula: '',
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}