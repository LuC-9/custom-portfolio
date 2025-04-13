"use client"

import dynamic from "next/dynamic"

// Dynamic imports with ssr: false
export const CustomCursorClient = dynamic(() => import("@/components/custom-cursor"), { ssr: false })
export const ThreeCanvasClient = dynamic(() => import("@/components/three/three-canvas"), { ssr: false })
export const BriefcaseIconClient = dynamic(() => import("@/components/three/briefcase-icon"), { ssr: false })
export const ProfileMeshClient = dynamic(() => import("@/components/three/profile-mesh"), { ssr: false })
