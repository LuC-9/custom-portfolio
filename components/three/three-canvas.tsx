"use client"

import { type ReactNode, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload } from "@react-three/drei"

export default function ThreeCanvas({
  children,
  controls = false,
  ...props
}: {
  children: ReactNode
  controls?: boolean
  [key: string]: any
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onError={(e) => console.error("Canvas error:", e)}
      {...props}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
      {controls && <OrbitControls enableZoom={false} />}
    </Canvas>
  )
}
