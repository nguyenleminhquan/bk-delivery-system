| API | METHOD | DESCRIPTION | HEADER | BODY |
| :- | :- | :- | :- | :- |
| /user/register | POST | Register new user | | fullname: string <br /> email: string <br /> phone: string <br /> password: string <br /> typeUser: string  |
| /user/login | POST | Login user |  | email: string <br /> password: string |
| /user/token | POST | Refresh acccess token | Authorization: Bearer <refresh_token> <access_token> | email: string |
| /user/working-day | GET | Get working days | Authorization: Bearer <refresh_token> <access_token> | |
| /user/working-day | POST | Update working day | Authorization: Bearer <refresh_token> <access_token> | time: string (recommend using Date.now()) |
| /user/:id/update | POST | Update user info | Authorization: Bearer <refresh_token> <access_token> | information you want to update |
| /user/:id | DELETE | Delete user | Authorization: Bearer <refresh_token> <access_token> | |
| /user/employee | GET | Get all employee | Authorization: Bearer <refresh_token> <access_token> | |
| /order | GET | Get all order | Authorization: Bearer <refresh_token> <access_token> | |
| /order | POST | Create new order | Authorization: Bearer <refresh_token> <access_token> | sender_address: string <br /> receiver_address: string <br/>payment_type: string<br/> cod_amount: number<br/>note: string<br/>status: string<br/>shipping_fee: number<br/>user_id: objectId<br>items:<br> [{ <br/>name: string, <br>type: string, <br>weight: number<br>}] |
| /order/:id | GET | Get order by id | Authorization: Bearer <refresh_token> <access_token> | |
| /order/:id | DELETE | Delete order by id | Authorization: Bearer <refresh_token> <access_token> | |
| /order/:id | PATCH | Edit order by id | Authorization: Bearer <refresh_token> <access_token> | Data |
| /order/:id/update-status | PATCH | Edit order status by id | Authorization: Bearer <refresh_token> <access_token> | status: string |
| /delivery?status=...&area_code=... | GET | Get delivery by status and area code | Authorization: Bearer <refresh_token> <access_token> | |
| /delivery | POST | Create new delivery | Authorization: Bearer <refresh_token> <access_token> | order_id: string <br /> driver_id: string (optional) <br /> status: string <br /> area_code: number <br /> from: string <br /> to: string |
| /delivery/history/:driverId | GET | Get delivery history | Authorization: Bearer <refresh_token> <access_token> | |
| /delivery/:id/update-status | PATCH | Change the status of delivery | Authorization: Bearer <refresh_token> <access_token> | status: string |
| /delivery/:id/accept-delivery | PATCH | Driver accept the waiting delivery | Authorization: Bearer <refresh_token> <access_token> | driver_id: string |
| /stock| GET | Get all stock | Authorization: Bearer <refresh_token> <access_token> | |
| /stock/:id/vehicles | GET | Get all vehicle at this stock | Authorization: Bearer <refresh_token> <access_token> | |
| /stock/:stockId/vehicle/:vehicleId/avail-orders | GET | Get available orders for vehicle at one stock | Authorization: Bearer <refresh_token> <access_token> | |
| /stock| POST | Add stock | Authorization: Bearer <refresh_token> <access_token> | name: string <br/> address: string <br/> area_code: number |
| /stock/:id | DELETE | Delete stock | Authorization: Bearer <refresh_token> <access_token> | |
| /stock/:id | PATCH | Edit stock | Authorization: Bearer <refresh_token> <access_token> | address: string |
| /stock/order | POST | Import order to stock | Authorization: Bearer <refresh_token> <access_token> | {order_ids: string <br /> stock_id: string <br /> stocker_id: string<br/>vehicle_id: string}|
| /stock/:stock_id/order | GET | Get all orders in the stock with stock_id | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle | GET | Get all vehicle | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle/:id/order | GET | Get all orders by vehicle id | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle/:id/order?filter=stock&stock_id=<stock_id> | GET | Get all orders by vehicle id and filter by stock | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle | POST | Add vehicle | Authorization: Bearer <refresh_token> <access_token> | max_weight: string <br/> from: string <br/> to: string <br/> license_plate_number: string |
| /vehicle/search?from=`number`&to=`number` | GET | Filter vehicle by route | Authorization: Bearer <refresh_token> <access_token> | |
| /vehicle/:id/order | POST | Push order to vehicle | Authorization: Bearer <refresh_token> <access_token> | { list_orders: [array of order_id] <br>stock_id: id } |
| /vehicle/order/:order_id | DELETE | Delete order from vehicle | Authorization: Bearer <refresh_token> <access_token> | {vehicle_id: string <br/>stock_id: string <br/>} |
| **OBSELETED** /vehicle/:id/avail-order | GET | Get available orders for the vehicle | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle/:id/export-order | POST | Export order on vehicle | Authorization: Bearer <refresh_token> <access_token> | { stocker_id: id } |
| /vehicle/region/:id/search?exported=<true\|false> | GET | Get all vehicle by region and status | Authorization: Bearer <refresh_token> <access_token> |  |
| /user/create-account | POST | Create account for stocker and driver | Authorization: Bearer <refresh_token> <access_token> | information you want to create |
| /user/edit-account/:id | POST | Edit account for stocker and driver | Authorization: Bearer <refresh_token> <access_token>  | information you want to create |
| /exportinfo/:id/download | GET | Get export information | Authorization: Bearer <refresh_token> <access_token> |  |
| /maps/vehicle/:vehicle_id/best-way | GET | Find best way between multiple points | Authorization: Bearer <refresh_token> <access_token> |  |
