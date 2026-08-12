const feed = document.getElementById("feed");

async function fetchItems(page, pageSize = 12) {
  const res = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function renderCard(item) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-image" style="background:${item.color}">
      <img alt="${item.title}" data-src="${item.imageUrl}" />
    </div>
    <div class="card-body">
      <h2>${item.title}</h2>
      <p>${item.body}</p>
    </div>`;
  return card;
}

let page = 1;
let loading = false;
let hasMore = true;

async function loadNextPage() {
    if (loading || !hasMore) return;
    loading = true;

    const res = await fetchItems(page);
    res.items.forEach(item => feed.append(renderCard(item)));
    loadVisibleImages();

    page += 1;
    hasMore = res.hasMore;
    loading = false;
}

function onScroll() {
    const scrolledToBottom =
        window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 400;
    if (scrolledToBottom) loadNextPage();
}

function loadVisibleImages() {
    document.querySelectorAll("img[data-src]").forEach(img => {
        const rect = img.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
        }
    });
}

function debounce(fn, wait = 150) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}

window.addEventListener("scroll", debounce(onScroll));
window.addEventListener("scroll", debounce(loadVisibleImages));

loadNextPage(); // kick off page 1
