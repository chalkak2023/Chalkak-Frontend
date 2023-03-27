import React, { useState } from 'react';
import styled from 'styled-components';
import { GuideMainData } from './GuideMainData';
import GuideFaq from './GuideFaq';
import GuideTermsOfUse from './GuideTermsOfUse';
import GuidePrivacyPolicy from './GuidePrivacyPolicy';

const Guide = () => {
  const [content, setContent] = useState('Faq');

  const handleClickButton = e => {
    const { name } = e.target;
    setContent(name);
  };

  const selectComponent = {
    Faq: <GuideFaq />,
    TermsOfUse: <GuideTermsOfUse />,
    PrivacyPolicy: <GuidePrivacyPolicy />,
  };

  return (
    <div>
      <Container>
        {GuideMainData.map(data => {
          return (
            <Button onClick={handleClickButton} name={data.name} key={data.id}>
              {data.text}
            </Button>
          );
        })}
      </Container>
      {content && <Content>{selectComponent[content]}</Content>}
    </div>
  );
};

export default Guide;

const Container = styled.div`
text-align: center;
  font-size: 18px;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  margin-right: 4rem;
  color: white;
  background-color: black;
  border-radius: 3rem;
`;

const Content = styled.div`
  text-align: center;
  font-size: 18px;
  line-height: 1.5;
  border-radius: 1rem;
  margin-top: 10rem;
  margin: 9rem;
  background-color: white;
  padding: 2rem
`;
