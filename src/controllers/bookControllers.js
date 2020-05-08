const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

function bookControllers(bookService, nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();
        res.render('booksListView', {
          nav,
          title: 'library',
          books,
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('connected correctly to server');

        const db = client.db(dbName);
        const col = db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });
        debug(book);
        book.details = await bookService.getBookById(book.bookID);
        res.render('bookView', {
          nav,
          title: 'library',
          book
        });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }
  function middleware(req, res, next) {
    // if (req.user) {
    next();
    // } else {
    // res.redirect('/');
    // }
  }
  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookControllers;
