export const metadata = { title: 'Términos y condiciones' };

export default function TerminosPage() {
  return (
    <section className="container-page py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-sm-700 mb-4">Tratamiento de datos personales</h1>
      <div className="prose prose-sm max-w-none text-gray-700">
        <p>Al utilizar Service Merchandise aceptas los siguientes puntos:</p>
        <h3>1. Solo recopilamos los datos necesarios.</h3>
        <p>2. Usamos tu información de forma segura y confidencial.</p>
        <h3>3. No compartimos tus datos sin tu autorización.</h3>
        <p>4. Protegemos tu información con medidas de seguridad.
        </p>
        <h3>5. Puedes actualizar o solicitar la eliminación de tus datos.</h3>
        <p>6. Respetamos tu privacidad y cumplimos la normativa vigente.</p>
        <h3>.    </h3>
        <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
      </div>
    </section>
  );
}