fetch(`https://pixabay.com/api/?key=33543328-1e01a52b77697b8d064c91a7e&q=${"cat"}&image_type=photo&orientation=horizontal&safesearch=true`).then((t=>{if(!t.ok)throw new Error(t.status);return t.json()})).then((t=>{console.dir(t)}));
//# sourceMappingURL=index.afb8ac69.js.map
