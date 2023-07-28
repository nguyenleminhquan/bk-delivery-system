import dataProvinceDepth2 from '../resources/province-depth-2.json' assert { type: "json" }
import dataProvinceDepth1 from '../resources/province-depth-1.json' assert { type: "json" }
import {
  getDomainFromProvinceCode
} from './domain-utils.js'
import axios from "axios";

function parseAddressString(address) {
  let parseAddress = address.split(", ")
  let length_parseAddress = parseAddress.length
  let areaAddress = parseAddress[length_parseAddress - 1]
  let districtAddress = parseAddress[length_parseAddress - 2]

  return [areaAddress, districtAddress]
}

function getDomainFromString(address) {
  let parseAddress = parseAddressString(address)
  let domain = ""

  dataProvinceDepth1.forEach(province => {
    if (province.name.includes(parseAddress[0])) {
      console.log(`Province name: ${province.name}`)
      console.log(`Province code: ${province.code}`)
      domain = getDomainFromProvinceCode(province.code)
    }
  })

  return domain
}

function getAreaCodeAndDistrictCodeFromString(address) {
  let parseAddress = parseAddressString(address)

  let areaCode = -1
  let districtCode = -1

  dataProvinceDepth2.forEach(province => {
    if (province.name.includes([parseAddress[0]])) {
      console.log(`Province name: ${province.name}`)
      console.log(`Province code: ${province.code}`)
      areaCode = province.code

      province.districts.forEach(district => {
        if (district.name.includes(parseAddress[1])) {
          console.log(`District name: ${district.name}`)
          console.log(`District code: ${district.code}`)
          districtCode = district.code
        }
      })
    }
  })

  if (areaCode != -1 && districtCode != -1) {
    return [areaCode, districtCode]
  } else {
    return new Error("Invalid address")
  }
}

async function convertAddressToCoordinates(address) {
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
    console.log(error);
  }
}

async function calculateDistance(origins, destinations, travelMode='driving') {
  const apiUrl = 'https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix';
  const key = 'Ap4o60ux5Ozb0VwHbgqPxPk-aoGdSRq2VdR_zYT4ogd5rvhYvA_cD-V-u4WlNyIA';

  try {
    const res = await axios.get(`${apiUrl}?origins=${origins}&destinations=${destinations}&travelMode=${travelMode}&key=${key}`);
    return res.data.resourceSets[0].resources[0].results[0].travelDistance;
  } catch (error) {
    console.log(error);
  }
}


export {
  getAreaCodeAndDistrictCodeFromString,
  getDomainFromString,
  convertAddressToCoordinates,
  calculateDistance,
}

// // console.log(getDomainFromString("1544 Ngô Quyền, thị xã Cai , Huyện Năm Căn, Tỉnh Cà Mau"))
// // console.log(getAreaCodeAndDistrictCodeFromString("1544 Ngô Quyền, thị xã Cai , Huyện Năm Căn, Tỉnh Cà Mau"))
// console.log(calculateDistance('9.547330887567275,105.9881875110322', '10.760091892776083,106.66269048471909', 'driving'))