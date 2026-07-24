export const metadata = { title: 'Política de privacidad' };

export default function PrivacidadPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-sm-700 mb-4">Política de privacidad</h1>
      <div className="prose prose-sm max-w-none text-gray-700">
        <p>En Service Merchandise respetamos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
        <h3>Datos que recopilamos</h3>
        <p>Recopilamos información de contacto (nombre, correo, teléfono, empresa, ciudad) cuando solicitas una cotización o te suscribes a nuestro newsletter.</p>
        <h3>Uso de la información</h3>
        <p>Usamos tus datos únicamente para procesar solicitudes de cotización, enviarte comunicaciones comerciales si lo autorizas y mejorar nuestros servicios.</p>
        <h3>Protección</h3>
        <p>Implementamos medidas técnicas y organizativas para proteger tu información.</p>
        <h3>Derechos</h3>
        <p>Puedes solicitar acceso, rectificación o eliminación de tus datos escribiéndonos a contacto@servicemerchandise.com.</p>
      </div>
    </section>
  );
}