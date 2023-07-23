import axios from "axios";
import { toast } from "react-toastify";

export const convertAddressToCoordinates = async (address) => {
  const apiUrl = 'https://nominatim.openstreetmap.org/search';
  const format = 'json';

  try {
    const res = await axios.get(`${apiUrl}?q=${encodeURIComponent(address)}&format=${format}`);
    if (res.data.length > 0) {
      const result = res.data[0];
      const lat = Number(Number(result.lat).toFixed(3));
      const lon = Number(Number(result.lon).toFixed(3));
      return {lat, lon};
    } else {
      console.log('No results found');
    }
  } catch (error) {
    toast.error(error);
    return null;
  }
}
