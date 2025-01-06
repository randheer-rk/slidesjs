import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface BackdropTheme {
  bg: string
  particle: string
  particleOp: number
  particleSize: number
  fogNear: number
  fogFar: number
}

export interface BackdropThemes {
  light: BackdropTheme
  dark: BackdropTheme
}

export interface DeckBackdropProps {
  idx: number
  dark?: boolean
  particleCount?: number
  cometCount?: number
  fps?: number
  themes?: BackdropThemes
}

const DEFAULT_THEMES: BackdropThemes = {
  light: { bg: '#FAFAF7', particle: '#111111', particleOp: 0.6, particleSize: 0.08, fogNear: 12, fogFar: 40 },
  dark: { bg: '#121212', particle: '#FAFAF7', particleOp: 0.5, particleSize: 0.05, fogNear: 9, fogFar: 32 },
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo)

const radialGlowTexture = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

const cometTexture = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const g = c.getContext('2d')!
  const HEAD = 440
  const tailGrad = g.createLinearGradient(0, 0, HEAD, 0)
  tailGrad.addColorStop(0, 'rgba(255,255,255,0)')
  tailGrad.addColorStop(0.6, 'rgba(255,255,255,0.06)')
  tailGrad.addColorStop(0.85, 'rgba(255,255,255,0.2)')
  tailGrad.addColorStop(0.96, 'rgba(255,255,255,0.55)')
  tailGrad.addColorStop(1, 'rgba(255,255,255,1)')
  g.beginPath()
  g.moveTo(0, 64)
  g.quadraticCurveTo(HEAD * 0.65, 46, HEAD, 40)
  g.lineTo(HEAD, 88)
  g.quadraticCurveTo(HEAD * 0.65, 82, 0, 64)
  g.closePath()
  g.fillStyle = tailGrad
  g.fill()
  const rg = g.createRadialGradient(HEAD, 64, 0, HEAD, 64, 38)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.2, 'rgba(255,255,255,0.6)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg
  g.beginPath()
  g.arc(HEAD, 64, 38, 0, Math.PI * 2)
  g.fill()
  return new THREE.CanvasTexture(c)
}

interface Comet {
  group: THREE.Group
  tail: THREE.Mesh
  head: THREE.Sprite
  active: boolean
  nextAt: number
  born: number
  vel: THREE.Vector3
  len: number
}

