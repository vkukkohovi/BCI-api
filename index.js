const { v4: uuidv4 } = require('uuid');
//uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const date = new Date();
const fs = require('fs');

app.use(bodyParser.json());

fs.readFile('usersDB.json', 'utf8', (err, usersData) => {
    if (err) {
        throw err;
    }
    const userDBparser = JSON.parse(usersData.toString());
    users.push(userDBparser);
});

fs.readFile('listingsDB.json', 'utf8', (err, listingsData) => {
    if (err) {
        throw err;
    }
    const listingsDBparser = JSON.parse(listingsData.toString());
    listings.push(listingsDBparser);
});

const users = [];
const listings = [];

app.post('/users', (req, res) => {
    //Create new user

    /* POST USER BODY
    {
        "username": "foo",
        "password": "bar",
        "email": "foo@bar.com",
        "firstName": "Mike",
        "lastName": "Hawk",
        "phoneNumber": "0401234567"
    }
    */

    const uniqueUserId = uuidv4();
    const findUser = users.find(u => u.id === (req.params.userName));

    if(findUser === undefined) {
        const newUser = {
            userId: uniqueUserId,
            userName: req.body.userName,
            passWord: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            createDate: date.toDateString()
        }
        users.push(newUser);
        const userData = JSON.stringify(newUser);
        fs.appendFile('usersDB.json', '\n{"":[' + userData + '\n]}', (err) => {
            if (err) {
                throw err;
            }
        console.log('Saved user to JSON DB');
    })
        res.sendStatus(201);
        console.log('created a new user');
        console.log(`User ID: ${uniqueUserId}`);
    } else {
        res.sendStatus(409);
        console.log('username taken')
    }
    
})
app.post('/users/:userId/items', (req, res) => {
    //Create new listing for user

    /* POST LISTING BODY
    {
        "itemTitle": "Laptop",
        "itemDescription": "Good one",
        "itemCategory": "Electronics",
        "itemLocation": "Oulu",
        "itemImages": "image.jpg",
        "itemPrice": "50",
        "itemDeliveryType": "Pickup"
    }
    */

    const uniqueItemId = uuidv4();
    const newListing = {
        itemId: uniqueItemId,
        itemTitle: req.body.itemTitle,
        itemDescription: req.body.itemDescription,
        itemCategory: req.body.itemCategory,
        itemLocation: req.body.itemLocation,
        itemImages: req.body.itemImages,
        itemPrice: req.body.itemPrice,
        itemDeliveryType: req.body.itemDeliveryType
    }
    listings.push(newListing);

    const listingData = JSON.stringify(newListing);
    fs.appendFile('listingsDB.json', '\n{"":[' + listingData + '\n]}', (err) => {
        if (err) {
            throw err;
        }
        console.log('Saved listing to JSON DB');
    })
    res.sendStatus(201);
    console.log('Created a new listing');
    console.log(`Listing ID: ${uniqueItemId}`);
})

app.get('/users', (req, res) => {
    //Return list of users
    res.send(users);
    console.log('fetched list of users');
})
app.get('/listings/id', (req, res) => {
    //Return all listings by id
    res.send(listings);
    console.log('fetched all listing IDs');
})
app.get('/listings/:itemTitle', (req, res) => {
    //Return searched items
    const listing = listings.find(l => l.id === (req.params.itemTitle));
    if(listing === undefined) {
        res.sendStatus(404);
    } else {
        res.json(listings[req.params.itemTitle])
    }
    res.send(listings[listings.itemTitle]);
    console.log('fetches list of items on server');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})