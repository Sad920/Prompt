const galleryContainer = document.getElementById('gallery');

const galleryData = [
  {
    title: 'Apollo 11 Moonwalk (1969)',
    description: 'Neil Armstrong becomes the first person to walk on the Moon during NASA\'s Apollo 11 mission.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    badge: 'Space Age',
    alt: 'Astronaut footprint on the lunar surface.'
  },
  {
    title: 'V-E Day in Times Square (1945)',
    description: 'Crowds in New York City celebrate the Allied victory in Europe as World War II draws to a close.',
    image: 'https://images.unsplash.com/photo-1456081101716-74e616ab23d8?auto=format&fit=crop&w=900&q=80',
    badge: 'WWII',
    alt: 'Celebration in a busy city street with flags waving.'
  },
  {
    title: 'First Powered Flight (1903)',
    description: 'The Wright brothers successfully fly the Wright Flyer at Kitty Hawk, North Carolina.',
    image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=900&q=80',
    badge: 'Innovation',
    alt: 'Historic airplane taking off over sand dunes.'
  },
  {
    title: 'Fall of the Berlin Wall (1989)',
    description: 'Citizens gather to dismantle the Berlin Wall, marking a symbolic end to the Cold War divide.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    badge: 'Unity',
    alt: 'Hands reaching over a graffiti-covered wall.'
  },
  {
    title: 'Woodstock Festival (1969)',
    description: 'Half a million people gather in New York for a defining moment of 1960s counterculture and music.',
    image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=900&q=80',
    badge: 'Culture',
    alt: 'Crowd cheering at an outdoor music festival.'
  },
  {
    title: 'Launch of Hubble Telescope (1990)',
    description: 'NASA deploys the Hubble Space Telescope, opening a new era of deep-space observation.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    badge: 'Discovery',
    alt: 'Space shuttle rising with a plume of smoke.'
  }
];

function createCard({ title, description, image, alt, badge }) {
  const card = document.createElement('article');
  card.className = 'gallery-card';

  const img = document.createElement('img');
  img.src = image;
  img.alt = alt;
  card.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  if (badge) {
    const badgeEl = document.createElement('span');
    badgeEl.className = 'badge';
    badgeEl.textContent = badge;
    body.appendChild(badgeEl);
  }

  const titleEl = document.createElement('h3');
  titleEl.className = 'card-title';
  titleEl.textContent = title;
  body.appendChild(titleEl);

  const descEl = document.createElement('p');
  descEl.className = 'card-desc';
  descEl.textContent = description;
  body.appendChild(descEl);

  card.appendChild(body);
  return card;
}

function buildGallery(items = galleryData) {
  if (!galleryContainer) return;
  galleryContainer.innerHTML = '';
  items.forEach((item) => {
    const card = createCard(item);
    galleryContainer.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
});

if (typeof module !== 'undefined') {
  module.exports = { galleryData, buildGallery, createCard };
}
