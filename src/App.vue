<script setup lang="ts">
import CoverSection from "./components/cover/CoverSection.vue";

// Guest name from URL: ?to=Nama%20Tamu
const guest = new URLSearchParams(location.search).get("to") ?? "Nama Tamu";

function open() {
  // next section scrolls in here later
  console.log("open invitation");
}
</script>

<template>
  <main>
    <CoverSection :guest-name="guest" @open="open" />
  </main>
</template>
