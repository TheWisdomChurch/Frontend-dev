import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const LargeButton : React.FC<ButtonProps> = (props) => (
  <Button size="lg" {...props} />
);

export default LargeButton;
