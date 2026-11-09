import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Don't refresh on mobile address-bar show/hide (a source of jitter)
ScrollTrigger.config({ ignoreMobileResize: true })

// How far the logo group travels down in video mode, as a % of the hero height.
// (Figma: logo center 30.1% in image mode -> 48.9% in video mode)
const VIDEO_SHIFT = 18.76

// How far MANHATTAN + tagline drift UP while you scroll through the hero,
// as a % of the hero height. 0 = fully pinned, bigger = moves more.
const LOGO_DRIFT = 7

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const PauseIcon = () => (
  <svg {...iconProps}>
    <path d="M9 5v14M15 5v14" />
  </svg>
)

const PlayIcon = () => (
  <svg {...iconProps}>
    <path d="M7 4.5v15l12-7.5-12-7.5z" />
  </svg>
)

const MutedIcon = () => (
  <svg {...iconProps}>
    <path d="M4 9.5v5h4l5 4v-13l-5 4H4z" />
    <path d="M17 9.5l4 5M21 9.5l-4 5" />
  </svg>
)

const SoundIcon = () => (
  <svg {...iconProps}>
    <path d="M4 9.5v5h4l5 4v-13l-5 4H4z" />
    <path d="M16.5 9a4.5 4.5 0 010 6M19 6.5a8 8 0 010 11" />
  </svg>
)

const VideoCamIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="M16 10.5l5-3v9l-5-3z" />
  </svg>
)

const ImageIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="9.5" r="1.5" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)

