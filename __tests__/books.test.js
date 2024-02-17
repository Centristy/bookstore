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


    describe("GET /:isbn", function () {
        test("Find book by isbn", async function () {
          const response = await request(app)
              .get(`/books/${test_isbn}`)
              expect(response.body.book).toHaveProperty("isbn");
              expect(response.body.book.isbn).toBe(book_isbn);
        });

        test("404 if book doesn't exist", async function () {
            const response = await request(app)
                .get(`/books/20202020`)
            expect(response.statusCode).toBe(404);
          });
    
        });


describe("PUT /books/:id", function () {
     test("Updates a single book", async function () {
        const response = await request(app)
            .put(`/books/${book_isbn}`)
            .send({
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "UPDATED BOOK",
            year: 2024
     });
        expect(response.body.book).toHaveProperty("isbn");
        expect(response.body.book.title).toBe("UPDATED BOOK");
});
          
    test("Prevents a bad book update", async function () {
        const response = await request(app)
            .put(`/books/${book_isbn}`)
            .send({
            isbn: "0987653456",
            bad: "bad",
            author: "TEST",
            language: "TEST",
            pages: 1000,
            publisher: "TEST",
            title: "TEST",
            year: 20024
        });
         expect(response.statusCode).toBe(400);
  });

});




afterEach(async function () {
    await db.query("DELETE FROM BOOKS");
});
          
          
afterAll(async function () {
  await db.end();
});