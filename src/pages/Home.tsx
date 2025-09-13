import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export function Home() {
  const { theme } = useTheme()
  
  return (
    <div className="space-y-8">
      {/* Test simple */}
      <div className={`p-8 rounded-2xl ${
        theme === 'senegalais' 
          ? 'bg-gradient-to-br from-orange-100 to-yellow-100' 
          : 'bg-gray-100'
      }`}>
        <h1 className="text-4xl font-bold text-center mb-4">
          Bienvenue sur CityzenMag
        </h1>
        <p className="text-center text-gray-600">
          Plateforme de transparence et modernisation du Sénégal
        </p>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Thème actuel : {theme}
          </p>
        </div>
      </div>

      {/* Section de test */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-2">Interviews</h3>
          <p className="text-gray-600">Témoignages d'experts</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-2">Reportages</h3>
          <p className="text-gray-600">Galeries photo immersives</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-2">Vidéos</h3>
          <p className="text-gray-600">Analyses approfondies</p>
        </div>
      </div>
    </div>
  )
}