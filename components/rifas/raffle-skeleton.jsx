import { Skeleton } from '@/components/ui/skeleton'

export function RaffleSkeleton() {
  return (
    <div className='w-full max-w-4xl mx-auto space-y-8 animate-pulse'>
      <div className='space-y-4'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </div>

      <div className='aspect-[16/9] w-full'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>

      <div className='space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-4/6' />
      </div>

      <div className='h-[400px] w-full'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
    </div>
  )
}
