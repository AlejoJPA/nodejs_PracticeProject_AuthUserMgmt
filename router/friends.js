const express = require('express');

const router = express.Router();

let friends = {
    "johnsmith@gamil.com": {"firstName": "John","lastName": "Doe","DOB":"22-12-1990"},
    "annasmith@gamil.com":{"firstName": "Anna","lastName": "smith","DOB":"02-07-1983"},
    "peterjones@gamil.com":{"firstName": "Peter","lastName": "Jones","DOB":"21-03-1989"}
};


// GET request: Retrieve all friends
//router.get("/",(req,res)=>{
  // Update the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
 // res.send(friends)
//});

// GET by specific ID request: Retrieve a single friend with email ID
//router.get("/:email",(req,res)=>{
  // Update the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
//  res.send(JSON.stringify({friends}, null, 4));
//});


// POST request: Add a new friend
//router.post("/",(req,res)=>{
  // Update the code here
//  res.send("Yet to be implemented")//This line is to be replaced with actual return value
//});


// PUT request: Update the details of a friend with email id
//router.put("/:email", (req, res) => {
  // Update the code here
//  res.send("Yet to be implemented")//This line is to be replaced with actual return value
//});


// DELETE request: Delete a friend by email id
//router.delete("/:email", (req, res) => {
  // Update the code here
//  res.send("Yet to be implemented")//This line is to be replaced with actual return value
//});


//API endpoint to retrieve friendly users (Authenticated users)
// route handler for GET requests to the root path "/"
router.get("/",(req, res) => {
    res.send(JSON.stringify(friends, null, 4));
});

//API endpoint to retrieve Authenticated users email and send it to the client
router.get("/:email", (req,res) =>{
    //Retrieve email parameter and send it to client
    const email = req.params.email;
    res.send(friends[email]);
});

//Add (CRUD: CREATE, post) the new user to the JSON/dictionary (i.e. friends = {...} @ router/friends.js)
router.post("/", (req,res)=>{
    // Check if email is provided in the request body
    if (req.body.email) {
        friends[req.body.email]= {
            "firstName" : req.body.firstName,
            "lastName" : req.body.lastName,
            "DOB": req.body.BOD
        };
    }
    res.send("The user" + (' ') + (req.body.firstName) + " Has been added!");
});

//Update (CRUD: UPDATE, put) a user in the JSON/dictionary (i.e. friends = {...} @ router/friends.js)
router.put("/email", (req,res)=>{
    const email = req.params.email;
    let friend = friends[email]; // Retrieve friend object associated with email
    if (friend) {
        let DOB = req.body.DOB;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        // Update DOB,firstName and lastName if provided in request body
        if (DOB) {
            friend["DOB"] = DOB;
        };

        if (firstName) {
            friend["firstName"] = firstName;
        };

        if (lastName) {
            friend["lastName"] = lastName;
        };

        friends[email] = friend; // Update friend details in 'friends' object
        res.send(`Friend with the email ${email} updated.`);
    } else {
        res.send(`Unable to find friend!`);
    }
});

//Delete friend
router.delete("/:email", (req, res) => {
    // Extract email parameter from request URL
    const email = req.params.email;
    
    if (email) {
        // Delete friend from 'friends' object based on provided email
        delete friends[email];
    }
    // Send response confirming deletion of friend
    res.send(`Friend with the email ${email} deleted.`);
});


module.exports=router;
