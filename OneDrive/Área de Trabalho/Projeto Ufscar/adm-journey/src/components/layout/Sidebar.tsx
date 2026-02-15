// Sidebar Component
export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">ADM Journey</h1>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          <li>
            <a href="/" className="block px-4 py-2 rounded hover:bg-gray-100">
              📊 Dashboard
            </a>
          </li>
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
              📈 Resumos
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
  );
}
