export async function getAddress(latitude: number, longitude: number): Promise<string> {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
		);
		const data = await response.json();

		const city = data.address.city || data.address.state || '';
		const road = data.address.road || '';
		const postcode = data.address.postcode || '';

		const address = `${city ? city + ', ' : ''}${road ? road + ', ' : ''}${postcode ? postcode : ''}`;

		return address;
	} catch (error) {
		console.error('Error fetching address:', error);
		return '';
	}
}