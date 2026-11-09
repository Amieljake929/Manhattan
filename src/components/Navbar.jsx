import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import 'flag-icons/css/flag-icons.min.css'

const links = [
  { label: 'Services', href: '#' },
  { label: 'Fence Style', href: '#' },
  { label: 'Gallery', href: '#' },
  { label: 'About', href: '#about' },
]

// Text of the button on the right
const CTA_LABEL = 'Tour'

// flag = country code used by the flag-icons package
const currencies = [
  { code: 'USD', name: 'US Dollar', flag: 'us' },
  { code: 'EUR', name: 'Euro', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', flag: 'gb' },
  { code: 'PHP', name: 'Philippine Peso', flag: 'ph' },
  { code: 'AUD', name: 'Australian Dollar', flag: 'au' },
  { code: 'CAD', name: 'Canadian Dollar', flag: 'ca' },
  { code: 'SGD', name: 'Singapore Dollar', flag: 'sg' },
  { code: 'JPY', name: 'Japanese Yen', flag: 'jp' },
  { code: 'AED', name: 'UAE Dirham', flag: 'ae' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: 'nz' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: 'hk' },
  { code: 'CNY', name: 'Chinese Yuan', flag: 'cn' },
  { code: 'KRW', name: 'South Korean Won', flag: 'kr' },
  { code: 'INR', name: 'Indian Rupee', flag: 'in' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: 'my' },
  { code: 'THB', name: 'Thai Baht', flag: 'th' },
  { code: 'CHF', name: 'Swiss Franc', flag: 'ch' },
]

const STORAGE_KEY = 'manhattan-currency'

// The solid bar appears once the bottom of the hero is this many px
// from the top of the screen (i.e. when the next section reaches the navbar)
const HERO_EXIT_OFFSET = 70

// Navbar font size: min 10px (phones), grows with the screen, max 16px.
const NAV_FONT_SIZE = 'text-[clamp(10px,0.8vw,16px)]'

// Shared look for the thin, widely spaced navbar text
const thinText = 'font-extralight tracking-[0.2em] md:tracking-[0.3em]'

function getSavedCurrency() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && currencies.some((c) => c.code === saved)) return saved
  } catch {
    /* storage unavailable: fall back to USD */
  }
  return 'USD'
}

