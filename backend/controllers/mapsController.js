import Stock from "../models/Stock.js"
import Vehicle from "../models/Vehicle.js"
import axios from "axios"
import createError from 'http-errors'

// Lấy thông tin chi tiết từ mảng stock_ids
async function getDetailStocks(stock_ids) {
  let result = []
  for (let i = 0; i < stock_ids.length; i++) {
    const stock = await Stock.findById(stock_ids[i])
    result.push(stock)
  }
  return result
}

// Tính khoảng cách giữa 2 point
async function calculateDistance(beginPoint, endPoint) {
  console.info("------>Function: calculateDistance")
  let api = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?travelMode=driving&origins=${beginPoint}&destinations=${endPoint}&key=${process.env.BING_MAPS_KEY}`
  // console.info("------>API: ", api)
  let result = await axios.get(api)
  return result.data.resourceSets[0].resources[0].results[0].travelDistance
}

// Tìm index của mảng visitedStocks mà đường đi dài nhất từ điểm bắt đầu đến mảng
async function findLongestDistanceFromOnePoint(beginPoint, visitedStocks) {
  console.info("------>Function: findLongestDistanceFromOnePoint")
  let markerIndex = 0
  let markerLongestDistance = -1
  let beginCoordinates = `${beginPoint.lat},${beginPoint.lon}`
  console.info(`------>Begin coordinates: ${beginCoordinates}`)
  let markerCoordinates = `${visitedStocks[markerIndex].lat},${visitedStocks[markerIndex].lon}`
  console.info(`------>Marker coordinates: ${markerCoordinates}`)
  markerLongestDistance = await calculateDistance(beginCoordinates, markerCoordinates)
  console.info(`------>Marker longest distance: ${markerLongestDistance}`)

  for (let i = 1; i < visitedStocks.length; i++) {
    let currentCoordinates = `${visitedStocks[i].lat},${visitedStocks[i].lon}`
    let currentDistance = await calculateDistance(beginCoordinates, currentCoordinates)
    console.info(`------>Current distance: ${currentDistance}, stock name: ${visitedStocks[i].name}`)
    console.info(`------>Current coordinates: ${currentCoordinates}`)
    if (currentDistance > markerLongestDistance) {
      markerIndex = i
      markerLongestDistance = currentDistance
    }
  }

  return markerIndex
}

// Tìm đường đi tối ưu giữa nhiều points
async function findOptimizedRoutes(queryString) {
  console.info("------>Function: findOptimizedRoutes")
  let api = `https://dev.virtualearth.net/REST/v1/Routes/Driving?${queryString}&optwp=true&optimize=timeWithTraffic&key=${process.env.BING_MAPS_KEY}`
  console.info(`------>API: ${api}`)
  let result = await axios.get(api)
  return result.data.resourceSets[0].resources[0].waypointsOrder
}

const findBestWayBetweenWaypoints = async (req, res, next) => {
  try {
    console.info("[API] Find best way between way points")

    const vehicle = await Vehicle.findById(req.params.id)
    const stocks = await getDetailStocks(vehicle.visitedStocks)

    if (stocks.length <= 1) {
      return res.json({ mgs: "Số lượng stock chưa cần thiết để dùng API này!"})
    }
    const originStock = (await Stock.find({ area_code: vehicle.from }))[0]

    console.info("--->Origin stock: ", originStock)
    if (stocks.length == 0) {
      return next(createError(400, 'Xe tải chưa có thông tin các kho cần ghé!'))
    }
    console.info(`--->visitedStocks length: ${stocks.length}`)

    const indexStockHasLongestDistance = await findLongestDistanceFromOnePoint(originStock, stocks)
    console.info(`--->index stock having longest distance: ${indexStockHasLongestDistance}`)
    console.info("--->Stock having longest distance from origin: ", stocks[indexStockHasLongestDistance])
    
    let queryString = `wp.0=${originStock.lat},${originStock.lon}`
    let count = 1
    for (let i = 0; i < stocks.length; i++) {
      if (i != indexStockHasLongestDistance) {
        queryString += `&wp.${count}=${stocks[i].lat},${stocks[i].lon}`
        count++
      }
    }
    queryString += `&wp${count}=${stocks[indexStockHasLongestDistance].lat},${stocks[indexStockHasLongestDistance].lon}`

    let findOptimize = await findOptimizedRoutes(queryString)
    console.info("--->", findOptimize)
    vehicle.recommend_ways = []

    for (let i = 1; i < findOptimize.length; i++) {
      let indexOfOptimizedArray = parseInt(findOptimize[i].split('.')[1])
      vehicle.recommend_ways.push(stocks[indexOfOptimizedArray]._id)
    }
    vehicle.recommend_ways.push(stocks[indexStockHasLongestDistance]._id)

    await vehicle.save()
    let vehicleDetailsRecommendWays = await Vehicle.findById(vehicle._id)
                                                    .populate('recommend_ways')

    return res.json(vehicleDetailsRecommendWays.recommend_ways)
  } catch (error) {
    return next(createError(400))
  }
}

export {
  findBestWayBetweenWaypoints
}