export default function decorate(block) {
  const children = [...block.children];
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'chairman-profile-copy';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'chairman-profile-image';

  const modalBio = document.createElement('div');
  modalBio.className = 'chairman-profile-bio';
  modalBio.style.display = 'none';

  const leftContent = [];
  const rightImage = [];

  children.forEach((child) => {
    if (child.querySelector('picture, img')) {
      rightImage.push(child);
    } else if (child.classList.contains('chairman-profile-bio')) {
      modalBio.innerHTML = child.innerHTML;
    } else {
      leftContent.push(child);
    }
  });

  leftContent.forEach((node) => {
    const clone = node.cloneNode(true);
    contentWrapper.append(clone);
  });

  if (rightImage.length) {
    const media = rightImage[0].cloneNode(true);
    imageWrapper.append(media);
  }

  const readMore = document.createElement('button');
  readMore.type = 'button';
  readMore.className = 'chairman-profile-read-more';
  readMore.textContent = 'Read More';

  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'chairman-profile-modal-backdrop';
  modalBackdrop.setAttribute('aria-hidden', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.className = 'chairman-profile-modal-dialog';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'chairman-profile-close';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.textContent = '×';

  const modalLeft = document.createElement('div');
  modalLeft.className = 'chairman-profile-modal-photo';
  if (imageWrapper.firstElementChild) {
    const modalImage = imageWrapper.firstElementChild.cloneNode(true);
    modalLeft.append(modalImage);
  }

  const modalRight = document.createElement('div');
  modalRight.className = 'chairman-profile-modal-content';
  const hasExplicitBio = modalBio.textContent.trim().length > 0;
  if (hasExplicitBio) {
    modalRight.append(modalBio.cloneNode(true));
  } else {
    const fallbackBio = contentWrapper.cloneNode(true);
    fallbackBio.querySelector('.chairman-profile-read-more')?.remove();
    modalRight.append(fallbackBio);
  }

  modalDialog.append(closeButton, modalLeft, modalRight);
  modalBackdrop.append(modalDialog);

  const openModal = () => {
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  readMore.addEventListener('click', (event) => {
    event.stopPropagation();
    openModal();
  });

  block.addEventListener('click', (event) => {
    const clickedReadMore = event.target.closest('.chairman-profile-read-more');
    if (!clickedReadMore) {
      openModal();
    }
  });

  closeButton.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  contentWrapper.append(readMore);
  block.textContent = '';
  block.append(contentWrapper, imageWrapper, modalBackdrop);
}
