import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const OutlineButton : React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);

export default OutlineButton;
