"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { MeshStandardMaterial, type Mesh } from "three"
import { useSpring, animated, config } from "@react-spring/three"

export default function ProfileMesh({
  developerImage = "/profile.jpg",
  gamerImage = "/gamer-profile.gif", // Updated to .gif
}) {
  const meshRef = useRef<Mesh>(null)
  const [active, setActive] = useState(false)
  const { viewport } = useThree()

  // Load both textures with error handling
  const [textureDev, textureGamer] = useTexture(
    [developerImage, gamerImage],
    (textures) => {
      // Success callback
      console.log("Textures loaded successfully")
    },
    (error) => {
      // Error callback
      console.error("Error loading textures:", error)
    },
  )

  // Create animated materials for smooth transition
  const materials = [new MeshStandardMaterial({ map: textureDev }), new MeshStandardMaterial({ map: textureGamer })]

  // Animation for rotation and position when hovered
  const { rotation, scale, position } = useSpring({
    rotation: active ? [0, Math.PI, 0] : [0, 0, 0],
    scale: active ? 1.1 : 1,
    position: active ? [0, 0.1, 0] : [0, 0, 0],
    config: config.wobbly,
  })

  // Responsive sizing based on viewport
  const size = Math.min(2, viewport.width / 5)

  // Small continuous rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <animated.mesh
      ref={meshRef}
      rotation={rotation as any}
      scale={scale}
      position={position as any}
      onClick={() => setActive(!active)}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <circleGeometry args={[size, 32]} />
      <meshStandardMaterial map={active ? textureGamer : textureDev} transparent={true} />
    </animated.mesh>
  )
}



