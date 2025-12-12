import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const XLargeButton : React.FC<ButtonProps> = (props) => (
  <Button size="xl" {...props} />
);

export default XLargeButton;
