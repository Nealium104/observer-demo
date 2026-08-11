interface Item {
  id: number;
  title: string;
  body: string;
  color: string;
  imageUrl: string;
}

interface FeedResponse {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  items: Item[];
}

const feed = document.getElementById("feed") as HTMLElement;

async function fetchItems(page: number, pageSize = 12): Promise<FeedResponse> {
  const res = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function renderCard(item: Item): HTMLElement {
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
    document.querySelectorAll<HTMLImageElement>("img[data-src]").forEach(img => {
        const rect = img.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            img.src = img.dataset.src!;
            img.removeAttribute("data-src");
        }
    });
}

window.addEventListener("scroll", onScroll);
window.addEventListener("scroll", loadVisibleImages);

loadNextPage(); // kick off page 1
