<script setup lang="ts">
import CoverSection from "./components/cover/CoverSection.vue";
import InviteBody from "./components/invite/InviteBody.vue";

const guest = new URLSearchParams(location.search).get("to") ?? "Nama Tamu";

function open() {
  document.getElementById("invite")?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <main>
    <CoverSection :guest-name="guest" @open="open" />
    <section id="invite">
      <InviteBody />
    </section>
  </main>
</template>
