import { useState } from 'react'
import { useData } from '../hooks/useData'
import { ThreadCard } from '../components/ThreadCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { LayoutSelector } from '../components/LayoutSelector'
import { GridLayout } from '../components/layouts/GridLayout'
import { ColumnLayout } from '../components/layouts/ColumnLayout'
import { FocusLayout } from '../components/layouts/FocusLayout'
import { MosaicLayout } from '../components/layouts/MosaicLayout'
import { PersonalizedFeed } from '../components/recommendations/PersonalizedFeed'
import type { LayoutType } from '../types/layout'

export function Home() {
  const [layout, setLayout] = useState<LayoutType>('grid')
  const { threads, loading, error } = useData()

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>

  const renderLayout = () => {
    const layoutProps = {
      threads,
      renderCard: (thread: any) => <ThreadCard key={thread.id} thread={thread} />
    }

    switch (layout) {
      case 'columns':
        return <ColumnLayout {...layoutProps} />
      case 'focus':
        return <FocusLayout {...layoutProps} />
      case 'mosaic':
        return <MosaicLayout {...layoutProps} />
      default:
        return <GridLayout {...layoutProps} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Section Recommandations Personnalisées */}
      <PersonalizedFeed 
        userId="user-demo" 
        limit={8}
        showHeader={true}
      />

      {/* Section Articles Twitter */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold theme-text">Articles & Analyses</h2>
            <p className="text-gray-600 mt-2">Derniers contenus de notre veille Twitter</p>
          </div>
          <LayoutSelector layout={layout} onLayoutChange={setLayout} />
        </div>

        {renderLayout()}
      </div>
    </div>
  )
}