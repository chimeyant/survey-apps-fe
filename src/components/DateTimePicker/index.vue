<template>
  <div
    class="w-full"
    :class="{ 'flex items-start space-x-3': labelPosition === 'inline' }"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div :class="['relative', { 'flex-1': labelPosition === 'inline' }]">
      <!-- Trigger / Input -->
      <div
        :id="inputId"
        ref="triggerRef"
        @click="toggleDropdown"
        @keydown="handleKeydown"
        :class="[
          'relative cursor-pointer flex items-center justify-between rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200',
          sizeClasses,
          variantClasses,
          {
            'border-gray-300': !error,
            'border-red-500': error,
            'opacity-50 cursor-not-allowed': disabled,
            'pl-10': iconLeft
          }
        ]"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="'dialog'"
        :aria-label="label || 'Pilih tanggal dan waktu'"
      >
        <i
          v-if="iconLeft"
          :class="[iconLeft, 'absolute left-3 text-gray-400 pointer-events-none']"
        ></i>
        <span :class="{ 'text-gray-400': !displayText }" class="truncate">
          {{ displayText || placeholder || 'Pilih tanggal & waktu' }}
        </span>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button
            v-if="clearable && modelValue && !disabled"
            type="button"
            @click.stop="clearValue"
            class="p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:text-gray-600"
            aria-label="Hapus"
          >
            <i class="ri-close-line text-sm"></i>
          </button>
          <i
            :class="[
              'ri-calendar-line text-gray-400 text-lg transition-transform duration-200',
              { 'rotate-180': isOpen }
            ]"
          ></i>
        </div>
      </div>

      <!-- Dropdown -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="panelRef"
          :class="[
            'absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden',
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full'
          ]"
          :style="{ minWidth: dropdownWidth + 'px' }"
        >
          <!-- Calendar header: month/year -->
          <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              @click="prevMonth"
              class="p-1.5 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Bulan sebelumnya"
            >
              <i class="ri-arrow-left-s-line text-lg"></i>
            </button>
            <span class="text-sm font-medium text-gray-700 min-w-[140px] text-center">
              {{ monthYearLabel }}
            </span>
            <button
              type="button"
              @click="nextMonth"
              class="p-1.5 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Bulan berikutnya"
            >
              <i class="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>

          <!-- Weekday headers -->
          <div class="grid grid-cols-7 gap-0.5 px-2 pt-2">
            <span
              v-for="day in weekdayLabels"
              :key="day"
              class="text-center text-xs font-medium text-gray-500 py-1"
            >
              {{ day }}
            </span>
          </div>

          <!-- Calendar grid -->
          <div class="grid grid-cols-7 gap-0.5 p-2">
            <button
              v-for="(cell, idx) in calendarDays"
              :key="idx"
              type="button"
              @click="cell.isCurrentMonth && !cell.disabled && selectDate(cell.date)"
              :class="[
                'w-8 h-8 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1',
                cell.isCurrentMonth ? 'text-gray-700' : 'text-gray-300',
                cell.isToday && cell.isCurrentMonth ? 'bg-cyan-100 font-semibold text-cyan-700' : '',
                cell.isSelected ? 'bg-cyan-500 text-white font-medium' : '',
                !cell.isSelected && cell.isCurrentMonth && !cell.disabled ? 'hover:bg-cyan-50' : '',
                cell.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              ]"
              :disabled="cell.disabled"
            >
              {{ cell.day }}
            </button>
          </div>

          <!-- Time inputs -->
          <div class="flex items-center gap-2 px-3 py-3 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center gap-1">
              <input
                ref="hourInputRef"
                v-model.number="localHours"
                type="number"
                min="0"
                :max="use24h ? 23 : 12"
                class="w-12 text-center text-sm border border-gray-300 rounded px-1 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                @change="clampTime"
              />
              <span class="text-gray-500">:</span>
              <input
                v-model.number="localMinutes"
                type="number"
                min="0"
                max="59"
                class="w-12 text-center text-sm border border-gray-300 rounded px-1 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                @change="clampTime"
              />
            </div>
            <select
              v-if="!use24h"
              v-model="localAmPm"
              class="text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <!-- Footer: today / apply -->
          <div class="flex justify-end gap-2 px-3 py-2 border-t border-gray-200">
            <button
              type="button"
              @click="setToday"
              class="text-sm text-cyan-600 hover:text-cyan-700 font-medium focus:outline-none focus:underline"
            >
              Hari ini
            </button>
            <button
              type="button"
              @click="applyAndClose"
              class="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
            >
              Gunakan
            </button>
          </div>
        </div>
      </transition>

      <!-- Helper / Error -->
      <p v-if="error" :id="`${inputId}-error`" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
      <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function parseValue(val) {
  if (val == null || val === '') return null;
  const d = typeof val === 'string' ? new Date(val) : val;
  return isNaN(d.getTime()) ? null : d;
}

