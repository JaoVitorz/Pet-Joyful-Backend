export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cards de Estatísticas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Média Acadêmica</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">8.5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Saldo</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ 1.250</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Tarefas</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Apresentações</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
        </div>
      </div>

      {/* Seção de Atividades Recentes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
        <div className="space-y-3">
          <p className="text-gray-600">Nenhuma atividade recente</p>
        </div>
      </div>
    </div>
  )
}
