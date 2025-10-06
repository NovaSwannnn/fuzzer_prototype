import { ResultsTable } from '../ResultsTable'

export default function ResultsTableExample() {
  const results = [
    {
      id: '1',
      method: 'Traditional',
      testNumber: 12,
      bugType: 'Buffer Overflow',
      timestamp: '12:34:15',
    },
    {
      id: '2',
      method: 'LLM-Guided',
      testNumber: 8,
      bugType: 'Command Injection',
      timestamp: '12:35:22',
    },
    {
      id: '3',
      method: 'Traditional',
      testNumber: 23,
      bugType: 'Logic Error',
      timestamp: '12:36:44',
    },
    {
      id: '4',
      method: 'Genetic Algorithm',
      testNumber: 15,
      bugType: 'Array Bounds',
      timestamp: '12:37:01',
    },
    {
      id: '5',
      method: 'LLM-Guided',
      testNumber: 19,
      bugType: 'Division by Zero',
      timestamp: '12:38:33',
    },
  ]

  return (
    <div className="p-4">
      <ResultsTable
        results={results}
        onViewDetails={(id) => console.log('View details:', id)}
      />
    </div>
  )
}
