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

const venue = "Rumah mempelai wanita";
const address = "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330";
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
      title="Akad Nikah"
      day="Saturday,"
      date="19 April 2029"
      time="10.00 WIB - 12.00 WIB"
      :venue="venue"
      :address="address"
      overlap="-6.933%"
    />
    <div class="seam" aria-hidden="true" />
    <EventSection
      :bg="resBg"
      :frame="resFrame"
      :flor-l="resFlorL"
      :flor-r="resFlorR"
      :pin="resPin"
      title="Resepsi"
      day="Saturday,"
      date="19 April 2029"
      time="10.00 WIB - 12.00 WIB"
      :venue="venue"
      :address="address"
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
