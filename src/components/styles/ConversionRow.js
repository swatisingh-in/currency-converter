import styled from 'styled-components';

const ConversionRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  @media (min-width: 600px) {
    flex-direction: unset;
    padding: 24px;
  }
`;

export default ConversionRow;
