import { Carousel, Container } from 'react-bootstrap';

const MainCarousel = () => {
  return (
    <>
      <Container style={{ marginBottom: '100px'}}>
        <h2 className='mt-5'>찰칵! 당신의 순간을 담을게요.</h2>
        <Carousel>
          <Carousel.Item key='0'>
            <div className='imgBox'>
              <img className="d-block w-100" src='https://i.pinimg.com/564x/dd/71/24/dd7124e0166ca29e5483c4299c723b6d.jpg' alt='img_0'/>
            </div>
          </Carousel.Item>
          <Carousel.Item key='1'>
            <div className='imgBox'>
              <img className="d-block w-100" src='https://i.pinimg.com/564x/dd/71/24/dd7124e0166ca29e5483c4299c723b6d.jpg' alt='img_1'/>
            </div>
          </Carousel.Item>
          </Carousel>
      </Container>
    </>
  )

};

export default MainCarousel;