function toISOLocal(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}:${s}`;
}

function formatDisplay(d, use24h) {
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes();
  if (!use24h) {
    const am = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${String(minutes).padStart(2, '0')} ${am}`;
  }
  return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export default {
  name: 'UDateTimePicker',
  emits: ['update:modelValue', 'change', 'open', 'close'],
  props: {
    modelValue: {
      type: [String, Date, Number],
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Pilih tanggal & waktu',
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    helperText: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    min: {
      type: [String, Date],
      default: null,
    },
    max: {
      type: [String, Date],
      default: null,
    },
    use24h: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
    variant: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'filled', 'outlined'].includes(v),
    },
    labelPosition: {
      type: String,
      default: 'top',
      validator: (v) => ['top', 'inline'].includes(v),
    },
    labelWidth: {
      type: String,
      default: 'w-32',
    },
    iconLeft: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const hourInputRef = ref(null);
    const inputId = `datetime-${Math.random().toString(36).slice(2, 11)}`;
    const isOpen = ref(false);
    const dropdownPosition = ref('bottom');
    const dropdownWidth = ref(0);

    const viewDate = ref(new Date());
    const localHours = ref(0);
    const localMinutes = ref(0);
    const localAmPm = ref('AM');

    const minDate = computed(() => parseValue(props.min));
    const maxDate = computed(() => parseValue(props.max));

    const parsedValue = computed(() => parseValue(props.modelValue));

    const displayText = computed(() => {
      return formatDisplay(parsedValue.value, props.use24h);
    });

    const labelClasses = computed(() => {
      const base = 'text-sm font-medium text-gray-700';
      if (props.labelPosition === 'inline') {
        return [base, props.labelWidth, 'flex-shrink-0 pt-2'].join(' ');
      }
      return [base, 'block mb-1'].join(' ');
    });

    const sizeClasses = computed(() => {
      const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-3 py-2 text-sm', lg: 'px-4 py-3 text-base' };
      return sizes[props.size];
    });

    const variantClasses = computed(() => {
      const v = {
        default: 'border border-gray-300 bg-white',
        filled: 'border border-gray-300 bg-gray-50',
        outlined: 'border-2 border-gray-300 bg-transparent',
      };
      return v[props.variant];
    });

    const monthYearLabel = computed(() => {
      return `${MONTHS[viewDate.value.getMonth()]} ${viewDate.value.getFullYear()}`;
    });

    const weekdayLabels = computed(() => WEEKDAYS);

    const calendarDays = computed(() => {
      const y = viewDate.value.getFullYear();
      const m = viewDate.value.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      const startDay = first.getDay();
      const daysInMonth = last.getDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const cells = [];
      const prevMonth = new Date(y, m, 0);
      const prevDays = prevMonth.getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const d = new Date(y, m - 1, prevDays - i);
        cells.push({
          date: d,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: isSameDay(d, parsedValue.value),
          disabled: isDisabled(d),
        });
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(y, m, day);
        cells.push({
          date: d,
          day,
          isCurrentMonth: true,
          isToday: isSameDay(d, today),
          isSelected: isSameDay(d, parsedValue.value),
          disabled: isDisabled(d),
        });
      }
      const remaining = 42 - cells.length;
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(y, m + 1, i);
        cells.push({
          date: d,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          disabled: true,
        });
      }
      return cells;
    });

    function isSameDay(a, b) {
      if (!b) return false;
      const d = b instanceof Date ? b : new Date(b);
      return a.getFullYear() === d.getFullYear() && a.getMonth() === d.getMonth() && a.getDate() === d.getDate();
    }

    function isDisabled(d) {
      const t = d.getTime();
      if (minDate.value && t < minDate.value.setHours(0, 0, 0, 0)) return true;
      if (maxDate.value && t > maxDate.value.setHours(23, 59, 59, 999)) return true;
      return false;
    }

    function syncFromModel() {
      const v = parsedValue.value;
      if (v) {
        viewDate.value = new Date(v.getFullYear(), v.getMonth(), v.getDate());
        let h = v.getHours();
        localMinutes.value = v.getMinutes();
        if (props.use24h) {
          localHours.value = h;
        } else {
          localAmPm.value = h >= 12 ? 'PM' : 'AM';
          localHours.value = h % 12 || 12;
        }
      } else {
        const now = new Date();
        viewDate.value = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        localHours.value = props.use24h ? now.getHours() : (now.getHours() % 12 || 12);
        localMinutes.value = now.getMinutes();
        localAmPm.value = now.getHours() >= 12 ? 'PM' : 'AM';
      }
    }

    function buildCurrentDateTime(baseDate) {
      let h = localHours.value;
      if (!props.use24h && localAmPm.value === 'PM') h += 12;
      if (!props.use24h && localAmPm.value === 'AM' && h === 12) h = 0;
      const d = new Date(baseDate);
      d.setHours(h, localMinutes.value, 0, 0);
      return d;
    }

    function clampTime() {
      const maxH = props.use24h ? 23 : 12;
      localHours.value = Math.max(0, Math.min(maxH, Number(localHours.value) || 0));
      localMinutes.value = Math.max(0, Math.min(59, Number(localMinutes.value) || 0));
    }

    function selectDate(date) {
      const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const result = buildCurrentDateTime(base);
      const iso = toISOLocal(result);
      emit('update:modelValue', iso);
      emit('change', { value: iso, date: result });
    }

    function setToday() {
      const now = new Date();
      const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const result = buildCurrentDateTime(base);
      const iso = toISOLocal(result);
      emit('update:modelValue', iso);
      emit('change', { value: iso, date: result });
      syncFromModel();
    }

    function applyAndClose() {
      const v = parsedValue.value;
      const base = v ? new Date(v.getFullYear(), v.getMonth(), v.getDate()) : new Date();
      const result = buildCurrentDateTime(base);
      const iso = toISOLocal(result);
      emit('update:modelValue', iso);
      emit('change', { value: iso, date: result });
      closeDropdown();
    }

    function prevMonth() {
      viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1);
    }

    function nextMonth() {
      viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1);
    }

    function toggleDropdown() {
      if (props.disabled) return;
      if (isOpen.value) closeDropdown();
      else openDropdown();
    }

    function openDropdown() {
      if (props.disabled) return;
      syncFromModel();
      isOpen.value = true;
      emit('open');
      nextTick(() => {
        if (triggerRef.value) {
          const rect = triggerRef.value.getBoundingClientRect();
          dropdownWidth.value = rect.width;
          const spaceBelow = window.innerHeight - rect.bottom;
          dropdownPosition.value = spaceBelow < 400 && rect.top > spaceBelow ? 'top' : 'bottom';
        }
      });
    }

    function closeDropdown() {
      isOpen.value = false;
      emit('close');
    }

    function clearValue() {
      emit('update:modelValue', null);
      emit('change', { value: null, date: null });
    }

    function handleKeydown(e) {
      if (props.disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
      if (e.key === 'Escape' && isOpen.value) {
        e.preventDefault();
        closeDropdown();
      }
    }

    function handleClickOutside(e) {
      if (
        triggerRef.value && !triggerRef.value.contains(e.target) &&
        panelRef.value && !panelRef.value.contains(e.target)
      ) {
        closeDropdown();
      }
    }

    watch(parsedValue, syncFromModel, { immediate: true });
    watch(isOpen, (open) => {
      if (open) syncFromModel();
    });

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      triggerRef,
      panelRef,
      hourInputRef,
      inputId,
      isOpen,
      dropdownPosition,
      dropdownWidth,
      viewDate,
      localHours,
      localMinutes,
      localAmPm,
      displayText,
      labelClasses,
      sizeClasses,
      variantClasses,
      monthYearLabel,
      weekdayLabels,
      calendarDays,
      toggleDropdown,
      openDropdown,
      closeDropdown,
      selectDate,
      setToday,
      applyAndClose,
      clearValue,
      handleKeydown,
      clampTime,
      prevMonth,
      nextMonth,
    };
  },
};
</script>
