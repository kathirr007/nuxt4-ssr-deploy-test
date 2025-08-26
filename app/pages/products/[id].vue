<script setup>
const productId = useRoute().params.id;

const currentSlide = ref(0)

const slideTo = (nextSlide) => (currentSlide.value = nextSlide)

const galleryConfig = {
    itemsToShow: 1,
    wrapAround: true,
    slideEffect: 'fade',
    mouseDrag: false,
    touchDrag: false,
    height: 320,
}

const thumbnailsConfig = {
    height: 80,
    itemsToShow: 6,
    wrapAround: true,
    touchDrag: false,
    gap: 10,
}

const { data: productDetails } = await useAsyncData('product-details', () => {
    return $fetch(`/api/products/${productId}`)
        .then((response) => {
            return response.product;
        })
        .catch((error) => {
            console.log(error);
        })
})

</script>

<template>
    <div>
        <h2>
            {{ productDetails.title }}
        </h2>
        <ul>
            <li>
                Price: {{ productDetails.price }}
            </li>
        </ul>
        <h3>Gallery</h3>
        <!-- <div class="image-gallery">
            <template v-for="(image, index) in productDetails.prodImages" :key="index">
                <img :src="image.location" alt="image.name">
            </template>
        </div> -->
        <Carousel id="gallery" v-bind="galleryConfig" v-model="currentSlide">
            <Slide v-for="image in productDetails.prodImages" :key="image.name">
                <img :src="image.location" :alt="image.name" class="gallery-image" />
            </Slide>
        </Carousel>

        <Carousel id="thumbnails" v-bind="thumbnailsConfig" v-model="currentSlide">
            <Slide v-for="image in productDetails.prodImages" :key="image.name">
                <template #default="{ currentIndex, isActive }">
                    <div
                        :class="['thumbnail', { 'is-active': isActive }]"
                        @click="slideTo(currentIndex)">
                        <img :src="image.location" :alt="image.name" class="thumbnail-image" />
                    </div>
                </template>
            </Slide>

            <template #addons>
                <Navigation class="gallery-navigation" />
            </template>
        </Carousel>
    </div>
</template>


<style scoped>
.image-gallery {
    display: flex;
    gap: 1rem;
}

.image-gallery img {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.carousel {
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}

img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-image {
  border-radius: 16px;
  width: auto;
  height: 100%;
}

#thumbnails {
  margin-top: 10px;
}

.thumbnail {
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;
}

.thumbnail.is-active,
.thumbnail:hover {
  opacity: 1;
}

.thumbnail-image {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gallery-navigation {
    margin-bottom: 1.5rem;
}
</style>