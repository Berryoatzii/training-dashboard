const filters = [...document.querySelectorAll('[data-filter]')];
const posts = [...document.querySelectorAll('[data-category]')];
if (filters.length) {
  const controls = document.querySelector('.blog-filters');
  const status = document.querySelector('#blog-count');
  controls.hidden = false;
  function show(category) {
    let count = 0;
    for (const post of posts) {
      post.hidden = category !== 'all' && post.dataset.category !== category;
      if (!post.hidden) count++;
    }
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    status.textContent = 'แสดง ' + count + ' บทความ';
  }
  for (const button of filters) button.addEventListener('click', () => show(button.dataset.filter));
  show('all');
}
