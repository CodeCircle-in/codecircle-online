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
        title="CodeCircle | Student Tech Community & Developer Resources | CodeCircle.online"
        description="CodeCircle (Code Circle / CodeCircle.online) is the premier student tech community for student developers. Discover curated coding resources, tutorials, tech blogs, internships, AI/ML, Linux guides, cybersecurity, open source projects, and verified credentials."
        keywords="CodeCircle, Code Circle, code circle, codecircle, CodeCircle.online, codecircle.online, Code Circle Online, student tech community, student developer community, student coding resources, internships for students, tech blog for students, learn programming, Devidas Chinnarathod"
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
