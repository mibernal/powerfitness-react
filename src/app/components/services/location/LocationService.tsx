//src\app\components\services\location\LocationService.tsx:
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface LocationContextType {
  departments: string[];
  cities: string[];
  getCitiesByDepartment: (departmentId: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';
  const [departments, setDepartments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get<any[]>(apiUrl);
        const uniqueDepartments = Array.from(new Set(response.data.map((department) => department.departamento)));
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [apiUrl]);

  const getCitiesByDepartment = async (departmentId: string): Promise<void> => {
    if (departmentId) {
      try {
        const response = await axios.get<any[]>(apiUrl, { params: { departamento: departmentId } });
        const cityNames = response.data.map((city) => city.municipio);
        setCities(cityNames); // Actualiza las ciudades en el estado
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setCities([]); // Limpia las ciudades si no hay departamento seleccionado
    }
  };
  

  return (
    <LocationContext.Provider value={{ departments, cities, getCitiesByDepartment }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
