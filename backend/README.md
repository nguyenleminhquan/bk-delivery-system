| API | METHOD | DESCRIPTION | HEADER | BODY |
| :- | :- | :- | :- | :- |
| /user/register | POST | Register new user | | fullname: string <br /> email: string <br /> phone: string <br /> password: string <br /> typeUser: string  |
| /user/login | POST | Login user |  | email: string <br /> password: string |
| /user/token | POST | Refresh acccess token | Authorization: Bearer <refresh_token> <access_token> | email: string |
| /order | GET | Get all order | Authorization: Bearer <refresh_token> <access_token> | |
| /order | POST | Create new order | Authorization: Bearer <refresh_token> <access_token> | sender_address: string <br /> receiver_address: string <br/>payment_type: string<br/> cod_amount: number<br/>note: string<br/>status: string<br/>shipping_fee: number<br/>user_id: objectId<br>items:<br> [{ <br/>name: string, <br>quantity: number, <br>type: string, <br>weight: number<br>}] |
| /order/id | GET | Get order by id | Authorization: Bearer <refresh_token> <access_token> | |