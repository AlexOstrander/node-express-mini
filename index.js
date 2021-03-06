//requiring express sets up the ability to use the express function
const express = require('express');

// express() is a function with methods for server building
const server = express();
const db = require('./data/db')
const PORT = 4000
const parser = express.json();
/*
Middlewear
Express doesnt parse the body data on its own which is why you need to use server.use to access express.json middlewear
*/
server.use(parser);

/*
 get() wants to know endpoint and then callback the call back need a request and response param. Res can send html, string, arrays, objects. Any real JS object really. json() is used when responding with json data. status() needs to be kept in mind when sending responses in case you need to use someting other than 200.
endpoints
*/
/*server.get('/greet/:name', (req, res) => {
    const name = req.params.name
    res.send(`Suh ${name}`);
});*/

server.get('/api/users', (req, res) => {
       db.find()
         .then((users) => {
           res
            .json(users)
       })
         .catch(err => {
           res
             .status(500)
             .json({message: "Failed to get users"});
       });
});

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
          db.findById(id)
            .then(user => {
              if (user) {
                res.json(user) 
              } else {
                res.status(404).json({ message: "User does not exist"});
              } 
              
          })
            .catch(err => {
              res
                .status(500)
                .json({message: "Failed to get Id"})
          })
});


server.post('/api/users/', (req, res) => {
    const user = req.body;
    
    if (user.name && user.bio) {
    db.insert(user)
        .then(idInfo => { db.findById(idInfo.id).then(user => {
          res.status(201).json(user);
        })
    }).catch(err => {
        res
            .status(500)
            .json({ message: "Failed to insert user"})
    });
    } else {
        res.status(400).json({ message: "Missing name or bio"})
    }
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id).then(count => {
        if (count) {
           res.json({message: "Successfully deleted"})
        } else {
           res
               .status(404)
               .json({ message: "Invalid Id"})
        }
     }
    ).catch(err => {
        res
            .status(500)
            .json({ message: "Failed to delete user"})
    })
});

server.put('/api/users/:id', (req, res) => {
    const user = req.body;
    const { id } = req.params;
    
    if (user.name && user.bio) {
        db.update(id, user).then(count => {
            console.log(count)
            if (count == true) {
                db.findById(id).then(user => {
                    res.json(user);
                })
            } else {
                res.status(404).json({ message: "invalid id"})
            }
        }).catch(err => {
            res.status(500).json("Failed to update")
        })
    } else {
        res.status(400).json({ message: "Missing name or bio"})
    }
})

/*
listening
last on page but first read, listen requires a port and a callback
*/
server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});