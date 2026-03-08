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
        v-if="swalState.show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swal-title"
      >
        <div
          class="absolute inset-0 bg-black/50"
          aria-hidden="true"
          @click="handleBackdropClick"
        />
        <div
          class="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
          role="document"
        >
          <!-- Icon -->
          <div class="flex justify-center pt-8 pb-2">
            <span
              :class="iconClasses"
              class="flex h-16 w-16 items-center justify-center rounded-full"
            >
              <i :class="iconName" class="text-4xl text-white"></i>
            </span>
          </div>
          <!-- Title -->
          <h2
            v-if="swalState.title"
            id="swal-title"
            class="text-center text-xl font-semibold text-gray-900 px-6 pt-2"
          >
            {{ swalState.title }}
          </h2>
          <!-- Text / HTML -->
          <div class="px-6 py-4 text-center">
            <p v-if="swalState.text && !swalState.html" class="text-sm text-gray-600">
              {{ swalState.text }}
            </p>
            <div
              v-else-if="swalState.html"
              class="text-sm text-gray-600 prose prose-sm max-w-none"
              v-html="swalState.html"
            />
          </div>
          <!-- Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 px-6 pb-6">
            <button
              v-if="swalState.showCancelButton"
              type="button"
              class="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              :class="swalState.cancelButtonClass"
              @click="handleCancel"
            >
              {{ swalState.cancelButtonText }}
            </button>
            <button
              type="button"
              :class="[
                'rounded-xl px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
                confirmButtonClasses,
                swalState.confirmButtonClass
              ]"
              @click="handleConfirm"
            >
              {{ swalState.confirmButtonText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed } from "vue";
import { swalState, confirm, cancel } from "@/composables/useSwal";

export default {
  name: "USwal",
  setup() {
    const iconClasses = computed(() => {
      const map = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-cyan-500",
        question: "bg-indigo-500",
      };
      return map[swalState.icon] || map.success;
    });

    const iconName = computed(() => {
      const map = {
        success: "ri-check-line",
        error: "ri-close-line",
        warning: "ri-error-warning-line",
        info: "ri-information-line",
        question: "ri-question-line",
      };
      return map[swalState.icon] || map.success;
    });

    const confirmButtonClasses = computed(() => {
      const map = {
        success: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
        error: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        warning: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
        info: "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
        question: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
      };
      return map[swalState.icon] || map.success;
    });

    const handleConfirm = () => confirm();
    const handleCancel = () => cancel();

    const handleBackdropClick = () => {
      if (swalState.showCancelButton) handleCancel();
      else handleConfirm();
    };

    return {
      swalState,
      iconClasses,
      iconName,
      confirmButtonClasses,
      handleConfirm,
      handleCancel,
      handleBackdropClick,
    };
  },
};
</script>
