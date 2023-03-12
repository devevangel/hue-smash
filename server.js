import express from "express";

const app = express();

app.use(express.static("client"));
app.use(express.json());

// routes

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Listening on port ${port} initiated`));
