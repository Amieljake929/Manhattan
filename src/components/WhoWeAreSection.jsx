import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'

gsap.registerPlugin(ScrollTrigger)

// When you have the real photo, put it in /public/who-we-are/ and set the path here.
// Example: const WHO_IMAGE = '/who-we-are/who.jpg'
const WHO_IMAGE = null

// Placeholder numbers: replace later
const stats = [
  { value: '00+', label: 'Years of experience' },
  { value: '000', label: 'Homes delivered' },
  { value: '00', label: 'Awards' },
]

export default function WhoWeAreSection() {
  const sectionRef = useRef(null)
  const mediaRef = useRef(null)

  /* Gentle parallax inside the image frame */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mediaRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="who-we-are"
      data-nav-theme="light"
      className="relative w-full bg-white text-neutral-900"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-[6vw] md:px-[9vw] md:py-[10vw]">
        {/* Text */}
        <div>
          <Reveal>
            <p className="text-xs font-light uppercase tracking-[0.3em] text-neutral-500 md:text-sm">
              Who we are
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-5 text-[clamp(28px,3.6vw,64px)] font-light uppercase leading-[1.1] tracking-[0.04em]">
              Placeholder headline about Manhattan
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[520px] text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-4 max-w-[520px] text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>
          </Reveal>

          <div className="mt-12 grid max-w-[520px] grid-cols-3 gap-4 border-t border-neutral-200 pt-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.15 * i}>
                <p className="text-2xl font-light md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-[11px] font-light uppercase tracking-[0.15em] text-neutral-500 md:text-xs">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Image */}
        <Reveal y={60}>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
            <div
              ref={mediaRef}
              className="absolute -inset-[10%] will-change-transform"
            >
              {WHO_IMAGE ? (
                <img
                  src={WHO_IMAGE}
                  alt="Who we are"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-500">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="9.5" r="1.5" />
                    <path d="M21 16l-5-5-9 9" />
                  </svg>
                  <span className="text-xs font-light uppercase tracking-[0.25em]">
                    Placeholder image
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}