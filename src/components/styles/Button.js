import styled from 'styled-components';

const Button = styled.button`
  background: ${({ icon }) => `url(${icon})`};
  border: none;
  cursor: pointer;
  height: 48px;
  margin: 12px 20px 0;
  outline: 0;
  width: 48px;
`;

export default Button;
