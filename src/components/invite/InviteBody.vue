<script setup lang="ts">
import HeroSection from "./HeroSection.vue";
import QuoteSection from "./QuoteSection.vue";
import GroomSection from "./GroomSection.vue";
import BrideSection from "./BrideSection.vue";
import SaveDateSection from "./SaveDateSection.vue";
import AkadSection from "./AkadSection.vue";
// sections added one at a time: hero → quote → groom → bride → save-the-date → akad → …
</script>

<template>
  <div class="invite">
    <HeroSection />
    <QuoteSection />
    <GroomSection />
    <BrideSection />
    <SaveDateSection />
    <AkadSection />
  </div>
</template>

<style scoped>
.invite {
  width: min(100vw, 480px);
  margin: 0 auto;
  background: #efe6d3;
}
</style>
