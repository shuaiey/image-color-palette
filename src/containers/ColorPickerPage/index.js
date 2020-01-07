import React, { useState, useRef } from "react";
import styled from "styled-components";
import Title from "../../components/Title";
import ImgUploadBox from "../../components/ImgUploadBox";
import Button from "../../components/Button";
import ColorBox from "../../components/ColorBox";
import InfoBox from "../../components/InfoBox";
import PickerMMCQ from "../../components/PickerMMCQ";
import PickerMCQ from "../../components/PickerMCQ";
import PickerKMC from "../../components/PickerKMC";
import PickerMKMC from "../../components/PickerMKMC";
import PickerOctree from "../../components/PickerOctree";
import PickerUniform from "../../components/PickerUniform";
import {
  _getImageData,
  _rgbArray2String,
  _rgbObj2String,
  _checkImgData
} from "../../utils/imageUtils";

const CenterDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 62rem;
`;

const A = styled.a`
  font-style: italic;
  color: #05f;
  :hover {
    color: blue;
  }
`;

const FlexBox = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin: 2rem 0;
`;

function ColorPickerPage() {
  const imgRef = useRef(null);
  // const [imgData, setImgData] = useState(null);
  const [UQ, setUQ] = useState({ mc: [], palette: [], info: {} });
  const [KMeans, setKMeans] = useState({ mc: [], palette: [], info: {} });
  const [MKMeans, setMKMeans] = useState({ mc: [], palette: [], info: {} });
  const [MMCQ, setMMCQ] = useState({ mc: [], palette: [], info: {} });
  const [MCQ, setMCQ] = useState({ mc: [], palette: [], info: {} });
  const [Octree, setOctree] = useState({ mc: [], palette: [], info: {} });

  const PickerWithUQ = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const UQ = new PickerUniform();
    const maxColor = 8;
    const swatch = UQ.getSwatch(imgData, maxColor);
    const swatchOptimized = UQ.getSwatchOptimized(imgData, maxColor);
    const mc = [_rgbObj2String(swatch.mc)];
    const palette = swatch.palette.map(c => _rgbObj2String(c));
    const info = [
      { time: swatch.info.time, desp: "without MinHeap" },
      { time: swatchOptimized.info.time, desp: "with MinHeap" }
    ];
    setUQ({ mc, palette, info });
  };

  const PickerWithKMeans = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const KMC = new PickerKMC();
    const k = 8;
    const swatch = KMC.censusColors(imgData, k);
    const mc = swatch.mc.map(c => _rgbObj2String(c));
    const palette = swatch.palette;
    const info = swatch.info;
    setKMeans({ mc, palette, info });
  };

  const PickerWithMKMeans = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const MKMC = new PickerMKMC();
    const k = 8;
    const swatch = MKMC.censusColors(imgData, k);
    const mc = swatch.mc.map(c => _rgbObj2String(c));
    const palette = swatch.palette;
    const info = swatch.info;
    setMKMeans({ mc, palette, info });
  };

  const PickerWithMMCQ = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const MMCQ = new PickerMMCQ();
    const swatch = MMCQ.getSwatch(imgData);
    let mc = [`rgb(${swatch.mc.join(",")})`];
    let palette = _rgbArray2String(swatch.palette);
    const info = swatch.info;
    setMMCQ({ mc, palette, info });
  };

  const PickerWithMCQ = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const MCQ = new PickerMCQ();
    const swatch = MCQ.getSwatch(imgData);
    let mc = [_rgbObj2String(swatch.mc)];
    let palette = swatch.palette.map(c => _rgbObj2String(c));
    const info = swatch.info;
    setMCQ({ mc, palette, info });
  };

  const PickerWithOctree = imgData => {
    imgData = _checkImgData(imgData);
    if (!imgData) return;
    const Octree = new PickerOctree();
    const swatch = Octree.getSwatch(imgData, 10);
    let mc = [swatch.mc];
    let palette = swatch.palette;
    const info = swatch.info;
    setOctree({ mc, palette, info });
  };

  const PickerWithAll = e => {
    var imgData = _checkImgData();
    if (!imgData) return;
    try {
      PickerWithUQ(imgData);
      PickerWithKMeans(imgData);
      PickerWithMCQ(imgData);
      PickerWithMMCQ(imgData);
      PickerWithMKMeans(imgData);
      PickerWithOctree(imgData);
    } catch {
      window.alert(
        "There is something wrong in caculating, please try again later."
      );
    }
  };

  return (
    <CenterDiv>
      <Title
        title="Many Methods To Get Color Palette of An Image"
        author="Echo Yang"
        created="Dec 01, 2019"
        updated="Dec 26, 2019"
      />
      <ImgUploadBox ref={imgRef} />

      <FlexBox>
        <Button onClick={PickerWithAll} reverse={"true"}>
          Try All Pickers
        </Button>
        <Button onClick={() => PickerWithUQ()}>Uniform</Button>
        <Button onClick={() => PickerWithKMeans()}>K Means Cluster</Button>
        <Button onClick={() => PickerWithMKMeans()}>
          Modified K Means Cluster
        </Button>
        <Button onClick={() => PickerWithMCQ()}>Median Cut</Button>
        <Button onClick={() => PickerWithMMCQ()}>Modified Median Cut</Button>
        <Button onClick={() => PickerWithOctree()}>Octree</Button>
      </FlexBox>

      <div className="picker">
        <h2># Method: Uniform/One-pass Quantization</h2>
        <p>Simple implementation by Echo Yang</p>
        <ColorBox mainColor={UQ.mc} palette={UQ.palette} />
        {/* <InfoBox>Process time: {UQ.info.time ? UQ.info.time : 0}ms</InfoBox> */}
        <InfoBox>
          Process time:{" "}
          {UQ.info.length > 0
            ? `${UQ.info[0].time} ms (${UQ.info[0].desp}), ${UQ.info[1].time} ms (${UQ.info[1].desp})`
            : 0}
        </InfoBox>
      </div>

      <div className="picker">
        <h2># Method: K Means Cluster</h2>
        <p>
          From{" "}
          <A className="link" href="https://github.com/woshizja/colorful-color">
            Colorful Color
          </A>{" "}
          by woshizja
        </p>
        <ColorBox mainColor={KMeans.mc} palette={KMeans.palette} />
        <InfoBox>
          Process time: {KMeans.info.time ? KMeans.info.time : 0}ms
        </InfoBox>
      </div>

      <div className="picker">
        <h2># Method: Modified K Means Cluster</h2>
        <p>
          Modification is based on{" "}
          <A className="link" href="https://github.com/woshizja/colorful-color">
            Colorful Color
          </A>{" "}
          by Echo
        </p>
        <ColorBox mainColor={MKMeans.mc} palette={MKMeans.palette} />
        <InfoBox>
          Process time: {MKMeans.info.time ? MKMeans.info.time : 0}ms
        </InfoBox>
      </div>

      <div className="picker">
        <h2># Method: Median Cut</h2>
        <p>
          From{" "}
          <A
            className="link"
            href="https://github.com/GoogleChromeLabs/sample-media-pwa"
          >
            Sample Media (VOD) App
          </A>{" "}
          by GoogleChromeLabs
        </p>
        <ColorBox mainColor={MCQ.mc} palette={MCQ.palette} />
        <InfoBox>Process time: {MCQ.info.time ? MCQ.info.time : 0}ms</InfoBox>
      </div>

      <div className="picker">
        <h2># Method: Modified Median Cut</h2>
        <p>
          From{" "}
          <A className="link" href="https://github.com/lokesh/color-thief">
            Color Thief
          </A>{" "}
          by <A href="https://lokeshdhakar.com/">Lokesh Dhakar</A>. Here is a{" "}
          <A href="https://lokeshdhakar.com/projects/color-thief/">
            {" "}
            Demo Link
          </A>
        </p>
        <ColorBox mainColor={MMCQ.mc} palette={MMCQ.palette} />
        <InfoBox>Process time: {MMCQ.info.time ? MMCQ.info.time : 0}ms</InfoBox>
      </div>

      <div className="picker">
        <h2># Method: Octree</h2>
        <p>
          From{" "}
          <A
            className="link"
            href="https://github.com/XadillaX/theme-color-test/blob/master/version3/octree.js"
          >
            Octree 主题色提取
          </A>{" "}
          by XadillaX
        </p>
        <ColorBox mainColor={Octree.mc} palette={Octree.palette} />
        <InfoBox>
          Process time: {Octree.info.time ? Octree.info.time : 0}ms
        </InfoBox>
      </div>

      <style jsx="true">
        {`
          .picker {
            margin-bottom: 3rem;
          }
        `}
      </style>
    </CenterDiv>
  );
}

export default ColorPickerPage;
