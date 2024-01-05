// ******************Linkedin server***********************

import mongoConnect from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import server from "./socket/socket.js";





// Database connection
mongoConnect()



// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})









// ***************** React testing ********************

// import express from 'express'
// import cors from 'cors'
// import { cats } from './data.js';
// import morgan from 'morgan';


// const app = express();

// app.use(cors());
// app.use(morgan('dev'))

// app.get("/cats", async (req, res) => {
//   return res.json(cats);
// });

// app.listen(4000, () => {
//   console.log("Server started on port 4000");
// });
