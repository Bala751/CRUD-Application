const express = require("express")
const users = require("./sample.json")
const cors = require("cors");
const fs = require("fs")


//to create server

const app= express();
app.use(express.json());

const port= 1000;
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PATCH" , "DELETE" ]
})); 

//display all users

app.get("/users", (req, res)=>{
    return res.json(users);
})

//delete user details

app.delete("/users/:id", (req, res)=>{
    const id = Number(req.params.id);
    const filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error deleting user" });
      } else {
        res.json(filteredUsers);
      }
    });
})

//add user details

app.post("/users", (req, res)=>{
  let{name, age, city }=req.body;
  if(!name || !age || !city){
    res.status(400).send({"message": "All fields required"})
  }
  let id= Date.now()
  users.push({id, name, age, city})
  fs.writeFile("./sample.json", JSON.stringify(users),(err, data)=>{
  return res.json({"message": "User details added successfully"})
  })
 
})

// update user
app.patch("/users/:id", (req, res)=>{
  let id = Number(req.params.id);
  let{name, age, city }=req.body;
  if(!name || !age || !city){
    res.status(400).send({"message": "All fields required"})
  }
  let index = users.findIndex((user)=>user.id == id)
  users.splice(index, 1, {...req.body})

  fs.writeFile("./sample.json", JSON.stringify(users),(err, data)=>{
  return res.json({"message": "User details updated successfully"})
  })
 
})


// app.post("/users", (req, res)=>{
//   let {name, age, city}=req.body
//   if(!name || !age || !city){
//     res.status(400).send({"message":"All fields requried"})
//   }
// let id= Date.now()
// users.push({id, name, age, city})
// fs.writeFile("./sample.json", JSON.stringify(Users), (err, data)=>{
//   return res.json({"message":"User details added successfully"})
// })

// })

app.listen(port, (err)=>{
    console.log(`App is running in port ${port}`)
})