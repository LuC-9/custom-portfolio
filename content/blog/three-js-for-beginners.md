---
title: "Three.js for Beginners: Creating Your First 3D Scene"
date: "2023-03-28"
excerpt: "A comprehensive guide to getting started with Three.js and creating impressive 3D graphics on the web."
tags: ["Three.js", "JavaScript", "3D Graphics"]
# image: "/placeholder.svg?height=600&width=1200"
---

## Introduction to Three.js

Three.js is a JavaScript library that makes it easier to create 3D graphics in the browser using WebGL.

## Setting Up Your First Scene

To create a basic 3D scene, you need three things: a scene, a camera, and a renderer.

```javascript
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

## Adding Objects

Now let's add a simple cube to our scene:

```javascript
// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

## Animation

To animate the cube, we can use the requestAnimationFrame function:

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();
```

## Common Three.js Materials

Three.js provides several materials for different rendering styles:

| Material | Description | Use Case |
|----------|-------------|----------|
| MeshBasicMaterial | Simple material not affected by lights | UI elements, wireframes |
| MeshStandardMaterial | Physically based material | Realistic objects |
| MeshPhongMaterial | Shiny surfaces with specular highlights | Plastic, ceramic |
| MeshLambertMaterial | Matte surfaces | Cloth, wood |
| MeshNormalMaterial | Maps normal vectors to RGB colors | Debugging |
| MeshDepthMaterial | Color based on distance from camera | Depth effects |

## Integration with React

Here's how you can integrate Three.js with React using React Three Fiber:

```jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Cube(props) {
  const meshRef = useRef();
  
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });
  
  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'green'} />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Cube position={[0, 0, 0]} />
    </Canvas>
  );
}
```

## Conclusion

Three.js is a powerful library that makes 3D graphics on the web accessible to JavaScript developers. With just a few lines of code, you can create impressive 3D scenes and animations.



