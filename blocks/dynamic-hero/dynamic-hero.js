import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

function pickField(row, keys) {
  const matchedKey = keys.find((key) => row[key]);
  return matchedKey ? row[matchedKey] : '';
}

function toAbsolutePath(path) {
  if (!path) return '';
  return new URL(path, window.location.origin).pathname;
}

function normalizeImageUrl(src) {
  if (!src) return '';
  try {
    const parsed = new URL(src, window.location.origin);
    const driveFileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    if (parsed.hostname.includes('drive.google.com') && driveFileMatch) {
      return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
    }
    return parsed.href;
  } catch (e) {
    return src;
  }
}

function buildImage(image, alt, eager) {
  const normalizedImage = normalizeImageUrl(image);
  if (!normalizedImage) return null;

  const imageUrl = new URL(normalizedImage, window.location.origin);
  if (imageUrl.origin === window.location.origin) {
    return createOptimizedPicture(normalizedImage, alt, eager, [{ media: '(min-width: 900px)', width: '1200' }, { width: '800' }]);
  }

  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.loading = eager ? 'eager' : 'lazy';
  img.alt = alt;
  img.src = imageUrl.href;
  picture.append(img);
  return picture;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const endpoint = toAbsolutePath(config.endpoint || '/query-index.json');
  const url = new URL(endpoint, window.location.origin);
  const response = await fetch(url.href);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(`dynamic-hero: failed to fetch ${url.href} (${response.status})`);
    block.textContent = 'Unable to load banner content.';
    return;
  }

  const payload = await response.json();
  const rows = Array.isArray(payload.data) ? payload.data : [];
  if (!rows.length) {
    // eslint-disable-next-line no-console
    console.error('dynamic-hero: no rows found in query-index response');
    block.textContent = 'No banner content found.';
    return;
  }

  block.textContent = '';
  const list = document.createElement('div');
  list.className = 'dynamic-hero-list';

  rows.forEach((row, index) => {
    const title = pickField(row, ['title', 'heading', 'h1']);
    const description = pickField(row, ['description', 'subtext', 'copy']);
    const image = pickField(row, ['image', 'imageurl', 'backgroundimage']);
    const alt = pickField(row, ['alt', 'imagealt', 'alttext']) || title || '';
    const ctaText = pickField(row, ['ctatext', 'buttontext', 'linktext']);
    const ctaLink = pickField(row, ['ctalink', 'buttonlink', 'linkurl']);

    const banner = document.createElement('div');
    banner.className = 'dynamic-hero-banner';

    const picture = buildImage(image, alt, index === 0);
    if (picture) {
      banner.append(picture);
    }

    const content = document.createElement('div');
    content.className = 'dynamic-hero-content';

    if (title) {
      const heading = document.createElement(index === 0 ? 'h1' : 'h2');
      heading.textContent = title;
      content.append(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.className = 'dynamic-hero-description';
      p.textContent = description;
      content.append(p);
    }

    if (ctaText && ctaLink) {
      const buttonContainer = document.createElement('p');
      buttonContainer.className = 'button-container';
      const link = document.createElement('a');
      link.className = 'button primary';
      link.href = ctaLink;
      link.textContent = ctaText;
      buttonContainer.append(link);
      content.append(buttonContainer);
    }

    banner.append(content);
    list.append(banner);
  });

  block.append(list);
}
