
const mongoose = require('mongoose')
const userCollection = mongoose.connection.collection('users')
const adminCollection = mongoose.connection.collection('admin')
const jwt = require("jsonwebtoken");
const SECRET_KEY = "yahiya";


const viewUsers = async (req,res)=>{
    const users=await userCollection.find({}).toArray()
    res.json(users)
}

const adminLogin =async (req,res)=>{
    const {email,password}=req.body
    try {
        const isAdmin=await adminCollection.findOne({email})
        if(isAdmin && password==isAdmin.password) {
            const token = jwt.sign({ id: isAdmin._id, email: isAdmin.email,name:isAdmin.name}, SECRET_KEY, { expiresIn: "1h" });
            console.log(token);
            return res.status(201).json({message:'success',isAdmin,token})
        }
            
        res.status(401).json({message:'invalid credintials'})
    } catch (error) {
        res.json({error})
    }
   
}

const userSearch =async (req,res)=>{
    const {name}=req.body
    console.log('got inside search route');
    
    try{
        const result=await userCollection.find({name: { $regex: name, $options: "i" } }).toArray()
        if(result.length>0)
            res.status(200).json({message :' users found',result})
        else
            res.status(404).json({message:'no users found'})
    }
    catch(err)
    {
        res.status(500).json({err})
    }
}
const adminCreateUser=async(req,res)=>{
    console.log('get into create user');
    
    const {name,email,password}=req.body
    try
    {
        const existingUser =await userCollection.findOne({email})
        if(existingUser)
        {
            console.log('returning with 409');
            
            return res.status(409).json({message:'user already exists'})
        }
        const newUser={name,email,password}
        const result=await userCollection.insertOne(newUser)
        if (result.acknowledged) 
            return res.status(201).json({ message: "User created successfully" });
        return res.status(500).json({ message: "User creation failed" });
    }   
    catch(err){
        res.status(500).json({error:err})
    }
}
const adminUpdateUser=async (req,res)=>{
    console.log('entered admin update user');
    
    const {id}=req.params
    const {name,email}=req.body
    try {
        const updatedUser= await userCollection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            {$set:{name,email}},
            {returnDocument:'after'}
        )
        if(!updatedUser)
            return res.json({message:'user invalid'})
        res.json({message:'user updated successfully',updatedUser})
    } catch (err) {
        res.json({message:'server error',err})
    }
}
const deleteUser=async(req,res)=>{
    const {id}=req.params
    console.log('entered delete user route',id)
    try{
        const del=await userCollection.deleteOne({_id: new mongoose.Types.ObjectId(id) })
        console.log(del);
        
        if(del.deletedCount > 0)
            return res.status(200).json({message:'deleted successful'})
        res.status(404).json({message:'no user found'})
    }
    catch(err){
        res.status(500).json({err})
    }
}


const verifyAdminToken = (req, res, next) => {

    console.log('entered verify tokem');
    
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

       
        
        req.user = decoded; // Store decoded user info in request
        console.log('token verified',decoded);
        next();
    });
};


module.exports={viewUsers,adminCreateUser,adminLogin,userSearch,adminUpdateUser,deleteUser,verifyAdminToken}