<template>
  <div class="relative w-full">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Phone Input Container -->
    <div class="relative">
      <!-- Country Code Selector -->
      <div class="absolute inset-y-0 left-0 flex items-center">
        <select
          v-model="selectedCountryCode"
          :disabled="disabled"
          :class="[
            'h-full py-0 pl-3 pr-7 border-0 bg-transparent text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm rounded-l-md',
            {
              'cursor-not-allowed opacity-50': disabled
            }
          ]"
          @change="handleCountryChange"
        >
          <option 
            v-for="country in countries" 
            :key="country.code" 
            :value="country.code"
          >
            {{ country.flag }} {{ country.code }}
          </option>
        </select>
      </div>

      <!-- Phone Number Input -->
      <input
        :id="inputId"
        ref="phoneInputRef"
        v-model="phoneNumber"
        type="tel"
        :placeholder="currentPlaceholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="[
          'block w-full pl-20 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 sm:text-sm',
          {
            'border-gray-300': !error,
            'border-red-500': error,
            'bg-gray-50 cursor-not-allowed opacity-50': disabled,
            'bg-white': !disabled
          }
        ]"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Clear Button -->
      <button
        v-if="clearable && phoneNumber && !disabled"
        type="button"
        @click="clearInput"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        <i class="ri-close-line text-sm"></i>
      </button>
    </div>

    <!-- Format Display -->
    <div v-if="showFormat && formattedNumber" class="mt-1 text-xs text-gray-500">
      Formatted: {{ formattedNumber }}
    </div>

    <!-- Error message -->
    <p v-if="error" :id="`${inputId}-error`" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Helper text -->
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>

    <!-- Validation Status -->
    <div v-if="showValidation && phoneNumber" class="mt-1 flex items-center text-xs">
      <i 
        :class="[
          'mr-1',
          isValid ? 'ri-check-line text-green-500' : 'ri-close-line text-red-500'
        ]"
      ></i>
      <span :class="isValid ? 'text-green-600' : 'text-red-600'">
        {{ isValid ? 'Valid phone number' : 'Invalid phone number' }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";

export default {
  name: "UPhoneInput",
  emits: ["update:modelValue", "change", "focus", "blur", "country-change"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    helperText: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    showFormat: {
      type: Boolean,
      default: false,
    },
    showValidation: {
      type: Boolean,
      default: false,
    },
    defaultCountry: {
      type: String,
      default: "+62", // Indonesia default
    },
    allowedCountries: {
      type: Array,
      default: () => [], // Empty means all countries allowed
    },
    autoFormat: {
      type: Boolean,
      default: true,
    },
    validateOnInput: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // Refs
    const phoneInputRef = ref(null);
    const phoneNumber = ref("");
    const selectedCountryCode = ref(props.defaultCountry);
    const inputId = `phone-input-${Math.random().toString(36).substr(2, 9)}`;
    const isFocused = ref(false);

    // Common country codes with flags and formats
    const allCountries = [
      { code: "+62", country: "Indonesia", flag: "🇮🇩", format: "xxxx-xxxx-xxxx", maxLength: 13 },
      { code: "+1", country: "United States", flag: "🇺🇸", format: "(xxx) xxx-xxxx", maxLength: 10 },
      { code: "+44", country: "United Kingdom", flag: "🇬🇧", format: "xxxx xxx xxxx", maxLength: 11 },
      { code: "+65", country: "Singapore", flag: "🇸🇬", format: "xxxx xxxx", maxLength: 8 },
      { code: "+60", country: "Malaysia", flag: "🇲🇾", format: "xx-xxx xxxx", maxLength: 10 },
      { code: "+66", country: "Thailand", flag: "🇹🇭", format: "xx xxx xxxx", maxLength: 9 },
      { code: "+84", country: "Vietnam", flag: "🇻🇳", format: "xxx xxx xxxx", maxLength: 10 },
      { code: "+63", country: "Philippines", flag: "🇵🇭", format: "xxx xxx xxxx", maxLength: 10 },
      { code: "+91", country: "India", flag: "🇮🇳", format: "xxxxx xxxxx", maxLength: 10 },
      { code: "+86", country: "China", flag: "🇨🇳", format: "xxx xxxx xxxx", maxLength: 11 },
      { code: "+81", country: "Japan", flag: "🇯🇵", format: "xx-xxxx-xxxx", maxLength: 11 },
      { code: "+82", country: "South Korea", flag: "🇰🇷", format: "xx-xxxx-xxxx", maxLength: 11 },
      { code: "+61", country: "Australia", flag: "🇦🇺", format: "xxx xxx xxx", maxLength: 9 },
      { code: "+49", country: "Germany", flag: "🇩🇪", format: "xxx xxxxxxx", maxLength: 11 },
      { code: "+33", country: "France", flag: "🇫🇷", format: "x xx xx xx xx", maxLength: 10 },
    ];

    // Computed properties
    const countries = computed(() => {
      if (props.allowedCountries.length > 0) {
        return allCountries.filter(country => 
          props.allowedCountries.includes(country.code)
        );
      }
      return allCountries;
    });

    const currentCountry = computed(() => {
      return countries.value.find(country => country.code === selectedCountryCode.value) || countries.value[0];
    });

    const currentPlaceholder = computed(() => {
      if (props.placeholder) return props.placeholder;
      return currentCountry.value?.format.replace(/x/g, '0') || "Enter phone number";
    });

    const maxLength = computed(() => {
      return currentCountry.value?.maxLength || 15;
    });

    const formattedNumber = computed(() => {
      if (!phoneNumber.value || !props.autoFormat) return "";
      return formatPhoneNumber(phoneNumber.value, currentCountry.value);
    });

    const fullPhoneNumber = computed(() => {
      if (!phoneNumber.value) return "";
      return selectedCountryCode.value + phoneNumber.value.replace(/\D/g, '');
    });

    const isValid = computed(() => {
      if (!phoneNumber.value) return false;
      return validatePhoneNumber(phoneNumber.value, currentCountry.value);
    });

    // Helper functions
    const formatPhoneNumber = (number, country) => {
      if (!number || !country) return number;
      
      const cleaned = number.replace(/\D/g, '');
      const format = country.format;
      let formatted = '';
      let numberIndex = 0;

      for (let i = 0; i < format.length && numberIndex < cleaned.length; i++) {
        if (format[i] === 'x') {
          formatted += cleaned[numberIndex];
          numberIndex++;
        } else {
          formatted += format[i];
        }
      }

      return formatted;
    };

    const validatePhoneNumber = (number, country) => {
      if (!number || !country) return false;
      
      const cleaned = number.replace(/\D/g, '');
      const minLength = Math.max(country.maxLength - 3, 6); // Allow some flexibility
      
      return cleaned.length >= minLength && cleaned.length <= country.maxLength;
    };

    const parseInitialValue = () => {
      if (!props.modelValue) return;
      
      // Try to extract country code from full number
      const value = props.modelValue.toString();
      const matchedCountry = countries.value.find(country => 
        value.startsWith(country.code)
      );
      
      if (matchedCountry) {
        selectedCountryCode.value = matchedCountry.code;
        phoneNumber.value = value.substring(matchedCountry.code.length);
      } else {
        phoneNumber.value = value;
      }
    };

    // Event handlers
    const handleInput = (event) => {
      let value = event.target.value;
      
      // Remove non-numeric characters except for formatting
      if (props.autoFormat) {
        value = value.replace(/[^\d\s\-\(\)]/g, '');
      } else {
        value = value.replace(/\D/g, '');
      }
      
      phoneNumber.value = value;
      
      const fullNumber = selectedCountryCode.value + value.replace(/\D/g, '');
      emit("update:modelValue", fullNumber);
      
      emit("change", {
        value: fullNumber,
        phoneNumber: value,
        countryCode: selectedCountryCode.value,
        formatted: formattedNumber.value,
        isValid: props.validateOnInput ? isValid.value : undefined
      });
    };

    const handleCountryChange = () => {
      const fullNumber = selectedCountryCode.value + phoneNumber.value.replace(/\D/g, '');
      emit("update:modelValue", fullNumber);
      
      emit("country-change", {
        countryCode: selectedCountryCode.value,
        country: currentCountry.value
      });
      
      // Re-emit change event with new country
      if (phoneNumber.value) {
        emit("change", {
          value: fullNumber,
          phoneNumber: phoneNumber.value,
          countryCode: selectedCountryCode.value,
          formatted: formattedNumber.value,
          isValid: props.validateOnInput ? isValid.value : undefined
        });
      }
    };

    const handleFocus = (event) => {
      isFocused.value = true;
      emit("focus", event);
    };

    const handleBlur = (event) => {
      isFocused.value = false;
      emit("blur", {
        event,
        value: fullPhoneNumber.value,
        isValid: isValid.value
      });
    };

    const handleKeydown = (event) => {
      // Allow backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
          // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (event.keyCode === 65 && event.ctrlKey === true) ||
          (event.keyCode === 67 && event.ctrlKey === true) ||
          (event.keyCode === 86 && event.ctrlKey === true) ||
          (event.keyCode === 88 && event.ctrlKey === true) ||
          // Allow home, end, left, right
          (event.keyCode >= 35 && event.keyCode <= 39)) {
        return;
      }
      
      // Ensure that it is a number and stop the keypress
      if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
          (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault();
      }
    };

    const clearInput = () => {
      phoneNumber.value = "";
      emit("update:modelValue", "");
      emit("change", {
        value: "",
        phoneNumber: "",
        countryCode: selectedCountryCode.value,
        formatted: "",
        isValid: false
      });
      
      phoneInputRef.value?.focus();
    };

    const focus = () => {
      phoneInputRef.value?.focus();
    };

    const blur = () => {
      phoneInputRef.value?.blur();
    };

    // Watchers
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== fullPhoneNumber.value) {
        parseInitialValue();
      }
    });

    watch(() => props.defaultCountry, (newCountry) => {
      if (newCountry && !phoneNumber.value) {
        selectedCountryCode.value = newCountry;
      }
    });

    // Lifecycle
    onMounted(() => {
      parseInitialValue();
    });

    return {
      // Refs
      phoneInputRef,
      phoneNumber,
      selectedCountryCode,
      inputId,
      isFocused,
      
      // Computed
      countries,
      currentCountry,
      currentPlaceholder,
      maxLength,
      formattedNumber,
      fullPhoneNumber,
      isValid,
      
      // Methods
      handleInput,
      handleCountryChange,
      handleFocus,
      handleBlur,
      handleKeydown,
      clearInput,
      focus,
      blur,
    };
  },
};
</script>
