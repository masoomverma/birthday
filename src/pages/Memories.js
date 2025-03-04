import React from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';

// This would be replaced with actual memory data
const MEMORIES = [
  { id: 1, image: '/assets/memories/memory1.jpg', caption: 'Remember this day?' },
  { id: 2, image: '/assets/memories/memory2.jpg', caption: 'Such a fun time!' },
  { id: 3, image: '/assets/memories/memory3.jpg', caption: 'One of my favorites!' },
  { id: 4, image: '/assets/memories/memory4.jpg', caption: 'Classic Masoom!' },
  { id: 5, image: '/assets/memories/memory5.jpg', caption: 'Great memories!' },
  { id: 6, image: '/assets/memories/memory6.jpg', caption: 'Unforgettable!' },
];

const Memories = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/feedback');
  };
  
  return (
    <div className="glass-container">
      <h1 className="title">Special Memories 💖</h1>
      
      <DialogueBox 
        animal="bear" 
        message="Here are some of our favorite moments with you. Each one is special, just like you!"
      />
      
      <div className="memories-grid">
        {MEMORIES.map(memory => (
          <div key={memory.id} className="memory-card">
            <img 
              src={memory.image} 
              alt={`Memory ${memory.id}`} 
              className="memory-img"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x200?text=Memory+${memory.id}`;
              }}
            />
            <p style={{ textAlign: 'center', padding: '10px' }}>{memory.caption}</p>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button className="btn" onClick={handleContinue}>
          Continue to Next Surprise! 🎁
        </button>
      </div>
    </div>
  );
};

export default Memories;
