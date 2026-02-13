import React from "react";
import { Routes, Route } from "react-router-dom";
import SubmissionForm from "./components/SubmissionForm";
import Viewer from "./components/Viewer";
import AddVoiceForm from "./components/AddVoiceForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SubmissionForm />} />
      <Route path="/vm/:id" element={<Viewer />} />
      <Route path="/vm/:id/add-voice" element={<AddVoiceForm />} />
    </Routes>
  );
}

export default App;
