const photoGallery = document.getElementById('photoGallery');

const photos = [
  {
    title: 'First Moon Landing (1969)',
    description: 'NASA astronauts Neil Armstrong and Buzz Aldrin explore the lunar surface during Apollo 11.',
    src: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    alt: 'Astronaut on the Moon with the Earth in the background'
  },
  {
    title: 'Berlin Wall Fall (1989)',
    description: 'Crowds gather to celebrate as the Berlin Wall, a symbol of division, is dismantled.',
    src: 'https://images.unsplash.com/photo-1521292270410-a8c58500b210?auto=format&fit=crop&w=900&q=80',
    alt: 'People celebrating at a broken section of the Berlin Wall'
  },
  {
    title: 'Woodstock Festival (1969)',
    description: 'Hundreds of thousands gather for the legendary music festival that defined a generation.',
    src: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=900&q=80',
    alt: 'Crowd at a large outdoor music festival'
  },
  {
    title: 'Victory in Europe Day (1945)',
    description: 'Jubilant crowds fill the streets to celebrate the end of World War II in Europe.',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    alt: 'Historic celebration with confetti in a city street'
  }
];

function createPhotoCard(photo) {
  const article = document.createElement('article');
  article.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = photo.src;
  img.alt = photo.alt || photo.title;
  img.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'gallery-item__body';

  const title = document.createElement('h2');
  title.className = 'gallery-item__title';
  title.textContent = photo.title;

  const description = document.createElement('p');
  description.className = 'gallery-item__description';
  description.textContent = photo.description;

  body.append(title, description);
  article.append(img, body);
  return article;
}

function renderGallery() {
  photoGallery.innerHTML = '';
  photos.forEach((photo) => {
    const card = createPhotoCard(photo);
    photoGallery.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderGallery();
});

// Expose data for tests
if (typeof window !== 'undefined') {
  window.__photoData = photos;
}
