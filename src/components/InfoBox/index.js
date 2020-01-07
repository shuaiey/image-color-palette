import React from "react";
import styled from "styled-components";

const Box = styled.div`
  border: 1px dashed #000;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  white-space: pre-wrap;
  padding: 1.5rem;
  box-sizing: border-box;
  line-height: 1.5;
  overflow-x: auto;
`;

function InfoBox({ children }) {
  return <Box>{children}</Box>;
}

export default InfoBox;
