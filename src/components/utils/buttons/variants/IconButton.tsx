import React from "react";
import Button, { ButtonProps } from "../CustomButton";

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, children, ...props }) => (
  <Button leftIcon={icon} {...props}>
    {children}
  </Button>
);

export default IconButton;
