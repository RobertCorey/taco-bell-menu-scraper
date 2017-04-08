let rp = require('request-promise-native');
let cheerio = require('cheerio');

function getAll(params) {
  var options = {
    uri: 'https://www.nutritionix.com/taco-bell/menu/premium',
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  let items = [];
  rp(options).then($ => {
    $('.nmItem').each((i, elem) => {
      let obj = $(elem);
      let item = {
        "name": obj.html(),
        "id": obj.attr('id').split('-')[2]
      };
      console.log(item);
      items.push(item);
    });
    return items;
  });
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

  rp(options).then($ => {
    let ingredients = [];
    $('.weight strong').each((i, elem) => {
      ingredients.push($(elem).html());
    });
    console.log(ingredients);
    return ingredients;
  });
}

getIngredients('166711');
// getAll();
