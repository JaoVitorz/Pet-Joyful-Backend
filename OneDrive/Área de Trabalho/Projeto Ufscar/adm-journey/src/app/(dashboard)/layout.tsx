import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - ADM Journey',
  description: 'Dashboard principal',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">ADM Journey</h1>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-3">
            <li>
              <a href="/academic" className="block px-4 py-2 rounded hover:bg-gray-100">
                📚 Acadêmico
              </a>
            </li>
            <li>
              <a href="/finance" className="block px-4 py-2 rounded hover:bg-gray-100">
                💰 Financeiro
              </a>
            </li>
            <li>
              <a href="/summaries" className="block px-4 py-2 rounded hover:bg-gray-100">
                📊 Resumos
              </a>
            </li>
            <li>
              <a href="/presentations" className="block px-4 py-2 rounded hover:bg-gray-100">
                🎤 Apresentações
              </a>
            </li>
            <li>
              <a href="/journal" className="block px-4 py-2 rounded hover:bg-gray-100">
                📖 Diário
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">🔔</button>
              <button className="text-gray-600 hover:text-gray-900">⚙️</button>
              <button className="text-gray-600 hover:text-gray-900">👤</button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
