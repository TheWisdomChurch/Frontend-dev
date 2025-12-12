import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const DangerButton : React.FC<ButtonProps> = (props) => (
  <Button variant="danger" {...props} />
);

export default DangerButton;
