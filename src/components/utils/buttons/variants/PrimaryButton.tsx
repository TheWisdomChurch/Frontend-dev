import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const PrimaryButton : React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props} />
);

export default PrimaryButton;
