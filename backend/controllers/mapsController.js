import Stock from "../models/Stock.js"
import Vehicle from "../models/Vehicle.js"
import axios from "axios"

async function getDetailStocks(stock_ids) {
  let result = []
  for (let i = 0; i < stock_ids.length; i++) {
    const stock = await Stock.findById(stock_ids[i])
    result.push(stock)
  }
  return result
}

function returnRecommendWayString(beginPoint, visitedStocks) {

}

async function calculateDistance(beginPoint, endPoint) {
  let api = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?travelMode=driving&origins=${beginPoint}&destinations=${endPoint}&key=${process.env.BING_MAPS_KEY}`
  let result = await axios.get(api)
  return result.data.resourceSets[0].resources[0].results[0].travelDistance
}



// Tìm đường đi dài nhất từ điểm bắt đầu đến một mảng các stock
function findLongestDistanceFromOnePoint(beginPoint, visitedStocks) {
  let markerIndex = 0
  let markerLongestDistance = -1


  for (let i = 0; i < visitedStocks.length; i++) {

  }
}

const findBestWayBetweenWaypoints = async (req, res, next) => {
  try {
    console.info("[API] Find best way between way points")

    const vehicle = await Vehicle.findById(req.params.id)
    const stocks = await getDetailStocks(vehicle.visitedStocks)
    const originStock = (await Stock.find({ area_code: vehicle.from }))[0]

    console.info("--->Origin stock: ", originStock)
  
    if (stocks.length == 1) {

    } else {

    }

    let waypoints = vehicle.waypoints
    return res.json("Hello")
    // if (waypoints.length )
  } catch (error) {
    
  }
}

export {
  findBestWayBetweenWaypoints
}