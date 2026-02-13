import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/App.css";

const AddVoiceForm = () => {
  const { id } = useParams(); // vm_id
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [voice, setVoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) return alert("Enter your name!");
    if (!voice) return alert("Voice file is required!");

    setLoading(true);

    try {
      // Upload voice to storage
      const voiceExt = voice.name.split(".").pop();
      const path = `vm-${id}/${username}-voice.${voiceExt}`;
      const { error: uploadError } = await supabase.storage
        .from("vm-files")
        .upload(path, voice, { upsert: true });
      if (uploadError) throw uploadError;

      const { publicUrl } = supabase.storage.from("vm-files").getPublicUrl(path);

      // Insert into voicerecords
      const { error: dbError } = await supabase
        .from("voicerecords")
        .insert([{ vm_id: id, username, voice_url: publicUrl }]);
      if (dbError) throw dbError;

      alert("Voice added successfully!");
      navigate(`/vm/${id}`);
    } catch (err) {
      alert("Error adding voice: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Your Voice to This VM</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setVoice(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Voice"}
        </button>
      </form>
    </div>
  );
};

export default AddVoiceForm;
