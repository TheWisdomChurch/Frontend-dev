import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const YellowButton : React.FC<ButtonProps> = (props) => (
  <Button variant="accent-yellow" {...props} />
);

export default YellowButton;
