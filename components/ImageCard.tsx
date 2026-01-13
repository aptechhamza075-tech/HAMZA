
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  isActive: boolean;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300
        ${isActive ? 'border-red-500 scale-[1.02] shadow-lg shadow-red-500/20' : 'border-white/10 hover:border-white/30'}
      `}
    >
      <img 
        src={image.url} 
        alt={image.prompt} 
        className="w-full aspect-[3/4] object-cover" 
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white/80 line-clamp-1 italic">"{image.prompt}"</p>
      </div>
      {isActive && (
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
      )}
    </div>
  );
};

export default ImageCard;
