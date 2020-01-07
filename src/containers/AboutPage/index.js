import React from "react";
import Title from "../../components/Title";
import styled from "styled-components";

const Article = styled.div`
  max-width: 870px;
  margin: 0 auto;
`;
const Body = styled.div`
  margin: 0 20px;
`;

const Section = styled.h2`
  text-align: center;
  margin-top: 40px;
  margin-bottom: 30px;
`;

const Para = styled.div`
  line-height: 1.5rem;
`;

function AboutPage(props) {
  return (
    <Article>
      <Title
        title="About This"
        author="Echo Yang"
        created="Dec 26, 2019"
        updated="null"
      />

      <Section>Introduction</Section>
      <Para>
        <p>
          There are three motivations behind this example. First, I am a
          colour-lover. Second, I am a science/tech/facts-lover. Third, I love
          to combine Technologies and Art.
        </p>
        <p>
          Even though there have been already hunderds of implementations on
          this topic, my examples here are based on these wonderful
          implementations and they are my approaches to learn about how to get
          main colors from a picture.
        </p>
        <p>
          "<u>Get color palette from an image</u>" in scientific terminology, is
          called <b>Color Quantization</b>. Color quantization is the process of
          reducing an image with thousands or millions of colors to one with
          fewer. The trick is to balance speed, cpu and memory requirements
          while minimizing the perceptual loss in output quality. (rosetta) More
          info can be found on wikipedia. Various algorithms can be found on
          rosettacode.org.
        </p>
      </Para>
      <Section>One-pass Quantization</Section>
      <Para>
        <p>
          The most intuitive and simplest way is a fixed color partitioning. The
          term, one-pass quantization, is from Leptonica, some also call it{" "}
          <b>Uniform Quantization</b>.
        </p>
        <p>
          In my implemenation, I simply divide r/g/b color channels into larger
          segmentations (default is r8/g8/b4, means partition color space into
          256 blocks). Then categorise every pixel into the blocks, finally
          sorting blocks by count, take the first several (maxColor) as result.
        </p>
      </Para>
    </Article>
  );
}

export default AboutPage;
