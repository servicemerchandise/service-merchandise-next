export const metadata = { title: 'Términos y condiciones' };

export default function TerminosPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-sm-700 mb-4">Términos y condiciones</h1>
      <div className="prose prose-sm max-w-none text-gray-700">
        <p>Al utilizar Service Merchandise aceptas los siguientes términos.</p>
        <h3>Servicio</h3>
        <p>Service Merchandise es una plataforma B2B de cotización. No realizamos ventas en línea ni procesamos pagos a través de este sitio.</p>
        <h3>Propiedad intelectual</h3>
        <p>Todos los contenidos del sitio son propiedad de Service Merchandise o sus licenciantes.</p>
        <h3>Limitación de responsabilidad</h3>
        <p>Las cotizaciones tienen validez según los términos indicados en cada propuesta.</p>
        <h3>Ley aplicable</h3>
        <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
      </div>
    </section>
  );
}