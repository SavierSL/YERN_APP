import express from "express";
import morgan from "morgan";
import { Req, Res, Nxt } from "./TS/types";
import db from "./db/index";
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(morgan("dev"));

// Rules of our API
app.use((req: Req, res: Res, next: Nxt) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  next();
});

// GET ALL RESTAURANTS
app.get("/api/v1/restaurants", async (req: Req, res: Res) => {
  const results = await db.query("SELECT * FROM restaurants", []);
  try {
    res.json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//Get a restaurant
app.get("/api/v1/restaurants/:id", async (req: Req, res: Res) => {
  const restoID = req.params.id;

  try {
    const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      restoID,
    ]);
    res.json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//Create a Restaurant
app.post("/api/v1/restaurants", async (req: Req, res: Res) => {
  try {
    const result = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        restaurant: result.rows,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//UPDATE A RESTAURANT
app.put("/api/v1/restaurants/:id", async (req: Req, res: Res) => {
  const name = req.body.name;
  const location = req.body.location;
  const price_range = req.body.price_range;
  const restoID = req.params.id;

  try {
    const result = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [name, location, price_range, restoID]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        restaurant: result.rows,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//DELETE RESTAURANT
app.delete("/api/v1/restaurants/:id", async (req: Req, res: Res) => {
  const restoID = req.params.id;
  try {
    const result = await db.query(
      "DELETE FROM restaurants where id = $1 returning *",
      [restoID]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        restaurant: result.rows,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(port, () => {
  console.log(`connected in port ${port}`);
});
