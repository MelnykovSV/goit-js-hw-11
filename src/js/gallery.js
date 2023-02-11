import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let currentQuery;

const gallery = document.querySelector('.gallery-content');
const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  const searchInputvalue = e.currentTarget.querySelector('input').value;

  currentQuery = e.currentTarget.querySelector('input').value;

  fetchImages(searchInputvalue, page)
    .then(data => {
      console.log(data);
      renderGallery(data);
    })
    .catch(error => {
      console.log(error);
    });
});

loadMoreButton.addEventListener('click', e => {
  e.preventDefault();
  page += 1;
  fetchImages(currentQuery, page)
    .then(data => {
      console.log(data);
      renderGallery(data);
    })
    .catch(error => {
      console.log(error);
    });
});

//renders gallery

function renderGallery(arrayOfObjects) {
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
      return `<a href="${item.largeImageURL}" class="photo-card gallery-item" data-capture="${item.tags}"><div class="photo-card__thumb"><img src="${item.webformatURL}" alt="${item.alt}" loading="lazy" width="320" height="220" data-largeImageURL='${item.largeImageURL}'/></div>
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
    </a>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightboxGallery = new SimpleLightbox('.gallery-content a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
