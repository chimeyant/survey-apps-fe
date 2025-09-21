<template>
  <div
    v-if="isVisible"
    class="fixed  bottom-12 right-5 overflow-hidden text-white rounded-sm shadow-lg transform transition-all duration-300"
    :class="{
      'scale-100': isVisible,
      'scale-0': !isVisible,
      'bg-green-700': type =='success',
      'bg-yellow-200': type =='warning',
      'bg-red-600': type =='error',
    }"
  >
    <div class="flex w-full h-full ">
      <div
        class="w-[8px]"
        :class="{
        'scale-100': isVisible,
      'scale-0': !isVisible,
      'bg-green-800': type =='success',
      'bg-yellow-800': type =='warning',
      'bg-red-800': type =='error',
      }"
      >
      </div>
      <div class="flex items-center w-full h-full">
        <div class="grid grid-cols-12 w-full h-full">
          <div class="col-span-2 p-2">
            <i class="ri-information-2-fill text-2xl  "></i>
          </div>
          <div class="col-span-10">
            <div class="flex items-center w-full h-full text-sm px-2">
              {{ message }}
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    type: {
      type: String,
      default: "success",
    },
    message: {
      type: String,
      default: "Proses simpan berhasil",
    },
    duration: {
      type: Number,
      default: 3000,
    },
    postion: {
      type: String,
      default: "bottonm-right",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isVisible = ref(false);
    const message = ref(props.message);
    const type = ref(props.type);

    const showToast = () => {
      isVisible.value = true;
      setTimeout(() => {
        isVisible.value = false;
      }, props.duration);
    };

    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          showToast();
        }
      }
    );

    watch(
      () => props.message,
      (newVal) => {
        message.value = newVal;
      }
    );

    watch(
      () => props.type,
      (newVal) => {
        type.value = newVal;
      }
    );

    return {
      isVisible,
      message,
      type,
    };
  },
};
</script>