import { ProgressSpinner } from 'primereact/progressspinner'

export default function Loading() {
  return (
    <div className='loading-home'>
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth='4'
        fill='var(--surface-ground)'
        animationDuration='.8s'
      />
    </div>
  )
}
