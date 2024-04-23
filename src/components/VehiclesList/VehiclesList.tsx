import React, { useState, useEffect } from 'react';
import './style.scss';
import { Vehicle } from '../../app/App';
import { getAddress } from '../../utils/getAddress';

interface VehiclesListProps {
    vehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles, setVehicles }) => {
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentSort, setCurrentSort] = useState<{ sortBy: string, sortOrder: 'asc' | 'desc' }>({ sortBy: '', sortOrder: 'asc' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);
    const [addresses, setAddresses] = useState<{ [key: string]: string | null }>({});
    const [loadingAddresses, setLoadingAddresses] = useState<{ [key: string]: boolean }>({});

    const handleSort = (sortBy: string) => {
        const newSortOrder = sortBy === currentSort.sortBy && currentSort.sortOrder === 'asc' ? 'desc' : 'asc';

        const sortedVehicles = [...vehicles].sort((a, b) => {
            if (sortBy === 'year') {
                return newSortOrder === 'asc' ? a.year - b.year : b.year - a.year;
            } else if (sortBy === 'price') {
                return newSortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            }
            return 0;
        });

        setVehicles(sortedVehicles);
        setSortBy(sortBy);
        setSortOrder(newSortOrder);
        setCurrentSort({ sortBy, sortOrder: newSortOrder });
    };

    const handleEdit = (id: number) => {
        const vehicleToEdit = vehicles.find(vehicle => vehicle.id === id);
        if (vehicleToEdit) {
            setEditingId(id);
            setEditedVehicle(vehicleToEdit);
        }
    };

    const handleSave = (id: number) => {
        const updatedVehicles = vehicles.map(vehicle => {
            if (vehicle.id === id) {
                return editedVehicle!;
            }
            return vehicle;
        });
        setVehicles(updatedVehicles);
        setEditingId(null);
        setEditedVehicle(null);
    };

    const handleDelete = (id: number) => {
        const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
        setVehicles(updatedVehicles);
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            const newAddresses: { [key: string]: string | null } = {};
            const newLoadingAddresses: { [key: string]: boolean } = {};
            for (const vehicle of vehicles) {
                try {
                    newLoadingAddresses[vehicle.id.toString()] = true;
                    const address = await getAddress(vehicle.latitude, vehicle.longitude);
                    newAddresses[vehicle.id.toString()] = address;
                } catch (error) {
                    console.error('Error fetching address:', error);
                    newAddresses[vehicle.id.toString()] = null;
                } finally {
                    newLoadingAddresses[vehicle.id.toString()] = false;
                }
            }
            setAddresses(newAddresses);
            setLoadingAddresses(newLoadingAddresses);
        };

        fetchAddresses();
    }, [vehicles]);

    return (
        <div className='vehicles-list'>
            <h2>Список автомобилей</h2>
            <div className='vehicles-list_sort'>
                <span>Сортировка:</span>
                <button className={sortBy === 'year' ? 'active' : ''} onClick={() => handleSort('year')}>
                    Год {sortBy === 'year' && sortOrder === 'asc' ? '▲' : '▼'}
                </button>
                <button className={sortBy === 'price' ? 'active' : ''} onClick={() => handleSort('price')}>
                    Цена {sortBy === 'price' && sortOrder === 'asc' ? '▲' : '▼'}
                </button>
            </div>
            <ul>
                {vehicles.map(vehicle => (
                    <li key={vehicle.id}>
                        {editingId === vehicle.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedVehicle?.name}
                                    onChange={e => setEditedVehicle({ ...editedVehicle!, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editedVehicle?.model}
                                    onChange={e => setEditedVehicle({ ...editedVehicle!, model: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editedVehicle?.price}
                                    onChange={e => setEditedVehicle({ ...editedVehicle!, price: parseInt(e.target.value, 10) })}
                                />
                                <button onClick={() => handleSave(vehicle.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <strong>{vehicle.name} {vehicle.model}</strong>
                                <p>Год: {vehicle.year}</p>
                                <p>Цвет: {vehicle.color}</p>
                                <p>Цена: {vehicle.price}</p>
                                <p>Широта: {vehicle.latitude}, Долгота: {vehicle.longitude}</p>
                                <div className='vehicles-list_address'>
                                    <p>Адрес: </p>
                                    {loadingAddresses[vehicle.id.toString()] !== undefined ? (
                                        loadingAddresses[vehicle.id.toString()] ? (
                                        <Spinner />
                                        ) : (
                                        <p>{addresses[vehicle.id.toString()] || 'N/A'}</p>
                                        )
                                    ) : (
                                        <Spinner />
                                    )}
                                </div>
                                <button onClick={() => handleEdit(vehicle.id)}>Изменить</button>
                                <button onClick={() => handleDelete(vehicle.id)}>Удалить</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Spinner: React.FC = () => {
	return (
		<div className="spinner-container">
			<div className="spinner" />
		</div>
	);
};

export default VehiclesList;