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
      ref="dialogBox"
      class="rounded-sm shadow-lg"
      :class="`bg-white ${width}`"
      :style="dialogStyle"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-4 h-[48px] px-4 border-b-4 cursor-move"
        :class="[
          `bg-${colors.PRIMARY}-700`,
          `border-b-${colors.PRIMARY}-900`
        ]"
        @mousedown="startDrag"
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
import { computed, ref, onMounted, onUnmounted } from "vue";
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

    // Draggable functionality
    const dialogBox = ref(null);
    const position = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    const dragOffset = ref({ x: 0, y: 0 });

    const dialogStyle = computed(() => {
      if (isDragging.value || position.value.x !== 0 || position.value.y !== 0) {
        return {
          position: 'fixed',
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          transform: 'none',
          zIndex: 1000
        };
      }
      return {};
    });

    const startDrag = (e) => {
      // Only start drag if clicking on the header area, not the close button
      if (e.target.closest('.cursor-move') && !e.target.closest('i')) {
        isDragging.value = true;
        
        // Get initial mouse position and dialog position
        const rect = dialogBox.value.getBoundingClientRect();
        dragOffset.value = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        // Set initial position
        position.value = {
          x: rect.left,
          y: rect.top
        };
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
      }
    };

    const handleDrag = (e) => {
      if (isDragging.value) {
        const newX = e.clientX - dragOffset.value.x;
        const newY = e.clientY - dragOffset.value.y;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get dialog dimensions
        const dialogWidth = dialogBox.value.offsetWidth;
        const dialogHeight = dialogBox.value.offsetHeight;
        
        // Constrain to viewport bounds
        position.value = {
          x: Math.max(0, Math.min(newX, viewportWidth - dialogWidth)),
          y: Math.max(0, Math.min(newY, viewportHeight - dialogHeight))
        };
      }
    };

    const stopDrag = () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    const resetPosition = () => {
      position.value = { x: 0, y: 0 };
      isDragging.value = false;
    };

    // Reset position when dialog closes
    const formWatcher = computed(() => store.form);
    const unwatchForm = computed(() => {
      if (!formWatcher.value.add) {
        resetPosition();
      }
      return formWatcher.value;
    });

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    });

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
      dialogBox,
      dialogStyle,
      startDrag,
      unwatchForm
    };
  },
};
</script>