export function DeckBackdrop({
  idx,
  dark = false,
  particleCount = 700,
  cometCount = 2,
  fps = 30,
  themes = DEFAULT_THEMES,
}: DeckBackdropProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const idxRef = useRef(idx)

  useEffect(() => {
    idxRef.current = idx
  }, [idx])

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const t = dark ? themes.dark : themes.light

    let rafId: number | null = null
    let cleanup: (() => void) | null = null

    try {
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight

      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(new THREE.Color(t.bg), t.fogNear, t.fogFar)

      const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 80)
      camera.position.set(0, 0, 10)

      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(w, h)
      renderer.setClearColor(new THREE.Color(t.bg), 1)
      renderer.domElement.style.display = 'block'
      el.appendChild(renderer.domElement)

      scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, dark ? 0.5 : 0.85))
      const key = new THREE.DirectionalLight(0xffffff, dark ? 0.5 : 0.8)
      key.position.set(4, 6, 6)
      scene.add(key)

      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 34
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30
        positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: new THREE.Color(t.particle),
          size: t.particleSize,
          transparent: true,
          opacity: t.particleOp,
          depthWrite: false,
        }),
      )
      scene.add(particles)

      const glowTex = radialGlowTexture()
      const cometTex = cometTexture()
      const cometColor = dark ? '#FFFFFF' : '#111111'
      const cometBlending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
      const comets: Comet[] = Array.from({ length: cometCount }, () => {
        const group = new THREE.Group()
        const tail = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({
            map: cometTex,
            color: new THREE.Color(cometColor),
            transparent: true,
            opacity: 0,
            blending: cometBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
          }),
        )
        group.add(tail)
        const head = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: new THREE.Color(cometColor),
            transparent: true,
            opacity: 0,
            blending: cometBlending,
            depthWrite: false,
            fog: false,
          }),
        )
        group.add(head)
        scene.add(group)
        return { group, tail, head, active: false, nextAt: rnd(1, 5), born: 0, vel: new THREE.Vector3(), len: 3 }
      })

      const spawnComet = (c: Comet, s: number) => {
        const fromLeft = Math.random() < 0.5
        const baseY = camera.position.y
        c.group.position.set(fromLeft ? -16 : 16, baseY + rnd(-1, 5), rnd(-13, -8))
        c.vel.set((fromLeft ? 1 : -1) * rnd(5, 8), rnd(-2.0, -0.6), 0)
        c.len = rnd(2.4, 4)
        const width = c.len * rnd(0.1, 0.14)
        c.tail.scale.set(c.len, width, 1)
        c.tail.position.x = -c.len * 0.36
        c.head.scale.set(width * 1.6, width * 1.6, 1)
        c.group.rotation.z = Math.atan2(c.vel.y, c.vel.x)
        c.born = s
        c.active = true
      }

      let cur = idxRef.current
      let lastS = performance.now() / 1000
      let lastDraw = 0
      const frameInterval = 1000 / fps

      const tick = () => {
        rafId = requestAnimationFrame(tick)
        const nowMs = performance.now()
        if (nowMs - lastDraw < frameInterval) return
        lastDraw = nowMs

        const s = nowMs / 1000
        const dt = Math.min(0.05, s - lastS)
        lastS = s

        cur = lerp(cur, idxRef.current, 1 - Math.pow(0.001, dt))
        camera.position.y = -cur * 2.4 + Math.sin(s * 0.18) * 0.25
        camera.position.x = Math.sin(cur * 0.9) * 1.1 + Math.sin(s * 0.13) * 0.2
        camera.lookAt(camera.position.x * 0.3, camera.position.y + 0.4, 0)
        particles.rotation.y = s * 0.012

        for (const c of comets) {
          if (!c.active) {
            if (s >= c.nextAt) spawnComet(c, s)
            continue
          }
          if (Math.abs(c.group.position.x) > 20) {
            c.active = false
            c.nextAt = s + rnd(4, 10)
            ;(c.tail.material as THREE.Material).opacity = 0
            ;(c.head.material as THREE.Material).opacity = 0
            continue
          }
          c.group.position.addScaledVector(c.vel, dt)
          const env = Math.min(1, (s - c.born) / 0.25)
          const twinkle = 1 + Math.sin(s * 23 + c.born * 7) * 0.1
          ;(c.tail.material as THREE.Material).opacity = (dark ? 0.5 : 0.4) * env
          ;(c.head.material as THREE.Material).opacity = (dark ? 0.7 : 0.5) * env * twinkle
        }

        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(tick)

      const onResize = () => {
        const ww = el.clientWidth
        const hh = el.clientHeight
        if (!ww || !hh) return
        renderer.setSize(ww, hh)
        camera.aspect = ww / hh
        camera.updateProjectionMatrix()
      }
      const resizeObs = new ResizeObserver(onResize)
      resizeObs.observe(el)

      cleanup = () => {
        if (rafId) cancelAnimationFrame(rafId)
        resizeObs.disconnect()
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh
          if (mesh.geometry) mesh.geometry.dispose()
          const mat = mesh.material
          if (mat) {
            const mats = Array.isArray(mat) ? mat : [mat]
            for (const m of mats) {
              const mapped = m as THREE.MeshBasicMaterial
              if (mapped.map) mapped.map.dispose()
              m.dispose()
            }
          }
        })
        pGeo.dispose()
        glowTex.dispose()
        cometTex.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    } catch {
      cleanup = () => {
        if (rafId) cancelAnimationFrame(rafId)
      }
    }

    return () => cleanup?.()
  }, [dark, particleCount, cometCount, fps, themes])

  return <div ref={elRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}