export default function Hero() {
  const wrapperRef = useRef(null)
  const skyRef = useRef(null)
  const skyImgRef = useRef(null)
  const logoLayerRef = useRef(null)
  const travelRef = useRef(null)
  const logoImgRef = useRef(null)
  const taglineRef = useRef(null)
  const exploreRef = useRef(null)
  const houseImgRef = useRef(null)
  const fabRef = useRef(null)
  const videoRef = useRef(null)
  const userPausedRef = useRef(false)
  const firstModeRun = useRef(true)

  const [mode, setMode] = useState('image') // 'image' | 'video'
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [heroInView, setHeroInView] = useState(true)

  /* ---------- Scroll parallax + intro animation ---------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* The sky drifts down slowly. The logo layer is pinned to the screen
         (see .hero-pin in index.css) and only drifts up a little, so the
         house (1x speed) still overtakes it and covers it. */
      gsap
        .timeline({
          defaults: { ease: 'none', force3D: true },
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
        .to(skyRef.current, { yPercent: 60 }, 0)
        .to(logoLayerRef.current, { yPercent: -LOGO_DRIFT }, 0)

      const clear = 'opacity,transform'
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

      intro
        .from(
          skyImgRef.current,
          { scale: 1.15, duration: 2.2, clearProps: 'transform' },
          0,
        )
        .from(
          houseImgRef.current,
          { yPercent: 18, opacity: 0, duration: 1.6, clearProps: clear },
          0.1,
        )
        .from(
          logoImgRef.current,
          { y: 50, opacity: 0, duration: 1.4, clearProps: clear },
          0.35,
        )
        .from(
          taglineRef.current,
          { y: 20, opacity: 0, duration: 1.1, clearProps: clear },
          0.85,
        )
        .from(
          exploreRef.current,
          { y: 16, opacity: 0, duration: 1, clearProps: clear },
          1.05,
        )
        .from(
          fabRef.current,
          {
            scale: 0.6,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.7)',
            clearProps: clear,
          },
          1.2,
        )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  /* ---------- Logo + tagline glide when switching image <-> video ---------- */
  useEffect(() => {
    if (firstModeRun.current) {
      firstModeRun.current = false
      return
    }

    const layer = logoLayerRef.current
    const toVideo = mode === 'video'

    // lift the logo above the video layer right away
    if (toVideo) gsap.set(layer, { zIndex: 35 })

    const tween = gsap.to(travelRef.current, {
      yPercent: toVideo ? VIDEO_SHIFT : 0,
      duration: 1.2,
      ease: 'power3.inOut',
      force3D: true,
      overwrite: 'auto',
      onComplete: () => {
        // back under the house once it has returned to its image position
        if (!toVideo) gsap.set(layer, { zIndex: 10 })
      },
    })

    return () => tween.kill()
  }, [mode])

  /* ---------- Show the FAB only while the hero is on screen ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  /* ---------- Video: lazy load, play in video mode, pause otherwise ---------- */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (mode !== 'video') {
      video.pause()
      return
    }

    // first time: start downloading the file
    if (video.preload !== 'auto') {
      video.preload = 'auto'
      video.load()
    }

    let visible = true
    const sync = () => {
      if (visible && !userPausedRef.current) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0.25 },
    )

    observer.observe(video)
    sync()

    return () => observer.disconnect()
  }, [mode])

  /* ---------- Controls ---------- */
  const toggleMode = () => {
    if (mode === 'image') userPausedRef.current = false
    setMode((m) => (m === 'image' ? 'video' : 'image'))
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      userPausedRef.current = false
      video.play().catch(() => {})
    } else {
      userPausedRef.current = true
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  const isVideo = mode === 'video'

  const roundButton =
    'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:opacity-70'

  const taglineClass =
    'whitespace-nowrap text-[clamp(9px,2.6vw,12px)] font-light uppercase tracking-[0.2em] text-white md:text-[clamp(11px,1.1vw,22px)]'

  return (
    <>
      <section
        ref={wrapperRef}
        className="hero relative w-full overflow-hidden bg-[#2f6fbd]"
      >
        {/* Layer 1: sky (slowest) */}
        <div
          ref={skyRef}
          className="absolute inset-0 z-0 transform-gpu will-change-transform"
        >
          <img
            ref={skyImgRef}
            src="/hero-section/muted-sky.png"
            alt=""
            draggable={false}
            className="h-full w-full object-cover brightness-[0.88]"
          />
        </div>

        {/* Layer 2: MANHATTAN logo + tagline + Explore (mobile).
            Pinned to the screen, with a small upward drift while scrolling.
            The hero clips it, and the house slides over it. */}
        <div
          ref={logoLayerRef}
          className="hero-pin pointer-events-none z-10 transform-gpu will-change-transform"
        >
          <div
            ref={travelRef}
            className="absolute inset-0 transform-gpu will-change-transform"
          >
            {/* zero-height flex row = the logo is centered on the top value */}
            <div className="hero-logo-row absolute inset-x-0 flex h-0 items-center justify-center">
              <img
                ref={logoImgRef}
                src="/manhattan/manhattan.png"
                alt="Manhattan"
                draggable={false}
                className="w-[78%] max-w-none md:w-[63.4%]"
              />
            </div>

            <div className="hero-tagline-row absolute inset-x-0 flex h-0 items-center justify-center">
              <p ref={taglineRef} className={taglineClass}>
                Turn your dream home into reality.
              </p>
            </div>

            {/* Explore button: mobile only */}
            <div className="hero-explore-row absolute inset-x-0 flex h-0 items-center justify-center md:hidden">
              <a
                ref={exploreRef}
                href="#who-we-are"
                className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-white/60 bg-white/10 px-6 py-2.5 text-[11px] font-extralight uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900 active:scale-95"
              >
                Explore
                <ArrowDownIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Layer 3: house (the hero is as tall as the image, so nothing is cut) */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <img
            ref={houseImgRef}
            src="/hero-section/modern-house.png"
            alt="Modern house"
            draggable={false}
            fetchPriority="high"
            className="h-full w-full object-cover object-bottom brightness-[0.9]"
          />
        </div>

        {/* Layer 4: video background (fades in over the house) */}
        <div
          aria-hidden={!isVideo}
          className={`absolute inset-0 z-30 bg-neutral-950 transition-opacity duration-700 ease-out ${
            isVideo ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster="/mp4/poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/mp4/manhattan-web-small.mp4" type="video/mp4" />
          </video>

          {/* Soft dim so the white text and controls stay readable */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />

          <button
            type="button"
            aria-label={playing ? 'Pause video' : 'Play video'}
            onClick={togglePlay}
            tabIndex={isVideo ? 0 : -1}
            className={`${roundButton} absolute bottom-6 left-[5vw] md:bottom-[4.4vw] md:left-[5.2vw]`}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            onClick={toggleMute}
            tabIndex={isVideo ? 0 : -1}
            className={`${roundButton} absolute bottom-6 right-[5vw] md:bottom-[4.4vw] md:right-[4.8vw]`}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
          </button>
        </div>
      </section>

      {/* FAB: switch between image and video.
          Lives outside the (clipped) hero so it is never cut off.
          The wrapper ignores clicks, so it can never block other buttons. */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center transition-opacity duration-500 md:bottom-[3.2vw] ${
          heroInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          ref={fabRef}
          type="button"
          onClick={toggleMode}
          aria-label={isVideo ? 'Show image background' : 'Show video background'}
          title={isVideo ? 'Show image' : 'Play video'}
          tabIndex={heroInView ? 0 : -1}
          className="pointer-events-auto relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <span
            className={`absolute transition-all duration-300 ${
              isVideo ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <VideoCamIcon />
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isVideo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <ImageIcon />
          </span>
        </button>
      </div>
    </>
  )
}