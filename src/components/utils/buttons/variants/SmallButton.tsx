import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const SmallButton : React.FC<ButtonProps> = (props) => (
  <Button size="sm" {...props} />
);

export default SmallButton;
