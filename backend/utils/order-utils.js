import dataProvinceDepth2 from '../resources/province-depth-2.json' assert { type: "json" }
import dataProvinceDepth1 from '../resources/province-depth-1.json' assert { type: "json" }
import {
  getDomainFromProvinceCode
} from './domain-utils.js'

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

export {
  getAreaCodeAndDistrictCodeFromString,
  getDomainFromString
}

console.log(getDomainFromString("1544 Ngô Quyền, thị xã Cai , Huyện Năm Căn, Tỉnh Cà Mau"))
console.log(getAreaCodeAndDistrictCodeFromString("1544 Ngô Quyền, thị xã Cai , Huyện Năm Căn, Tỉnh Cà Mau"))