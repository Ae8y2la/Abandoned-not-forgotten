import React from 'react';

const PLANET_IMAGES = {
  moon: {
    src: '/assets/planet-moon-isolated.png',
    alt: 'Rotating Moon',
  },
  mars: {
    src: '/assets/planet-mars-isolated.png',
    alt: 'Rotating Mars',
  },
  voyager: {
    src: '/assets/planet-voyager.png',
    alt: 'Floating Voyager spacecraft',
  },
};

export default function PlanetIcon({ type, hovered, reducedMotion, hidden }) {
  const image = PLANET_IMAGES[type];
  const isPaused = reducedMotion || hidden;

  return (
    <span
      className={[
        'planet-icon',
        `planet-icon--${type}`,
        hovered ? 'planet-icon--hovered' : '',
        isPaused ? 'planet-icon--paused' : '',
      ].filter(Boolean).join(' ')}
    >
      <img src={image.src} alt="" draggable="false" />
    </span>
  );
}
