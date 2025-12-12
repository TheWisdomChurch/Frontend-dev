import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const FullWidthButton : React.FC<ButtonProps> = (props) => (
  <Button fullWidth {...props} />
);

export default FullWidthButton;
