import React from 'react';

const animals = {
  cat: {
    name: 'Whiskers',
    image: 'https://img.icons8.com/color/96/000000/cat--v1.png',
    color: 'rgba(255, 222, 173, 0.7)'
  },
  bunny: {
    name: 'Hoppy',
    image: 'https://img.icons8.com/color/96/000000/rabbit.png',
    color: 'rgba(255, 182, 193, 0.7)'
  },
  bear: {
    name: 'Teddy',
    image: 'https://img.icons8.com/color/96/000000/bear.png',
    color: 'rgba(222, 184, 135, 0.7)'
  },
  penguin: {
    name: 'Waddles',
    image: 'https://img.icons8.com/color/96/000000/penguin.png',
    color: 'rgba(173, 216, 230, 0.7)'
  },
  dog: {
    name: 'Buddy',
    image: 'https://img.icons8.com/color/96/000000/dog.png',
    color: 'rgba(210, 180, 140, 0.7)'
  },
  fox: {
    name: 'Foxy',
    image: 'https://img.icons8.com/color/96/000000/fox.png',
    color: 'rgba(249, 201, 181, 0.7)'
  },
  owl: {
    name: 'Hootie',
    image: 'https://img.icons8.com/color/96/000000/owl.png',
    color: 'rgba(188, 143, 143, 0.7)'
  },
  elephant: {
    name: 'Ellie',
    image: 'https://img.icons8.com/color/96/000000/elephant.png',
    color: 'rgba(169, 169, 169, 0.7)'
  },
  panda: {
    name: 'Bamboo',
    image: 'https://img.icons8.com/color/96/000000/panda.png',
    color: 'rgba(220, 220, 220, 0.7)'
  },
  lion: {
    name: 'Roary',
    image: 'https://img.icons8.com/color/96/000000/lion.png',
    color: 'rgba(255, 215, 0, 0.7)'
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
            // Backup options if the main image fails
            const backups = [
              'https://via.placeholder.com/80?text=' + animalData.name,
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="%23f0f0f0" stroke="%23ddd" stroke-width="2"/><text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" dy=".3em" fill="%23666">' + animalData.name + '</text></svg>'
            ];
            
            e.target.src = backups[0];
            e.target.onerror = () => {
              e.target.src = backups[1];
              e.target.onerror = null;
            };
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
