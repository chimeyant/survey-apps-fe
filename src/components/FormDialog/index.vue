<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="form.add"
        id="form-dialog-overlay"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @keydown.esc="closeDialog"
      >
        <div
          class="absolute inset-0 bg-black/50"
          aria-hidden="true"
          @click="closeDialog"
        />
        <div
          ref="dialogBox"
          :style="dialogStyle"
          :id="titleId"
          :class="width"
          class="relative z-[10000] flex max-h-[90vh] flex-col rounded-xl bg-white shadow-xl"
          role="document"
        >
          <div
            class="flex shrink-0 items-center justify-between gap-3 border-b border-gray-300 bg-gray-600 px-5 py-3.5 rounded-t-xl cursor-move"
            @mousedown="startDrag"
          >
            <h2 class="text-base font-semibold text-white truncate pr-2">
              {{ title }}
            </h2>
            <button
              type="button"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Tutup"
              @click.stop="closeDialog"
            >
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          <div class="flex flex-1 flex-col overflow-y-auto min-h-0">
            <div class="p-5 sm:p-6">
              <slot name="formdata" />
            </div>
            <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 rounded-b-xl">
              <UButton
                label="Batal"
                variant="secondary"
                size="sm"
                @click="closeDialog"
              />
              <UButton
                v-if="!form.edit"
                label="Simpan"
                variant="primary"
                size="sm"
                iconLeft="ri-save-line"
                @click="postRecord"
              />
              <UButton
                v-if="form.edit"
                label="Ubah"
                variant="primary"
                size="sm"
                iconLeft="ri-edit-line"
                @click="postUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref, watch, onBeforeUnmount } from "vue";
import { UButton } from "@/components";

export default {
  name: "UFormDialog",
  components: { UButton },
  props: {
    title: {
      type: String,
      default: "Form",
    },
    width: {
      type: String,
      default: "w-full max-w-lg",
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const form = computed(() => store.form);
    const titleId =
      "form-dialog-title-" + Math.random().toString(36).slice(2, 9);

    const dialogBox = ref(null);
    const position = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    const dragOffset = ref({ x: 0, y: 0 });

    const dialogStyle = computed(() => {
      if (position.value.x !== 0 || position.value.y !== 0) {
        return {
          position: "fixed",
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          transform: "none",
        };
      }
      return {};
    });

    const startDrag = (e) => {
      if (!dialogBox.value || e.target.closest("button")) return;
      isDragging.value = true;
      const rect = dialogBox.value.getBoundingClientRect();
      dragOffset.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      position.value = { x: rect.left, y: rect.top };
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
      e.preventDefault();
    };

    const handleDrag = (e) => {
      if (!isDragging.value || !dialogBox.value) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = dialogBox.value.offsetWidth;
      const h = dialogBox.value.offsetHeight;
      position.value = {
        x: Math.max(0, Math.min(e.clientX - dragOffset.value.x, vw - w)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.value.y, vh - h)),
      };
    };

    const stopDrag = () => {
      isDragging.value = false;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    const resetPosition = () => {
      position.value = { x: 0, y: 0 };
    };

    const closeDialog = () => {
      store.setForm({ add: false, edit: false });
      resetPosition();
    };

    const postRecord = () => emit("onSave");
    const postUpdate = () => emit("onUpdate");

    watch(
      () => form.value.add,
      (add) => {
        if (!add) resetPosition();
      }
    );

    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
    });

    return {
      form,
      titleId,
      dialogBox,
      dialogStyle,
      startDrag,
      closeDialog,
      postRecord,
      postUpdate,
    };
  },
};
</script>
