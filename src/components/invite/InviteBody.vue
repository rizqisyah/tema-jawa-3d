<script setup lang="ts">
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
import akadBg from "../../assets/invite/akad/parts/bg.png";
import akadFrame from "../../assets/invite/akad/parts/frame.png";
import akadFlorL from "../../assets/invite/akad/parts/florL.png";
import akadFlorR from "../../assets/invite/akad/parts/florR.png";
import akadPin from "../../assets/invite/akad/parts/pin.png";
import resBg from "../../assets/invite/resepsi/parts/bg.png";
import resFrame from "../../assets/invite/resepsi/parts/frame.png";
import resFlorL from "../../assets/invite/resepsi/parts/florL.png";
import resFlorR from "../../assets/invite/resepsi/parts/florR.png";
import resPin from "../../assets/invite/resepsi/parts/pin.png";
// sections added one at a time: hero → quote → groom → bride → save-the-date → akad → resepsi → gift → gallery → rsvp → closing portrait → wedding wish → footer (complete)

// the Figma template repeats the akad copy verbatim in the resepsi band (placeholder),
// so both blocks carry the same date/time/venue until the real resepsi details land
const venue = "Rumah mempelai wanita";
const address =
  "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330";
</script>

<template>
  <div class="invite">
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
    <div class="seam" aria-hidden="true" />
    <GallerySection />
    <RsvpSection />
    <div class="seam" aria-hidden="true" />
    <ClosingPortraitSection />
    <WishSection />
    <FooterSection />
  </div>
</template>

<style scoped>
.invite {
  width: min(100vw, 480px);
  margin: 0 auto;
  background: #efe6d3;
  container-type: inline-size;
}

/* Each band is its own fixed-ratio crop with overflow:hidden, so where two exports meet
   the join reads as a hard line. This zero-height marker straddles the boundary and
   blurs the backdrop across it, which is all the client asked for ("dibuat lebih smooth").
   It has to live outside the sections — neither one can paint past its own clip. */
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
