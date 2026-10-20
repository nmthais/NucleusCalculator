import express from "express";
import { calculate } from "./calculator.js";

const app = express();
app.use(express.json());

app.post("/api/calculate", (request, response) => {
  try {
    const { expression } = request.body ?? {};
    const result = calculate(expression);
    response.json({ result });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("API running at http://localhost:3001"));