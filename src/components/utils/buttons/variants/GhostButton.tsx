import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const GhostButton : React.FC<ButtonProps> = (props) => (
  <Button variant="ghost" {...props} />
);

export default GhostButton;
