<script>
  import { onMount } from "svelte";

    let products = [];

    onMount(async () => {
        const res = await fetch("/api/products");
        products = await res.json();
    });
</script>

{#each products as product}
    <div class= "product">
        <img src={product.imageUrl} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <strong>{(product.price / 100).toFixed(2)}€</strong>
    </div>
{/each}
    
