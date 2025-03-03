//import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");//library allows to connect to MongoDB 
const Book = require("./model/Book");

//initialise express app
//app variable will handle routing and middleware
const app = express();

//middleware config
app.use(bodyParser.json());
//Enable CORS for all origin
app.use(cors());

//Create in memory database
//let books = [];

const port = process.env.PORT || 4001;
const mongodbUrl = 
  process.env.MONGODB_URL || "mongodb://localhost:27017/defaultDB";

//Connect to MongoDB
mongoose.connect(mongodbUrl,{
    useNewUrlParser: true,  //makes sure to be compatible with latest MongoDb
    useUnifiedTopology: true, //makes sure to be compatible with latest MongoDb
})
.then(() =>
   console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection failed:", error));

//Routes

//1. Get all books
app.get("/books", async(req,res) =>{
    try{
        const books = await Book.find(); //finds the books automatically
        res
          .status(200)
          .json({success: true, data:books,});
    } catch (error) {
          res  
             .status(500)
             .json({success: false, message: "Error occured",
                error: error.message
             });
    }
});

//2. Add new books
 //Extract book details from the req.body
 //Validate if all req. fields are provided....(title, author, year)
  //Assign a unique id to the book
  //Add the new book to the book array
  //Return success msg with added book

  //req.body--> Access data sent in the POST req.body
  //res.status(400)--> bad request
  // books.push()--> Add new books to books array

  app.post("/books", async(req, res) =>{
    try{
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
        });
        const savedbook = await book.save();//saves automatically
        res
        .status(201)
        .json({success: true, message: "Books Added!!", data: savedbook});
    }catch(error){
          res
           .status(500)
           .json({success: false, message: "Error Occurred!", error: error.message});
    }
});

//3.Get the specific book by ID
//Extract the book ID from the route parameter(req.params.id)
//Search that book from books array using find()
//Return the book details if found or 404 error, if not

//req.params(:id)
//parseInt(): Converts the ID(string) to integer
//books.find(): to find the respective books required

app.get("/books/:id", async(req,res) =>{
   try{
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if(!bookId){
        return res 
          .status(404)
          .json({success: false, message:"Entered Books Not Found"});
    }
    res.json({success: true, message:"Book Retrieved successfully", data: book});
   }catch(error){
    res
    .status(500)
    .json({success: false, message:"Error Occurred!", error: error.message});
   }
   
});

//4.Update the books by ID
 app.put("/books/:id", async(req,res)=>{
     try{
        const bookId = req.params.id;
        //Update book in the database
        const updateBook = await Book.findByIdAndUpdate(bookId,{
            title: req.body.title,
            author: req.body.author,
            year: req.body.year, 
         },
         {new: true} //updating data from old to NEW
       );
       if(!updateBook){
         res 
            .status(404)
            .json({success: false, message:"Entered Book Not Found"});
       }else{
          res
             .status(200)
             .json({success: true, message: "Book Updated Successfully", data: updateBook});
       }
     }catch(error){
        res
          .status(500)
          .json({success: false, message: "Error Occurred!", error: error.message});
     }
 });

 //5.Delete book by ID
 //req.params.id
 
  app.delete("/books/:id", async(req, res) =>{
    try{
        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if(!deletedBook){
            res 
               .status(404)
               .json({success: false, message:"Entered Book Not Found"});
          }else{
             res
                .status(200)
                .json({success: true, message: "Book Deleted Successfully"});
          }
    }catch(error){
        res
        .status(500)
        .json({success: false, message: "Error Occurred!", error: error.message});
    }
  });

  //start the server
  // const PORT = 4000;
   app.listen(port , ()=>{
      console.log(`Server is running on http://localhost:${port}`);

   });