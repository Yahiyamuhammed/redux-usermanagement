const mongoose =require('mongoose')

 const connectDb=async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/projectUserManagement")
        console.log('mongodb conected successfully')

    }
    catch(err){
        console.log(err)
    }
}

// export default connectDb
module.exports=connectDb