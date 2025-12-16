'use client'

import { useEffect, useRef } from 'react'

export default function NetworkPlexus() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes: Node[] = []
    const nodeCount = 120
    const connectionDistance = 150
    const mouseRadius = 180
    let mouse = { x: null as number | null, y: null as number | null }
    let animationId: number

    class Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      originalY: number
      waveOffset: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1
        this.originalY = this.y
        this.waveOffset = Math.random() * Math.PI * 2
      }

      update(time: number) {
        const waveAmplitude = 30
        const waveFrequency = 0.002
        const waveY = Math.sin(time * waveFrequency + this.waveOffset + this.x * 0.005) * waveAmplitude

        this.x += this.vx
        this.y += this.vy + Math.sin(time * 0.001) * 0.1
        this.y += waveY * 0.02

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius
            this.x -= dx * force * 0.03
            this.y -= dy * force * 0.03
          }
        }

        this.x = Math.max(0, Math.min(canvas.width, this.x))
        this.y = Math.max(0, Math.min(canvas.height, this.y))
      }

      draw() {
        if (!ctx) return
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
        ctx.fill()

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3)
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)')
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node())
    }

    function drawConnections() {
      if (!ctx) return
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)

            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            )
            gradient.addColorStop(0, `rgba(100, 200, 255, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(150, 100, 255, ${opacity})`)
            gradient.addColorStop(1, `rgba(100, 200, 255, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    let time = 0
    function animate() {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time++

      drawConnections()

      nodes.forEach(node => {
        node.update(time)
        node.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    const handleResize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    handleResize()

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
