// Importamos React y el tipo para el control de formularios
import React from 'react';

// Función de validación para React
export function minLengthValidator(minLength: number) {
  return (value: string) => {
    if (value && value.length < minLength) {
      return 'La longitud debe ser al menos de ' + minLength + ' caracteres';
    }
    return null; // Si no hay error, retornamos null
  };
}
