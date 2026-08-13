const feed = document.getElementById("feed");

async function fetchItems(page, pageSize = 12) {
  const res = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function renderCard(item) {
  const card = document.createElement("article");
  card.className = "card reveal";
  card.innerHTML = `
    <div class="card-image" style="background:${item.color}">
      <img alt="${item.title}" data-src="${item.imageUrl}" />
    </div>
    <div class="card-body">
      <h2>${item.title}</h2>
      <p>${item.body}</p>
    </div>`;
  imageObserver.observe(card.querySelector("img"));
  revealObserver.observe(card);
  return card;
}

const imageObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
    }
}, { rootMargin: "200px" });

const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
    }
});

let page = 1;
let loading = false;
let hasMore = true;

async function loadNextPage() {
    if (loading || !hasMore) return;
    loading = true;

    const res = await fetchItems(page);
    res.items.forEach(item => feed.append(renderCard(item)));
    page += 1;
    hasMore = res.hasMore;
    loading = false;

    if (!hasMore) {
        sentinel.classList.add("done");
        sentinelObserver.disconnect();
        return;
    }
    // A page may not push the sentinel out of the trigger zone (tall window, short page).
    // IO only fires on crossing*, so re-observe to force a fresh check
    // otherwise "still intersecting" is silent and the feed stalls with the spinner up.
    sentinelObserver.unobserve(sentinel);
    sentinelObserver.observe(sentinel);
}

const sentinel = document.createElement("div");
sentinel.className = "sentinel";
sentinel.innerHTML = `<div class="spinner"></div>`;
feed.after(sentinel);

const sentinelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadNextPage();
}, { rootMargin: "400px" });

sentinelObserver.observe(sentinel);
