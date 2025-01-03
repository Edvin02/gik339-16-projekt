// Hämtar formulärets HTML-element via dess ID
const formHtml = document.getElementById("carForm");

// Definierar serverns URL
const serverUrl = "http://localhost:3000/cars";

// Definierar en färgkarta för bilens färger

const colorMap = {
  "#C02B1B": "red",
  "#2C2C2C": "black",
  "#1F5833": "green",
  "#EC6600": "orange",
  "#FFC800": "yellow",
  "#A1A1A1": "grey",
  "#E66EB2": "pink",
  "#005EBD": "blue",
};

const reverseColorMap = Object.fromEntries(
  Object.entries(colorMap).map(([hex, name]) => [name, hex])
);

// Funktion för att hämta bilinformation från servern
async function fetchcars() {
  try {
    // Hämtar bildata från servern
    const response = await fetch(serverUrl);
    const cars = await response.json();

    // Hämtar div-container för att visa bilarna
    const divContainer = document.getElementById("carList");

    // Rensar den befintliga billistan innan nya bilar läggs till
    divContainer.innerHTML = "";

    // Sätter klass för div-containern för att styla den
    divContainer.className = "d-flex flex-wrap gap-3 justify-content-center";

    // Itererar genom varje bil och skapar ett kort för att visa den
    cars.forEach((car) => {
      const card = document.createElement("div");

      // Lägger till klasser för att styla kortet
      card.classList.add(
        "card",
        "p-3",
        "rounded-5",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "col-12",
        "col-sm-6",
        "col-md-4",
        "col-lg-3"
      );

      // Sätter bakgrundsfärg på kortet baserat på bilens färg
      const chosenColor = reverseColorMap[car.color] || car.color;
      card.style.backgroundColor = chosenColor;

      /* card.style.backgroundColor = car.color || "#f5ede5"; */

      // Lagrar bilens ID som en data-attribut på kortet
      card.dataset.id = car.id;

      // Sätter fontfärgen baserat på bilens färg
      const fontColor = car.color === "#5b5b5b" ? "#808080" : "#000";
      card.style.color = fontColor;

      // Sätter in HTML-innehållet i kortet, inklusive bilens detaljer och handlingsknappar
      card.innerHTML = ` 
        <div class="card-body text-center rounded custom-rounded" style="background-color: ${chosenColor}">
          <h5 class="card-title text-light">${car.brand}</h5>
          <p class="card-text text-light">${car.year} - ${car.regnr}</p>
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-outline-light rounded-pill btn-sm edit-btn">Change</button>
            <button class="btn btn-outline-light rounded-pill btn-sm del-btn">Delete</button>
          </div>
        </div>
      `;

      // Lägger till kortet i div-containern
      divContainer.appendChild(card);
    });
  } catch (error) {
    // Visar ett felmeddelande om det misslyckas att hämta bilar
    showMessage("Error fetching cars", "danger");
  }
}

// Funktion för att visa ett meddelande (framgång eller fel) till användaren
function showMessage(message, type = "success") {
  console.log("showMessage called:", message); // Loggar meddelandet för felsökning
  const messageBox = document.getElementById("messageBox");

  // Sätter meddelandets text och stylar det baserat på typen
  messageBox.textContent = message;
  messageBox.className = `alert alert-${type}`;
  messageBox.classList.remove("d-none");

  // Döljer meddelandet efter 7 sekunder
  setTimeout(() => {
    messageBox.classList.add("d-none");
  }, 7000);
}

// Funktion för att hantera formulärets inskick för att lägga till eller uppdatera en bil
document.getElementById("carForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Skapar ett bilobjekt med formulärdata
  const car = {
    brand: document.getElementById("brand").value.trim(),
    year: document.getElementById("year").value.trim(),
    color: document.getElementById("color").value.trim(), // färgen hämtas här
    regnr: document.getElementById("regnr").value.trim(),
  };

  // Konvertera hexkoden till färgnamn
  const colorName = colorMap[car.color] || car.color; // Använd hexkoden för att få färgnamnet
  car.color = colorName; // Sätt färgnamnet i bilobjektet

  const carId = document.getElementById("carId").value;

  try {
    // Skickar en begäran för att skapa en ny bil eller uppdatera en befintlig bil
    const response = await fetch(carId ? `${serverUrl}/${carId}` : serverUrl, {
      method: carId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });

    const result = await response.json();

    // Visar ett framgångsmeddelande efter operationen
    showMessage(result.message);

    // Nollställer formuläret och tar bort bilens ID
    document.getElementById("carForm").reset();
    document.getElementById("carId").value = "";

    // Hämtar uppdaterad bilinformation
    fetchcars();
  } catch (error) {
    // Visar ett felmeddelande om operationen misslyckas
    showMessage("Error saving car", "danger");
  }
});

// Funktion för att hantera ändrings- och raderingsåtgärder för bilar
document.addEventListener("click", async (e) => {
  const target = e.target;

  // Hanterar klick på "Change"-knappen (redigera bil)
  if (target.classList.contains("edit-btn")) {
    const card = target.closest(".card");
    const carId = card.dataset.id;

    try {
      // Hämtar detaljer för bilen att redigera
      const response = await fetch(`${serverUrl}/${carId}`);
      const car = await response.json();

      // Fyller formuläret med bilens detaljer för redigering
      document.getElementById("carId").value = car.id;
      document.getElementById("brand").value = car.brand;
      document.getElementById("year").value = car.year;
      document.getElementById("color").value = car.color;
      document.getElementById("regnr").value = car.regnr;
    } catch (error) {
      // Visar ett felmeddelande om det misslyckas att hämta bilens detaljer
      showMessage("Error fetching car details", "danger");
    }
  } else if (target.classList.contains("del-btn")) {
    // Hanterar klick på "Delete"-knappen (radera bil)
    const card = target.closest(".card");
    const carId = card.dataset.id;

    try {
      // Skickar en begäran för att radera bilen
      const response = await fetch(`${serverUrl}/${carId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      // Visar ett framgångsmeddelande efter radering
      showMessage(result.message);
      // Hämtar uppdaterad bilinformation
      fetchcars();
    } catch (error) {
      // Visar ett felmeddelande om det misslyckas att radera bilen
      showMessage("Error deleting car", "danger");
    }
  }
});

// Hämtar bilar när sidan har laddats
document.addEventListener("DOMContentLoaded", fetchcars);
