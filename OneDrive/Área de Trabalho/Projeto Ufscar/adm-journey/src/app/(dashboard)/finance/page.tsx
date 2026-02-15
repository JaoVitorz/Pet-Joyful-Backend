export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestão Financeira</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Saldo Total</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ 5.420</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Despesas Mês</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">R$ 1.250</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Economias</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">R$ 2.100</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Transações</h2>
        <div className="space-y-3">
          <p className="text-gray-600">Nenhuma transação registrada</p>
        </div>
      </div>
    </div>
  )
}
