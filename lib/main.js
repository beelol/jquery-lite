const $l = require('./$l.js');
const DOMNodeCollection = require('./dom_node_collection.js');

$l( () => {

  let li = document.createElement("li");
  let $li = $l(li);

  console.log($li);

  const $div = $l("li");

  console.log($div);

  $li.addClass("empty");
  $li.append("heeeeeeeeeeeeeeey");
  $div.append($li);

});
