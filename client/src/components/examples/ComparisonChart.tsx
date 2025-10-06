import { ComparisonChart } from '../ComparisonChart'

export default function ComparisonChartExample() {
  const results = [
    {
      method: 'Traditional',
      crashes: 12,
      coverage: 3,
      time: 1.2,
    },
    {
      method: 'LLM-Guided',
      crashes: 18,
      coverage: 4,
      time: 2.1,
    },
    {
      method: 'Genetic Algorithm',
      crashes: 15,
      coverage: 4,
      time: 1.8,
    },
  ]

  return (
    <div className="p-4">
      <ComparisonChart results={results} />
    </div>
  )
}
