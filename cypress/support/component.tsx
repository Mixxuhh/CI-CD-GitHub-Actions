import "@testing-library/cypress/add-commands";

// Import mount from Cypress React
import { mount } from "cypress/react18";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Add mount command
Cypress.Commands.add("mount", mount);

// Add any custom commands here
