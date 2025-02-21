<script>
    import { onMount } from "svelte";
  
    let products = [];
    let error = "";
  
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Hiba a termékek betöltésekor.");
        products = await res.json();
      } catch (err) {
        error = err.message;
      }
    }
  
    onMount(fetchProducts);
  </script>
  
  <h1>Termékek</h1>
  
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  
  {#if products.length === 0}
    <p>Jelenleg nincsenek termékek.</p>
  {:else}
    <div class="product-list">
      {#each products as product}
        <div class="product">
          <img src={product.imageUrl} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <strong>{(product.price / 100).toFixed(2)}€</strong>
          <button on:click={() => addToCart(product.id)}>Kosárba</button>
        </div>
      {/each}
    </div>
  {/if}
  
  <style>
    .product-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .product {
      border: 1px solid #ddd;
      padding: 10px;
      width: 200px;
      text-align: center;
    }
    .product img {
      max-width: 100%;
      height: auto;
    }
  </style>
    
