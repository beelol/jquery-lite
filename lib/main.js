const DOMNodeCollection = require('./dom_node_collection.js');
const $l = require('./$l.js');

$l( () => {

  let test = new $l("div");

  $l.ajax({
    url: "https://api.github.com/users/mralexgray/repos",
    success: (data) => {
      console.log(data.toString());
    },
    contentType: "text"
  });


});
