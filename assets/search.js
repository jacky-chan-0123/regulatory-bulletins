(() => {
  const input = document.querySelector('#search');
  const cards = [...document.querySelectorAll('#archive .card')];
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    for (const card of cards) card.hidden = query && !card.textContent.toLowerCase().includes(query);
  });
})();
