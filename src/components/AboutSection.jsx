import Reveal from './Reveal'

// When you have the real photo, put it in /public/about/ and set the path here.
// Example: const ABOUT_IMAGE = '/about/about.jpg'
const ABOUT_IMAGE = null

// Placeholder values: replace later
const values = [
  {
    number: '01',
    title: 'Placeholder value',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.',
  },
  {
    number: '02',
    title: 'Placeholder value',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
  },
  {
    number: '03',
    title: 'Placeholder value',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      data-nav-theme="light"
      className="relative w-full bg-[#f5f5f3] text-neutral-900"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-[9vw] md:py-[10vw]">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-[6vw]">
          {/* Image (left) */}
          <Reveal y={60}>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
              {ABOUT_IMAGE ? (
                <img
                  src={ABOUT_IMAGE}
                  alt="About Manhattan"
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
          </Reveal>

          {/* Text (right) */}
          <div>
            <Reveal>
              <p className="text-xs font-light uppercase tracking-[0.3em] text-neutral-500 md:text-sm">
                About
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-5 text-[clamp(28px,3.2vw,56px)] font-light uppercase leading-[1.1] tracking-[0.04em]">
                Placeholder about headline
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-[520px] text-base font-light leading-relaxed text-neutral-600 md:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid gap-10 border-t border-neutral-300 pt-10 md:mt-[6vw] md:grid-cols-3 md:gap-[4vw]">
          {values.map((item, i) => (
            <Reveal key={item.number} delay={0.12 * i}>
              <p className="text-sm font-light tracking-[0.2em] text-neutral-400">
                {item.number}
              </p>
              <h3 className="mt-4 text-lg font-light uppercase tracking-[0.12em] md:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-base font-light leading-relaxed text-neutral-600">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}