let rp = require('request-promise-native');
let cheerio = require('cheerio');
var jsonfile = require('jsonfile');

function getAll(params) {
  var options = {
    uri: 'https://www.nutritionix.com/taco-bell/menu/premium',
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  let items = [];
  return new Promise((resolve, reject) => {
    rp(options).then($ => {
      let getIngredientsPromises = [];
      $('.nmItem').each((i, elem) => {
        let obj = $(elem);
        let item = {
          "name": obj.html(),
          "id": obj.attr('id').split('-')[2]
        };

        getIngredientsPromises.push(
          getIngredients(item.id)
          .then(value => {
            item.ingredients = value;
            items.push(item);
          })
          .catch(error => {
            throw new Error(error);
          })
        );
      });

      Promise.all(getIngredientsPromises).then(() => {
        resolve(items);
      }).catch(error => {
        reject(error);
      })

    });
  })
}

/**
 * returns an array of ingredients contained in item
 * @param {String} itemId 
 */
function getIngredients(itemId) {
  let options = {
    uri: `https://www.nutritionix.com/taco-bell/viewLabel/item/${itemId}`,
    transform: function (body) {
      return cheerio.load(body);
    }
  }

  return rp(options).then($ => {
    let ingredients = [];
    $('.weight strong').each((i, elem) => {
      ingredients.push($(elem).html());
    });
    return ingredients;
  });
}

getAll().then(value => {
  jsonfile.writeFileSync('menu.json', value, {spaces: 2});
});
