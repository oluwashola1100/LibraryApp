const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadServices');

const parser = xml2js.Parser({ explicitArray: false });
function goodreadService() {
  function getBookById() {
    return new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/title.xml?author=Arthur+Conan+Doyle&key=piYPjQEMutn8IVBjbkDyw&title=Hound+of+the+Baskervilles')
        .then((response) => {
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }
  return { getBookById };
}

module.exports = goodreadService();
