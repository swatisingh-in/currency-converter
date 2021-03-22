import styled from 'styled-components';
import BackGroundImage from '../../images/background.jpeg';

const ConversionContainer = styled.section`
  background: linear-gradient(180deg, #000000 0%, rgba(34, 34, 34, 0.38) 100%), url(${BackGroundImage});
  box-shadow: 0px 3px 11px 4px rgba(0, 0, 0, 0.26);
  border-radius: 10px;
  padding: 16px;

  @media (min-width: 600px) {
    padding: 24px 50px 50px;
  }
`;

export default ConversionContainer;
