import { useEffect, useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import apiAxios from '../../utils/api-axios';

const MainCarousel = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getRandomPhoto();
  }, []);

  return (
    <>
      <Container style={{ marginBottom: '100px'}}>
        <h2 className='mt-5'>찰칵! 당신의 순간을 담을게요.</h2>
        <Carousel>
          {
            photos.length > 0 ?
            photos.map((photo, i) => (
                <Carousel.Item className='mainCarousel' key={i}>
                  <div className='imgBox' style={{ backgroundColor: 'transparent' }}>
                    <img className="d-block w-100" src={photo.image} alt={i}/>
                  </div>
                </Carousel.Item>
            )) :
            <h3 style={{ backgroundColor: 'transparent' }}>등록된 포토스팟이 없습니다.</h3>
          }
        </Carousel>
      </Container>
    </>
  )

  function getRandomPhoto() {
    apiAxios
      .get(`/api/photospots/random`)
      .then(({ status, data }) => {
        if (status === 200) {
          setPhotos(data);
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
};

export default MainCarousel;
