fetch("https://pixabay.com/api/?key=33543328-1e01a52b77697b8d064c91a7e&q=".concat("cat","&image_type=photo&orientation=horizontal&safesearch=true")).then((function(t){if(!t.ok)throw new Error(t.status);return t.json()})).then((function(t){console.dir(t)}));
//# sourceMappingURL=index.f59e29b1.js.map
