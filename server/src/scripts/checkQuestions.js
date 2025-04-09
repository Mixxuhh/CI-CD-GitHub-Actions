const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/techquiz"
);

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const Question = mongoose.model("Question", QuestionSchema);

async function checkQuestions() {
  try {
    await mongoose.connection.once("open", async () => {
      console.log("Connected to MongoDB");

      const count = await Question.countDocuments();
      console.log(`Number of questions in database: ${count}`);

      if (count > 0) {
        const questions = await Question.find().limit(1);
        console.log("Sample question:", JSON.stringify(questions[0], null, 2));
      }

      process.exit(0);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkQuestions();
