import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Wrap any content in <Reveal> and it fades/slides in when scrolled into view.
export default function Reveal({ children, className = '', delay = 0, y = 40 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [y, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}