import React from "react";
import styled from "styled-components";

const SwatchDIV = styled.div`
  display: inline-block;
  background: #afafaf;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  margin-right: 0.4rem;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  &.placeholder span {
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.6rem;
  }
`;

function Swatch({ color, placeholder }) {
  return placeholder ? (
    <SwatchDIV className="placeholder">
      {" "}
      <span>P</span>{" "}
    </SwatchDIV>
  ) : (
    <SwatchDIV className="swatch" style={{ backgroundColor: color }} />
  );
}

export default Swatch;
