import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

type FormMeta = {
  name: string;
  createdAt: string;
};

export default function MyForms() {
  const [forms, setForms] = useState<FormMeta[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const loadedForms: FormMeta[] = [];

    keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.name && parsed.createdAt && parsed.fields) {
            loadedForms.push({ name: parsed.name, createdAt: parsed.createdAt });
          }
        }
      } catch (err) {
        console.warn(`Invalid form data for key ${key}`);
      }
    });

    setForms(loadedForms);
  }, []);

  const deleteForm = (name: string) => {
    localStorage.removeItem(name);
    setForms((prev) => prev.filter((form) => form.name !== name));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📁 My Forms
      </Typography>

      {forms.length === 0 ? (
        <Typography>No forms found.</Typography>
      ) : (
        <List>
          {forms.map((form) => (
            <React.Fragment key={form.name}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteForm(form.name)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={form.name}
                  secondary={`Created at: ${new Date(form.createdAt).toLocaleString()}`}
                />
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/preview/${form.name}`)}
                  sx={{ ml: 2 }}
                >
                  Preview
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
}