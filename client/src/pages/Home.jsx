import Hero from '../components/Hero'
import About from '../components/About'
import CategoriesSection from '../components/CategoriesSection'
import BlogPreview from '../components/BlogPreview'
import CommunitiesSection from '../components/CommunitiesSection'
import HallOfFame from '../components/HallOfFame'
import JoinSection from '../components/JoinSection'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CategoriesSection />
      <BlogPreview />
      <HallOfFame />
      <CommunitiesSection />
      <JoinSection />
    </>
  )
}
