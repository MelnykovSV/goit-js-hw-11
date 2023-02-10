import { fetchImages } from './fetchImages';

const gallery = document.querySelector('.gallery');

console.log(gallery);

fetchImages('helicopter')
  .then(data => {
    console.log(data);
    renderGallery(data);
  })
  .catch(error => {
    console.log(error);
  });

function renderGallery(arrayOfObjects) {
  //   clearElements(countryInfo);
  //   hide(countryInfo);
  console.log(arrayOfObjects);
  const listArray = arrayOfObjects.hits.map(item => {
    const listData = {};
    listData.webformatURL = item.webformatURL;
    listData.largeImageURL = item.largeImageURL;
    listData.alt = item.tags;
    listData.likes = item.likes;
    listData.views = item.views;
    listData.comments = item.comments;
    listData.downloads = item.downloads;
    return listData;
  });

  console.log(listArray);
  const markup = listArray
    .map(item => {
      return `<div class="photo-card">
      <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" data-largeImageURL='${item.largeImageURL}'/>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${item.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${item.downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');

  console.log(markup);

  gallery.innerHTML = markup;
  //   show(countryList);
  //   return listArray;
}
