import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ showAlert }) => {
  const [slot, setSlot] = useState("Slot 1");
  const navigate = useNavigate();

  const handleStart = () => {
    const formattedSlot = slot.replace(" ", "_").toLowerCase();
    navigate(`/${formattedSlot}`);
  };

  return (
    <div>
    
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to the Round 1</h1>
      <p style={{fontSize:"20px"}}>Select Slot</p>
      <select value={slot} onChange={(e) => setSlot(e.target.value)} style={{ padding: "10px", marginBottom: "10px" }}>
        {[...Array(10).keys()].map((i) => (
          <option key={i + 1} value={`Slot ${i + 1}`}>{`Slot ${i + 1}`}</option>
        ))}
      </select>
      <br />
      <button onClick={handleStart} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Submit
      </button>
    </div>
    </div>
  );
};

export default HomePage;
