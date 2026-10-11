import { computed, type Ref } from "vue";
import { useWedding } from "./useWedding";

export type Person = "groom" | "bride";

/**
 * The person a mempelai band shows: names, parents' line, photo and its zoom/position.
 * Shared by GroomSection and BrideSection, each of which shows its own person by default.
 */
export function useMempelai(person: Ref<Person>) {
  const { groom, bride, parsedOverride } = useWedding();

  const isGroom = computed(() => person.value === "groom");
  const data = computed<any>(() => (isGroom.value ? groom.value : bride.value));

  const nickname = computed(
    () => data.value?.nickname || data.value?.name?.split(" ")[0] || (isGroom.value ? "Antonio" : "Allysa")
  );

  const fullName = computed(
    () => data.value?.name || (isGroom.value ? "Antonio Josua Setiyadi" : "Ayu Shella Pratni")
  );

  const parentText = computed(() => {
    const p = data.value;
    const prefix = isGroom.value ? "Putra dari" : "Putri dari";
    if (p?.father_name && p?.mother_name) return `${prefix}  ${p.father_name}\n&  ${p.mother_name}`;
    if (p?.father_name) return `${prefix}  ${p.father_name}`;
    if (p?.mother_name) return `${prefix}  ${p.mother_name}`;
    if (p?.child_of) return p.child_of;
    return isGroom.value ? `${prefix}  Tono\n&  Ratna` : `${prefix}  Heri\n&  Sofie`;
  });

  const customPhoto = computed<string>(() => {
    const images = parsedOverride.value?.images;
    return isGroom.value
      ? data.value?.photo_url || images?.foto_mempelai_pria || images?.foto_pria || images?.groom || ""
      : data.value?.photo_url || images?.foto_mempelai_wanita || images?.foto_wanita || images?.bride || "";
  });

  // Zoom/position set in "Pengaturan Zoom & Posisi Foto Mempelai" — follows the person,
  // not the band, so a swapped order keeps each photo's own framing.
  const photoTransform = computed(() => {
    const o = parsedOverride.value;
    const t = isGroom.value
      ? o?.foto_pria_transform || o?.foto_mempelai_transform
      : o?.foto_wanita_transform || o?.spouse_photo_transform;
    const num = (v: unknown, d: number) => (typeof v === "number" ? v : v !== undefined ? parseFloat(String(v)) : d);
    return { x: num(t?.x, 50), y: num(t?.y, 50), scale: num(t?.scale, 1) };
  });

  return { isGroom, nickname, fullName, parentText, customPhoto, photoTransform };
}
