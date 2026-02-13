import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../style/App.css';

const SubmissionForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [images, setImages] = useState(['', '', '', '', '']); // 5 images
  const [voice, setVoice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (idx, val) => {
    const newImages = [...images];
    newImages[idx] = val;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Enter your name!');
      return;
    }
    if (images.some((img) => !img.trim())) {
      alert('All 5 image URLs are required!');
      return;
    }
    if (!voice.trim()) {
      alert('Voice URL is required!');
      return;
    }

    setLoading(true);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('userinputs')
        .insert([
          { username, image_urls: images }
        ])
        .select();

      if (error) throw error;

      const vmId = data[0].id;

      // Insert the voice record
      const { error: voiceError } = await supabase
        .from('voicerecords')
        .insert([
          { vm_id: vmId, username, voice_url: voice }
        ]);

      if (voiceError) throw voiceError;

      alert('VM created successfully!');
      navigate(`/vm/${vmId}`);
    } catch (err) {
      alert('Error creating VM: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Valentine VM</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {images.map((img, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Image URL ${idx + 1}`}
            value={img}
            onChange={(e) => handleImageChange(idx, e.target.value)}
          />
        ))}

        <input
          type="text"
          placeholder="Voice URL"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create VM'}
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;
