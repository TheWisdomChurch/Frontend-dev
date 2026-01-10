import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const GrayButton : React.FC<ButtonProps> = (props) => (
  <Button variant="secondary" {...props} />
);

export default GrayButton;
