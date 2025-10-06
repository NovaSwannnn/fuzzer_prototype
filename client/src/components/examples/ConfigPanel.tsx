import { ConfigPanel } from '../ConfigPanel'
import { useState } from 'react'

export default function ConfigPanelExample() {
  const [testsPerMethod, setTestsPerMethod] = useState(30)
  const [verboseMode, setVerboseMode] = useState(true)
  const [useRealLlm, setUseRealLlm] = useState(false)

  return (
    <div className="p-4 max-w-md">
      <ConfigPanel
        testsPerMethod={testsPerMethod}
        onTestsPerMethodChange={setTestsPerMethod}
        verboseMode={verboseMode}
        onVerboseModeChange={setVerboseMode}
        useRealLlm={useRealLlm}
        onUseRealLlmChange={setUseRealLlm}
      />
    </div>
  )
}
