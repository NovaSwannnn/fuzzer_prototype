import { MetricCard } from '../MetricCard'
import { Bug, CheckCircle2, Clock, Zap } from 'lucide-react'

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Coverage"
        value="4/5"
        icon={CheckCircle2}
        color="success"
        subtitle="Bug types discovered"
      />
      <MetricCard
        title="Crashes Found"
        value={23}
        icon={Bug}
        color="danger"
        subtitle="Total vulnerabilities"
      />
      <MetricCard
        title="Tests Run"
        value={90}
        icon={Zap}
        color="primary"
        subtitle="Across all methods"
      />
      <MetricCard
        title="Time Elapsed"
        value="2.4s"
        icon={Clock}
        color="info"
        subtitle="Average per method"
      />
    </div>
  )
}
