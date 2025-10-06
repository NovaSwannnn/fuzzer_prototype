import { CoverageVisualization } from '../CoverageVisualization'

export default function CoverageVisualizationExample() {
  const bugTypes = [
    {
      id: 'buffer_overflow',
      name: 'Buffer Overflow',
      description: 'Long strings exceeding buffer limits',
      discovered: true,
    },
    {
      id: 'injection',
      name: 'Command Injection',
      description: 'Special characters in input fields',
      discovered: true,
    },
    {
      id: 'logic_error',
      name: 'Logic Error',
      description: 'Negative age values causing crashes',
      discovered: true,
    },
    {
      id: 'array_bounds',
      name: 'Array Bounds',
      description: 'Large arrays exceeding limits',
      discovered: true,
    },
    {
      id: 'division_by_zero',
      name: 'Division by Zero',
      description: 'Zero values in rating fields',
      discovered: false,
    },
  ]

  return (
    <div className="p-4 max-w-2xl">
      <CoverageVisualization bugTypes={bugTypes} />
    </div>
  )
}
