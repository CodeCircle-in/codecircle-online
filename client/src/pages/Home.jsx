import Hero from '../components/Hero'
import About from '../components/About'
import CategoriesSection from '../components/CategoriesSection'
import BlogPreview from '../components/BlogPreview'
import CommunitiesSection from '../components/CommunitiesSection'
import HallOfFame from '../components/HallOfFame'
import RecentUploads from '../components/RecentUploads'
import JoinSection from '../components/JoinSection'
import Seo from '../components/Seo'

export default function Home() {
  return (
    <>
      <Seo
        title="Student Tech Community"
        description="Join CodeCircle to explore student-friendly tech resources, blog posts, contributors, internships, AI, Linux, cybersecurity, open source, and more."
        path="/"
      />
      <Hero />
      <RecentUploads />
      <About />
      <CategoriesSection />
      <BlogPreview />
      <HallOfFame />
      <CommunitiesSection />
      <JoinSection />
    </>
  )
}
