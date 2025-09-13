import { useState } from 'react'

export function TestModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-red-900">Test Modal Simple</h3>
          <p className="text-sm text-red-700">Test pour vérifier si les modals fonctionnent</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Ouvrir Modal Test
        </button>
      </div>

      {/* Modal de test */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Modal de Test</h2>
            <p className="mb-4">Si vous voyez ce modal, les modals fonctionnent !</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ✅ Modal fonctionne !
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}