(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const input = document.querySelector('#search');
  const cards = [...document.querySelectorAll('[data-filter-card]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#result-count');
  const cloud = document.querySelector('[data-topic-cloud]');
  if (cloud) {
    for (const button of document.querySelectorAll('[data-topic-sort]')) {
      button.addEventListener('click', () => {
        const mode = button.dataset.topicSort;
        const words = [...cloud.querySelectorAll('[data-filter-card]')];
        words.sort((a, b) => mode === 'count'
          ? Number(b.dataset.topicCount) - Number(a.dataset.topicCount) || a.dataset.topicLabel.localeCompare(b.dataset.topicLabel)
          : a.dataset.topicLabel.localeCompare(b.dataset.topicLabel));
        for (const word of words) cloud.append(word);
      });
    }
  }
  if (!input || !cards.length) return;

  const params = new URLSearchParams(location.search);
  input.value = params.get('q') || '';
  for (const field of filters) field.value = params.get(field.dataset.filter) || '';

  const apply = (updateUrl = true) => {
    const query = input.value.trim().toLocaleLowerCase();
    const selected = Object.fromEntries(filters.map((field) => [field.dataset.filter, field.value]));
    let visible = 0;
    for (const card of cards) {
      const text = card.dataset.search || card.textContent.toLocaleLowerCase();
      const queryMatch = !query || text.includes(query);
      const filterMatch = Object.entries(selected).every(([name, value]) => {
        if (!value) return true;
        return (card.dataset[name] || '').split('|').includes(value);
      });
      card.hidden = !(queryMatch && filterMatch);
      if (!card.hidden) visible += 1;
    }
    if (count) {
      const noun = count.dataset.resultNoun || 'development';
      count.textContent = `${visible} ${noun}${visible === 1 ? '' : 's'}`;
    }
    if (updateUrl) {
      const next = new URLSearchParams();
      if (query) next.set('q', query);
      for (const [name, value] of Object.entries(selected)) if (value) next.set(name, value);
      history.replaceState(null, '', `${location.pathname}${next.size ? `?${next}` : ''}`);
    }
  };

  input.addEventListener('input', () => apply());
  for (const field of filters) field.addEventListener('change', () => apply());
  apply(false);
})();
