// src\app\services\csv-writer.service.tsx:
import React, { useState } from 'react';

// Definir la interfaz para el tipo de datos de productos
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  size: string;
  sizes: string[];
  stock: number;
  discount: number;
  imageUrl: string;
  flavors: string[];
}

interface CsvWriterServiceProps {
  products: Product[];
}

const CsvWriterService: React.FC<CsvWriterServiceProps> = ({ products }) => {
const [downloadLink, setDownloadLink] = useState<HTMLAnchorElement | null>(null);

  // Función para generar el archivo CSV
  const generateCSV = () => {
    const csvContent = convertToCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    link.style.visibility = 'hidden';

    link.onload = () => {
      setDownloadLink(null); // Limpiar el estado del enlace temporal
      URL.revokeObjectURL(url); // Liberar el objeto URL
    };

    setDownloadLink(link); // Establecer el enlace temporal
  };

  // Función para convertir los productos en formato CSV
  const convertToCSV = (products: Product[]): string => {
    const headers = 'id,name,description,price,brand,category,size,sizes,stock,discount,imageUrl,flavors';
    const rows = products.map((product) => {
      const {
        id,
        name,
        description,
        price,
        brand,
        category,
        size,
        sizes,
        stock,
        discount,
        imageUrl,
        flavors,
      } = product;

      const sizesString = sizes ? sizes.join(';') : '';
      const flavorsString = flavors ? flavors.join(';') : '';

      return `${id},"${name}","${description}",${price},"${brand}","${category}","${size}","${sizesString}",${stock},${discount},"${imageUrl}","${flavorsString}"`;
    });

    return `${headers}\n${rows.join('\n')}`;
  };

  // Renderizar el botón para disparar la descarga
  return (
    <div>
      <button onClick={generateCSV} disabled={products.length === 0}>
        {products.length > 0 ? 'Download CSV' : 'No products available'}
      </button>
      {downloadLink && (
        <a href={downloadLink.href} download={downloadLink.download} style={{ display: 'none' }} ref={(el) => el && el.click()}>
          Descargar
        </a>
      )}
    </div>
  );
};

export default CsvWriterService;
