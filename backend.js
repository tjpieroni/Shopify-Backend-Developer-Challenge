// Create Express Node.js server and listen on port 3000
const express = require("express");
const Datastore = require("nedb");
const app = express();
app.listen(3000, () => console.log("server listening at port:3000...\nEnter 'localhost:3000/Inventory_Manager.html' into your URL..."));

// Serve static files from 'public' directory and recieve all requests in JSON 
app.use(express.static("public"));
app.use(express.json());

// Activate NEDB Database
const database = new Datastore("database.db");
database.loadDatabase();

// POST request, add new Item into the database and send the item including the unique _id back to the client
app.post("/api", (request,response) => {
    let requestData = request.body;
    database.insert(requestData, (err,newDoc) => {
        response.json(newDoc);
    });
});

// GET request, retrieve all Items from the database and send them to the client
app.get("/api", (request,response) => {
    database.find({}, (err,data) => {
        response.json(data)
    });
});

// PUT request, update the information of Item in the database and send the updated item to the client
app.put("/api", (request, response) =>{
    let requestData = request.body;
    database.update({_id: requestData.Id},{$set : {Name: requestData.Name, Price: requestData.Price, Quantity: requestData.Quantity, Category: requestData.Category}}, {} ,(err,data) => {
        database.find({_id: requestData.Id}, (err,data) =>{
            response.json(data[0]);         // Send back the sole Item object, instead of in a list
        });
    });
});


// DELETE request, delete an item from the database and send back the id of the deleted item
app.delete("/api", (request,response) =>{
    let requestData = request.body
    database.remove({_id: requestData.Id});
    response.json({id: requestData.Id});
});

