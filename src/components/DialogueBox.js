import React from 'react';

const animals = {
  cat: {
    name: 'Whiskers',
    icon: '/assets/cat-icon.png',
    color: 'rgba(255, 222, 173, 0.7)'
  },
  bunny: {
    name: 'Hoppy',
    icon: '/assets/bunny-icon.png',
    color: 'rgba(255, 182, 193, 0.7)'
  },
  bear: {
    name: 'Teddy',
    icon: '/assets/bear-icon.png',
    color: 'rgba(222, 184, 135, 0.7)'
  },
  penguin: {
    name: 'Waddles',
    icon: '/assets/penguin-icon.png',
    color: 'rgba(173, 216, 230, 0.7)'
  }
};

const DialogueBox = ({ animal = 'bunny', message, children }) => {
  const animalData = animals[animal] || animals.bunny;
  
  return (
    <div className="dialogue-box" style={{ backgroundColor: animalData.color }}>
      <div className="dialogue-header">
        <img 
          src={animalData.icon} 
          alt={`${animalData.name} icon`} 
          className="animal-icon"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80?text=' + animalData.name;
          }}
        />
        <h3>{animalData.name} says:</h3>
      </div>
      
      <p>{message}</p>
      
      {children && (
        <div className="dialogue-actions">
          {children}
        </div>
      )}
    </div>
  );
};

export default DialogueBox;
