Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedBloglistUser", JSON.stringify(body));
    cy.visit("/");
  });
});

Cypress.Commands.add("populateDatabase", (blogs) => {
  const loggedUserJson = window.localStorage.getItem("loggedBloglistUser");
  const user = JSON.parse(loggedUserJson);
  
  const authorization = `bearer ${user.token}`;
  
  for (let blog of blogs) {
    const options = {
      url: "http://localhost:3003/api/blogs",
      method: "POST",
      body: blog,
      headers: { authorization },
    };
    cy.request(options).its("status").should("eq", 201);
  }
});
