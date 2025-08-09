import { Routes, Route, Navigate } from 'react-router-dom';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create" replace />} />
      <Route path="/create" element={<CreateForm />} />
      <Route path="/preview/:formId" element={<PreviewForm />} />
      <Route path="/myforms" element={<MyForms />} />
    </Routes>
  );
}

export default App;