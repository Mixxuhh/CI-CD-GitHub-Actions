/// <reference types="cypress" />
import Quiz from "../../client/src/components/Quiz";

describe("Quiz Component", () => {
  beforeEach(() => {
    // Mock the API response
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: [
        {
          question: "Which is the correct answer?",
          answers: [
            { text: "Correct", isCorrect: true },
            { text: "Almost", isCorrect: false },
            { text: "Not Quite", isCorrect: false },
            { text: "Not Close", isCorrect: false },
          ],
        },
      ],
    }).as("getRandomQuestion");
  });

  it("should start the quiz and display the first question", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getRandomQuestion");
    cy.get(".card").should("be.visible");
    cy.get("h2").should("not.be.empty");
  });

  it("should answer questions and complete the quiz", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getRandomQuestion");

    // Answer questions
    cy.get("button").contains("1").click();

    // Verify the quiz completion
    cy.get(".alert-success").should("be.visible").and("contain", "Your score");
  });

  it("should restart the quiz after completion", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getRandomQuestion");

    // Answer questions
    cy.get("button").contains("1").click();

    // Restart the quiz
    cy.get("button").contains("Take New Quiz").click();
    cy.wait("@getRandomQuestion");

    // Verify the quiz is restarted
    cy.get(".card").should("be.visible");
    cy.get("h2").should("not.be.empty");
  });
});
