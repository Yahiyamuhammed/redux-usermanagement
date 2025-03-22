const express = require ('express')
const connectDb = require('./config/db')
const userRouter=require('./routes/userRoutes')
const adminRouter=require('./routes/adminRoutes')
const cors = require("cors");


const app=express()
connectDb()

app.use(express.json())
app.use(cors())
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use('/uploads', express.static('public/uploads'));


app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)


// app.get('/',(req,res)=>{
//     res.send('hi hello')
// })
app.listen(3000,(err)=>{
    console.log('server started')
    if(err)
        console.log(err);
        
})