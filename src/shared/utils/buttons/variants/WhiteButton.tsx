import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const WhiteButton: React.FC<ButtonProps> = props => (
  <Button
    variant="ghost"
    className="border border-[#e5e5e5] bg-white text-black hover:bg-white/90"
    {...props}
  />
);

export default WhiteButton;
