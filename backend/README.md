| API | METHOD | DESCRIPTION | HEADER | BODY |
| :- | :- | :- | :- | :- |
| /user/register | POST | Register new user | | fullname: string <br /> email: string <br /> phone: string <br /> password: string <br /> typeUser: string  |
| /user/login | POST | Login user |  | email: string <br /> password: string |
| /user/token | POST | Refresh acccess token | Authorization: Bearer <refresh_token> <access_token> | email: string |
| /user/working-day | GET | Get working days | Authorization: Bearer <refresh_token> <access_token> | |
| /user/working-day | POST | Update working day | Authorization: Bearer <refresh_token> <access_token> | time: string (recommend using Date.now()) |
| /order | GET | Get all order | Authorization: Bearer <refresh_token> <access_token> | |
| /order | POST | Create new order | Authorization: Bearer <refresh_token> <access_token> | sender_address: string <br /> receiver_address: string <br/>payment_type: string<br/> cod_amount: number<br/>note: string<br/>status: string<br/>shipping_fee: number<br/>user_id: objectId<br>items:<br> [{ <br/>name: string, <br>quantity: number, <br>type: string, <br>weight: number<br>}] |
| /order/:id | GET | Get order by id | Authorization: Bearer <refresh_token> <access_token> | |
| /order/:id | DELETE | Delete order by id | Authorization: Bearer <refresh_token> <access_token> | |
| /order/:id | PATCH | Edit order by id | Authorization: Bearer <refresh_token> <access_token> | Data |
| /order/:id/update-status | PATCH | Edit order status by id | Authorization: Bearer <refresh_token> <access_token> | status: string |
| /delivery?status=...&area_code=... | GET | Get delivery by status and area code | Authorization: Bearer <refresh_token> <access_token> | |
| /delivery | POST | Create new delivery | Authorization: Bearer <refresh_token> <access_token> | order_id: string <br /> driver_id: string (optional) <br /> status: string <br /> area_code: number <br /> from: string <br /> to: string |
| /delivery/history/:driverId | GET | Get delivery history | Authorization: Bearer <refresh_token> <access_token> | |
| /delivery/:id/update-status | PATCH | Change the status of delivery | Authorization: Bearer <refresh_token> <access_token> | status: string |
| /delivery/:id/accept-delivery | PATCH | Driver accept the waiting delivery | Authorization: Bearer <refresh_token> <access_token> | driver_id: string |
| /stock| POST | Import order to stock | Authorization: Bearer <refresh_token> <access_token> | order_id: string <br /> stock_id: string <br /> stocker_id: string|
| /stock/:stock_id/orders| GET | Get all orders in the stock with stock_id | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle | GET | Get all vehicle | Authorization: Bearer <refresh_token> <access_token> |  |
| /vehicle | POST | Add vehicle | Authorization: Bearer <refresh_token> <access_token> | max_weight: string <br/> from: string <br/> to: string <br/> license_plate_number: string |
