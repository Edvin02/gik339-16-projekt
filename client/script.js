//Alva----->>>

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
    showMessage("Fel vid hämtning av bilar", "danger");
  }
}

// Add an event listener for the "Erase car details" button
document
  .querySelector(".btn-dark.w-50[type='button']")
  .addEventListener("click", () => {
    // Clear all input fields in the form
    document.getElementById("carId").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("year").value = "";
    document.getElementById("color").value = "";
    document.getElementById("regnr").value = "";

    // Show a message confirming the reset
    showMessage("Bilsinformation har rensats", "info");
  });

// Klara---->
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

  const carId = document.getElementById("carId").value;

  try {
    // Skickar en begäran för att skapa en ny bil eller uppdatera en befintlig bil
    const response = await fetch(carId ? `${serverUrl}/${carId}` : serverUrl, {
      method: carId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.includes("registreringsnummer")) {
        showMessage(
          "Ett fordon med detta registreringsnummer finns redan.",
          "danger"
        );
      } else {
        showMessage(errorData.error || "Något gick fel", "danger");
      }
      return;
    }

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
    showMessage("Fel vid sparande av bil", "danger");
  }
});

// Elange --->

// Lägger till en händelselyssnare för klickhändelser på hela dokumentet
document.addEventListener("click", async (e) => {
  const target = e.target; // Hämtar elementet som användaren klickade på

  // Kontrollera om det klickade elementet är en knapp för redigering (med klassen "edit-btn")
  if (target.classList.contains("edit-btn")) {
    const card = target.closest(".card"); // Hittar det närmaste kortelementet (bilkort) där knappen klickades
    const carId = card.dataset.id; // Hämtar bilens ID från dataset-attributet i kortet

    try {
      // Skickar en GET-begäran till servern för att hämta detaljer om den valda bilen
      const response = await fetch(`${serverUrl}/${carId}`);
      const car = await response.json(); // Omvandlar svaret från servern till JSON-format

      // Fyller i redigeringsformuläret med bilens nuvarande detaljer
      document.getElementById("carId").value = car.id;
      document.getElementById("brand").value = car.brand;
      document.getElementById("year").value = car.year;
      document.getElementById("color").value = car.color;
      document.getElementById("regnr").value = car.regnr;
    } catch (error) {
      // Visar ett felmeddelande om något går fel vid hämtning av bildetaljer
      showMessage("Fel vid hämtning av bildetaljer", "danger");
    }
  }
  // Kontrollera om det klickade elementet är en knapp för borttagning (med klassen "del-btn")
  else if (target.classList.contains("del-btn")) {
    const card = target.closest(".card"); // Hittar det närmaste kortelementet (bilkort) där knappen klickades
    const carId = card.dataset.id; // Hämtar bilens ID från dataset-attributet i kortet

    try {
      // Skickar en DELETE-begäran till servern för att ta bort bilen med det angivna ID:t
      const response = await fetch(`${serverUrl}/${carId}`, {
        method: "DELETE", // Anger att det är en borttagningsoperation
      });

      const result = await response.json(); // Omvandlar svaret från servern till JSON-format
      // Visar ett meddelande om att bilen har tagits bort framgångsrikt
      showMessage(result.message);
      // Uppdaterar bilinformationen genom att hämta den på nytt från servern
      fetchcars();
    } catch (error) {
      // Visar ett felmeddelande om något går fel vid borttagning av bilen
      showMessage("Fel vid borttagning av bil", "danger");
    }
  }
});

// Lägger till en händelselyssnare som körs när sidan är färdigladdad
document.addEventListener("DOMContentLoaded", fetchcars); // Hämtar och visar alla bilar från servern när sidan laddas
