import { ControlPanel } from '../ControlPanel'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ControlPanelExample() {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle')

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <ControlPanel
        status={status}
        onStart={() => {
          console.log('Start fuzzing')
          setStatus('running')
        }}
        onStop={() => {
          console.log('Stop fuzzing')
          setStatus('completed')
        }}
        onReset={() => {
          console.log('Reset fuzzing')
          setStatus('idle')
        }}
      />
      <div className="flex gap-2">
        <Button onClick={() => setStatus('idle')} variant="outline" size="sm">
          Set Idle
        </Button>
        <Button onClick={() => setStatus('running')} variant="outline" size="sm">
          Set Running
        </Button>
        <Button onClick={() => setStatus('completed')} variant="outline" size="sm">
          Set Completed
        </Button>
      </div>
    </div>
  )
}
