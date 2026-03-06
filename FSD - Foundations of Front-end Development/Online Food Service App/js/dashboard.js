let userEmail = localStorage.getItem("email");

// Check if user email is present. If not, redirect immediately and stop execution.
if (!userEmail) {
  // Use .replace() to prevent the user from using the back button to return to the original page
  window.location.replace("login.html");
} else {
  // Only run this code if the user is present
  document.getElementById("userEmail").innerHTML = `Hello, ${userEmail}!`;
}

let foodSelection = document.getElementById("foodSelection");
let cartSelection = document.getElementById("cartSelection");

function logout() {
  // Clear the email from localStorage
  localStorage.removeItem("email");
  window.location.href = "login.html"; // Redirect to login page
}

foodSelection.style.display = "grid"; // Show food selection by default
cartSelection.style.display = "none"; // Hide cart selection by default

function showFoodSelection() {
  foodSelection.style.display = "grid"; // Show food selection
  cartSelection.style.display = "none"; // Hide cart selection
}

function showCartSelection() {
  foodSelection.style.display = "none"; // Hide food selection
  cartSelection.style.display = "block"; // Show cart selection
}

let FOOD_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=c";
fetch(FOOD_URL)
  .then((response) => response.json())
  .then((data) => {
    displayFood(data.meals);
  })
  .catch((error) => {
    console.log(error);
  });

function displayFood(meals) {
  const foodSelection = document.getElementById("foodSelection");
  meals.forEach((meal) => {
    let price = Math.floor(Math.random() * 20) + 5; // Random price between $5 and $25
    const foodCard = document.createElement("div");
    foodCard.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-md">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="h-48 w-full object-cover rounded-lg"/>
        <h3 class="text-lg font-semibold">${meal.strMeal}</h3>
        <p class="text-gray-600">Category: ${meal.strCategory}</p>
        <p class="text-gray-600">Area: ${meal.strArea}</p>
        <p class="text-gray-600 text-sm">Price: $${price}</p>
        <button class="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded cursor-pointer" onclick="addToCart('${meal.idMeal}', '${meal.strMeal}', ${price})">Add to Cart</button>
      </div>
    `;
    foodSelection.appendChild(foodCard);
  });
}

let cart = [];

// Get the current price total of the cart
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart
  document.getElementById("cartCount").innerText = `Cart Items: ${totalItems}`; // Update cart count display
}

function addToCart(id, name, price) {
  let item = cart.find((c) => c.id === id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  updateCartCount(); // Update cart count after adding an item
  updateCart();
}

function changeQuantity(mealID, change) {
  let item = cart.find((c) => c.id === mealID);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((c) => c.id !== mealID); // Remove item if quantity reaches 0
    }
    updateCartCount(); // Update cart count after changing quantity
    updateCart();
  }
}

function updateCart() {
  let cartItem = document.getElementById("cartItem");
  cartItem.innerHTML = ""; // Clear existing cart items

  let total = 0; // Initialize total

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.innerHTML = `
      <div class="flex items-center justify-between p-4 border-b">
        <h4 class="font-semibold">${item.name} (x${item.quantity})</h4>
        <p class="text-gray-600">$${item.price * item.quantity}</p>
        <div>
          <input type="button" value="+" onClick="changeQuantity('${item.id}', 1)" class="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-3 rounded cursor-pointer"/>
          <input type="button" value="-" onClick="changeQuantity('${item.id}', -1)" class="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-3 rounded cursor-pointer"/>
        </div>
      </div>
    `;
    cartItem.appendChild(cartItemDiv);
    total += item.price * item.quantity; // Accumulate total
  });

  // Append total to the cart
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<h3 class="text-lg font-bold p-4">Total: $${total.toFixed(2)}</h3>`;
  cartItem.appendChild(totalDiv);
}

function checkOut() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add some items before checking out.");
    return false;
  } else {
    alert(
      `Thank you for your order total of $${getCartTotal().toFixed(2)}! Your food will be delivered soon.`,
    );
    cart = []; // Clear the cart after checkout
    updateCartCount(); // Reset the nav badge after checkout
    updateCart(); // Update the cart display after checkout
    return true;
  }
}
