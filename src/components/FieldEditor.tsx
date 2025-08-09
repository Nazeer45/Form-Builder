import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
} from '@mui/material';
import type { FormField, ValidationRules } from '../types';

type Props = {
  field: FormField;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
  allFields: FormField[];
  index: number;
  moveUp: () => void;
  moveDown: () => void;
};

const fieldTypes: FormField['type'][] = [
  'text',
  'number',
  'email',
  'date',
  'textarea',
  'select',
  'radio',
  'checkbox',
];

export default function FieldEditor({
  field,
  onChange,
  onDelete,
  allFields,
  index,
  moveUp,
  moveDown,
}: Props) {
  const handleChange = (key: keyof FormField, value: any) => {
    onChange({ ...field, [key]: value });
  };

  const handleValidationChange = (key: keyof ValidationRules, value: any) => {
    onChange({
      ...field,
      validation: {
        ...field.validation,
        [key]: value,
      },
    });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[idx] = value;
    handleChange('options', newOptions);
  };

  const addOption = () => {
    handleChange('options', [...(field.options || []), '']);
  };

  const removeOption = (idx: number) => {
    const newOptions = field.options?.filter((_, i) => i !== idx) || [];
    handleChange('options', newOptions);
  };

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Field {index + 1}
      </Typography>

     
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => handleChange('label', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      
      <Select
        value={field.type}
        onChange={(e) => handleChange('type', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {fieldTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      
      <TextField
        label="Default Value"
        value={field.defaultValue || ''}
        onChange={(e) => handleChange('defaultValue', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Required */}
      <FormControlLabel
        control={
          <Checkbox
            checked={field.required}
            onChange={(e) => handleChange('required', e.target.checked)}
          />
        }
        label="Required"
      />

      
      <FormControlLabel
        control={
          <Checkbox
            checked={field.isDerived || false}
            onChange={(e) => handleChange('isDerived', e.target.checked)}
          />
        }
        label="Derived Field"
      />

      {field.isDerived && (
        <>
          <Select
            multiple
            value={field.derivedFrom || []}
            onChange={(e) => handleChange('derivedFrom', e.target.value as string[])}
            fullWidth
            sx={{ mb: 2 }}
          >
            {allFields
              .filter((f) => f.id !== field.id)
              .map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label?.trim() || '(Unnamed Field)'}
                </MenuItem>
              ))}
          </Select>
          <TextField
            label="Formula (JS expression)"
            value={field.formula || ''}
            onChange={(e) => handleChange('formula', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Example: `${parent1} + ${parent2}` or custom logic"
          />
        </>
      )}

      {/* Options for select/radio/checkbox */}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Options</Typography>
          {(field.options || []).map((opt, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                fullWidth
              />
              <Button color="error" onClick={() => removeOption(i)}>
                ❌
              </Button>
            </Box>
          ))}
          <Button variant="outlined" onClick={addOption}>
            ➕ Add Option
          </Button>
        </Box>
      )}

      {/* Validation Rules */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Validation Rules
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={field.validation?.notEmpty || false}
            onChange={(e) => handleValidationChange('notEmpty', e.target.checked)}
          />
        }
        label="Not Empty"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={field.validation?.email || false}
            onChange={(e) => handleValidationChange('email', e.target.checked)}
          />
        }
        label="Email Format"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={field.validation?.passwordRule || false}
            onChange={(e) => handleValidationChange('passwordRule', e.target.checked)}
          />
        }
        label="Password Rule"
      />

      <TextField
        label="Min Length"
        type="number"
        value={field.validation?.minLength ?? ''}
        onChange={(e) =>
          handleValidationChange(
            'minLength',
            e.target.value === '' ? undefined : Number(e.target.value)
          )
        }
        sx={{ mr: 2, mt: 1 }}
      />

      <TextField
        label="Max Length"
        type="number"
        value={field.validation?.maxLength ?? ''}
        onChange={(e) =>
          handleValidationChange(
            'maxLength',
            e.target.value === '' ? undefined : Number(e.target.value)
          )
        }
        sx={{ mr: 2, mt: 1 }}
      />

      <TextField
        label="Pattern (Regex)"
        value={field.validation?.pattern || ''}
        onChange={(e) => handleValidationChange('pattern', e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        helperText="Optional: custom regex pattern for validation"
      />

      {/* Field Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button onClick={moveUp} disabled={index === 0}>
          ↑ Move Up
        </Button>
        <Button onClick={moveDown} disabled={index === allFields.length - 1}>
          ↓ Move Down
        </Button>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}
