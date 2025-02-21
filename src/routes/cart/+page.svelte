<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
  
    let cart = [];
    let error = "";
    let message = "";
  
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Hiba a kosár lekérésekor");
        cart = await res.json();
      } catch (err) {
        error = err.message;
      }
    }
  
    async function removeFromCart(productId) {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
  
        if (!res.ok) throw new Error("Hiba a termék eltávolításakor");
        cart = cart.filter(item => item.productId !== productId); // Frontenden is frissítünk
    } catch (err) {
      error = err.message;
    }
  }
  
    async function placeOrder() {
      try {
        const res = await fetch("/api/orders", { method: "POST" });
        if (!res.ok) throw new Error("Hiba a rendelés leadásakor");
  
        message = "Rendelés sikeresen leadva!";
        cart = []; // Frontenden ürítjük a kosarat
        setTimeout(() => goto("/"), 2000); // 2 mp múlva vissza a főoldalra
      } catch (err) {
        error = err.message;
      }
    }

    onMount(fetchCart);
  </script>
  
  <h1>Kosár</h1>

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  
  {#if message}
  <p style="color: green;">{message}</p>
  {/if} 

  {#if cart.length === 0}
    <p>A kosarad üres.</p>
  {:else}
    {#each cart as item}
      <div class="cart-item">
        <img src={item.imageUrl} alt={item.name} />
        <h2>{item.name}</h2>
        <p>{item.quantity} × {(item.price / 100).toFixed(2)}€</p>
        <button on:click={() => removeFromCart(item.productId)}>Törlés</button>
      </div>
    {/each}
    <button on:click={placeOrder} class="order-button" disabled={cart.length === 0}>
      Rendelés leadása
    </button>
  {/if}
  
  <style>
    .cart-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .cart-item img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
    }
    .order-button {
      margin-top: 10px;
      padding: 10px;
      background: #28a745;
      color: white;
      border: none;
      cursor: pointer;
    }
    .order-button:disabled {
    background: gray;
    cursor: not-allowed;
    }
  </style>