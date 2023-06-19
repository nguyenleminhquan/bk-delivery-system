import ExportInfo from "../models/ExportInfo.js"
import Drive from "../models/Drive.js"
import createError from 'http-errors'

const downloadExportInfo = async (req, res, next) => {
  try {
    let exportInfo = await ExportInfo.findById(req.params.id)
    console.log(`exportInfo.vehicle_id: ${exportInfo.vehicle_id}`)

    let driver = await Drive.find({ vehicle_id: exportInfo.vehicle_id }).populate('driver_id')
    console.log(`driver: ${driver.driver_id}`)
    exportInfo = await ExportInfo.findById(req.params.id)
                      .populate('vehicle_id').populate('stocker_id').populate('orders')
    return res.json({ exportInfo, driver: driver })
  } catch (error) {
    return next(createError(400))
  }
}

export {
  downloadExportInfo
}