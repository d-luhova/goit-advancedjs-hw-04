export const createGalleryCardTemplate = ({ tags: alt, webformatURL: src, largeImageURL: href, likes, views, comments, downloads}) => {
    return `
      <li>
      <a class="gallery-item" href="${href}">
      <img class="gallery-image" src="${src}" alt="${alt}" title="${alt}"/>
      <div class="gallery-text-block">
      <p class="gallery-text">Likes<br>${likes}</p>
      <p class="gallery-text">Views<br>${views}</p>
      <p class="gallery-text">Comments<br>${comments}</p>
      <p class="gallery-text">Downloads<br>${downloads}</p>
      </div>
      </a>
      </li>
    `;
};