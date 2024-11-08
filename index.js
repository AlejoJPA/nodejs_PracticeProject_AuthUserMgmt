const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/friends.js');
const router = require('./router/friends.js');

let users = []

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const app = express();

app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));

app.use(express.json());

// Middleware to authenticate requests to "/friends" endpoint
app.use("/friends", function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Login endpoint
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Register a new user
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

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


const PORT =5000;

app.use("/friends", routes);

app.listen(PORT,()=>console.log("Server is running"));
