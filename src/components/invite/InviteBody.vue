<script setup lang="ts">
import VideoSection from "../sections/VideoSection.vue";
import HeroSection from "./HeroSection.vue";
import QuoteSection from "./QuoteSection.vue";
import GroomSection from "./GroomSection.vue";
import BrideSection from "./BrideSection.vue";
import SaveDateSection from "./SaveDateSection.vue";
import EventSection from "./EventSection.vue";
import GiftSection from "./GiftSection.vue";
import GallerySection from "./GallerySection.vue";
import RsvpSection from "./RsvpSection.vue";
import ClosingPortraitSection from "./ClosingPortraitSection.vue";
import WishSection from "./WishSection.vue";
import FooterSection from "./FooterSection.vue";
import akadBg from "../../assets/invite/akad/parts/bg.webp";
import akadFrame from "../../assets/invite/akad/parts/frame.webp";
import akadFlorL from "../../assets/invite/akad/parts/florL.webp";
import akadFlorR from "../../assets/invite/akad/parts/florR.webp";
import akadPin from "../../assets/invite/akad/parts/pin.webp";
import resBg from "../../assets/invite/resepsi/parts/bg.webp";
import resFrame from "../../assets/invite/resepsi/parts/frame.webp";
import resFlorL from "../../assets/invite/resepsi/parts/florL.webp";
import resFlorR from "../../assets/invite/resepsi/parts/florR.webp";
import resPin from "../../assets/invite/resepsi/parts/pin.webp";

import { computed } from "vue";
import { useWedding } from "../../composables/useWedding";

const { acara, gallery, isGroomFirst, hasGift } = useWedding();

const hasGallery = computed(() => {
  return Array.isArray(gallery.value) && gallery.value.length > 0;
});

function formatDate(dateStr?: string) {
  if (!dateStr) return { day: "Saturday,", date: "19 April 2029" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "Saturday,", date: dateStr };
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" }) + ",";
    const dateFormatted = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return { day: dayName, date: dateFormatted };
  } catch {
    return { day: "Saturday,", date: dateStr };
  }
}

const events = computed(() => {
  if (acara.value && acara.value.length > 0) {
    return acara.value.map((item: any, idx: number) => {
      const isEven = idx % 2 === 1;
      const dateInfo = formatDate(item.event_date);
      return {
        id: item.id || `event-${idx}`,
        title: item.title || (isEven ? "Resepsi" : "Akad Nikah"),
        day: dateInfo.day,
        date: dateInfo.date,
        time: item.event_time || (isEven ? "13.00 WIB - 17.00 WIB" : "09.00 WIB - 11.00 WIB"),
        venue: item.location_name || "Lokasi Acara",
        address: item.address || "",
        mapsUrl: item.maps_url || "",
        bg: isEven ? resBg : akadBg,
        frame: isEven ? resFrame : akadFrame,
        florL: isEven ? resFlorL : akadFlorL,
        florR: isEven ? resFlorR : akadFlorR,
        pin: isEven ? resPin : akadPin,
        overlap: idx === 0 ? "-6.933%" : undefined,
        offsetX: isEven ? "1.333%" : undefined,
      };
    });
  }

  const defAkad = formatDate("2029-04-19");
  const defRes = formatDate("2029-04-19");
  return [
    {
      id: "default-akad",
      title: "Akad Nikah",
      day: defAkad.day,
      date: defAkad.date,
      time: "10.00 WIB - 12.00 WIB",
      venue: "Rumah mempelai wanita",
      address: "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330",
      mapsUrl: "",
      bg: akadBg,
      frame: akadFrame,
      florL: akadFlorL,
      florR: akadFlorR,
      pin: akadPin,
      overlap: "-6.933%",
      offsetX: undefined,
    },
    {
      id: "default-resepsi",
      title: "Resepsi",
      day: defRes.day,
      date: defRes.date,
      time: "10.00 WIB - 12.00 WIB",
      venue: "Rumah mempelai wanita",
      address: "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330",
      mapsUrl: "",
      bg: resBg,
      frame: resFrame,
      florL: resFlorL,
      florR: resFlorR,
      pin: resPin,
      overlap: undefined,
      offsetX: "1.333%",
    },
  ];
});
</script>

<template>
  <div class="invite">
    <VideoSection />
    <HeroSection />
    <QuoteSection />
    <template v-if="isGroomFirst">
      <GroomSection id="couple" :is-first="true" />
      <BrideSection :is-first="false" />
    </template>
    <template v-else>
      <BrideSection id="couple" :is-first="true" />
      <GroomSection :is-first="false" />
    </template>
    <div class="seam" aria-hidden="true" />
    <SaveDateSection />
    <div class="seam" aria-hidden="true" />
    <template v-for="(ev, idx) in events" :key="ev.id">
      <div v-if="Number(idx) > 0" class="seam" aria-hidden="true" />
      <EventSection
        :bg="ev.bg"
        :frame="ev.frame"
        :flor-l="ev.florL"
        :flor-r="ev.florR"
        :pin="ev.pin"
        :title="ev.title"
        :day="ev.day"
        :date="ev.date"
        :time="ev.time"
        :venue="ev.venue"
        :address="ev.address"
        :maps-url="ev.mapsUrl"
        :overlap="ev.overlap"
        :offset-x="ev.offsetX"
      />
    </template>
    <template v-if="hasGift">
      <div class="seam" aria-hidden="true" />
      <GiftSection />
    </template>
    <GallerySection v-if="hasGallery" />
    <RsvpSection />
    <ClosingPortraitSection />
    <WishSection />
    <FooterSection />
  </div>
</template>

<style scoped>
.invite {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #efe6d3;
  container-type: inline-size;
}

.seam {
  position: relative;
  height: 0;
  z-index: 4;
}
.seam::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -3.2cqw;
  height: 6.4cqw;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 50%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 50%, transparent);
  pointer-events: none;
}
</style>
