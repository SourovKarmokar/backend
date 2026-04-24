require("dotenv").config()
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require("cookie-parser")

const authRouters = require("./routes/auth")
const SwaggerUi = require("swagger-ui-express")
const SwaggerSpecs = require('./config/swagger')

const app = express()

app.use(express.json({limit: '10kb'}))
// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
// Swagger Docs
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerSpecs))
// Cookie Parser
app.use(cookieParser())

//Routes

app.use('/api/v1/auth' , authRouters)

// Not Found Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

//MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then (() => {
    console.log("MongoDB connectd successfully");
    
}).catch((err) => {
    console.log("MongoDB connection error: " , err);
    
}) 

//Server 
const port = process.env.PORT || 5000
app.listen(port,() => {
    console.log(`Server running on port ${port}`);
    
})

