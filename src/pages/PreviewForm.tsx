import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  Box,
  MenuItem,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setForm } from "../store/formSlice";
import type { FormField } from "../types";

type FormSchema = {
  name: string;
  createdAt: string;
  fields: FormField[];
};

export default function PreviewForm() {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const schema = useSelector((state: RootState) => state.form.currentForm);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  // 🧠 Evaluate derived fields
  const evaluateDerivedFields = () => {
    if (!schema) return;

    const updatedData = { ...formData };
    schema.fields.forEach((field) => {
      if (field.isDerived && field.formula && field.derivedFrom) {
        try {
          const formulaFn = new Function(
            ...field.derivedFrom,
            `return ${field.formula};`
          );
          const args = field.derivedFrom.map((id) => updatedData[id] || 0);
          updatedData[field.id] = formulaFn(...args);
        } catch (err) {
          console.error(`Error evaluating formula for ${field.label}`, err);
        }
      }
    });
    setFormData(updatedData);
  };

  useEffect(() => {
    if (!schema && formId) {
      const raw = localStorage.getItem(formId);
      if (raw) {
        const parsed: FormSchema = JSON.parse(raw);
        dispatch(setForm(parsed));

        const initialData: Record<string, any> = {};
        parsed.fields.forEach((field) => {
          initialData[field.id] = field.defaultValue || "";
        });
        setFormData(initialData);

        setTimeout(() => {
          evaluateDerivedFields();
        }, 0);
      }
    } else if (schema) {
      const initialData: Record<string, any> = {};
      schema.fields.forEach((field) => {
        initialData[field.id] = field.defaultValue || "";
      });
      setFormData(initialData);

      setTimeout(() => {
        evaluateDerivedFields();
      }, 0);
    }
  }, [formId, schema]);

  const handleChange = (field: FormField, value: any) => {
    setFormData((prev) => ({ ...prev, [field.id]: value }));
  };

  const handleSubmit = () => {
    if (!schema) return;

    const errors: string[] = [];

    schema.fields.forEach((field) => {
      const value = formData[field.id];

      if (field.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "boolean" && value === false);
        if (isEmpty) {
          errors.push(`${field.label} is required`);
          return;
        }
      }

      if (field.validation) {
        if (
          field.validation.notEmpty &&
          typeof value === "string" &&
          value.trim() === ""
        ) {
          errors.push(`${field.label} cannot be empty`);
        }
        if (
          typeof value === "string" &&
          field.validation.minLength !== undefined &&
          value.length < field.validation.minLength
        ) {
          errors.push(
            `${field.label} must be at least ${field.validation.minLength} characters`
          );
        }
        if (
          typeof value === "string" &&
          field.validation.maxLength !== undefined &&
          value.length > field.validation.maxLength
        ) {
          errors.push(
            `${field.label} must be no more than ${field.validation.maxLength} characters`
          );
        }
        if (field.validation.email && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field.label} must be a valid email address`);
          }
        }
        if (field.validation.passwordRule && value) {
          const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
          if (!passwordRegex.test(value)) {
            errors.push(
              `${field.label} must contain uppercase, lowercase, and a number`
            );
          }
        }
        if (field.validation.pattern && value) {
          try {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
              errors.push(
                `${field.label} does not match the required pattern`
              );
            }
          } catch (err) {
            console.error("Invalid regex in field:", field.label);
          }
        }
      }
    });

    if (errors.length > 0) {
      alert("Please fix the following issues:\n\n" + errors.join("\n"));
      return;
    }

    setSubmitted(true);
    const labeledData: Record<string, any> = {};
    schema.fields.forEach((field) => {
      labeledData[field.label] = formData[field.id];
    });
    console.log("Submitted Data:", labeledData);
  };

  if (!schema) {
    return <Typography>Unknown URL request....</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Preview: {schema.name}
      </Typography>

      {schema.fields.map((field) => {
        if (field.isDerived) {
          return (
            <TextField
              key={field.id}
              label={field.label}
              value={formData[field.id] || ""}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          );
        }

        switch (field.type) {
          case "text":
          case "number":
          case "email":
          case "date":
            return (
              <TextField
                key={field.id}
                label={field.label}
                type={field.type}
                value={formData[field.id] || ""}
                required={field.required}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange(field, e.target.value)}
              />
            );

          case "textarea":
            return (
              <TextField
                key={field.id}
                label={field.label}
                value={formData[field.id] || ""}
                required={field.required}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            );

          case "select":
            return (
              <TextField
                key={field.id}
                label={field.label}
                select
                value={formData[field.id] || ""}
                required={field.required}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange(field, e.target.value)}
              >
                {(field.options || []).map((opt, i) => (
                  <MenuItem key={i} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "radio":
            return (
              <Box key={field.id} sx={{ mb: 2 }}>
                <Typography>{field.label}</Typography>
                <RadioGroup
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                >
                  {(field.options || []).map((opt, i) => (
                    <FormControlLabel
                      key={i}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
              </Box>
            );

          case "checkbox":
            return (
              <FormControlLabel
                key={field.id}
                control={
                  <Checkbox
                    checked={!!formData[field.id]}
                    onChange={(e) => handleChange(field, e.target.checked)}
                  />
                }
                label={field.label}
              />
            );

          default:
            return null;
        }
      })}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          🔼 Back to Top
        </Button>
      </Box>

      {submitted && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Form submitted! Check console for data.
        </Alert>
      )}
    </Container>
  );
}
