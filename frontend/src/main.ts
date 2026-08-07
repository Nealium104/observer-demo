interface Item {
  id: number;
  title: string;
  body: string;
  color: string;
  imageUrl: string;
}

const feed = document.getElementById("feed") as HTMLElement;

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
