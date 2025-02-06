const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then( () => {
console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/",  ( req, res) => {
     res.send("Hi , i am root");
});

// Index Route
app.get("/listings", async ( req, res) => {
   // res.send("Hi , i am root");
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
 // console.log(allListings);
});


 // New Route
 app.get("/listings/new", (req , res) =>{
    res.render("listings/new.ejs");
  });


//Show Route
// app.get("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", { listing });
//   });
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  // Ensure the price is formatted correctly
  if (listing.price && !isNaN(listing.price)) {
      listing.priceFormatted = listing.price.toLocaleString("en-IN");
  } else {
      listing.priceFormatted = "N/A";
  }

  // Send the data to the template
  res.render("listings/show.ejs", { listing });
});



  // // Create Route
  // app.post("/listings", async (req , res) => {
  //   // let {title , description, image , price , country , location} = req.body;
  //  // let listing = req.body.listing;
  //  const newListing = new Listing(req.body.listing);
  //  await newListing.save();
  //  res.redirect("/listings");
  //  // console.log(listing);
  // });

//   app.post("/listings", async (req , res) => {
//     console.log("Received Data:", req.body); // Debugging line
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });

// app.post("/listings", async (req, res) => {  // ✅ Mark function as async
//   console.log("Received Data:", req.body); 

//   // If image URL is an empty string, set it to undefined
//   if (req.body.listing.image?.url?.trim() === "") {
//       req.body.listing.image.url = undefined;
//   }

//   try {
//       const newListing = new Listing(req.body.listing);
//       await newListing.save();
//       res.redirect("/listings");
//   } catch (err) {
//       console.error("Error saving listing:", err);
//       res.status(500).send("Internal Server Error");
//   }
// });
// app.post("/listings", async (req, res) => {
//   try {
//     const newListing = new Listing(req.body.listing);
//     console.log("Processed Listing Before Save:", newListing); // Debugging log
//     await newListing.save();
//     res.status(201).send(newListing);
//   } catch (error) {
//     console.error("Error saving listing:", error);
//     res.status(400).send(error);
//   }
// });

app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log("Listing saved successfully:", newListing);
    res.redirect("/listings"); // 👈 Redirects to /listings after saving
  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).send("Error saving listing");
  }
});



//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
   // console.log(listing.image); 
    res.render("listings/edit.ejs", { listing });
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);  
});

// DElete route
app.delete("/listings/:id", async (req,res) =>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
   // console.log(deletedListing);
    res.redirect("/listings");
});
 

// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });

app.listen(8080 , () => {
console.log("server is listening to port 8080");
});