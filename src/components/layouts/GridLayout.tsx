import { ReactNode } from 'react'
import type { Thread } from '../../types/thread'

interface GridLayoutProps {
  threads: Thread[]
  renderCard: (thread: Thread) => ReactNode
}

export function GridLayout({ threads, renderCard }: GridLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {threads.map(thread => renderCard(thread))}
    </div>
  )
}