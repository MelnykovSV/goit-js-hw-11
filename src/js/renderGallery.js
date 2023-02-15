import { gallery } from './gallery';
// import { lightboxGallery } from './gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// export const gallery = document.querySelector('.gallery-content');
export const lightboxGallery = new SimpleLightbox('.gallery-content a', {
  captionsData: 'alt',
  captionDelay: 250,
});
export function renderGallery(arrayOfObjects) {
  const listArray = arrayOfObjects.map(item => {
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

  // if (!lightboxGallery.isOpen) {
  //   console.log('closed');
  //   console.log(lightboxGallery);
  //   lightboxGallery.refresh();
  // }
  // if (lightboxGallery.isOpen) {
  //   lightboxGallery.on('closed.simplelightbox', () => {
  //     console.log('opened');
  //     console.log(lightboxGallery);
  //     lightboxGallery.refresh();
  //   });
  // }

  if (!document.querySelector('.sl-wrapper')) {
    console.log('closed');
    console.log(lightboxGallery);
    lightboxGallery.refresh();
  }
  if (document.querySelector('.sl-wrapper')) {
    lightboxGallery.on('closed.simplelightbox', () => {
      console.log('opened');
      console.log(lightboxGallery);
      lightboxGallery.refresh();
    });
  }
}
