//src\app\services\csv-parser.service.tsx:
import { getFirestore, collection, addDoc } from 'firebase/firestore';

class CsvParserService {
  // Método para importar productos desde un archivo CSV
  async importProductsFromCSV(file: File): Promise<void> {
    const reader = new FileReader();

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          
          if (!csvData) {
            throw new Error("CSV file is empty.");
          }

          // Dividir las líneas del archivo CSV
          const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
          if (lines.length <= 1) {
            throw new Error("CSV file contains no valid data.");
          }

          // Obtener los encabezados
          const headers = lines[0].split(',');
          const products: any[] = [];

          // Procesar cada línea después de la primera (la cabecera)
          for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');

            // Asegurarse de que haya suficientes valores en cada línea
            if (currentLine.length < headers.length) {
              console.warn(`Skipping invalid row ${i + 1}: not enough columns.`);
              continue;
            }

            const product = {
              name: currentLine[0].trim(),
              description: currentLine[1].trim(),
              price: parseFloat(currentLine[2].trim()) || 0,
              brand: currentLine[3].trim(),
              category: currentLine[4].trim(),
              size: currentLine[5].trim(),
              sizes: currentLine[6] ? currentLine[6].split(';').map(s => s.trim()) : [],
              stock: parseInt(currentLine[7], 10) || 0,
              discount: parseFloat(currentLine[8].trim()) || 0,
              imageUrl: currentLine[9].trim(),
              flavors: currentLine[10] ? currentLine[10].split(';').map(f => f.trim()) : [],
            };

            // Validar los campos críticos
            if (!product.name || !product.price || !product.category) {
              console.warn(`Skipping invalid product at row ${i + 1}: Missing critical fields.`);
              continue;
            }

            products.push(product);
          }

          if (products.length === 0) {
            throw new Error("No valid products found in the CSV.");
          }

          // Subir los productos a Firestore
          const db = getFirestore();
          const productCollection = collection(db, 'productos');
          const batch = products.map((product) => addDoc(productCollection, product));

          // Esperar que todos los productos se agreguen
          await Promise.all(batch);

          console.log('Products added to Firestore:', products);
          resolve();
        } catch (error) {
          console.error('Error adding products to Firestore:', error);
          reject(error instanceof Error ? error.message : 'Unknown error');
        }
      };

      reader.onerror = (event) => {
        console.error('Error reading CSV file:', event.target?.error);
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  }
}

export default CsvParserService;
