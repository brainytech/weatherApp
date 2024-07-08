const express = require("express");
const path = require("path")
const hbs = require("hbs")

const app = express();

const weatherdata = require("../utils/Wheatherdata");
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templets/views");
const partialsPath = path.join(__dirname, "../templets/partials");

app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicPath))
const port = 4000;

app.get("/", (req, res) => {
    // res.send("Hello From wheather App")
    res.render("index", { title: "wheather App" })
})

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send("Address is required");
    }
    weatherdata(req.query.address, (error, result) => {
        if (error) {
            return res.send(error);
        }

        res.send(result);
    })
})

app.get("*", (req, res) => {
    res.render("404", { title: "Error 404 ! Page Not Found" })
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})