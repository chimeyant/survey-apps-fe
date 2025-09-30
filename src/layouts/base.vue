<template>
  <div class="w-screen h-screen flex">
    <!-- Side bar -->
    <transition name="sidebar">
      <div
        v-show="showSide"
        :class="[
          'fixed z-50 lg:relative h-full text-white animate-fadeInLeft transition-all duration-300',
          `bg-${themeColors.primary}-700`,
          minimised ? 'w-[70px]' : 'w-[300px]'
        ]"
        @mouseenter="handleSidebarHover"
        @mouseleave="handleSidebarLeave"
      >
        <!-- Sidebar Header -->
        <div class="h-[220px] flex flex-col justify-between"
             :class="`bg-gradient-to-t from-${themeColors.primary}-700 to-${themeColors.primary}-950`">
          <div class="flex items-center justify-between px-2 pt-2">
            <div v-if="!minimised" class="w-full text-start text-white">
              <div class="font-bold text-sm italic tracking-wider">Survey Manajemen Sistem</div>
              <div class="text-xs font-bold animate-pulse">Ver. 1.00</div>
            </div>
            <div v-else class="flex-1 flex justify-center">
              <img src="/simpelin.png" alt="Logo" class="w-8 h-8 rounded-full" />
            </div>
            <div
              class="cursor-pointer w-[30px] mr-2 mt-1 lg:hidden"
              @click="toggleSideBar"
            >
              <i class="ri-menu-line text-2xl hover:text-white"></i>
            </div>
          </div>
          <div class="flex items-center px-2 py-5">
            <div class="w-12 h-12 bg-cyan-200 rounded-lg border-4 border-cyan-900 overflow-hidden flex-shrink-0">
              <img
                :src="user.avatar == '' ? '/images/user.png' : user.avatar"
                alt=""
                class="w-full h-full object-cover"
              >
            </div>
            <div v-if="!minimised" class="text-start px-2 text-white">
              <div class="text-xs font-bold">
                {{ user.name}}
              </div>
              <div class="text-xs font-extralight">
                {{ user.role.name}}
              </div>
              <div class="flex justify-end w-full mt-1 ">
                <div class="text-xs border-cyan-200 py-1 border-2 px-2 rounded-full ">
                  {{ time }}
                </div>
              </div>
            </div>
          </div>
          <!-- Minimise Button -->
          <div class="flex  justify-end  px-2 pb-2 ">
            <button
              @click="toggleMinimised"
              :class="`bg-blue-500 hover:bg-teal-500 hover:animate-pulse rounded-full px-2 py-1 transition-all duration-200 focus:outline-none`"
              :title="minimised ? 'Perbesar Sidebar' : 'Minimalkan Sidebar'"
            >
              <i :class="minimised ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'"></i>
            </button>
          </div>
        </div>
        
        <!-- Sidebar Menu -->
        <div
          :class="[
            'h-[calc(100vh-220px)] w-[99%] py-[20px] rounded-tr-3xl shadow-lg overflow-y-scroll transition-all duration-300',
            `bg-gradient-to-r from-gray-600 to-gray-500`,
            `border-t-white-900`,
            `border-t-4`,
            `border-r-white-900`,
            `border-r-4`,
            minimised ? 'px-1' : 'px-[10px]'
          ]"
        >
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
                    'text-sm h-[42px] rounded-sm  opacity-50  font-semibold text-uppercase',
                    `bg-${themeColors.primary}`,
                    `border-b-cyan-900`,
                    minimised ? 'px-2 py-2 flex items-center justify-center' : 'px-4 py-2'
                  ]"
                >
                  <span v-if="!minimised">{{ menu.title }}</span>
                  <span v-else>
                    <i class="ri-more-fill"></i>
                  </span>
                </div>

                <!-- Main Menu Item -->
                <button
                  v-if="menu.props.type =='item'"
                  @click="router.push({name: menu.props.route})"
                  :class="[
                    'flex items-center w-full rounded-full text-left transition-all duration-500 focus:outline-none relative',
                    minimised ? 'justify-center px-0 py-2' : 'px-4 py-2',
                    `hover:bg-${themeColors.primary}-100`,
                    `hover:text-${themeColors.primary}-700`
                  ]"
                  :title="minimised ? menu.title : ''"
                >
                  <i :class="menu.props.icon + ' text-lg ' + (minimised ? '' : 'mr-2')"></i>
                  <span v-if="!minimised" class="text-sm">{{ menu.title }}</span>
                  
                  <!-- Tooltip for minimised state -->
                  <div 
                    v-if="minimised && !isHoveringToExpand"
                    class="tooltip-menu"
                  >
                    {{ menu.title }}
                  </div>
                </button>

                <!-- Main Menu Items (Group) -->
                <div v-if="menu.props.type =='group'" class="relative group-menu">
                  <button
                    @click="toggleMenu(index)"
                    @mouseenter="handleMenuHover(index)"
                    :class="[
                      'flex items-center w-full rounded-full text-left transition-all duration-500 focus:outline-none relative',
                      minimised ? 'justify-center px-0 py-2' : 'px-4 py-2',
                      `hover:bg-${themeColors.primary}-100`,
                      `hover:text-${themeColors.primary}-700`
                    ]"
                    :title="minimised ? menu.title : ''"
                  >
                    <i :class="menu.props.icon + ' text-lg ' + (minimised ? '' : 'mr-2')"></i>
                    <span v-if="!minimised" class="text-sm">{{ menu.title }}</span>
                    <svg
                      v-if="menu.props.submenus && !minimised"
                      :class="{ 'transform rotate-90': openMenuIndex === index }"
                      class="ml-auto w-4 h-4 transition-transform"
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
                    
                    <!-- Tooltip for minimised state -->
                    <div 
                      v-if="minimised && !isHoveringToExpand"
                      class="tooltip-menu"
                    >
                      {{ menu.title }}
                    </div>
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
                        class="py-2 px-4 animate-fadeInLeft text-sm rounded-full duration-500 transition-all hover:cursor-pointer"
                        :class="[
                          `hover:bg-${themeColors.primary}-100`,
                          `hover:text-${themeColors.primary}-700`
                        ]"
                        @click="router.push({ name: submenus.props.route})"
                      >
                        <a href="#"><i class="ri-checkbox-blank-circle-fill mr-2 text-[7pt]"></i> {{ submenus.title }}</a>
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
                        class="py-2 px-4 text-sm rounded-lg duration-200 transition-all hover:cursor-pointer"
                        :class="[
                          `hover:bg-${themeColors.primary}-100`,
                          `hover:text-${themeColors.primary}-700`
                        ]"
                        @click="router.push({ name: submenus.props.route})"
                      >
                        <i class="ri-checkbox-blank-circle-fill mr-2 text-[7pt]"></i> {{ submenus.title }}
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
    <div class="w-full h-full bg-white" >
      <div class="h-[50px] flex items-center shadow-sm px-[20px] w-full py-[10px] z-10 border-b-4 bg-gradient-to-r from-cyan-50 to-cyan-700"
           :class="[
             `bg-white-100`,
             `border-b-${themeColors.primary}-900`
           ]">
        <!-- Hamburger menu -->
        <div
          class="cursor-pointer w-[30px]"
          @click="toggleSideBar"
        >
          <i class="ri-menu-line text-2xl" :class="`hover:text-${themeColors.primary}-700`"></i>
        </div>
        <!-- Search bar -->

        <div class="w-[calc(100%-30px)] flex">
          <div class="w-[calc(100%-200px)] flex justify-center ">
          </div>
          <!-- User login -->
          <div class="w-auto">
            <div
              class="flex items-center justify-start space-x-4 hover:cursor-pointer w-auto"
              @click="toggleDropDown"
            >
              <img
                class="w-8 h-8 rounded-full border-2"
                :class="`border-${themeColors.primary}-50`"
                :src="user.avatar == '' ? '/images/user.png' : user.avatar"
                alt=""
              >
              <div class="text-xs md:text-sm dark:text-black text-left"
                   :class="`text-${themeColors.primary}-900`">
                <div class="flex text-xs text-white  w-auto">{{ user.name }}</div>
              </div>
            </div>
            <!-- Drop down -->
            <div
              v-show="showDropDown"
              class="absolute right-[10px] z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              @mouseleave="showDropDown = false"
              tabindex="-1"
            >
              <div
                class="py-1 text-left"
                role="none"
              >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm"
                  :class="[
                    `text-${themeColors.primary}-700`,
                    `hover:bg-${themeColors.primary}-100`,
                    `hover:text-${themeColors.primary}-900`
                  ]"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                  @click="changePassword"
                >Ganti Kata Sandi</a>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm"
                  :class="[
                    `text-${themeColors.primary}-700`,
                    `hover:bg-${themeColors.primary}-100`,
                    `hover:text-${themeColors.primary}-900`
                  ]"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                >Profil</a>
                <button
                  type="button"
                  class="block w-full px-4 py-2 text-sm"
                  :class="[
                    `text-${themeColors.primary}-700`,
                    `hover:bg-red-300`,
                    `hover:text-${themeColors.primary}-900`
                  ]"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-3"
                  @click="postSignOut"
                ><i class="ri-logout-circle-line"></i> Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-[calc(100vh-90px)] p-[20px] bg- overflow-y-hidden">
        <!-- Breadcrumb -->
        <UBreadcrumb :breadcrumbs="page.breadcrumbs" />
        <div class="w-full h-full overflow-y-scroll ">
          <router-view />
        </div>
      </div>
      <div class="h-[40px] w-full shadow-lg border-t"
           :class="[
             `bg-${themeColors.primary}-50`,
             `border-t-${themeColors.primary}-200`
           ]">
        <div class="flex items-center h-full px-3 justify-center md:justify-between">
          <div class="lg:flex h-full items-center hidden sm:block">
            <div class="text-xs font-light" :class="`text-${themeColors.primary}-700`">Status : {{ form.delete ? 'Hapus Data' : form.add ? form.edit ? 'Ubah Data' : "Tambah Data" : 'Ready'  }}</div>
            <div class="px-1 text-xs" :class="`text-${themeColors.primary}-700`">
              | Records : {{ table.footer.total }}
            </div>
          </div>
          <div class="text-xs hidden sm:block" :class="`text-${themeColors.primary}-700`">&copy; Dinas Komunikasi Dan Informatika Kabupaten Tangerang</div>
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
} from "vue";
import { useRouter } from "vue-router";
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
    let timer = null;
    let hoverTimer = null;
    let dropdownTimer = null;

    const fetchUserInfo = () => {
      store.getUserInfo().then(()=>{
        store.fetchMenus()
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

    const toggleMenu = (index) => {
      openMenuIndex.value = openMenuIndex.value === index ? null : index;
    };

    const getyCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString();
    };

    const updateClock = () => {
      time.value = getyCurrentTime();
    };

    const changePassword = () => {
      router.push({name: "change-password"});
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
    });

    onBeforeUnmount(() => {
      clearInterval(timer);
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
    };
  },
};
</script>

<style scoped>
.sidebar-enter-active, .sidebar-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.sidebar-enter-from, .sidebar-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.sidebar-enter-to, .sidebar-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.submenu-enter-active, .submenu-leave-active {
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
}
.submenu-enter-from, .submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.submenu-enter-to, .submenu-leave-from {
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
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Arrow for tooltip */
.tooltip-menu::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.9);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 12px;
  margin-left: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  animation: slideInRight 0.2s ease-out;
}

.dropdown-title {
  font-weight: bold;
  font-size: 13px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
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