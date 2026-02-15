export default function PresentationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Apresentações</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Minhas Apresentações</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">+ Nova</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800">Apresentação 1</h3>
            <p className="text-sm text-gray-600 mt-2">Pronta para apresentar</p>
            <div className="mt-4 flex space-x-2">
              <button className="text-blue-500 hover:underline">Editar</button>
              <button className="text-red-500 hover:underline">Deletar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
