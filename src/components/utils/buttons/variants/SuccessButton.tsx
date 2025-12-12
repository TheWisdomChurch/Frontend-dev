import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const SuccessButton : React.FC<ButtonProps> = (props) => (
  <Button style={{
  backgroundColor: "#16a34a",
  color: "white",
}} {...props} />
);

export default SuccessButton;
