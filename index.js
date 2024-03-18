const http = require('http')
const users = require('./userDb')

function getBodyFromStream(req) {
    return new Promise ((resolve, reject) => {
        const data = [];
        req.on("data", (chunk) => {
            data.push(chunk);
        });
        req.on("end", () => {
            const body = Buffer.concat(data).toString();
            if (body) { //if body is a json object
                resolve(JSON.parse(body));
                return;
            }
            resolve({}); //if there is no body
        });

        req.on("error", (err) => {
            reject(err);
        });
    });
}








function authenticate(req, res, next) {
    const { username, password } = req.headers
    

    //find user in database
    const foundUser = users.find((user) => user.username === username)

    //if no user
    if (!foundUser) {
        res.statusCode = 401; // Unauthorized
        return res.end("User not found");
    }

    //check if password is correct
    if (foundUser.password === password) {
        console.log("password is correct");
    }

    //Authentication successful
    next(req, res);
}



function getBooks(req, res) {
    console.log("getBooks", req.body);
    res.setHeader("content-Type", "application/json");
    res.end(JSON.stringify({books: [{name: "Half of a yellow sun"}]}));
}

function getAuthors(req, res) {
    console.log("getAuthors", req.body);
    res.setHeader("content-Type", "application/json");
    res.end(JSON.stringify({authors: [{name: "Harry"}]}));
}





const server = http.createServer(async(req, res) => {
    try {
        const body = await getBodyFromStream(req);
        req.body = body;
    //after you get body, you want to call and see if user is authenticated before giving access to any route
    if (req.url === "/books" && req.method === "GET") {
        authenticate (req, res, getBooks);
    } else if (req.url === "/books" && req.method === "POST") {
        authenticate (req, res, getBooks);
    } else if (req.url === "/books" && req.method === "PUT") {
        authenticate (req, res, getBooks);
    } else if (req.url === "/books" && req.method === "PATCH") {
        authenticate (req, res, getBooks);
    } else if (req.url === "/books" && req.method === "DELETE") {
        res.end("Books deleted");
    }
    




    //Authors route,.
    if (req.url === "/authors" && req.method === "GET") {
        authenticate (req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "POST") {
        authenticate (req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "PUT") {
        authenticate (req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "PATCH") {
        authenticate (req, res, getAuthors);
    } else if (req.url === "/authors" && req.method === "DELETE") {
        res.end("Authors deleted");
    }


    } catch (error) {
        res.statusCode = 500;
        res.end(error.message);
    }
});


server.listen(3000, () => {
    console.log("Server is listening");
});