import { LogTerminal } from '../LogTerminal'
import { useState } from 'react'

export default function LogTerminalExample() {
  const [logs] = useState([
    {
      id: '1',
      timestamp: '12:34:01',
      level: 'info' as const,
      message: 'Fuzzer initialized with 8 seed files',
    },
    {
      id: '2',
      timestamp: '12:34:02',
      level: 'success' as const,
      message: 'Traditional fuzzing started',
    },
    {
      id: '3',
      timestamp: '12:34:03',
      level: 'warning' as const,
      message: 'Test #5: Possible timeout detected',
    },
    {
      id: '4',
      timestamp: '12:34:04',
      level: 'error' as const,
      message: 'Bug #1 found at test #12: Buffer overflow detected!',
    },
    {
      id: '5',
      timestamp: '12:34:05',
      level: 'success' as const,
      message: 'Traditional fuzzing completed: 12 crashes, 3/5 coverage',
    },
  ])

  return (
    <div className="p-4">
      <LogTerminal logs={logs} onClear={() => console.log('Clear logs')} />
    </div>
  )
}
