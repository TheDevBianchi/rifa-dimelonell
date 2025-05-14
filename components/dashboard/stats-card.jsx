import { Card } from '@/components/ui/card'

export default function StatsCard ({ title, value, total }) {
  // Calculate percentage for the progress indicator
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <Card className='p-4 border-gray-800 bg-gray-900/50'>
      <div className='space-y-2'>
        <p className='text-sm font-medium text-gray-400'>{title}</p>

        <div className='flex items-end justify-between'>
          <div className='space-y-1'>
            <span className='text-2xl font-bold text-white'>{value}</span>
            {total && (
              <span className='text-sm text-gray-400 ml-1'>/ {total}</span>
            )}
          </div>

          <span className='text-sm font-medium text-gray-400'>
            {percentage.toFixed(0)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className='h-1 w-full bg-gray-800 rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary transition-all duration-300 ease-in-out'
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
