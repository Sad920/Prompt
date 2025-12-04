class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
    this.children = [];
    this.attributes = {};
    this.className = '';
    this.textContent = '';
    this.innerHTML = '';
    this.id = '';
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  set src(value) { this.attributes.src = value; }
  get src() { return this.attributes.src; }

  set alt(value) { this.attributes.alt = value; }
  get alt() { return this.attributes.alt; }
}

const galleryEl = new FakeElement('div');
const documentStub = {
  createElement: (tag) => new FakeElement(tag),
  getElementById: (id) => (id === 'gallery' ? galleryEl : null),
  addEventListener: () => {}
};

global.document = documentStub;

const { galleryData, buildGallery } = require('../script.js');

buildGallery();

const cardCountMatches = galleryEl.children.length === galleryData.length;
if (!cardCountMatches) {
  throw new Error(`Expected ${galleryData.length} cards, found ${galleryEl.children.length}`);
}

galleryEl.children.forEach((card, index) => {
  if (!String(card.className).includes('gallery-card')) {
    throw new Error(`Card ${index + 1} is missing the gallery-card class.`);
  }

  const [img, body] = card.children;
  if (!img || img.tagName !== 'img' || !img.src || !img.alt) {
    throw new Error(`Card ${index + 1} is missing an image with alt text.`);
  }

  const hasTitle = body.children.some((child) => child.tagName === 'h3' && child.textContent);
  const hasDescription = body.children.some((child) => child.tagName === 'p' && child.textContent);

  if (!hasTitle || !hasDescription) {
    throw new Error(`Card ${index + 1} is missing title or description text.`);
  }
});

console.log('Gallery renders expected number of cards with images, titles, and descriptions.');
