// Ambil elemen HTML yang akan dipakai oleh JavaScript.
const form = document.querySelector("#shopping-form");
const nameInput = document.querySelector("#item-name");
const priceInput = document.querySelector("#item-price");
const budgetInput = document.querySelector("#budget");
const itemList = document.querySelector("#item-list");
const totalText = document.querySelector("#total");
const remainingText = document.querySelector("#remaining");
const messageText = document.querySelector("#message");
const remainingLabel = document.querySelector("#remaining-label");
const progressBar = document.querySelector("#progress-bar");
const itemCount = document.querySelector("#item-count");
const formMessage = document.querySelector("#form-message");
const addButton = form.querySelector("button[type='submit']");

// Daftar barang disimpan sementara selama halaman dibuka.
const items = [];

// Mengubah angka menjadi format Rupiah, misalnya 150000 menjadi Rp150.000.
function rupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

// Hitung total harga dan perbarui informasi anggaran.
function updateBudget() {
  let total = 0;

  for (const item of items) {
    total = total + item.price;
  }

  const budget = Number(budgetInput.value);
  const remaining = budget - total;
  const usedPercent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  totalText.textContent = rupiah(total);
  remainingText.textContent = rupiah(budget > 0 ? remaining : 0);
  progressBar.style.width = usedPercent + "%";
  itemCount.textContent = items.length + " barang";
  addButton.disabled = budget <= 0 || remaining <= 0;

  if (remaining <= 0 && budget > 0) {
    formMessage.textContent = "Anggaran sudah habis. Hapus barang atau naikkan anggaran untuk menambah barang.";
  } else {
    formMessage.textContent = "";
  }

  if (budget <= 0) {
    remainingLabel.textContent = "Sisa anggaran";
    messageText.textContent = "Masukkan anggaran lebih dari Rp0.";
    messageText.classList.remove("over-budget");
    remainingText.classList.remove("over-budget");
    progressBar.classList.remove("over-budget");
  } else if (remaining < 0) {
    remainingLabel.textContent = "Melebihi anggaran";
    messageText.textContent = "Belanjaanmu melebihi anggaran.";
    messageText.classList.add("over-budget");
    remainingText.classList.add("over-budget");
    progressBar.classList.add("over-budget");
  } else {
    remainingLabel.textContent = "Sisa anggaran";
    messageText.textContent = items.length === 0
      ? "Anggaranmu masih aman. Yuk, susun daftar belanja!"
      : "Anggaranmu masih aman. Tetap belanja sesuai rencana!";
    messageText.classList.remove("over-budget");
    remainingText.classList.remove("over-budget");
    progressBar.classList.remove("over-budget");
  }
}

// Tampilkan semua barang yang ada di dalam daftar items.
function showItems() {
  itemList.innerHTML = "";

  if (items.length === 0) {
    itemList.innerHTML = '<li class="empty"><span class="cart-icon">🛒</span><strong>Daftarnya masih kosong</strong><span>Tambahkan kebutuhan pertamamu di atas.</span></li>';
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const row = document.createElement("li");
    const itemText = document.createElement("span");
    const deleteButton = document.createElement("button");

    itemText.textContent = items[i].name + " — " + rupiah(items[i].price);
    deleteButton.textContent = "Hapus";
    deleteButton.className = "delete-button";
    deleteButton.type = "button";

    // Hapus barang yang sesuai dengan nomor urutnya.
    deleteButton.addEventListener("click", function () {
      items.splice(i, 1);
      showItems();
      updateBudget();
    });

    row.append(itemText, deleteButton);
    itemList.append(row);
  }
}

// Jalankan saat tombol "Tambah barang" ditekan.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const budget = Number(budgetInput.value);

  if (name === "" || price <= 0) {
    return;
  }

  const total = items.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  if (budget <= 0 || total + price > budget) {
    formMessage.textContent = "Barang tidak ditambahkan karena harganya akan melebihi anggaran.";
    return;
  }

  items.push({ name: name, price: price });
  showItems();
  updateBudget();
  form.reset();
  nameInput.focus();
});

// Hitung ulang jika anggaran diubah.
budgetInput.addEventListener("input", updateBudget);
nameInput.addEventListener("input", function () {
  formMessage.textContent = "";
});
priceInput.addEventListener("input", function () {
  formMessage.textContent = "";
});

// Tampilkan nilai awal saat halaman pertama kali dibuka.
updateBudget();
