import React from "react";
import styled from "styled-components";

const MyButton = styled.button`
  border: none;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: rgb(0, 0, 0, 0.1);
  &.reverse {
    color: white;
    background-color: #000;
  }
`;

function Button(props) {
  const { onClick, children, color, reverse } = props;
  return (
    <MyButton
      className={reverse ? "reverse" : ""}
      onClick={onClick}
      style={{ backgroundColor: color }}
    >
      {children}
    </MyButton>
  );
}

export default Button;
