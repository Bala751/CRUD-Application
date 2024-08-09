import axios from "axios"
import './App.css'
import React, { useEffect, useState } from "react"

function App() {

  const [users, setUsers]=useState([])
  const [filteruser, setFilteruser]=useState([])
  const [isModelOpen, setIsModelOpen]= useState()
  const [userData, setUserData]=useState({name:" ", age:" ", city:" "})

  const getallusers = async()=>{
    await axios.get("http://localhost:1000/users").then(
      (res)=>{
        setUsers(res.data)
        setFilteruser(res.data)
      })
      .catch ((error)=> {
        console.error("Error fetching users:", error)
      })
    }
  
  useEffect(()=>{
    getallusers()
  },[])

  const handlesearchuser =(e)=>{
    const searchText = e.target.value.toLowerCase()
    const filteredUsers = users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.age.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText) )
    setFilteruser(filteredUsers) }
  
  const handledeleteuser = async (id)=>{
    await axios.delete(`http://localhost:1000/users/${id}`).then((res)=>{
        setUsers(res.data)
        setFilteruser(res.data)
    })
  }

  const handleAdduser = ()=>{
    setUserData({name:"", age:"", city:""})
    setIsModelOpen(true)
  }

  const modelClose = ()=>{
    setIsModelOpen(false)
    getallusers()
  }

  const handleData = (e) =>{
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:1000/users/${userData.id}`,userData).then((res)=>{
        console.log(res)
      })
    }else{
      await axios.post("http://localhost:1000/users",userData).then((res)=>{
        console.log(res)
      })
    }
    modelClose()
    setUserData({name:"", age:"", city:""})
    
  }

  const handleUserEdit =(user)=>{
    setUserData(user)
    setIsModelOpen(true)
  }



  return (
    <>
      <div className='container'>
       <h3>CRUD Application using React js Front-end and Node js Back-end</h3>
       <div className="input-search">
        <input type="Search" onChange={handlesearchuser} />
        <button className='btn green' onClick={handleAdduser}>Add Record</button>
       </div>
       <table className='table'>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
       {filteruser && filteruser.map((user, index)=>{
        return(
          <tr key={user.id || index}>
          <td>{index+1}</td>
          <td>{user.name}</td>
          <td>{user.age}</td>
          <td>{user.city}</td>
          <td><button className='btn green' onClick={()=>handleUserEdit(user)}>Edit</button></td>
          <td><button className='btn red' onClick={()=>handledeleteuser(user.id)}>Delete</button></td>
        </tr>
        )
          
       })}
        </tbody>
        </table>
        {isModelOpen && <div className="model">
          <div className="model-content">
          <span className="close" onClick={modelClose}> &times;</span>
            <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
            <div className="input-field">
              <label htmlFor="name">Full Name</label>
              <input type="text" name="name" id="name" value={userData.name} onChange={handleData}/>
            </div>
            <div className="input-field">
              <label htmlFor="age">Age</label>
              <input type="number" name="age" id="age" value={userData.age} onChange={handleData} />
            </div>
            <div className="input-field">
              <label htmlFor="city">City</label>
              <input type="text" name="city" id="city" value={userData.city} onChange={handleData} />
            </div>
            <button className="btn green" onClick={handleSubmit}>{userData.id ? "Update User" : "Add User"}</button>
          </div>
           </div>
           }
      </div>
      
    </>
  )
}

export default App
