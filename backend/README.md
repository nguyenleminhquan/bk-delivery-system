| API | METHOD | DESCRIPTION | HEADER | BODY |
| :- | :- | :- | :- | :- |
| /user/register | POST | Register new user | | fullname: string <br /> email: string <br /> phone: string <br /> password: string <br /> typeUser: string  |
| /user/login | POST | Login user |  | email: string <br /> password: string |
| /user/token | POST | Refresh acccess token | Authorization: Bearer <refresh_token> <access_token> | email: string |