import { createContext, useContext, useState, ReactNode } from 'react';
import { Location } from '../types';
import { LOCATIONS } from '../utils/mockData';

interface LocationContextType {
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (location: Location) => void;
  updateLocation: (oldLocation: Location, newLocation: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>(LOCATIONS);

  const addLocation = (location: Location) => {
    setLocations([...locations, location]);
  };

  const removeLocation = (location: Location) => {
    setLocations(locations.filter(l => l !== location));
  };

  const updateLocation = (oldLocation: Location, newLocation: Location) => {
    setLocations(locations.map(l => l === oldLocation ? newLocation : l));
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation, removeLocation, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};