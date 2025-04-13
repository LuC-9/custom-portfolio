"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { useSpring, animated } from "@react-spring/three"
import { Box, RoundedBox } from "@react-three/drei"

export default function BriefcaseIcon({ size = 1, color = "#6366f1" }) {
  const groupRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Animation for hover state
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  })

  // Continuous rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
    }
  })

  return (
    <animated.group
      ref={groupRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Briefcase Body */}
      <RoundedBox args={[size, size * 0.7, size * 0.3]} radius={0.1}>
        <meshStandardMaterial color={color} />
      </RoundedBox>

      {/* Briefcase Handle */}
      <Box args={[size * 0.4, size * 0.1, size * 0.1]} position={[0, size * 0.4, 0]}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Briefcase Clasp */}
      <Box args={[size * 0.2, size * 0.05, size * 0.35]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
    </animated.group>
  )
}
