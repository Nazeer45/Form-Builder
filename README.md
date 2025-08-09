# 🛠️ React Dynamic Form Builder

A **dynamic form builder** application built with **React**, **TypeScript**, **Material-UI (MUI)**, and **Redux Toolkit**, allowing users to create custom forms, preview them, and store them in **localStorage** for later use.

---

## 📌 Features

- ➕ **Add, edit, delete, and reorder** form fields
- 📝 Supports multiple field types:
  - Text, Number, Email, Date
  - Textarea
  - Select, Radio, Checkbox
- ✅ **Validation Rules**:
  - Required fields
  - Min / Max length
  - Email format check
  - Password rules (uppercase, lowercase, number)
  - Custom regex pattern
- 🔄 **Derived fields** — calculate values from other fields using formulas
- 💾 Save forms locally using **localStorage**
- 👁️ Preview and submit forms with **real-time validation**
- 🗄️ State management with **Redux Toolkit**
- 🎨 Styled with **Material-UI (MUI)** components

---
1. Live Demo: [Form Builder App - Click here](https://form-builder-abrp-5ln5xjsb6-shaik-nazeers-projects.vercel.app)
---

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (for fast development)
- **Material-UI (MUI)** — UI components
- **Redux Toolkit** — state management
- **React Router DOM** — routing
- **UUID** — unique field IDs

---

## 📦 Dependencies

This project uses the following dependencies:

```jsonc
"dependencies": {
  "@emotion/react": "^11.11.3",
  "@emotion/styled": "^11.11.3",
  "@mui/icons-material": "^5.15.0",
  "@mui/material": "^5.15.0",
  "@reduxjs/toolkit": "^1.9.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-redux": "^8.1.3",
  "react-router-dom": "^6.17.0",
  "uuid": "^9.0.1"
},
"devDependencies": {
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/uuid": "^9.0.5",
  "typescript": "^5.2.0",
  "vite": "^5.0.0"
}
```

---

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/<your-username>/<repo-name>.git
   cd form-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the App

Start the development server:

```
npm run dev
```

Open your browser and go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Build for Production

```
npm run build
```

## Requirements

- Node.js (v16 or higher recommended)
- npm

---

## Usage

- Go to `/create` to build a new form.
- Save your form to localStorage.
- Preview and submit forms via `/preview/:formId`.
- Manage saved forms in `/myforms`.

---

## License

MIT
