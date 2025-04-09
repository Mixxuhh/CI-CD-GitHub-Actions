import db from "../config/connection.js";
import Question from "../models/Question.js";
async function checkQuestions() {
    try {
        await db.once("open", async () => {
            console.log("Connected to MongoDB");
            const count = await Question.countDocuments();
            console.log(`Number of questions in database: ${count}`);
            if (count > 0) {
                const questions = await Question.find().limit(1);
                console.log("Sample question:", JSON.stringify(questions[0], null, 2));
            }
            process.exit(0);
        });
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
checkQuestions();
