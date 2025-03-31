import express, { Request, Response } from "express";
import { askGPT } from "../gptService";
import { executeSQL } from "../utils/queryExecutor";
import { isValidDiningHall, isValidDate, isValidFoodItem, getAllDiningHalls, getAllFoodItems } from "../utils/validators";




// const router = express.Router();

// router.get("/test", (_req: Request, res: Response) => {
//   res.json({ message: "Chatbot route is connected!" });
// });

// router.post("/chat", async (req: Request, res: Response) => {
//   const { userPrompt } = req.body;

//   try {
//     const sqlQuery = await askGPT(userPrompt);
//     console.log("Generated SQL:", sqlQuery);

//     const result = await executeSQL(sqlQuery);
//     console.log("Query Result:", result);

//     res.json({ success: true, query: sqlQuery, result });
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     res.status(500).json({ success: false, message: "An error occurred." });
//   }
// });

// export default router;


const router = express.Router();

router.post("/chat", async (req: Request, res: Response) => {
  const { userPrompt } = req.body;

  try {
    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt required.",
      });
    }

    const lowerPrompt = userPrompt.toLowerCase();

    // Get dynamic list of dining halls and food items
    const allDiningHalls = await getAllDiningHalls();
    const allFoodItems = await getAllFoodItems();

    // Try to match dining hall and food item
    const matchedHall = allDiningHalls.find((hall) =>
      lowerPrompt.includes(hall)
    );
    const matchedFood = allFoodItems.find((food) =>
      lowerPrompt.includes(food)
    );

    // Validate matched dining hall if present
    if (matchedHall && !(await isValidDiningHall(matchedHall))) {
      return res.status(400).json({
        success: false,
        message: `Invalid dining hall: ${matchedHall}`,
      });
    }

    // Validate matched food item if present
    if (matchedFood && !(await isValidFoodItem(matchedFood))) {
      return res.status(400).json({
        success: false,
        message: `Food item not found: ${matchedFood}`,
      });
    }

    // If no matches at all
    if (!matchedHall && !matchedFood) {
      return res.status(400).json({
        success: false,
        message:
          "Your question does not contain a valid dining hall or food item.",
      });
    }

    // Check for valid date format if a date is mentioned
    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    const dateMatch = userPrompt.match(dateRegex);
    if (dateMatch && !isValidDate(dateMatch[0])) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format. Use YYYY-MM-DD.`,
      });
    }

    // Ask GPT for SQL generation
    const sqlQuery = await askGPT(userPrompt);
    console.log("Generated SQL:", sqlQuery);

    // Execute SQL and send result
    const result = await executeSQL(sqlQuery);
    console.log("Query Result:", result);

    res.json({ success: true, query: sqlQuery, result });
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export default router;