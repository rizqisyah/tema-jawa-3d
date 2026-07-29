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

const { acara } = useWedding();

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

const akadItem = computed(() => {
  return acara.value.find((a: any) => a.type === 'akad' || a.title?.toLowerCase().includes('akad')) || acara.value[0] || null;
});

const resepsiItem = computed(() => {
  return acara.value.find((a: any) => a.type === 'resepsi' || a.title?.toLowerCase().includes('resepsi')) || acara.value[1] || null;
});

const akadDateInfo = computed(() => formatDate(akadItem.value?.event_date));
const resepsiDateInfo = computed(() => formatDate(resepsiItem.value?.event_date));

const akadTitle = computed(() => akadItem.value?.title || "Akad Nikah");
const akadTime = computed(() => akadItem.value?.event_time || "10.00 WIB - 12.00 WIB");
const akadVenue = computed(() => akadItem.value?.location_name || "Rumah mempelai wanita");
const akadAddress = computed(() => akadItem.value?.address || "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330");
const akadMaps = computed(() => akadItem.value?.maps_url || "");

const resepsiTitle = computed(() => resepsiItem.value?.title || "Resepsi");
const resepsiTime = computed(() => resepsiItem.value?.event_time || "10.00 WIB - 12.00 WIB");
const resepsiVenue = computed(() => resepsiItem.value?.location_name || "Rumah mempelai wanita");
const resepsiAddress = computed(() => resepsiItem.value?.address || "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330");
const resepsiMaps = computed(() => resepsiItem.value?.maps_url || "");
</script>

<template>
  <div class="invite">
    <VideoSection />
    <HeroSection />
    <QuoteSection />
    <GroomSection />
    <BrideSection />
    <div class="seam" aria-hidden="true" />
    <SaveDateSection />
    <div class="seam" aria-hidden="true" />
    <EventSection
      :bg="akadBg"
      :frame="akadFrame"
      :flor-l="akadFlorL"
      :flor-r="akadFlorR"
      :pin="akadPin"
      :title="akadTitle"
      :day="akadDateInfo.day"
      :date="akadDateInfo.date"
      :time="akadTime"
      :venue="akadVenue"
      :address="akadAddress"
      :maps-url="akadMaps"
      overlap="-6.933%"
    />
    <div class="seam" aria-hidden="true" />
    <EventSection
      :bg="resBg"
      :frame="resFrame"
      :flor-l="resFlorL"
      :flor-r="resFlorR"
      :pin="resPin"
      :title="resepsiTitle"
      :day="resepsiDateInfo.day"
      :date="resepsiDateInfo.date"
      :time="resepsiTime"
      :venue="resepsiVenue"
      :address="resepsiAddress"
      :maps-url="resepsiMaps"
      offset-x="1.333%"
    />
    <div class="seam" aria-hidden="true" />
    <GiftSection />
    <GallerySection />
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
