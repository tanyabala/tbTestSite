export default function decorate(block) {
  const cards = [...block.children].filter((child) => child.tagName === 'DIV');

  if (!cards.length) return;

  const grid = document.createElement('div');
  grid.className = 'cards-leadership-grid';

  cards.forEach((cardNode) => {
    const card = document.createElement('article');
    card.className = 'cards-leadership-card';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'cards-leadership-card-image';

    const imageElement = cardNode.querySelector('picture, img');
    if (imageElement) {
      imageWrapper.append(imageElement.cloneNode(true));
    }

    const content = document.createElement('div');
    content.className = 'cards-leadership-card-content';

    const nameNode = cardNode.querySelector('h1, h2, h3, h4, h5, h6, strong');
    if (nameNode) {
      const name = document.createElement('h3');
      name.className = 'cards-leadership-name';
      name.textContent = nameNode.textContent.trim();
      content.append(name);
    }

    const divider = document.createElement('div');
    divider.className = 'cards-leadership-divider';
    content.append(divider);

    const designations = [...cardNode.querySelectorAll('p')];
    const targetDesignation = designations.find((paragraph) => paragraph.textContent.trim().length > 0) || document.createElement('p');
    if (targetDesignation) {
      const role = document.createElement('p');
      role.className = 'cards-leadership-designation';
      role.textContent = targetDesignation.textContent.trim();
      content.append(role);
    }

    card.append(imageWrapper, content);
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
