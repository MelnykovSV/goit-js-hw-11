function e(e){return fetch(`https://pixabay.com/api/?key=33543328-1e01a52b77697b8d064c91a7e&q=${e}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`).then((e=>{if(!e.ok)throw new Error(e.status);return e.json()}))}e("cat");const n=document.querySelector(".gallery");document.querySelector(".search-form").addEventListener("submit",(o=>{o.preventDefault();const t=o.currentTarget.querySelector("input").value;console.log(t),e(t).then((e=>{console.log(e),function(e){console.log(e);const o=e.hits.map((e=>{const n={};return n.webformatURL=e.webformatURL,n.largeImageURL=e.largeImageURL,n.alt=e.tags,n.likes=e.likes,n.views=e.views,n.comments=e.comments,n.downloads=e.downloads,n}));console.log(o);const t=o.map((e=>`<div class="photo-card">\n      <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" data-largeImageURL='${e.largeImageURL}'/>\n      <div class="info">\n        <p class="info-item">\n          <b>Likes</b>\n          ${e.likes}\n        </p>\n        <p class="info-item">\n          <b>Views</b>\n          ${e.views}\n        </p>\n        <p class="info-item">\n          <b>Comments</b>\n          ${e.comments}\n        </p>\n        <p class="info-item">\n          <b>Downloads</b>\n          ${e.downloads}\n        </p>\n      </div>\n    </div>`)).join("");console.log(t),n.innerHTML=t}(e)})).catch((e=>{console.log(e)}))}));
//# sourceMappingURL=index.551bc7b4.js.map
