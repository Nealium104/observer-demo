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

