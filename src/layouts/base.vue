<template>
  <div class="w-screen h-screen flex bg-slate-800 font-sans antialiased">
    <!-- Side bar -->
    <transition name="sidebar">
      <div
        v-show="showSide"
        :class="[
          'fixed z-50 lg:relative h-full text-white transition-all duration-300',
          minimised ? 'w-[70px]' : 'w-[300px]'
        ]"
        @mouseenter="handleSidebarHover"
        @mouseleave="handleSidebarLeave"
      >
        <!-- Sidebar Header -->
        <div class="h-[220px] flex flex-col justify-between bg-gradient-to-t from-slate-800 to-cyan-900/80 border-b border-slate-700/50">
          <div class="flex items-center justify-between px-2 pt-2">
            <div
              v-if="!minimised"
              class="w-full text-start text-white"
            >
              <div class="font-bold text-sm tracking-tight">Survey Manajemen Sistem</div>
              <div class="text-xs text-cyan-300/80">Ver. 1.00</div>
            </div>
            <div
              v-else
              class="flex-1 flex justify-center"
            >
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <i class="ri-survey-line text-white text-sm"></i>
              </div>
            </div>
            <div
              class="cursor-pointer w-[30px] mr-2 mt-1 lg:hidden text-slate-400 hover:text-white"
              @click="toggleSideBar"
            >
              <i class="ri-menu-line text-2xl"></i>
            </div>
          </div>
          <div class="flex items-center px-2 py-5">
            <div class="w-12 h-12 rounded-xl border-2 border-slate-600 overflow-hidden flex-shrink-0 bg-slate-700">
              <img
                :src="user.avatar == '' ? '/images/user.png' : user.avatar"
                alt=""
                class="w-full h-full object-cover"
              >
            </div>
            <div
              v-if="!minimised"
              class="text-start px-2 text-white"
            >
              <div class="text-xs font-semibold text-white">
                {{ user.name }}
              </div>
              <div class="text-xs text-slate-400">
                {{ user.role.name }}
              </div>
              <div class="flex justify-end w-full mt-1">
                <div class="text-xs text-slate-500 border border-slate-600 py-1 px-2 rounded-lg bg-slate-800/50">
                  {{ time }}
                </div>
              </div>
            </div>
          </div>
          <!-- Minimise Button -->
          <div class="flex justify-end px-2 pb-2">
            <button
              @click="toggleMinimised"
              class="rounded-lg px-2 py-1 bg-slate-700/80 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              :title="minimised ? 'Perbesar Sidebar' : 'Minimalkan Sidebar'"
            >
              <i :class="minimised ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'"></i>
            </button>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <div :class="[
            'h-[calc(100vh-220px)] w-[99%] py-[20px] rounded-tr-2xl overflow-y-scroll transition-all duration-300 border-t border-slate-700/50',
            'bg-slate-800/90',
            minimised ? 'px-1' : 'px-[10px]'
          ]">
          <div class="flex flex-col justify-between h-full space-y-[10px]">
            <ul class="space-y-1">
              <li
                v-for="(menu, index) in menus"
                :key="index"
                class="relative"
              >
                <!-- Sub Header Menu -->
                <div
                  v-if="menu.props.type=='subheader'"
                  :class="[
                    'text-xs font-semibold uppercase tracking-wider text-slate-500',
                    minimised ? 'px-2 py-2 flex items-center justify-center' : 'px-4 py-2'
                  ]"
                >
                  <span v-if="!minimised">{{ menu.title }}</span>
                  <span v-else><i class="ri-more-fill"></i></span>
                </div>

                <!-- Main Menu Item -->
                <button
                  v-if="menu.props.type =='item'"
                  @click="router.push({name: menu.props.route})"
                  :class="[
                    'flex items-center w-full rounded-xl text-left transition-all duration-200 focus:outline-none',
                    minimised ? 'justify-center px-0 py-2' : 'px-4 py-2',
                    isItemActive(menu.props.route)
                      ? 'text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-700/80 hover:text-cyan-400'
                  ]"
                  :title="minimised ? menu.title : ''"
                >
                  <i :class="menu.props.icon + ' text-lg ' + (minimised ? '' : 'mr-2')"></i>
                  <span
                    v-if="!minimised"
                    class="text-sm"
                  >{{ menu.title }}</span>
                  <div
                    v-if="minimised && !isHoveringToExpand"
                    class="tooltip-menu"
                  >{{ menu.title }}</div>
                </button>

                <!-- Main Menu Items (Group) -->
                <div
                  v-if="menu.props.type =='group'"
                  class="relative group-menu"
                >
                  <button
                    @click="toggleMenu(index)"
                    @mouseenter="handleMenuHover(index)"
                    :class="[
                      'flex items-center w-full rounded-xl text-left transition-all duration-200 focus:outline-none',
                      minimised ? 'justify-center px-0 py-2' : 'px-4 py-2',
                      isGroupActive(menu)
                        ? 'text-cyan-300'
                        : 'text-slate-300 hover:bg-slate-700/80 hover:text-cyan-400'
                    ]"
                    :title="minimised ? menu.title : ''"
                  >
                    <i :class="menu.props.icon + ' text-lg ' + (minimised ? '' : 'mr-2')"></i>
                    <span
                      v-if="!minimised"
                      class="text-sm"
                    >{{ menu.title }}</span>
                    <svg
                      v-if="menu.props.submenus && !minimised"
                      :class="{ 'transform rotate-90': openMenuIndex === index }"
                      class="ml-auto w-4 h-4 text-slate-500 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                    <div
                      v-if="minimised && !isHoveringToExpand"
                      class="tooltip-menu"
                    >{{ menu.title }}</div>
                  </button>

                  <!-- Submenu (inline when expanded) -->
                  <transition name="submenu">
                    <ul
                      v-if="menu.props.submenus && openMenuIndex === index && !minimised"
                      class="pl-8 space-y-1"
                    >
                      <li
                        v-for="(submenus, subIndex) in menu.props.submenus"
                        :key="subIndex"
                        :class="[
                          'py-2 px-4 text-sm rounded-xl cursor-pointer transition-all duration-200 flex items-center',
                          isSubmenuActive(submenus.props.route)
                            ? 'text-cyan-300 font-medium'
                            : 'text-slate-400 hover:bg-slate-700/80 hover:text-cyan-400'
                        ]"
                        @click="router.push({ name: submenus.props.route})"
                      >
                        <a
                          href="#"
                          class="flex items-center w-full"
                        ><i :class="['ri-checkbox-blank-circle-fill mr-2 text-[6px]', isSubmenuActive(submenus.props.route) ? 'text-cyan-400' : 'text-cyan-500']"></i> {{ submenus.title }}</a>
                      </li>
                    </ul>
                  </transition>

                  <!-- Dropdown Submenu (when minimised) -->
                  <div
                    v-if="minimised && menu.props.submenus && hoveredMenuIndex === index"
                    class="dropdown-submenu"
                    @mouseenter="keepDropdownOpen(index)"
                    @mouseleave="closeDropdown"
                  >
                    <div class="dropdown-title">{{ menu.title }}</div>
                    <ul class="space-y-1">
                      <li
                        v-for="(submenus, subIndex) in menu.props.submenus"
                        :key="subIndex"
                        :class="[
                          'py-2 px-4 text-sm rounded-lg cursor-pointer transition-colors',
                          isSubmenuActive(submenus.props.route)
                            ? 'text-cyan-300 font-medium'
                            : 'text-slate-300 hover:bg-slate-700/80 hover:text-cyan-400'
                        ]"
                        @click="router.push({ name: submenus.props.route})"
                      >
                        <i :class="['ri-checkbox-blank-circle-fill mr-2 text-[6px]', isSubmenuActive(submenus.props.route) ? 'text-cyan-400' : 'text-cyan-500']"></i> {{ submenus.title }}
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <div class="w-full h-full bg-white flex flex-col">
      <!-- Top bar -->
      <header class="h-14 flex-shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 bg-white border-b border-gray-200">
        <!-- Left: menu -->
        <button
          type="button"
          class="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2"
          aria-label="Buka atau tutup menu"
          @click="toggleSideBar"
        >
          <i class="ri-menu-line text-2xl"></i>
        </button>

        <!-- Center: page title (when set) -->
        <!-- <div class="flex-1 min-w-0 flex justify-center">
          <h1
            v-if="page.title"
            class="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-md"
          >
            {{ page.title }}
          </h1>
        </div> -->

        <!-- Right: user menu -->
        <div
          class="relative flex items-center flex-shrink-0"
          ref="userMenuRef"
        >
          <button
            type="button"
            class="flex items-center gap-2 sm:gap-3 pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 border border-transparent"
            :class="showDropDown
              ? 'bg-gray-50 border-gray-200 ring-2 ring-cyan-500/20'
              : 'hover:bg-gray-50 border-gray-100'"
            aria-expanded="showDropDown"
            aria-haspopup="true"
            aria-label="Menu pengguna"
            @click="toggleDropDown"
          >
            <div class="relative flex-shrink-0">
              <img
                :src="user.avatar == '' ? '/images/user.png' : user.avatar"
                :alt="user.name"
                class="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              />
              <span
                class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"
                aria-hidden="true"
              ></span>
            </div>
            <div class="hidden sm:block text-left min-w-0 max-w-[120px]">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ user.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user.role?.name || 'User' }}</p>
            </div>
            <i
              class="ri-arrow-down-s-line text-lg text-gray-400 flex-shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': showDropDown }"
            ></i>
          </button>

          <!-- Dropdown -->
          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-show="showDropDown"
              class="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              @mouseleave="showDropDown = false"
            >
              <div class="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <img
                    :src="user.avatar == '' ? '/images/user.png' : user.avatar"
                    :alt="user.name"
                    class="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user.email || user.role?.name || 'Pengguna' }}</p>
                  </div>
                </div>
              </div>
              <div class="py-1.5">
                <button
                  type="button"
                  role="menuitem"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                  @click="handleChangePassword"
                >
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 shrink-0">
                    <i class="ri-lock-password-line text-lg"></i>
                  </span>
                  Ganti Kata Sandi
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  @click="showDropDown = false"
                >
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 shrink-0">
                    <i class="ri-user-settings-line text-lg"></i>
                  </span>
                  Profil
                </button>
              </div>
              <div class="border-t border-gray-100"></div>
              <div class="py-1.5">
                <button
                  type="button"
                  role="menuitem"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  @click="postSignOut"
                >
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0">
                    <i class="ri-logout-box-r-line text-lg"></i>
                  </span>
                  Keluar
                </button>
              </div>
            </div>
          </transition>
        </div>
      </header>
      <div class="h-[calc(100vh-6rem)] p-4 sm:p-5 overflow-y-hidden flex flex-col bg-white">
        <!-- Breadcrumb -->
        <UBreadcrumb :breadcrumbs="page.breadcrumbs" />
        <div class="w-full h-full overflow-y-scroll text-gray-900">
          <router-view />
        </div>
      </div>
      <div class="h-[40px] w-full border-t border-gray-200 bg-gray-50">
        <div class="flex items-center h-full px-3 justify-center md:justify-between text-gray-600">
          <div class="lg:flex h-full items-center hidden sm:block">
            <div class="text-xs font-light text-gray-600">
              Status : {{ form.delete ? 'Hapus Data' : form.add ? form.edit ? 'Ubah Data' : "Tambah Data" : 'Ready' }}
            </div>
            <div class="px-1 text-xs text-gray-600">
              | Records : {{ table.footer.total }}
            </div>
          </div>
          <div class="text-xs hidden sm:block text-gray-600">
            &copy; Dinas Komunikasi Dan Informatika Kabupaten Tangerang
          </div>
          <!-- pagination -->
          <UPagination
            v-if="page.showtable"
            :current-page="table.footer.currentPage"
            :total-pages="table.footer.lastPage"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </div>
    <!-- Main  -->
  </div>

  <!-- Toast Component -->

  <UToast
    :message="snackbar.text"
    :show="snackbar.state"
    :type="snackbar.type"
  />

