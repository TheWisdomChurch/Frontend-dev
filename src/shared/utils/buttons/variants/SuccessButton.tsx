import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const SuccessButton: React.FC<ButtonProps> = props => (
  <Button
    variant="ghost"
    className="bg-[#16a34a] text-white hover:bg-[#15803d]"
    {...props}
  />
);

export default SuccessButton;
