import React from 'react';

// Enhanced with actual animal pictures
const animals = {
  cat: {
    name: 'Whiskers',
    image: '/assets/animals/cat.png',
    color: 'rgba(255, 222, 173, 0.7)'
  },
  bunny: {
    name: 'Hoppy',
    image: '/assets/animals/bunny.png',
    color: 'rgba(255, 182, 193, 0.7)'
  },
  bear: {
    name: 'Teddy',
    image: '/assets/animals/bear.png',
    color: 'rgba(222, 184, 135, 0.7)'
  },
  penguin: {
    name: 'Waddles',
    image: '/assets/animals/penguin.png',
    color: 'rgba(173, 216, 230, 0.7)'
  }
};

const DialogueBox = ({ animal = 'bunny', message, children }) => {
  const animalData = animals[animal] || animals.bunny;
  
  return (
    <div className="dialogue-box" style={{ backgroundColor: animalData.color }}>
      <div className="dialogue-header">
        <img 
          src={animalData.image} 
          alt={`${animalData.name}`} 
          className="animal-icon"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onError={(e) => {
            // Fallbacks for each animal if the image fails to load
            const fallbacks = {
              cat: 'https://img.icons8.com/color/96/000000/cat--v1.png',
              bunny: 'https://img.icons8.com/color/96/000000/rabbit.png',
              bear: 'https://img.icons8.com/color/96/000000/bear.png',
              penguin: 'https://img.icons8.com/color/96/000000/penguin.png'
            };
            e.target.src = fallbacks[animal] || 'https://via.placeholder.com/80?text=' + animalData.name;
          }}
        />
        <h3>{animalData.name} says:</h3>
      </div>
      
      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.5',
        margin: '10px 0'
      }}>{message}</p>
      
      {children && (
        <div className="dialogue-actions">
          {children}
        </div>
      )}
    </div>
  );
};

export default DialogueBox;
