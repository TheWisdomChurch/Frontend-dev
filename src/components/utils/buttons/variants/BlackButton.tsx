import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const BlackButton : React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props} />
);

export default BlackButton;
