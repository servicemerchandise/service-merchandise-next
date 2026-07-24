import ProductoEditor from '../ProductoEditor';

export default function EditarProductoPage({ params }: { params: { id: string } }) {
  return <ProductoEditor id={params.id} />;
}