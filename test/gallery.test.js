import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.parentNode = null;
    this.textContent = '';
    this.className = '';
    this.id = '';
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  append(...nodes) {
    nodes.forEach((node) => this.appendChild(node));
  }

  setAttribute(name, value) {
    if (name === 'id') this.id = value;
    if (name === 'class') this.className = value;
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  set innerHTML(value) {
    if (value === '') {
      this.children = [];
      this.textContent = '';
    }
  }

  get innerHTML() {
    return this.children.map((child) => child.textContent).join('');
  }

  querySelectorAll(selector) {
    const results = [];
    const isClassSelector = selector.startsWith('.');
    const className = isClassSelector ? selector.slice(1) : null;

    const traverse = (node) => {
      if (node !== this && node instanceof Element) {
        if (isClassSelector) {
          const classes = (node.className || '').split(/\s+/);
          if (classes.includes(className)) {
            results.push(node);
          }
        }
      }
      node.children.forEach(traverse);
    };

    traverse(this);
    return results;
  }
}

class Document extends Element {
  constructor() {
    super('#document');
    this.idMap = new Map();
  }

  createElement(tagName) {
    const el = new Element(tagName);
    Object.defineProperty(el, 'classList', {
      value: {
        add: (...classes) => {
          const existing = (el.className || '').split(/\s+/).filter(Boolean);
          const merged = Array.from(new Set([...existing, ...classes]));
          el.className = merged.join(' ');
        },
        remove: (cls) => {
          const existing = (el.className || '').split(/\s+/).filter(Boolean);
          el.className = existing.filter((c) => c !== cls).join(' ');
        },
      },
    });
    Object.defineProperty(el, 'id', {
      get: () => el._id || '',
      set: (value) => {
        el._id = value;
        this.idMap.set(value, el);
      },
    });
    return el;
  }

  getElementById(id) {
    return this.idMap.get(id) || null;
  }
}

function createTestWindow() {
  const document = new Document();
  const gallery = document.createElement('div');
  gallery.id = 'photoGallery';
  document.appendChild(gallery);

  const listeners = new Map();
  const window = {
    document,
    addEventListener: (event, handler) => listeners.set(event, handler),
    dispatchEvent: (event) => {
      const handler = listeners.get(event.type);
      if (handler) handler(event);
    },
    Event: class {
      constructor(type) { this.type = type; }
    },
  };
  window.window = window;
  return { window, document, gallery };
}

const { window, document, gallery } = createTestWindow();
const context = vm.createContext(window);

const scriptContent = readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
vm.runInContext(scriptContent, context);
window.dispatchEvent(new window.Event('DOMContentLoaded'));

const photoData = window.__photoData;
assert.ok(Array.isArray(photoData) && photoData.length > 0, 'Photo data should be exposed to the window');

const cards = gallery.querySelectorAll('.gallery-item');
assert.strictEqual(cards.length, photoData.length, 'Gallery should render a card for each photo');

cards.forEach((card, index) => {
  const title = card.querySelectorAll('.gallery-item__title')[0]?.textContent;
  const description = card.querySelectorAll('.gallery-item__description')[0]?.textContent;
  assert.ok(title && title.trim().length > 0, `Card ${index + 1} should have a title`);
  assert.ok(description && description.trim().length > 0, `Card ${index + 1} should have a description`);
});

console.log(`Gallery rendered ${cards.length} cards successfully.`);
