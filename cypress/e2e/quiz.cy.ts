describe("Quiz Application", () => {
  beforeEach(() => {
    // Retry the visit up to 3 times
    cy.visit("/", { retryOnNetworkFailure: true, timeout: 30000 }).then(() => {
      // Log success message if visit succeeds
      cy.log("Successfully loaded the application");
    });

    // Check if the server is running by making a direct API call
    cy.request({
      method: "GET",
      url: "/api/questions/random",
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 200) {
        cy.log(
          "Server API is not responding correctly:",
          response.status,
          response.body
        );
      }
    });
  });

  it("should load the quiz component", () => {
    // Wait for the App to be ready
    cy.get(".App", { timeout: 10000 }).should("be.visible");
  });

  it("should start the quiz when clicking the start button", () => {
    // Debug: Log the page content
    cy.document().then((doc) => {
      cy.log("Page HTML:", doc.body.innerHTML);
    });

    // Find and click the button
    cy.get("button")
      .contains("Start Quiz")
      .should("be.visible")
      .as("startButton");

    // Log the button's HTML for debugging
    cy.get("@startButton").then(($btn) => {
      cy.log("Button found:", $btn.prop("outerHTML"));
    });

    // Click the button
    cy.get("@startButton").click();

    // Wait for loading spinner to disappear
    cy.get(".spinner-border").should("exist");
    cy.get(".spinner-border").should("not.exist");

    // Wait for the question to appear
    cy.get('[data-testid="question"]', { timeout: 10000 }).should("be.visible");
  });

  it("should allow selecting an answer", () => {
    // Find and click the start button
    cy.get("button").contains("Start Quiz").should("be.visible").click();

    // Wait for loading spinner to disappear
    cy.get(".spinner-border").should("exist");
    cy.get(".spinner-border").should("not.exist");

    // Wait for and click an answer option
    cy.get('[data-testid="answer-option"]', { timeout: 10000 })
      .first()
      .should("be.visible")
      .click();
  });

  it("should show results after completing quiz", () => {
    // Find and click the start button
    cy.get("button").contains("Start Quiz").should("be.visible").click();

    // Wait for loading spinner to disappear
    cy.get(".spinner-border").should("exist");
    cy.get(".spinner-border").should("not.exist");

    // Answer all questions
    cy.get('[data-testid="question"]').then(() => {
      // Keep clicking answers until we see the results
      function clickAnswer() {
        cy.get('[data-testid="answer-option"]')
          .first()
          .click()
          .then(() => {
            // Check if we see results, if not, click another answer
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="results"]').length === 0) {
                clickAnswer();
              }
            });
          });
      }
      clickAnswer();
    });

    // Wait for results
    cy.get('[data-testid="results"]', { timeout: 10000 }).should("be.visible");
  });
});
