import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhoWeAreSection from './components/WhoWeAreSection'
import AboutSection from './components/AboutSection'
import useSmoothScroll from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <>
      <Navbar />

      <main className="bg-neutral-950 text-white">
        <Hero />
        <WhoWeAreSection />
        <AboutSection />
      </main>
    </>
  )
}

export default App