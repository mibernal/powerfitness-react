//src\app\components\product-import\ProductImport.jsx:
import React, { useState } from 'react';
import './ProductImport.scss';
import CsvParserService from '../../services/csv-parser.service'; // Adjust the import based on your service's structure

const ProductImport = () => {
  const [file, setFile] = useState(null);

  const handleFileInput = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const importCSV = () => {
    if (file) {
      CsvParserService.importProductsFromCSV(file); // Call your service method
    }
  };

  return (
    <div className="product-import-container">
      <h1 className="product-import-title">Product Import</h1>
      <input
        className="product-import-input"
        type="file"
        onChange={handleFileInput}
      />
      <p>
        <button className="product-import-button" onClick={importCSV}>
          Import CSV
        </button>
      </p>
    </div>
  );
};

export default ProductImport;
