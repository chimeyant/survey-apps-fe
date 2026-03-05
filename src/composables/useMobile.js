import { ref, onMounted, onUnmounted } from "vue";
import { checkIsMobileDevice } from "@/utils/device";

/**
 * Composable: state reaktif apakah device mobile.
 * Update otomatis saat window di-resize.
 * @param {number} [maxWidth=768] - Lebar maks (px) yang dianggap mobile (default = Tailwind md).
 * @returns {{ isMobile: import('vue').Ref<boolean> }}
 */
export function useMobile(maxWidth = 768) {
  const isMobile = ref(false);

  const update = () => {
    isMobile.value = checkIsMobileDevice(maxWidth);
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return { isMobile };
}
