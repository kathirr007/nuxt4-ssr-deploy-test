<script lang="ts" setup>

const apiHealth = ref()

await useAsyncData('healthCheck', async () => {
  return $fetch('/api/_health').then(response => {
    console.log(response)
    apiHealth.value = response
    return response
  })
})

const { data: products } = await useAsyncData('products', () => 
  $fetch('/api/products').then(response => (response as any).products)
)
</script>

<template>
  <div>
    <h1>Products List</h1>
    <ul v-if="products.length">
      <li v-for="item in products" :key="item._id">
        <NuxtLink :to="`/products/${item._id}`">
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
