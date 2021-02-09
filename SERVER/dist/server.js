"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./db/index"));
require("dotenv").config();
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(morgan_1.default("dev"));
// Rules of our API
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});
// GET ALL RESTAURANTS
app.get("/api/v1/restaurants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield index_1.default.query("SELECT * FROM restaurants", []);
    try {
        res.json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows,
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
//Get a restaurant
app.get("/api/v1/restaurants/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restoID = req.params.id;
    try {
        const results = yield index_1.default.query("SELECT * FROM restaurants WHERE id = $1", [
            restoID,
        ]);
        res.json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurant: results.rows[0],
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
//Create a Restaurant
app.post("/api/v1/restaurants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.default.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        res.json({
            status: "success",
            results: result.rows.length,
            data: {
                restaurant: result.rows,
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
//UPDATE A RESTAURANT
app.put("/api/v1/restaurants/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const location = req.body.location;
    const price_range = req.body.price_range;
    const restoID = req.params.id;
    try {
        const result = yield index_1.default.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *", [name, location, price_range, restoID]);
        res.json({
            status: "success",
            results: result.rows.length,
            data: {
                restaurant: result.rows,
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
//DELETE RESTAURANT
app.delete("/api/v1/restaurants/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restoID = req.params.id;
    try {
        const result = yield index_1.default.query("DELETE FROM restaurants where id = $1 returning *", [restoID]);
        res.json({
            status: "success",
            results: result.rows.length,
            data: {
                restaurant: result.rows,
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
app.listen(port, () => {
    console.log(`connected in port ${port}`);
});
//# sourceMappingURL=server.js.map