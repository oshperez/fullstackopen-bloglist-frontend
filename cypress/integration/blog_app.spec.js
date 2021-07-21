
describe("Blog app", function () {
  beforeEach(function () {
    // Empties database before each test
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "Greg Collins",
      username: "grcollins",
      password: "*grcoll",
    };

    // Creates new user before each test
    cy.request("POST", "http://localhost:3003/api/users/ ", user);

    cy.visit("/");
  });

  it("shows login form", function () {
    cy.contains("log in to application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("[data-cy=login-username]").type("grcollins");
      cy.get("[data-cy=login-password]").type("*grcoll");
      cy.get("[data-cy=login-submit]").click();

      cy.contains("Greg Collins logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("[data-cy=login-username]").type("grcollins");
      cy.get("[data-cy=login-password]").type("wrong_password");
      cy.get("[data-cy=login-submit]").click();

      cy.get("[data-cy=notification]").should("contain", "wrong credentials");
      cy.get("[data-cy=notification]").should(
        "have.css",
        "background-color",
        "rgb(241, 21, 21)"
      );
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      // Logs in the user who was previously created
      cy.login({ username: "grcollins", password: "*grcoll" });
    });

    it("a blog can be created", function () {
      const blog = {
        title: "E2E testing using Cypress",
        author: "Ben Harris",
        url: "dev.com/e2e-testing-using-cypress",
      };
      cy.get("[data-cy=toggle-open]").click();
      cy.get("[data-cy=blog-title]").type(blog.title);
      cy.get("[data-cy=blog-author]").type(blog.author);
      cy.get("[data-cy=blog-url]").type(blog.url);
      cy.get("[data-cy=blog-submit]").click();

      cy.contains(`${blog.title} by ${blog.author}`);
      cy.get("[data-cy=notification]").should(
        "contain",
        `a new blog ${blog.title} added`
      );
      cy.get("[data-cy=notification]").should(
        "have.css",
        "background-color",
        "rgb(22, 240, 76)"
      );
    });

    describe("When there are already blogs in the database", function () {
      const blogs = [
        {
          title: "Cypress Configuration",
          author: "Jim Clarson",
          url: "dev.com/cypress-configuration",
        },
        {
          title: "Cypress assertions",
          author: "Robert Green",
          url: "dev.com/cypress-assertions",
        },
        {
          title: "Cypress proxy",
          author: "Julio Gonzalez",
          url: "dev.com/cypress-proxy",
        },
      ];

      let targetBlog;

      beforeEach(function () {
        // Populates data base before each testn using logged-in user
        cy.populateDatabase(blogs);

        // Selects a blog ramdonly to be used in the test
        targetBlog = blogs[Math.floor(Math.random() * blogs.length)];

        cy.visit("/");
      });

      it("users are able to like blogs", async function () {
        // Number of likes that the target blog has before the test is executed
        const likesBefore = targetBlog.likes ? targetBlog.likes : 0;

        cy.contains(targetBlog.title).find("[data-cy=blog-toggle]").click();

        cy.get("[data-cy=blog]")
          .should("contain", targetBlog.title)
          .find("[data-cy=blog-likes]")
          .as("likeNode");

        cy.get("@likeNode")
          .find("span")
          .as("numOfLikes")
          .should("contain", likesBefore);

        cy.get("@likeNode").find("button").click();
        cy.get("@numOfLikes").should("contain", `${likesBefore + 1}`);

        cy.contains(targetBlog.title).find("[data-cy=blog-toggle]").click();
      });

      it("the user who create a blog can delete it", function () {
        cy.contains(targetBlog.title).find("[data-cy=blog-toggle]").click();

        cy.get("[data-cy=blog]")
          .should("contain", targetBlog.title)
          .find("[data-cy=blog-delete]")
          .click();

        cy.get("[data-cy=notification]")
          .should("contain", `${targetBlog.title} deleted`)
          .and("have.class", "notification notification__success");
      });

      it("users who did not create a blog can not delete it", function () {
        const otherUser = {
          name: "Mark Deamon",
          username: "madeamon",
          password: "*mdemo",
        };

        // Creates another user who has not created any blogs
        cy.request("POST", "http://localhost:3003/api/users", otherUser)
          .its("status")
          .should("equal", 200);

        // Logs out current logged-in user
        cy.contains("logout").click();

        // Logs in user who has not created any blogs
        cy.login({ username: "madeamon", password: "*mdemo" });

        cy.contains(targetBlog.title).find("[data-cy=blog-toggle]").click();
        cy.get("[data-cy=blog]")
          .should("contain", targetBlog.title)
          .find("[data-cy=blog-delete]")
          .click();

        cy.get("[data-cy=notification]")
          .should("contain", `deletion failed`)
          .and("have.class", "notification notification__error");

        cy.contains(targetBlog.title).find("[data-cy=blog-toggle]").click();

        // Logs out user who has not created any blogs
        cy.contains("logout").click();
      });

      it("blogs are ordered in descending order of likes", function () {
        // Shows details of every blog
        cy.get("[data-cy=blog-container]")
          .find("[data-cy=blog]")
          .each(($el) => {
            cy.wrap($el).find("[data-cy=blog-toggle]").click();
          });

        // Adds a like to a random block N=10 times
        Cypress._.times(10, () => {
          cy.get("[data-cy=blog-container]")
            .children()
            .eq(Math.floor(Math.random() * blogs.length))
            .find("[data-cy=blog-likes]")
            .children("button")
            .click();
        });

        // Checks that every blog(except for the last one) has more or
        // equal number of likes that the blog that comes after
        cy.get("[data-cy=blog-container]")
          .find("[data-cy=blog]")
          .spread((...blogs) => {
            blogs.forEach((blog, index, arr) => {
              if (index < arr.length - 1) {
                return cy
                  .wrap(blog)
                  .find("[data-cy=blog-likes]")
                  .children("span")
                  .then(($span) => {
                    const likesCurrentBlog = parseInt($span.text());
                    const nextBlog = arr[index + 1];
                    return cy
                      .wrap(nextBlog)
                      .find("[data-cy=blog-likes]")
                      .children("span")
                      .then(($span) => {
                        const likesNextBlog = parseInt($span.text());
                        expect(likesNextBlog).to.be.at.most(likesCurrentBlog);
                      });
                  });
              }
            });
          });

        // Hides details of evry blog
        cy.get("[data-cy=blog-container]")
          .find("[data-cy=blog]")
          .each(($el) => {
            cy.wrap($el).find("[data-cy=blog-toggle]").click();
          });
      });
    });
  });
});
