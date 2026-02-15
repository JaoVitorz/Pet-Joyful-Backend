export default function SummariesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resumos e Relatórios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Relatório Acadêmico</h3>
          <p className="text-gray-600 mb-4">Visualize seu desempenho acadêmico em detalhes.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Ver Relatório</button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Relatório Financeiro</h3>
          <p className="text-gray-600 mb-4">Análise completa de suas movimentações financeiras.</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Ver Relatório</button>
        </div>
      </div>
    </div>
  )
}
