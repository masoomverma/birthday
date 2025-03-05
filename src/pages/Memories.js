import React from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';

// Simple array of memories combining both images and videos
const MEMORIES = [
  // Images
  { 
    id: 1, 
    type: 'image',
    source: '/assets/images/memory1.jpg', 
    caption: 'Our first day together!' 
  },
  { 
    id: 2, 
    type: 'image',
    source: '/assets/images/memory2.jpg', 
    caption: 'Remember this adventure?' 
  },
  { 
    id: 3, 
    type: 'image',
    source: '/assets/images/memory3.jpg', 
    caption: 'That special celebration!' 
  },
  // Videos
  { 
    id: 4, 
    type: 'video',
    source: '/assets/videos/memory1.mp4', 
    caption: 'That time we couldn\'t stop laughing!' 
  },
  { 
    id: 5, 
    type: 'image',
    source: '/assets/images/memory4.jpg', 
    caption: 'One of my favorite moments' 
  },
  { 
    id: 6, 
    type: 'video',
    source: '/assets/videos/memory2.mp4', 
    caption: 'Dancing like nobody\'s watching!' 
  }
];

const Memories = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/ques');
  };
  
  // Render either image or video based on type
  const renderMedia = (memory) => {
    if (memory.type === 'image') {
      return (
        <img 
          src={memory.source} 
          alt={memory.caption} 
          className="memory-img"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x200?text=Memory`;
          }}
        />
      );
    } else if (memory.type === 'video') {
      return (
        <video 
          className="memory-video" 
          controls
          preload="metadata"
          onError={(e) => {
            e.target.parentNode.innerHTML = 'Video unavailable';
          }}
        >
          <source src={memory.source} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };
  
  return (
    <div className="glass-container">
      <h1 className="title">Our Special Memories 💖</h1>
      
      <DialogueBox 
        animal="bear" 
        message="Here are Masoom's favorite moments with you, U! I hope they bring back wonderful memories."
      />
      
      <div className="memories-grid">
        {MEMORIES.map(memory => (
          <div key={memory.id} className="memory-card">
            {renderMedia(memory)}
            <p style={{ 
              textAlign: 'center', 
              padding: '10px',
              background: 'rgba(255,255,255,0.5)',
              margin: '0' 
            }}>
              {memory.caption}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button className="btn" onClick={handleContinue}>
          Few Questions
        </button>
      </div>
    </div>
  );
};

export default Memories;
