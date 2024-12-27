const formHtml = document.getElementById("carForm");

// URL till backend-servern för att hämta användardata
const serverUrl = "http://localhost:3000/cars";

// Hämta data från servern med fetch
async function fetchcars() {
  const response = await fetch(serverUrl);
  const cars = await response.json();

  //listan för bilar
  const ul = document.createElement("ul");

  cars.forEach((car) => {
    const li = document.createElement("li");
    li.innerHTML = `
   <li class="d-flex justify-content-center align-items-center text-center mb-3 rounded-5" style="background-color:${modifiedColor} data-id=${car.id}">
<div>
<h2>
${cars.brand}
</h2>
<p>${cars.year}-${cars.color}- ${cars.regnr} </p>

</div>

   <div>
   <button class=" rounded-5 bg-blue text-lg edit-btn">Change</button>
   <button class=" rounded-5 bg-black text-lg del-btn">Delete</button>
   </div>
     </div>
    
    `;
  });
}

// Hämtar referenser från DOM-trädet
const carBrand = document.getElementById("brand");
const carYear = document - getElementById("year");
const carColor = document.getElementById("color");
const carRegnr = document.getElementById("regnr");
const carID = document.getElementById("carId");

// funktion för uppdatering av bilar
const carForm = addEventListener("submit", async (e) => {
  e.preventDefault();
  const car = {
    brand: document.getElementById("brand").value,
    year: document.getElementById("year").value,
    color: document.getElementById("color").value,
    regnr: document.getElementById("regnr").value,
  };

  const carID = document.getElementById("carId").value;

  try {
    const response = await fetch(carId ? `${serverUrl}/${carID}` : serverUrl, {
      method: carId ? "PUT" : "POST",
      headers: { "Content-Type": "application/Json" },
      body:JSON.stringify({brand,year,regnr,color})
    });

  } catch (error) {
    showMessage("Error saving car");
  }

function showMessage(message,Type= "success"){
    messageBox.textContet= message;
    messageBox.className= `Alert alert-$(type)`;
    messageBox.classList.remove("d-none")
    setTimeout(()=> messageBox.classList.add("d-none"),3000);

}

 });

//Funktion för att ta bort 
li.addEventListener("click", async(e)=> {
    const target= e.target;
    const carId= target.closest("li").dataset.id;

 });
if (target.classList.container("del-btn")){
    const response = await fetch(`${serverUrl}/carId`)
    const car = await response.json();
    document.getElementById("carId").value= car.id;
    document.getElementById("brand").value = car.brand;
    document.getElementById("year").value = car.year;
    document.getElementById("color").value = car.color;
    else if(target.classList.container("delete-btn")){
         try {
    const response = await fetch(carId ? `${serverUrl}/${carID}` : serverUrl, { method:"DELETE"});
    const result = await response.json;

   
showMessage( result, message);
fetchcars();
         }
catch(error){
    showMessage("Error deleting car")
}
 



   
 


});
