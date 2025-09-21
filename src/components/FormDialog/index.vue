<template>
  <div
    id="dialog"
    :class="{
      'hidden': !form.add
    }"
    :style="{
      backgroundColor: `rgba(0,0,0,0.5)`,
    }"
    class="fixed inset-0 flex items-center justify-center animate-fadeIn"
  >
    <!-- Dialog Box -->
    <div
      class="rounded-sm shadow-lg  "
      :class="`bg-white ${width}`"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-4 h-[48px] px-4 border-b-4"
        :class="[
          `bg-${colors.PRIMARY}-700`,
          `border-b-${colors.PRIMARY}-900`
        ]"
      >
        <h3 class="text-sm font-semibold" :class="`text-${themeColors.title}`">{{ title }}</h3>
        <div class="flex gap-x-2 px-4 bg-white rounded-full">
          <i
            class="ri-close-circle-fill text-red-700  hover:cursor-pointer text-xl hover:scale-125 transition "
            :class="`text-${themeColors.primary}-50 hover:text-${themeColors.primary}-200`"
            @click="form.add = false"
          ></i>
        </div>
      </div>
      <!-- Form -->
      <div class="p-5 space-x-2">
        <slot name="formdata" />
        

          <div class="flex justify-end gap-x-2">
            <UButton
              label="Batal"
              @click="form.add = false"
              rounded="sm"
              variant="secondary"
              size="sm"
              iconLeft="ri-close-circle-fill"
            />
  
            <UButton
              v-if="!form.edit"
              label="Simpan"
              @click="postRecord"
              rounded="sm"
              size="sm"
              iconLeft="ri-save-line"
            />
            
            <UButton
              v-if="form.edit"
              label="Ubah"
              @click="postUpdate"
              rounded="sm"
              size="sm"
              iconLeft="ri-edit-line"
            />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { computed, ref } from "vue";
import { UButton } from "@/components";
export default {
  components: {
    UButton,
  },
  props: {
    title: {
      type: String,
      default: "Your Title",
    },
    width: {
      type: String,
      default: "w-[500px]",
    },
  },
  setup(props, { emit }) {
    const store = useAppStore();
    const title = ref(props.title);
    const width = ref(props.width);
    const form = computed(() => store.form);
    const themeColors  = computed(() =>  store.getThemeColors);
    const colors = computed(() =>  store.colors);

    const postRecord = () => {
      emit("onSave");
    };

    const postUpdate = () => {
      emit("onUpdate");
    };

    return {
      form,
      title,
      width,
      themeColors,
      postRecord,
      postUpdate,
      colors,
    };
  },
};
</script>