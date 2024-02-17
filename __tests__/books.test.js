process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../app");
const db = require("../db");

let test_isbn // sample isbn


beforeEach(async () => {
    let result = await db.query(`
      INSERT INTO
        books (isbn, amazon_url,author,language,pages,publisher,title,year)
        VALUES(
          '123456789',
          'https://amazon.com/12345',
          'Vicky',
          'English',
          150,
          'Penguin House',
          'Title', 2024)
        RETURNING isbn`);
  
    test_isbn = result.rows[0].isbn
  });


  describe("POST /books", function () {
    test("New Book", async function () {
      const response = await request(app)
          .post(`/books`)
          .send({
            isbn: '1010101010',
            amazon_url: "",
            author: "TEST",
            language: "english",
            pages: 1000,
            publisher: "TEST",
            title: "TEST",
            year: 2023
          });
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toHaveProperty("isbn");
    });

});
  