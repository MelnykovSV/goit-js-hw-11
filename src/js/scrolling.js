import { page } from './gallery';

export function testFunc() {
  console.log(page);
  page += 1;
  console.log(page);
}

// export async function scrolling() {
//   page += 1;

//   //Checking for maximum pages number

//   spinner.classList.remove('visually-hidden');
//   window.removeEventListener('scroll', infiniteScrollHandler);

//   //fires if fetch results in non-empty array
//   try {
//     const data = await fetchImages(currentQuery, page);

//     if (data.hits.length !== 0) {
//       renderGallery(data.hits);
//       // Notiflix.Notify.success(`Hooray! We found ${data.hits.length} images.`);
//       window.scrollBy({
//         top: 200 * 2,
//         behavior: 'smooth',
//       });
//       spinner.classList.add('visually-hidden');

//       if (page === totalPages) {
//         Notiflix.Notify.warning(
//           'Sorry, these are the last images matching your search query. Please try to search something else.'
//         );
//         return;
//       }

//       window.addEventListener('scroll', infiniteScrollHandler);
//       return;
//     }
//   } catch (error) {
//     console.log(error);

//     spinner.classList.add('visually-hidden');

//     window.removeEventListener('scroll', infiniteScrollHandler);
//   }
// }
