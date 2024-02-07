import { useLayoutEffect } from 'react'
import { init } from './scene'
import './App.css'

function App() {
  useLayoutEffect(() => {
    init(document.getElementById('map')!)
  }, [])
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
          <canvas id="map" width={400} height={400} />
        </div>
      </div>
    </div>
  )
}

export default App
