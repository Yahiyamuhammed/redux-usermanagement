const multer = require('multer');
const path = require('path');
const fs = require("fs");

const mongoose = require('mongoose')
const userCollection = mongoose.connection.collection('users')

const jwt = require("jsonwebtoken");



const SECRET_KEY = "yahiya";





const createUser=async(req,res)=>{
    console.log('get into create user');
    
    const {name,email,password}=req.body
    try
    {
        const existingUser =await userCollection.findOne({email})
        if(existingUser)
            return res.status(400).json({message:'user already exists'})
        const newUser={name,email,password}
        await userCollection.insertOne(newUser)

        const token = jwt.sign({ id: newUser._id, email: newUser.email,name:newUser.name,imagePath:newUser.imagePath || null}, SECRET_KEY, { expiresIn: "1h" });
        console.log(token);
        res.status(201).json({message:'user created',newUser,token})
    }   
    catch(err){
        res.status(500).json({error:err})
    }
}

const userLogin=async(req,res)=>{
    const {email,password}=req.body
    try {
        const userExists=await userCollection.findOne({email})
        if(!userExists)
            return res.status(401).json({message :'user does not exists'})
        else if(userExists.password != password)
            return res.status(401).json({message:'password incorect'})


        const token = jwt.sign({ id: userExists._id, email: userExists.email,name:userExists.name,imagePath:userExists.imagePath }, SECRET_KEY, { expiresIn: "1h" });
        console.log(token);
        


        return res.status(201).json({message:'login succes',token,userExists})

    } catch (error) {
        res.status(401).json({message:'server error' ,error})
    }
}
// createUser({name:'yahiya',email:'yahiya@dfjkh',password:'yahiya123'})
const updateUser=async (req,res)=>{
    console.log('entered inside update profile');
    
    const {id}=req.params
    const {name,email}=req.body
    console.log(id,name,email)
    
    try {

        const currentUser = await userCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email !== currentUser.email) {
            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        const updatedUser= await userCollection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id) },
            {$set:{name,email}},
            {returnDocument:'after'}
        )
        console.log(updatedUser);
        
        if(!updatedUser)
            return res.status(404).json({message:'user invalid'})
        console.log('sending 200 ststus');
        res.status(200).json({message:'user updated successfully',updatedUser})
    } catch (err) {
        res.status(500).json({message:'server error',err})
    }
}
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/'); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Upload profile picture function
const uploadProfile = async (req, res) => {
    console.log('profileImage')
    upload.single('profileImage')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: "File upload failed", error: err.message });
        }

        const { id } = req.params;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }


        const user = await userCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (!user) return res.status(404).json({ message: 'User not found' });
        // const oldImagePath = user.profileImage;
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, "../public", user.profileImage);
            console.log("this is the path I need to delete:", oldImagePath);

            // ✅ Check if the file actually exists before deleting
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Old image deleted:", oldImagePath);
            } else {
                console.log("Old image not found, skipping delete.");
            }
        } else {
            console.log("User has no previous profile image, skipping delete.");
        }
        
        const profileImagePath = req.file.path.replace("public\\", "").replace("public/", "");  // Get file path

        try {
            // Update user with profile image path
            const updatedUser = await userCollection.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(id) },
                { $set: { profileImage: profileImagePath } },
                { returnDocument: "after" }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // const token = jwt.sign({ id: updatedUser._id, email: updatedUser.email,name:updatedUser.name,imagePath:updatedUser.profileImage }, SECRET_KEY, { expiresIn: "1h" });
            // console.log(token);
            

            res.status(200).json({ message: "Profile image uploaded",profileImage: profileImagePath });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
};


const verifyToken = (req, res, next) => {

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

const getUser= async (req, res)=>{
    try {
        console.log('inside get user');
        
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token,SECRET_KEY);
        const user = await userCollection.findOne({ _id: new mongoose.Types.ObjectId(decoded.id) });

        if (!user) return res.status(404).json({ message: "User not found" });

        console.log(user);
        

        res.status(200).json({ userId: user._id, email: user.email, imagePath: user.profileImage ,name:user.name});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}


module.exports={createUser,userLogin,updateUser,uploadProfile  ,verifyToken,getUser}