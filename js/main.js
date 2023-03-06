const titleInput = document.querySelector("input.title");
const categoryInput = document.querySelector("input.category");
const countInput = document.querySelector("input.count");
const searchInput = document.querySelector("input.search");
// cost inputs
const costInput = document.querySelector("input.cost");
const taxInput = document.querySelector("input.tax");
const adsInput = document.querySelector("input.ads");
const otherInput = document.querySelector("input.other");
// price inputs
const priceInput = document.querySelector("input.price");
const discountInput = document.querySelector("input.discount");
// total span
const totalCost = document.querySelector(".cost-part span.total-cost");
const totalPrice = document.querySelector(".price-part span.total-price");
// buttons
const addBtn = document.getElementById("add-btn");
const titleSearchBtn = document.getElementById("title-search-btn");
const categorySearchBtn = document.getElementById("category-search-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");

// is update?
let isUpdated = false;
let updateId;

// TOTAL COST FUNCTION :
function getTotalCost() {
  if (costInput.value) {
    let result =
      +costInput.value + +taxInput.value + +adsInput.value + +otherInput.value;
    totalCost.innerHTML = result;
    totalCost.style.opacity = "100%";
  } else {
    totalCost.innerHTML = "";
    totalCost.style.opacity = "80%";
  }
}
// TOTAL PRICE FUNCTION:
function getTotalPrice() {
  if (priceInput.value) {
    let result = +priceInput.value - +discountInput.value;
    totalPrice.innerHTML = result;
    totalPrice.style.opacity = "100%";
  } else {
    totalPrice.innerHTML = "";
    totalPrice.style.opacity = "80%";
  }
}

// ADD PRODUCT FUNCTION:
let data;
if (localStorage.products) {
  data = JSON.parse(localStorage.products);
} else {
  data = [];
}

addBtn.addEventListener("click", function () {
  let product = {
    title: titleInput.value.toLowerCase(), // to solve search promblem
    category: categoryInput.value.toLowerCase(), // to solve search promblem
    count: countInput.value,
    cost: costInput.value,
    taxes: taxInput.value,
    ads: adsInput.value,
    others: otherInput.value,
    totalCost: totalCost.innerHTML,
    price: priceInput.value,
    discount: discountInput.value,
    totalPrice: totalPrice.innerHTML,
  };

  if (titleInput.value == "") product.title = "undefined";
  if (categoryInput.value == "") product.category = "undefined";
  if (costInput.value == "") product.cost = 0;
  if (taxInput.value == "") product.taxes = 0;
  if (adsInput.value == "") product.ads = 0;
  if (otherInput.value == "") product.others = 0;
  if (!totalCost.innerHTML) product.totalCost = 0;
  if (priceInput.value == "") product.price = 0;
  if (discountInput.value == "") product.discount = 0;
  if (!totalPrice.innerHTML) product.totalPrice = 0;

  if (!isUpdated) {
    // count loop:
    if (product.count > 0 && product.count <= 100) {
      for (let i = 0; i < product.count; i++) {
        data.push(product);
      }
      // clear inputs
      clearInputs();
    } else {
      alert(`fill at least the count field from 1 to 100 only`);
    }
  } else {
    data[updateId] = product;
    isUpdated = false;
    countInput.removeAttribute("disabled");
    addBtn.innerHTML = `add product`;
    // clear inputs
    clearInputs();
  }

  localStorage.setItem("products", JSON.stringify(data));
  // get data
  getData();
});

// CLEAR DATA INPUTS:
function clearInputs() {
  titleInput.value = "";
  categoryInput.value = "";
  countInput.value = "";
  costInput.value = "";
  taxInput.value = "";
  adsInput.value = "";
  otherInput.value = "";
  totalCost.innerHTML = "";
  priceInput.value = "";
  discountInput.value = "";
  totalPrice.innerHTML = "";
  totalCost.style.opacity = "80%";
  totalPrice.style.opacity = "80%";
}

// GET THE DATA FUNCTION:
function getData() {
  let tbody = document.getElementById("tbody");
  let tr = "";
  if (data.length > 0) {
    data.forEach((product, id) => {
      tr += `<tr>
            <td>${id + 1}</td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${product.cost}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.others}</td>
            <td>${product.totalCost}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${product.totalPrice}</td>
            <td><button onclick="updateItem(${id})" type="button" class="btn" id="update-btn">update</button></td>
            <td><button onclick="deleteItem(${id})" type="button" class="btn" id="delete-btn">delete</button></td>
        </tr>`;
      tbody.innerHTML = tr;
      deleteAllBtn.style.display = "block";
      deleteAllBtn.innerHTML = `delete all (${data.length})`;
    });
  } else {
    deleteAllBtn.style.display = "none";
    tbody.innerHTML = "";
  }
}
getData();

// DELETE ITEM FUNCTION:
function deleteItem(id) {
  data.splice(id, 1);
  localStorage.products = JSON.stringify(data);
  getData();
}

// DELETE ALL FUNCTION:
function deleteAll() {
  data.splice(0);
  localStorage.products = JSON.stringify(data);
  getData();
}

// UPDATE ITEM FUNCTION:
function updateItem(i) {
  titleInput.value = data[i].title;
  categoryInput.value = data[i].category;
  costInput.value = data[i].cost;
  taxInput.value = data[i].taxes;
  adsInput.value = data[i].ads;
  otherInput.value = data[i].others;
  getTotalCost();
  priceInput.value = data[i].price;
  discountInput.value = data[i].discount;
  getTotalPrice();
  countInput.setAttribute("disabled", "true");
  addBtn.innerHTML = `update product '${i + 1}'`;
  isUpdated = true;
  updateId = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// SEARCH MODE FUNCTION:
let searchMode = "";
if (!searchMode) {
  searchInput.setAttribute("disabled", "true");
}
function searchModeType(id) {
  if (id === "title-search-btn") {
    searchMode = "title";
  } else if (id === "category-search-btn") {
    searchMode = "category";
  }

  searchInput.removeAttribute("disabled");
  searchInput.focus();
  searchInput.value = "";
  searchInput.placeholder = `search by ${searchMode}`;
  getData();
}

// SEARCH FUNCTION:
function search(value) {
  let tbody = document.getElementById("tbody");
  let tr = "";

  if (searchMode == "title") {
    data.forEach((product, id) => {
      if (product.title.includes(value.toLowerCase())) {
        console.log(id);
        tr += `<tr>
            <td>${id}</td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${product.cost}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.others}</td>
            <td>${product.totalCost}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${product.totalPrice}</td>
            <td><button onclick="updateItem(${id})" type="button" class="btn" id="update-btn">update</button></td>
            <td><button onclick="deleteItem(${id})" type="button" class="btn" id="delete-btn">delete</button></td>
        </tr>`;
      }
    });
  } else if (searchMode == "category") {
    data.forEach((product, id) => {
      if (product.category.includes(value.toLowerCase())) {
        tr += `<tr>
        <td>${id}</td>
        <td>${product.title}</td>
        <td>${product.category}</td>
        <td>${product.cost}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.others}</td>
        <td>${product.totalCost}</td>
        <td>${product.price}</td>
        <td>${product.discount}</td>
        <td>${product.totalPrice}</td>
        <td><button onclick="updateItem(${id})" type="button" class="btn" id="update-btn">update</button></td>
        <td><button onclick="deleteItem(${id})" type="button" class="btn" id="delete-btn">delete</button></td>
    </tr>`;
      }
    });
  }
  tbody.innerHTML = tr;
}
