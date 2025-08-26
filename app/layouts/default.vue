<template>
    <div>
        <ul class="nav-list">
            <li>
                <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/about">About</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/contact">Contact</NuxtLink>
            </li>
        </ul>
        <slot />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.nav-list {
    margin:0;
    padding:0;
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>