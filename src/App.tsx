import './App.css'
import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'

type BoxProps = ThreeElements['mesh'] & {
  w: number
  h: number
  d: number
}

function Box(props: BoxProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // const geometry = new THREE.BoxGeometry(1, 1, 0.2)
  // const edges = new THREE.EdgesGeometry(geometry)
  // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  return (
    <>
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => {
          console.log(event)
          setActive(!active)
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[props.w, props.h, props.d]} />
        <meshStandardMaterial color={hovered ? 'orange' : 0xffffff} />
      </mesh>
      <lineSegments {...props}>
        <boxGeometry args={[props.w, props.h, props.d]} />
        <lineBasicMaterial color={0xbfc0c0} />
      </lineSegments>
    </>
  )
}

function Plane(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)
  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={0xf4f4f4} />
    </mesh>
  )
}

function App() {
  return (
    <div className="h-screen w-screen">
      <div
        style={{ height: '48px' }}
        className="px-4 py-2 grid grid-cols-3 items-center"
      >
        <div className="font-medium text-zinc-800">Operations</div>
        <div className="flex justify-center">
          <div className="w-[450px] h-8 bg-zinc-100 rounded">
            <input
              className="h-full text-sm bg-transparent outline-none px-4 w-[450px]"
              placeholder="Search for customer order, jobs, vehicles and assets"
            />
          </div>
        </div>
        <div></div>
      </div>
      <div style={{ height: 'calc(100% - 48px)' }} className="px-4 pb-4">
        <div className="rounded bg-zinc-100 border border-zinc-200 h-full w-full flex items-center justify-center">
          <Canvas
            camera={{
              aspect: 640 / 480,
              fov: 50,
              near: 0.1,
              far: 1000,
              zoom: 1,
            }}
          >
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
            <group
              position={[0, 0, -6]}
              rotation={[
                (-45 * Math.PI) / 180,
                (0 * Math.PI) / 180,
                (-45 * Math.PI) / 180,
              ]}
            >
              <Box position={[0, 0, 0.5]} w={1} h={3} d={0.2} />
              <Box position={[0, 2.2, 0.5]} w={1} h={1} d={0.2} />
              <Plane position={[0, 0, 0]} />
              <Line
                points={[
                  [-5, 5, 0],
                  [5, 5, 0],
                  [5, -5, 0],
                  [-5, -5, 0],
                  [-5, 5, 0],
                ]}
                color={0xbfc0c0}
                lineWidth={1}
              />
            </group>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default App
