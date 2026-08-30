(() => {
  const input = document.querySelector('#search');
  if (!input) return;

  const findingCards = [...document.querySelectorAll('#findings .finding-card')];
  const bulletinCards = [...document.querySelectorAll('#bulletins .card, #archive .card')];
  const filters = [...document.querySelectorAll('[data-filter]')];

  const apply = () => {
    const query = input.value.trim().toLocaleLowerCase();
    const selected = Object.fromEntries(filters.map((field) => [field.dataset.filter, field.value]));
    const hasCategoryFilter = Object.values(selected).some(Boolean);
    let findingCount = 0;
    let bulletinCount = 0;

    for (const card of findingCards) {
      const matchesQuery = !query || (card.dataset.search || card.textContent.toLocaleLowerCase()).includes(query);
      const matchesFilters = Object.entries(selected).every(([name, value]) => {
        if (!value) return true;
        return (card.dataset[name] || '').split('|').includes(value);
      });
      card.hidden = !(matchesQuery && matchesFilters);
      if (!card.hidden) findingCount += 1;
    }

    for (const card of bulletinCards) {
      const text = card.dataset.search || card.textContent.toLocaleLowerCase();
      card.hidden = hasCategoryFilter || Boolean(query && !text.includes(query));
      if (!card.hidden) bulletinCount += 1;
    }

    const count = document.querySelector('#result-count');
    if (count) count.textContent = `${findingCount} finding(s) and ${bulletinCount} bulletin(s)`;
  };

  input.addEventListener('input', apply);
  for (const field of filters) field.addEventListener('change', apply);
  apply();
})();
