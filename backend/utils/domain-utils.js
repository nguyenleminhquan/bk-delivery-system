import { AreaCodesData } from "../resources/area-codes.js"

function getAreaFullName(areaCode) {
  if (areaCode in AreaCodesData) {
    return AreaCodesData[areaCode].full_name
  } 
}

function getDomainFromProvinceCode(provinceCode) {
  for (const key in AreaCodesData) {
    if (AreaCodesData[key].codes.includes(provinceCode)) {
      return key
    }
  }
}

export {
  getAreaFullName,
  getDomainFromProvinceCode
}