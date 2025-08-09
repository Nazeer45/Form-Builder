import { useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../store/store";
import type { FormField } from "../types";
import { v4 as uuidv4 } from 'uuid';
import FieldEditor from '../components/FieldEditor';
import { Container, Typography, TextField, Button } from '@mui/material';
import { setForm, updateFields, updateFormName, clearForm } from "../store/formSlice";

export default function CreateForm() {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.form.currentForm);

  useEffect(() => {
    if (!form) {
      dispatch(setForm({
        name: "",
        createdAt: new Date().toISOString(),
        fields: [],
      }));
    }
  }, []);

  const addField = () => {
    const newField: FormField = {
      id: uuidv4(),
      label: "",
      type: "text",
      required: false,
      defaultValue: "",
      validation: {
        notEmpty: false,
        minLength: undefined,
        maxLength: undefined,
        email: false,
        passwordRule: false,
      },
      isDerived: false,
      derivedFrom: [],
      formula: "",
      options: [],
    };
    dispatch(updateFields([...(form?.fields || []), newField]));
  };

  const saveForm = () => {
    if (!form || form.fields.length === 0) {
      alert("Cannot save empty form");
      return;
    }
    if (!form.name.trim()) {
      alert("Form name cannot be empty");
      return;
    }
    const schema = { ...form, createdAt: new Date().toISOString() };
    localStorage.setItem(form.name, JSON.stringify(schema));
    dispatch(clearForm());
    alert("Form saved!");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">🛠️ Form Builder - Build your Custom Forms</Typography>
      <TextField
        label="Form Name"
        value={form?.name || ""}
        onChange={(e) => dispatch(updateFormName(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={addField}>➕ Add Field</Button>
      {(form?.fields || []).map((field, index) => (
        <FieldEditor
          key={field.id}
          field={field}
          allFields={form?.fields ?? []}
          index={index}
          onChange={(updated) => {
            const updatedFields = [...(form?.fields || [])];
            updatedFields[index] = updated;
            dispatch(updateFields(updatedFields));
          }}
          onDelete={() => {
  const updatedFields = form?.fields?.filter((_, i) => i !== index) ?? [];
  dispatch(updateFields(updatedFields));
}}
          moveUp={() => {
  if (index > 0) {
    const updatedFields = [...(form?.fields ?? [])];
    [updatedFields[index - 1], updatedFields[index]] =
      [updatedFields[index], updatedFields[index - 1]];
    dispatch(updateFields(updatedFields));
  }
}}
          moveDown={() => {
  if (index < (form?.fields?.length ?? 0) - 1) {
    const updatedFields = [...(form?.fields ?? [])];
    [updatedFields[index + 1], updatedFields[index]] =
      [updatedFields[index], updatedFields[index + 1]];
    dispatch(updateFields(updatedFields));
  }
}}
        />
      ))}
      {(form?.fields?.length ?? 0) > 0 && (
        <Button color="success" onClick={saveForm}>💾 Save Form</Button>
      )}
    </Container>
  );
}
