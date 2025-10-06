import { MethodCard } from '../MethodCard'
import { Hammer, Brain, Dna } from 'lucide-react'

export default function MethodCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <MethodCard
        title="Traditional"
        description="Random mutations using standard fuzzing techniques"
        icon={Hammer}
        color="warning"
        crashes={12}
        tests={30}
        coverage={3}
        time={1.2}
        status="completed"
      />
      <MethodCard
        title="LLM-Guided"
        description="Smart mutations powered by AI language models"
        icon={Brain}
        color="primary"
        crashes={18}
        tests={30}
        coverage={4}
        time={2.1}
        status="completed"
      />
      <MethodCard
        title="Genetic Algorithm"
        description="Evolutionary approach with LLM seed generation"
        icon={Dna}
        color="info"
        status="running"
      />
    </div>
  )
}
