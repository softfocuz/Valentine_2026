import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Viewer = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVM = async () => {
      const { data: vmData, error: vmError } = await supabase
        .from("userinputs")
        .select("*")
        .eq("id", id)
        .single();
      if (vmError) return alert("Error fetching VM: " + vmError.message);

      setImages(vmData.image_urls);

      const { data: voiceData, error: voiceError } = await supabase
        .from("voicerecords")
        .select("*")
        .eq("vm_id", id)
        .single();
      if (voiceError) return alert("Error fetching voice: " + voiceError.message);

      setVoiceUrl(voiceData.voice_url);
      setLoading(false);
    };
    fetchVM();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="viewer-container">
      <h2>Valentine VM</h2>
      <div className="carousel">
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`image ${idx + 1}`} />
        ))}
      </div>
      <audio controls src={voiceUrl}></audio>
    </div>
  );
};

export default Viewer;
