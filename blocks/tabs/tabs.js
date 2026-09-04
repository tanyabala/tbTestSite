export default function decorate(block) {
  const panels = [...block.children].filter((child) => child.tagName === 'DIV');

  if (!panels.length) return;

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';

  const panelList = document.createElement('div');
  panelList.className = 'tabs-panels';

  panels.forEach((panel, index) => {
    const titleNode = panel.querySelector('h2, h3, h4, h5, h6, strong, p');
    const title = panel.dataset.tab
      || titleNode?.textContent?.trim()
      || `Tab ${index + 1}`;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'tabs-trigger';
    trigger.textContent = title;
    trigger.setAttribute('role', 'tab');
    trigger.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    trigger.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const tabPanel = document.createElement('div');
    tabPanel.className = 'tabs-panel';
    tabPanel.setAttribute('role', 'tabpanel');
    if (index !== 0) tabPanel.style.display = 'none';
    const panelClone = panel.cloneNode(true);
    if (!panel.dataset.tab) {
      const headingClone = panelClone.querySelector('h2, h3, h4, h5, h6, strong, p');
      if (headingClone) headingClone.remove();
    }
    tabPanel.append(...panelClone.childNodes);

    trigger.addEventListener('click', () => {
      const currentTriggers = tabList.querySelectorAll('.tabs-trigger');
      currentTriggers.forEach((btn, btnIndex) => {
        btn.classList.toggle('is-active', btnIndex === index);
        btn.setAttribute('aria-selected', btnIndex === index ? 'true' : 'false');
        btn.setAttribute('tabindex', btnIndex === index ? '0' : '-1');
      });

      const currentPanels = panelList.querySelectorAll('.tabs-panel');
      currentPanels.forEach((item, itemIndex) => {
        item.style.display = itemIndex === index ? 'block' : 'none';
      });
    });

    tabList.append(trigger);
    panelList.append(tabPanel);
  });

  block.textContent = '';
  block.append(tabList, panelList);

  const firstTrigger = tabList.querySelector('.tabs-trigger');
  if (firstTrigger) firstTrigger.classList.add('is-active');
}
