const formHtml = document.getElementById("carForm");
const serverUrl = "http://localhost:3000/cars";

// Hämta data från servern
async function fetchcars() {
  try {
    const response = await fetch(serverUrl);
    const cars = await response.json();

    const divContainer = document.getElementById("car-list");
    divContainer.innerHTML = "";

    cars.forEach((car) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        "p-3",
        "rounded-2",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      card.style.backgroundColor = car.color || "#f5ede5";
      card.dataset.id = car.id;
      const fontColor = car.color === "#5b5b5b" ? "#808080" : "#000";
      card.style.color = fontColor;

      card.innerHTML = `
        <div>
          <h1>${car.brand}</h1>
          <p>${car.year} - ${car.regnr}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger btn-sm edit-btn">Change</button>
          <button class="btn btn-danger btn-sm del-btn">Delete</button>
        </div>
      `;

      divContainer.appendChild(card);
    });
  } catch (error) {
    showMessage("Error fetching cars", "danger");
  }
}

function showMessage(message, type = "success") {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.className = `alert alert-${type}`;
  messageBox.classList.remove("d-none");

  setTimeout(() => {
    messageBox.classList.add("d-none");
  }, 3000);
}

document.getElementById("carForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const car = {
    brand: document.getElementById("brand").value.trim(),
    year: document.getElementById("year").value.trim(),
    color: document.getElementById("color").value.trim(),
    regnr: document.getElementById("regnr").value.trim(),
  };

  const carId = document.getElementById("carId").value;
  try {
    const response = await fetch(carId ? `${serverUrl}/${carId}` : serverUrl, {
      method: carId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });

    const result = await response.json();
    showMessage(result.message);
    document.getElementById("carForm").reset();
    document.getElementById("carId").value = "";
    fetchcars();
  } catch (error) {
    showMessage("Error saving car", "danger");
  }
});

document.addEventListener("click", async (e) => {
  const target = e.target;

  if (target.classList.contains("edit-btn")) {
    const card = target.closest(".card");
    const carId = card.dataset.id;

    try {
      const response = await fetch(`${serverUrl}/${carId}`);
      const car = await response.json();

      document.getElementById("carId").value = car.id;
      document.getElementById("brand").value = car.brand;
      document.getElementById("year").value = car.year;
      document.getElementById("color").value = car.color;
      document.getElementById("regnr").value = car.regnr;
    } catch (error) {
      showMessage("Error fetching car details", "danger");
    }
  } else if (target.classList.contains("del-btn")) {
    const card = target.closest(".card");
    const carId = card.dataset.id;

    try {
      const response = await fetch(`${serverUrl}/${carId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      showMessage(result.message);
      fetchcars();
    } catch (error) {
      showMessage("Error deleting car", "danger");
    }
  }
});

document.addEventListener("DOMContentLoaded", fetchcars);
