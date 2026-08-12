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
