# Fan Club Portal
### About
With not much to do amidst the lockdown, most of us have sought solace in Movies and web-series. And many times, some character (be it real or fictitious) catches our eye, and we cannot help but become their die-hard fans. Fan Club Portal is for every loyal fan out there. In this App, Users can create a chat room for any movie/series they like which can be followed by other fans logged into the portal.


### Key inclusions:
- Authentication is must for each user.
- Authentication using JWT and Google OAuth both are added.
- Email verification is must to activate the account (when JWT authentication is used i.e. using sign up form).
- All fans registered for the first time will be redirected to their profile page, where they have to complete their profile details like: hobbies, favourite character, favourite Show etc. Completing profile details are must to create and join any chatroom.
- Homepage shows all chatrooms followed by user.
- Clicking on a certain chat room redirects the User to another page displaying the chat messages, chat room members and the active chat room members.
- Clicking on any chat room member will redirect the user to their profile page.
- Users can share text messages and images in the chat rooms. The messages will have the timestamps displayed alongside them.
- Users sent and received messages are shown on different side of chatroom and with different colors.
- The User can also create a new chat room by providing the Title, optional display picture, and a short description of the chat room. The creator plainly becomes the Admin of the chat room.
- The Admin of the chat room can assign other fans the role of admins of the room.
- Users can see chatroom details by clicking on info button in any chatroom. Only the Admins will have permissions to edit the chat room details (i.e. name, description, display picture). 
- Real time updating of messages using Socket.io.
- View all chat in the hamburger redirects the User to the All Fan Clubs Page that lists all the chat rooms ever created. The User may follow any chat room and can then become its member.
- A leaderboard to keep a record of the top fans based on their activity.
- A leaderboard to keep a record of the top chatrooms based on their activity.
- Search feature to search for chatrooms.
- Error Handing in all forms (i.e. verification of proper email address, etc using regex)


### Major Tech Stack:
React, Nodejs, MongoDB, Express, Nodemailer, Socket.io

### Preview:

**Login Page**
![login](https://user-images.githubusercontent.com/60233336/111861390-e9b30500-8973-11eb-85a2-ee4c7ecefd15.gif)
<br>

**Chatrooms Followed Page**
![Screenshot from 2021-03-20 11-24-25](https://user-images.githubusercontent.com/60233336/111861402-ffc0c580-8973-11eb-895d-17df4f8f16a7.png)
<br>

**Individual Chatroom Page**
![chatroom](https://user-images.githubusercontent.com/60233336/111861408-0d764b00-8974-11eb-8b21-a57f01d4f4f6.gif)
<br>

**All Chatroom Page**
![Screenshot from 2021-03-20 11-24-57](https://user-images.githubusercontent.com/60233336/111861417-1a933a00-8974-11eb-9768-1fbdd9c55485.png)

<br>

**Fans Leaderboard Page**
![Screenshot from 2021-03-20 11-54-36](https://user-images.githubusercontent.com/60233336/111861424-23840b80-8974-11eb-8b9d-b74b81342490.png)
<br>

**Chatroom Leaderboard Page**
![Screenshot from 2021-03-20 11-54-03](https://user-images.githubusercontent.com/60233336/111861431-34cd1800-8974-11eb-9a05-7b54baf9c8af.png)
<br>

### Installation

```
Open terminal
https://github.com/saurabhhere/Fan-club-portal.git
cd Fan-club-portal
```
For client side:
```
cd client
npm install
npm start
```
For server side:
```
cd server
npm install 
nodemon server
```
Add .env file in server folder containing:
```
PORT = 5000
CONNECTION_URL = your_mongo_connection_string
JWT_SECRET = your_secret_string
EMAIL= your_yahoo_email
PASSWORD= your_email_password
CLIENT_URL=http://localhost:3000
```
Add keys.js on client side inside src folder:
```
module.exports = {
    clientId: "your_google_clientId"
}
```
Add keys.js on server side inside config folder:
```
module.exports = {
    google: {
        clientID: "your_google_client_id",
        clientSecret: "your_google_client_secret"
    }
}
```
Specially developed for IMG, IIT ROORKEE :heart:




