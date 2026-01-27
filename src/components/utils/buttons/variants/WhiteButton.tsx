import React from 'react';
import Button, { ButtonProps } from '../CustomButton';

const WhiteButton : React.FC<ButtonProps> = (props) => (
  <Button variant="outline"
style={{
  backgroundColor: "white",
  color: "black",
  border: "1px solid #e5e5e5",
}} {...props} />
);

export default WhiteButton;
