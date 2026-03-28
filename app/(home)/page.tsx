import FeaturedProducts from '@/components/home/FeaturedProducts';
import Hero from '@/components/home/Hero';
import Container from '@/components/global/Container';

function HomePage() {
  return (
    <>
      <Hero />
      <Container className='py-20'>
      <FeaturedProducts />
      </Container>
    </>
  );
}

export default HomePage;
