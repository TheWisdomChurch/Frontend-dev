import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const OrangeButton : React.FC<ButtonProps> = (props) => (
  <Button variant="accent-orange" {...props} />
);

export default OrangeButton;
