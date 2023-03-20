import React, { useState } from 'react';
import styled from 'styled-components';
import { ServiceMainData } from './ServiceMainData';
import ServiceFaq from './ServiceFaq';
import ServiceTermsOfUse from './ServiceTermsOfUse';
import ServicePrivacyPolicy from './ServicePrivacyPolicy';

const Service = () => {
  const [content, setContent] = useState('Faq');

  const handleClickButton = e => {
    const { name } = e.target;
    setContent(name);
  };
  
  const selectComponent = {
    Faq: <ServiceFaq />,
    TermsOfUse: <ServiceTermsOfUse />,
    PrivacyPolicy: <ServicePrivacyPolicy />,
  };

  return (
    <div>
      <Container>
        {ServiceMainData.map(data => {
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

export default Service;

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
