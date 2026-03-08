import { reactive } from "vue";

const defaultOptions = {
  title: "",
  text: "",
  html: "",
  icon: "success", // success | error | warning | info | question
  showCancelButton: false,
  confirmButtonText: "OK",
  cancelButtonText: "Batal",
  confirmButtonClass: "",
  cancelButtonClass: "",
  onConfirm: null,
  onCancel: null,
};

export const swalState = reactive({
  show: false,
  ...defaultOptions,
});

/**
 * Tampilkan dialog ala SweetAlert.
 * @param {Object} options
 * @param {string} [options.title] - Judul
 * @param {string} [options.text] - Teks isi
 * @param {string} [options.html] - HTML isi (prioritas di atas text)
 * @param {string} [options.icon] - success | error | warning | info | question
 * @param {boolean} [options.showCancelButton] - Tampilkan tombol Batal
 * @param {string} [options.confirmButtonText] - Teks tombol OK
 * @param {string} [options.cancelButtonText] - Teks tombol Batal
 * @param {Function} [options.onConfirm] - Callback saat OK diklik
 * @param {Function} [options.onCancel] - Callback saat Batal diklik
 * @returns {{ then: (fn: (result: { isConfirmed: boolean }) => void) => void }}
 */
export function fire(options = {}) {
  Object.assign(swalState, defaultOptions, options);
  swalState.show = true;

  return {
    then(fn) {
      swalState._resolve = fn;
    },
  };
}

export function close() {
  swalState.show = false;
  swalState._resolve = null;
}

export function confirm() {
  swalState.onConfirm?.();
  swalState._resolve?.({ isConfirmed: true });
  close();
}

export function cancel() {
  swalState.onCancel?.();
  swalState._resolve?.({ isConfirmed: false });
  close();
}

/**
 * Composable: akses swal di komponen.
 */
export function useSwal() {
  return { fire, close, swalState };
}
