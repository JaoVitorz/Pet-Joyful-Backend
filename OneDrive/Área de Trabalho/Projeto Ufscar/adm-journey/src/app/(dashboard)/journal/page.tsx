export default function JournalPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Diário</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Minhas Anotações</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">+ Nova Anotação</button>
        </div>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-500">15 de Fevereiro de 2026</p>
            <h3 className="font-semibold text-gray-800 mt-2">Primeira anotação</h3>
            <p className="text-gray-700 mt-2">Bem-vindo ao seu diário! Comece a registrar seus pensamentos e reflexões aqui.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
