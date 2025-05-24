import React from 'react'

export function MeditationsPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-semibold">Meditations</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Guided Meditations</h2>
          <p className="text-gray-600">
            Meditation library will be implemented here
          </p>
        </div>
      </main>
    </div>
  )
} 