<template>
  <div class="lokasi w-full space-y-4">
    <!-- Kecamatan -->
    <div>
      <UComboBox
        v-model="localValue.district_code"
        :items="districtsOptions"
        value-key="value"
        label-key="title"
        placeholder="Pilih Kecamatan"
        :label="labelKecamatan"
        :error="errors.district_code"
        :required="required"
        :disabled="disabled"
        :loading="loading.districts"
        @change="onDistrictChange"
      />
    </div>

    <!-- Desa -->
    <div>
      <UComboBox
        v-model="localValue.village_code"
        :items="villagesOptions"
        value-key="value"
        label-key="title"
        placeholder="Pilih Desa/Kelurahan"
        :label="labelDesa"
        :error="errors.village_code"
        :required="required"
        :disabled="disabled || !localValue.district_code"
        :loading="loading.villages"
        @change="onVillageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import UComboBox from "@/components/ComboBox/index.vue";
import { useAppStore } from "@/store/app";

const defaultModel = () => ({
  district_code: "",
  village_code: "",
});

export default {
  name: "ULokasi",
  components: {
    UComboBox,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => defaultModel(),
    },
    labelKecamatan: {
      type: String,
      default: "Kecamatan",
    },
    labelDesa: {
      type: String,
      default: "Desa/Kelurahan",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const store = useAppStore();

    const localValue = ref({ ...defaultModel(), ...props.modelValue });

    const loading = ref({
      districts: false,
      villages: false,
    });

    const districtsOptions = ref([]);
    const villagesOptions = ref([]);

    const emitValue = () => {
      emit("update:modelValue", { ...localValue.value });
      emit("change", { ...localValue.value });
    };

    const fetchDistricts = async () => {
      loading.value.districts = true;
      try {
        const data = await store.getCombo("/api/v1/combo/districts", true);
        const list = Array.isArray(data) ? data : [];
        districtsOptions.value = list.map((d) => ({
          value: d.value ?? d.code,
          title: d.title ?? d.name,
        }));
      } catch (e) {
        console.error("Error fetch districts:", e);
        districtsOptions.value = [];
      } finally {
        loading.value.districts = false;
      }
    };

    const fetchVillages = async (districtCode) => {
      if (!districtCode) {
        villagesOptions.value = [];
        return;
      }
      loading.value.villages = true;
      try {
        const data = await store.getCombo(
          `/api/v1/combo/villages/${encodeURIComponent(districtCode)}`,
          true
        );
        const list = Array.isArray(data) ? data : [];
        villagesOptions.value = list.map((v) => ({
          value: v.value ?? v.code,
          title: v.title ?? v.name,
        }));
      } catch (e) {
        console.error("Error fetch villages:", e);
        villagesOptions.value = [];
      } finally {
        loading.value.villages = false;
      }
    };

    const onDistrictChange = ({ value }) => {
      localValue.value.village_code = "";
      if (value) fetchVillages(value);
      else villagesOptions.value = [];
      emitValue();
    };

    const onVillageChange = () => {
      emitValue();
    };

    watch(
      () => props.modelValue,
      (v) => {
        if (v && typeof v === "object") {
          localValue.value = { ...defaultModel(), ...v };
        }
      },
      { deep: true }
    );

    onMounted(async () => {
      await fetchDistricts();
      if (
        localValue.value.district_code &&
        !villagesOptions.value.length
      ) {
        await fetchVillages(localValue.value.district_code);
      }
    });

    return {
      localValue,
      loading,
      districtsOptions,
      villagesOptions,
      onDistrictChange,
      onVillageChange,
    };
  },
};
</script>
