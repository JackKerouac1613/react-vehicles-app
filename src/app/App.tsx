import React, { useState, useEffect } from 'react';
import VehiclesList from '../components/VehiclesList/VehiclesList';
import './style.scss';
import Map from '../components/Map/Map';

export interface Vehicle {
    id: number;
    name: string;
    model: string;
    year: number;
    color: string;
    price: number;
    latitude: number;
    longitude: number;
}

const App: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://test.tspb.su/test-task/vehicles');
                if (!response.ok) {
                    throw new Error('Failed to fetch vehicles');
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className='container'>
            <h1>React Vehicles App</h1>
            <VehiclesList vehicles={vehicles} setVehicles={setVehicles} />
            <Map vehicles={vehicles} />
        </div>
    );
};

export default App;