declare module '../../services/location/LocationService.ts' {
  export const LocationProvider: React.FC;
  export const useLocation: () => {
    departments: string[];
    cities: string[];
    getCitiesByDepartment: (departmentId: string) => Promise<void>;
  };
}
