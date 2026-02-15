export default function AcademicPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestão Acadêmica</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Disciplinas</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">6</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Média Geral</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8.5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-600">Créditos</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">120</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Disciplinas Inscritas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Disciplina
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Professor
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nota</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700">Programação</td>
                <td className="px-6 py-4 text-sm text-gray-700">Prof. Silva</td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-600">8.5</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    Aprovado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
