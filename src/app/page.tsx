import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-2 sm:px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Plataforma de Visualización de Datos
          </h1>
          <div className="w-full mx-auto space-y-4">
            <p className="text-gray-600 text-center">
              Sube un archivo TXT con formato CSV para visualizar los datos en una tabla interactiva.
              El archivo debe contener campos como IMSI, ICC Id, Master MSISDN, y otros datos relacionados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[98%] mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-medium mb-2">Columnas visibles por defecto:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>ICC Id</li>
                  <li>Master MSISDN</li>
                  <li>Status</li>
                  <li>Prepaid Balance</li>
                  <li>Prepaid Expiry Date</li>
                  <li>Own Reference</li>
                </ul>
                <p className="mt-2 text-xs">
                  Puedes mostrar u ocultar columnas adicionales usando el botón de configuración en la tabla.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium mb-2">Opciones de paginación:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>20 filas por página (por defecto)</li>
                  <li>50 filas por página</li>
                  <li>100 filas por página</li>
                  <li>250 filas por página</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="w-[98%] mx-auto">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <FileUploader />
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Plataforma de respuesta rápida para visualización de datos</p>
        </footer>
      </div>
    </main>
  );
}
