export default function decorate(block) {
  const contentBlocks = [...block.children];
  const mediaBlock = contentBlocks.find((child) => child.querySelector('picture, img')) || document.createElement('div');
  const textBlock = contentBlocks.find((child) => !child.querySelector('picture, img')) || document.createElement('div');

  const outer = document.createElement('div');
  outer.className = 'hero-leader-inner';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'hero-leader-media';
  if (mediaBlock.firstElementChild) {
    mediaWrap.append(mediaBlock.firstElementChild.cloneNode(true));
  }

  const copyWrap = document.createElement('div');
  copyWrap.className = 'hero-leader-copy';

  const quoteMark = document.createElement('span');
  quoteMark.className = 'hero-leader-quote-mark';
  quoteMark.textContent = '“';
  copyWrap.append(quoteMark);

  const quoteTextEl = textBlock.querySelector('h1, h2, h3, h4, h5, h6, p');
  if (quoteTextEl) {
    const quoteText = document.createElement('p');
    quoteText.className = 'hero-leader-quote-text';
    quoteText.textContent = quoteTextEl.textContent.trim();
    copyWrap.append(quoteText);
  }

  const metaNodes = [...textBlock.querySelectorAll('p, span')].filter((node) => node !== quoteTextEl);
  const author = metaNodes.find((node) => node.textContent.trim().length > 0) || document.createElement('p');
  if (author) {
    author.className = 'hero-leader-author';
    copyWrap.append(author);
  }

  const ctaLink = textBlock.querySelector('a');
  if (ctaLink) {
    const button = document.createElement('a');
    button.href = ctaLink.href;
    button.className = 'hero-leader-cta';
    button.textContent = ctaLink.textContent.trim() || 'Learn More';
    copyWrap.append(button);
  } else {
    const button = document.createElement('a');
    button.href = '#';
    button.className = 'hero-leader-cta';
    button.textContent = 'Learn More';
    copyWrap.append(button);
  }

  outer.append(mediaWrap, copyWrap);
  block.textContent = '';
  block.append(outer);
}
