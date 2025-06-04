// Task 2: Basic CRUD

// a) Find all books in a specific genre
db.books.find({ genre: "Fiction" });

//b) Find books published after a certain year
db.books.find({ published_year: { $gt: 2015 } });

//c) Find books by a specific author
db.books.find({ author: "George Orwell" });

// d) Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 9.49 } });

//e) Delete a book by its title
db.books.deleteOne({ title: "The Great Gatsby" });

// Task 3: Advanced Queries

// Books in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 },
});

// Projection: title, author, and price only
db.books.find(
  {},
  {
    _id: 0,
    title: 1,
    author: 1,
    price: 1,
  }
);

// Sorting by price ascending
db.books.find().sort({ price: 1 });

// Sorting by price descending
db.books.find().sort({ price: -1 });

// Pagination: Page 1 (first 5 books)
db.books.find().skip(0).limit(5);

// Pagination: Page 2 (next 5 books)
db.books.find().skip(5).limit(5);

// Task 4: Aggregation Pipeline

// Average price by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      avg_price: { $avg: "$price" },
    },
  },
]);

// Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      book_count: { $sum: 1 },
    },
  },
  { $sort: { book_count: -1 } },
  { $limit: 1 },
]);

// Group by publication decade and count
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] },
      count: 1,
      _id: 0,
    },
  },
]);

// Task 5: Indexing

// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Explain query using the title index
db.books.find({ title: "1984" }).explain("executionStats");
