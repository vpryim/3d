import './App.css'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Text,
  CameraControls,
  Edges,
  Line,
  MapControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  PresentationControls,
} from '@react-three/drei'

type BoxProps = ThreeElements['mesh'] & {
  w: number
  h: number
  d: number
  l: string
  p: number[]
}

function Box(props: BoxProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { w, h, d, l, p, ...meshProps } = props
  // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // const geometry = new THREE.BoxGeometry(1, 1, 0.2)
  // const edges = new THREE.EdgesGeometry(geometry)
  // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  return (
    <>
      <mesh
        {...meshProps}
        ref={meshRef}
        position={p}
        scale={active ? 1 : 1}
        onClick={(event) => {
          setActive(!active)
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={hovered ? 0x5766c1 : 0xffffff} />
        <Edges scale={hovered ? 1 : 1} color={hovered ? 'black' : 0xa2a2a2} />
      </mesh>
      <Text
        position={[p[0] + 0.1, p[1] - 0.1, 0.4]}
        scale={0.1}
        color={hovered ? 'black' : 0xa2a2a2}
      >
        {props.l}
      </Text>
    </>
  )
}

function Plane(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)
  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={0xe2e2e2} />
      <Edges scale={1} threshold={15} color={0xa2a2a2} />
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
        <div className="rounded bg-zinc-50 border border-zinc-200 h-full w-full flex items-center justify-center">
          <Canvas
            orthographic
            camera={{
              up: [0, 0, 1],
              far: 200,
              zoom: 110,
            }}
          >
            <MapControls />
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[0, 5, 10]} decay={0} intensity={Math.PI} />
            <pointLight
              position={[5, 8, 10]}
              decay={0}
              intensity={Math.PI * 2}
            />
            <group
              position={[0, 0, -10]}
              rotation={[
                (-60 * Math.PI) / 180,
                (0 * Math.PI) / 180,
                (-45 * Math.PI) / 180,
              ]}
            >
              <Plane position={[0, 0, 0]} />
              <Box l="P2093" p={[-1, 2.2, 0.2]} w={1} h={1} d={0.2} />
              <Box l="P2094" p={[-1, 3.2, 0.2]} w={1} h={1} d={0.2} />
              <Box l="P2095" p={[0, 3.2, 0.2]} w={1} h={1} d={0.2} />
              <Box l="P2096" p={[0, 2.2, 0.2]} w={1} h={1} d={0.2} />
              <Box l="P2938" p={[-3.2, 1.2, 0.2]} w={2} h={1} d={0.2} />
              <Box l="P2931" p={[-3.87, 1.96, 0.2]} w={2 / 3} h={0.5} d={0.2} />
              <Box l="P2932" p={[-3.2, 1.96, 0.2]} w={2 / 3} h={0.5} d={0.2} />
              <Box l="P2933" p={[-2.54, 1.96, 0.2]} w={2 / 3} h={0.5} d={0.2} />
              <Box l="HS020" p={[-3.5, -2, 0.2]} w={1.5} h={1} d={0.2} />
              <Box l="HS019" p={[-3.5, -0.75, 0.2]} w={1.5} h={1.5} d={0.2} />
              <Box l="A094" p={[1.3, -2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A095" p={[0.4, -2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A096" p={[-0.5, -2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A097" p={[-1.4, -2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A091" p={[1.3, -3.2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A092" p={[0.4, -3.2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A093" p={[-0.5, -3.2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A094" p={[-1.4, -3.2, 0.2]} w={0.5} h={1} d={0.2} />
              <Box l="A020" p={[3, -3, 0.2]} w={1.5} h={1.5} d={0.2} />
              <Box l="A030" p={[2.75, -1.5, 0.2]} w={1} h={1.5} d={0.2} />
              <Box l="A031" p={[3.5, -1.875, 0.2]} w={0.5} h={0.75} d={0.2} />
              <Box l="A032" p={[3.5, -1.125, 0.2]} w={0.5} h={0.75} d={0.2} />
            </group>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default App
