import styled from 'styled-components';

const GraphContainer = styled.section`
  background: linear-gradient(0deg, #FFFFFF, #FFFFFF);
  box-shadow: 0px 3px 11px 4px rgba(0, 0, 0, 0.26);
  border-radius: 10px;
  margin: 16px;
  max-width: 1200px;
  padding: 16px;

  canvas {
    width: 100% !important;
  }
  
  @media (min-width: 600px) {
    margin: 50px auto;
    padding: 32px;
  }

`;

export default GraphContainer;
