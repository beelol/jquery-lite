const $l = require('./$l.js');
const DOMNodeCollection = require('./dom_node_collection.js');

$l( () => {

  console.log("what the hell");

  let test = new $l("li");
  test.append("asdffwaaa");

  // $l.ajax({
  //   url: "https://api.github.com/users/mralexgray/repos",
  //   success: (data) => {
  //     console.log(data.toString());
  //   },
  //   contentType: "text"
  // });


});
