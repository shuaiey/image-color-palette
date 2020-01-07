import React from "react";
import Swatch from "./Swatch";
import styled from "styled-components";

const FlexBox = styled.div`
  display: flex;
  .main-color {
    flex: 0 1 16rem;
    margin-right: 2rem;
  }
  .color-palette {
  }
  h3 {
    margin-top: 0;
  }
`;

function ColorBox({ mainColor, palette }) {
  return (
    <FlexBox>
      <div className="main-color">
        <h3>Main Color</h3>
        <div className="swatches">
          {mainColor.length !== 0 ? (
            mainColor.map((c, index) => <Swatch color={c} key={index} />)
          ) : (
            <Swatch placeholder={true} />
          )}
        </div>
      </div>
      <div className="color-palette">
        <h3>Color Palette</h3>
        <div className="swatches">
          {palette.length !== 0 ? (
            palette.map((c, index) => <Swatch color={c} key={index} />)
          ) : (
            <>
              <Swatch placeholder={true} />
              <Swatch placeholder={true} />
              <Swatch placeholder={true} />
            </>
          )}
        </div>
      </div>
    </FlexBox>
  );
}

export default ColorBox;
