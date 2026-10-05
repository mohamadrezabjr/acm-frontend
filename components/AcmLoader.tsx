"use client"

import { useEffect, useRef, useState } from "react"

// ثابت‌های تایمینگ (باید با مقادیر انیمیشن‌های CSS هماهنگ باشن)
const STEPS = 20
const RADII_COUNT = 3
const TOTAL_TRI = STEPS * (RADII_COUNT - 1) * 2 // = 80
const TRI_STAGGER = 0.025 // ثانیه
const TRI_DUR = 0.5 // ثانیه

const LETTER_DUR = 1.1 // ثانیه
const LETTER_M_DELAY = 0.15 // ثانیه

const TRI_TOTAL_MS = ((TOTAL_TRI - 1) * TRI_STAGGER + TRI_DUR) * 1000
const LETTER_TOTAL_MS = (LETTER_M_DELAY + LETTER_DUR) * 1000

const ENTER_MS = Math.max(TRI_TOTAL_MS, LETTER_TOTAL_MS) + 50
const HOLD_MS = 800
const EXIT_MS = ENTER_MS
const LOOP_GAP_MS = 150

export default function AcmLoader() {
  const groupRef = useRef<SVGGElement>(null)
  const [show, setShow] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [cycle, setCycle] = useState(0)

  const loadedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    if (document.readyState === "complete") return
    setShow(true)
    function markLoaded() {
      loadedRef.current = true
    }
    window.addEventListener("load", markLoaded)
    return () => window.removeEventListener("load", markLoaded)
  }, [])

  useEffect(() => {
    if (!show) return
  
    function runCycle() {
      setExiting(false)
  
      const t1 = setTimeout(() => {
        const t2 = setTimeout(() => {
          setExiting(true)
  
          const t3 = setTimeout(() => {
            if (loadedRef.current) {
              setShow(false)
            } else {
              const t4 = setTimeout(() => {
                setCycle((c) => c + 1)
                runCycle()
              }, LOOP_GAP_MS)
              timersRef.current.push(t4)
            }
          }, EXIT_MS)
          timersRef.current.push(t3)
        }, HOLD_MS)
        timersRef.current.push(t2)
      }, ENTER_MS)
      timersRef.current.push(t1)
    }
  
    runCycle()
  
    return () => clearTimers()
  }, [show])
  useEffect(() => {
    if (!show) return
    const svgNS = "http://www.w3.org/2000/svg"
    const group = groupRef.current
    if (!group) return

    group.innerHTML = ""

    const cx = 132, cy = 50
    const outerR = 46
    const midR = 34
    const innerR = 23
    const startAngle = 28
    const endAngle = 332
    const steps = STEPS
    const radii = [outerR, midR, innerR]
    const angleSpan = endAngle - startAngle

    function polar(pcx: number, pcy: number, r: number, angleDeg: number): [number, number] {
      const a = (angleDeg * Math.PI) / 180
      return [pcx + r * Math.cos(a), pcy + r * Math.sin(a)]
    }

    function jitter(v: number, amt: number): number {
      return v + (Math.random() - 0.5) * amt
    }

    let triangleIndex = 0
    
    function addTri(pts: [number, number][]) {
      const poly = document.createElementNS(svgNS, "polygon")
      poly.setAttribute("points", pts.map((p) => p.join(",")).join(" "))
      poly.classList.add("acm-tri")

      const inDelay = triangleIndex * TRI_STAGGER
      const pulseDelay = 0.7 + Math.random() * 1.2
      const outDelay = (TOTAL_TRI - 1 - triangleIndex) * TRI_STAGGER

      poly.style.setProperty("--delay-fwd", `${inDelay.toFixed(3)}s`)
      poly.style.setProperty("--delay-pulse", `${pulseDelay.toFixed(3)}s`)
      poly.style.setProperty("--delay-rev", `${outDelay.toFixed(3)}s`)

      group!.appendChild(poly)
      triangleIndex++
    }

    for (let i = 0; i < steps; i++) {
      const a1 = startAngle + (angleSpan * i) / steps
      const a2 = startAngle + (angleSpan * (i + 1)) / steps

      for (let row = 0; row < radii.length - 1; row++) {
        const rOuter = radii[row]
        const rInner = radii[row + 1]

        const outer1 = polar(cx, cy, jitter(rOuter, 3.5), a1)
        const outer2 = polar(cx, cy, jitter(rOuter, 3.5), a2)
        const inner1 = polar(cx, cy, jitter(rInner, 3.5), a1)
        const inner2 = polar(cx, cy, jitter(rInner, 3.5), a2)

        const quads: [number, number][][] =
          Math.random() > 0.5
            ? [[outer1, outer2, inner1], [outer2, inner2, inner1]]
            : [[outer1, outer2, inner2], [outer1, inner2, inner1]]

        quads.forEach(addTri)
      }
    }
  }, [show, cycle])

  if (!show) return null

  return (
    <>
      <style>{`
        #acm-loader {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          background: var(--background);
          z-index: 9999;
        }

        .acm-logo-wrap {
          width: 340px;
          max-width: 70vw;
          aspect-ratio: 3 / 1;
          position: relative;
        }
        .acm-logo-wrap svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* پایه: حروف کامل و پررنگ‌اند. ورود با backwards قبل از شروعش حالت مخفی رو نشون میده،
           بعد از تمام‌شدن به‌طور طبیعی به همین حالت پایه (کامل) برمی‌گرده و می‌مونه. */
        .acm-letter {
          fill: none;
          stroke: var(--foreground);
          stroke-width: 9;
          stroke-linejoin: miter;
          stroke-linecap: butt;
          stroke-miterlimit: 4;
          stroke-dasharray: 1;
          stroke-dashoffset: 0;
          animation: acm-draw ${LETTER_DUR}s cubic-bezier(0.65, 0, 0.35, 1) backwards;
        }
        .acm-letter.m {
          animation-delay: ${LETTER_M_DELAY}s;
        }
        @keyframes acm-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes acm-draw-reverse {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 1; }
        }

        /* خروج معکوس حروف: تا قبل از رسیدن دیلی، چون انیمیشن قبلی جایگزین شده،
           به حالت پایه (کامل/dashoffset:0) برمی‌گرده و پررنگ می‌مونه؛ بعد با forwards محو می‌شه. */
        #acm-loader.acm-exiting .acm-letter.a {
          animation: acm-draw-reverse ${LETTER_DUR}s cubic-bezier(0.65, 0, 0.35, 1) ${LETTER_M_DELAY}s forwards;
        }
        #acm-loader.acm-exiting .acm-letter.m {
          animation: acm-draw-reverse ${LETTER_DUR}s cubic-bezier(0.65, 0, 0.35, 1) 0s forwards;
        }

        /* پایه: مثلث کامل و پررنگ (opacity:1, scale(1)). ورود با backwards قبل از نوبتش
           حالت کوچک/محو رو نشون میده، بعد از پایان به حالت پایه‌ی کامل برمی‌گرده. */
        .acm-tri {
          fill: var(--foreground);
          fill-opacity: 0.04;
          stroke: var(--foreground);
          stroke-width: 1.3;
          stroke-linejoin: round;
          transform-box: fill-box;
          transform-origin: center;
          opacity: 1;
          transform: scale(1);
          animation:
            acm-tri-in ${TRI_DUR}s ease var(--delay-fwd, 0s) backwards,
            acm-tri-pulse 1.8s ease-in-out var(--delay-pulse, 0.7s) infinite;
        }
        @keyframes acm-tri-in {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes acm-tri-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.4); }
        }
        @keyframes acm-tri-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* خروج معکوس مثلث‌ها: با تعویض کامل انیمیشن، پالس هم حذف می‌شه و opacity
           به حالت پایه (کامل=1) برمی‌گرده تا قبل از رسیدن دیلی هر مثلث؛ یعنی C پررنگ
           می‌مونه و بعد به ترتیب معکوس (آخرین ورودی، اولین خروجی) بسته می‌شه. */
        #acm-loader.acm-exiting .acm-tri {
          animation: acm-tri-out ${TRI_DUR}s ease var(--delay-rev, 0s) forwards;
        }

        .acm-caption {
          width: 340px;
          max-width: 70vw;
          text-align: center;
          letter-spacing: 0.35em;
          font-size: 12px;
          color: var(--foreground);
          text-transform: uppercase;
          opacity: 0.75;
        }
        .acm-caption .dot {
          display: inline-block;
          animation: acm-dot 1.4s infinite;
          opacity: 0;
        }
        .acm-caption .dot:nth-child(1) { animation-delay: 0s; }
        .acm-caption .dot:nth-child(2) { animation-delay: 0.2s; }
        .acm-caption .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes acm-dot {
          0%, 80%, 100% { opacity: 0; }
          40%           { opacity: 1; }
        }
      `}</style>

      <div id="acm-loader" className={exiting ? "acm-exiting" : ""}>
        <div className="acm-logo-wrap">
          <svg key={cycle} viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
            <path
              className="acm-letter a"
              pathLength={1}
              d="M 5 95 L 46 8 L 88 95"
            />

            <g ref={groupRef} id="acm-c-mesh" />

            <path
              className="acm-letter m"
              pathLength={1}
              d="M 184 95 L 184 5 L 238 54 L 293 5 L 293 95"
            />
          </svg>
        </div>

        <div className="acm-caption">
          ASSOCIATION FOR COMPUTING MACHINERY
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>
    </>
  )
}