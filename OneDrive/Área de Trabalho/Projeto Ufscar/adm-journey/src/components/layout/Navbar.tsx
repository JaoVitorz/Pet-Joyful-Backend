// Navbar Component
export function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900 text-xl">🔔</button>
          <button className="text-gray-600 hover:text-gray-900 text-xl">⚙️</button>
          <button className="text-gray-600 hover:text-gray-900 text-xl">👤</button>
        </div>
      </div>
    </header>
  )
}