</template>

<script>
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store/app";
import { UPagination, UToast, UBreadcrumb, UThemeSwitcher } from "@/components";

export default {
  components: {
    UPagination,
    UToast,
    UBreadcrumb,
    UThemeSwitcher,
  },
  setup() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const user = computed(() => store.user);
    const menus = computed(() => store.menus);
    const snackbar = computed(() => store.snackbar);
    const page = computed(() => store.page);
    const form = computed(() => store.form);
    const records = computed(() => store.records);
    const table = computed(() => store.table);
    const themeColors = computed(() => store.getThemeColors);

    const openMenuIndex = ref(null);
    const showDropDown = ref(false);
    const showSide = ref(true);
    const minimised = ref(false);
    const isMinimisedByUser = ref(false);
    const isHoveringToExpand = ref(false);
    const hoveredMenuIndex = ref(null);
    const time = ref(new Date().toLocaleTimeString());
    const userMenuRef = ref(null);
    let timer = null;
    let hoverTimer = null;
    let dropdownTimer = null;

    const fetchUserInfo = () => {
      store.getUserInfo().then(() => {
        store.fetchMenus();
        // if(user.value.role.name == "User"){
        //   router.push({name: "user-dashboard"})
        // }else{
        //   router.push({name: "dashboard"})
        // }
      });
    };

    const toggleSideBar = () => {
      showSide.value = !showSide.value;
    };

    const toggleMinimised = () => {
      minimised.value = !minimised.value;
      isMinimisedByUser.value = minimised.value;
      isHoveringToExpand.value = false;
      // close open menu if minimised
      if (minimised.value) openMenuIndex.value = null;
    };

    const handleSidebarHover = () => {
      if (isMinimisedByUser.value && !minimised.value) {
        return; // Already expanded
      }

      if (isMinimisedByUser.value) {
        // Delay expansion to avoid accidental triggers
        hoverTimer = setTimeout(() => {
          minimised.value = false;
          isHoveringToExpand.value = true;
        }, 500);
      }
    };

    const handleSidebarLeave = () => {
      // Clear the hover timer if mouse leaves before expansion
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      // Close dropdown when leaving sidebar
      hoveredMenuIndex.value = null;

      // Collapse sidebar if it was expanded by hover
      if (isMinimisedByUser.value && isHoveringToExpand.value) {
        minimised.value = true;
        isHoveringToExpand.value = false;
        openMenuIndex.value = null;
      }
    };

    const handleMenuHover = (index) => {
      if (minimised.value && !isHoveringToExpand.value) {
        // Clear any existing timer
        if (dropdownTimer) {
          clearTimeout(dropdownTimer);
        }
        // Show dropdown after a short delay
        dropdownTimer = setTimeout(() => {
          hoveredMenuIndex.value = index;
        }, 200);
      }
    };

    const keepDropdownOpen = (index) => {
      hoveredMenuIndex.value = index;
    };

    const closeDropdown = () => {
      if (dropdownTimer) {
        clearTimeout(dropdownTimer);
        dropdownTimer = null;
      }
      setTimeout(() => {
        hoveredMenuIndex.value = null;
      }, 100);
    };

    const toggleDropDown = () => {
      showDropDown.value = !showDropDown.value;
    };

    const handleClickOutsideUserMenu = (e) => {
      if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
        showDropDown.value = false;
      }
    };

    const toggleMenu = (index) => {
      openMenuIndex.value = openMenuIndex.value === index ? null : index;
    };

    const isItemActive = (routeName) => route.name === routeName;

    const isGroupActive = (menu) => {
      if (!menu?.props?.submenus?.length) return false;
      return menu.props.submenus.some((s) => s.props?.route === route.name);
    };

    const isSubmenuActive = (routeName) => route.name === routeName;

    watch(
      () => route.name,
      (name) => {
        if (!name || minimised.value) return;
        const list = menus.value || [];
        const idx = list.findIndex(
          (m) => m?.props?.type === "group" && isGroupActive(m)
        );
        if (idx !== -1) openMenuIndex.value = idx;
      },
      { immediate: true }
    );

    const getyCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString();
    };

    const updateClock = () => {
      time.value = getyCurrentTime();
    };

    const changePassword = () => {
      router.push({ name: "change-password" });
    };

    const handleChangePassword = () => {
      showDropDown.value = false;
      changePassword();
    };

    const postSignOut = async () => {
      try {
        await store.postSignOut().then(() => {
          router.push({
            name: "login",
          });
        });
      } catch (error) {}
    };

    const handlePageChange = async (newPage) => {
      table.value.footer.currentPage = newPage;
    };

    onBeforeMount(async () => {
      fetchUserInfo();
    });

    onMounted(() => {
      timer = setInterval(() => {
        updateClock();
      }, 1000);
      document.addEventListener("click", handleClickOutsideUserMenu);
    });

    onBeforeUnmount(() => {
      clearInterval(timer);
      document.removeEventListener("click", handleClickOutsideUserMenu);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
      if (dropdownTimer) {
        clearTimeout(dropdownTimer);
      }
    });

    return {
      router,
      user,
      toggleSideBar,
      toggleDropDown,
      showDropDown,
      showSide,
      openMenuIndex,
      toggleMenu,
      time,
      menus,
      postSignOut,
      snackbar,
      page,
      form,
      records,
      table,
      handlePageChange,
      minimised,
      toggleMinimised,
      themeColors,
      changePassword,
      handleSidebarHover,
      handleSidebarLeave,
      isHoveringToExpand,
      hoveredMenuIndex,
      handleMenuHover,
      keepDropdownOpen,
      closeDropdown,
      userMenuRef,
      handleChangePassword,
      isItemActive,
      isGroupActive,
      isSubmenuActive,
    };
  },
};
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.sidebar-enter-to,
.sidebar-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Tooltip styling */
.tooltip-menu {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  background: rgb(30 41 59);
  color: rgb(226 232 240);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgb(51 65 85);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.tooltip-menu::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgb(51 65 85);
}

/* Show tooltip on hover */
button:hover .tooltip-menu {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.3s;
}

/* Dropdown Submenu styling */
.dropdown-submenu {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 200px;
  background: linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%);
  border: 1px solid rgb(51 65 85);
  border-radius: 10px;
  padding: 12px;
  margin-left: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  z-index: 1001;
  animation: slideInRight 0.2s ease-out;
}

.dropdown-title {
  font-weight: 600;
  font-size: 13px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgb(51 65 85);
  color: rgb(226 232 240);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Prevent tooltip from showing when dropdown is active */
.group-menu:hover .tooltip-menu {
  display: none;
}
</style>