const ChevronIcon = ({ open }) => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export default function Navbar() {
  const headerRef = useRef(null)
  const currencyRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [currency, setCurrency] = useState(getSavedCurrency)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const current = currencies.find((c) => c.code === currency) ?? currencies[0]

  const q = query.trim().toLowerCase()
  const filtered = q
    ? currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
      )
    : currencies

  /* Intro animation: every navbar item appears at the same time */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-nav]', {
        y: -24,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.9,
        clearProps: 'opacity,transform',
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  /* Solid container only after the hero has been passed */
  useEffect(() => {
    const hero = document.querySelector('.hero')

    const update = () => {
      const passed = hero
        ? hero.getBoundingClientRect().bottom <= HERO_EXIT_OFFSET
        : window.scrollY > window.innerHeight
      setScrolled(passed)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  /* Close the dropdown: outside tap, Escape, or scrolling the page */
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!currencyRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onScroll = () => {
      // the mobile keyboard can nudge the page; don't close while typing
      if (document.activeElement === inputRef.current) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  /* Focus the search box on desktop (not on phones, to avoid the keyboard) */
  useEffect(() => {
    if (!open) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const t = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      60,
    )
    return () => clearTimeout(t)
  }, [open])

  /* Arrow keys move between the search box and the list */
  const onKeyNav = (e) => {
    if (!open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return

    const items = Array.from(listRef.current?.querySelectorAll('button') ?? [])
    if (!items.length) return
    e.preventDefault()

    const index = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') {
      items[index === -1 ? 0 : Math.min(index + 1, items.length - 1)].focus()
    } else if (index <= 0) {
      inputRef.current?.focus()
    } else {
      items[index - 1].focus()
    }
  }

  const toggleOpen = () => {
    setQuery('')
    setOpen((o) => !o)
  }

  const selectCurrency = (code) => {
    setCurrency(code)
    setOpen(false)
    setQuery('')
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 ${NAV_FONT_SIZE} font-light uppercase tracking-[0.14em] transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-white py-3 text-neutral-900 shadow-[0_1px_12px_rgba(0,0,0,0.08)] md:py-4'
          : 'bg-transparent py-6 text-white md:py-[3vw]'
      }`}
    >
      {/* 3 columns: the middle one is always the true center of the page.
          `relative` so the dropdown aligns to the page edge, not the button. */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-[8vw]">
        {/* Left: menu button */}
        <div className="col-start-1 flex items-center justify-self-start">
          <button
            type="button"
            aria-label="Open menu"
            data-nav
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-current/30 transition-colors duration-300 hover:bg-current/10 md:h-11 md:w-11"
          >
            <span className="flex flex-col items-end gap-[5px]">
              <span className="block h-px w-[18px] bg-current transition-all duration-300 group-hover:w-[22px]" />
              <span className="block h-px w-[10px] bg-current transition-all duration-300 group-hover:w-[22px]" />
            </span>
          </button>
        </div>

        {/* Center: nav links */}
        <nav className="col-start-2 hidden items-center gap-[2.8vw] lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-nav
              className={`${thinText} transition-opacity hover:opacity-70`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: currency | tour */}
        <div className="col-start-3 flex items-center justify-self-end">
          <div ref={currencyRef} data-nav onKeyDown={onKeyNav}>
            <button
              type="button"
              onClick={toggleOpen}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={`Currency: ${currency}. Change currency`}
              className={`${thinText} flex cursor-pointer items-center gap-[0.8em] transition-opacity hover:opacity-70`}
            >
              {/* rectangular flag (4:3) */}
              <span
                className={`fi fi-${current.flag} shrink-0 rounded-[2px] text-[1.15em] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]`}
              />
              {currency}
              <ChevronIcon open={open} />
            </button>

            {/* Dropdown panel: right edge lines up with the page content edge */}
            <div
              className={`absolute right-6 top-full z-50 mt-3 w-[min(15rem,calc(100vw-3rem))] origin-top-right rounded-2xl border border-neutral-200/70 bg-white p-2 text-neutral-900 normal-case tracking-normal shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out md:right-[8vw] md:mt-4 ${
                open
                  ? 'visible translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none invisible -translate-y-2 scale-95 opacity-0'
              }`}
            >
              {/* Search */}
              <div className="relative">
                <SearchIcon />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filtered[0]) {
                      selectCurrency(filtered[0].code)
                    }
                  }}
                  tabIndex={open ? 0 : -1}
                  placeholder="Search currency"
                  aria-label="Search currency"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[16px] font-normal normal-case tracking-normal text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 md:text-sm"
                />
              </div>

              {/* data-lenis-prevent lets the wheel / touch scroll this list
                  instead of the smooth scroll capturing it */}
              <ul
                ref={listRef}
                role="listbox"
                aria-label="Select currency"
                data-lenis-prevent
                className="currency-scroll mt-2 max-h-[232px] overflow-y-auto overscroll-contain border-t border-neutral-100 pr-1 pt-1.5"
              >
                {filtered.length === 0 && (
                  <li
                    role="presentation"
                    className="px-3 py-6 text-center text-xs font-normal text-neutral-400"
                  >
                    No currency found
                  </li>
                )}

                {filtered.map((item) => {
                  const selected = item.code === currency
                  return (
                    <li key={item.code} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        tabIndex={open ? 0 : -1}
                        onClick={() => selectCurrency(item.code)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left outline-none transition-colors duration-200 focus-visible:bg-neutral-100 ${
                          selected
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-neutral-800 hover:bg-neutral-100'
                        }`}
                      >
                        <span
                          className={`fi fis fi-${item.flag} flag-round shrink-0 text-[22px]`}
                        />

                        <span className="flex min-w-0 flex-1 items-baseline gap-2">
                          <span className="text-sm font-medium">{item.code}</span>
                          <span
                            className={`truncate text-xs font-normal ${
                              selected ? 'text-indigo-400' : 'text-neutral-500'
                            }`}
                          >
                            {item.name}
                          </span>
                        </span>

                        <span className="flex w-4 shrink-0 justify-end">
                          {selected ? <CheckIcon /> : null}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <span data-nav className="mx-3 font-extralight opacity-60 md:mx-[1.25vw]">
            |
          </span>

          <a
            href="#"
            data-nav
            className={`${thinText} transition-opacity hover:opacity-70`}
          >
            {CTA_LABEL}
          </a>
        </div>
      </div>
    </header>
  )
}