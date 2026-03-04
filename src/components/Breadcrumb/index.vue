<template>
  <nav
    v-if="hasItems"
    class="flex items-center py-3 text-sm"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex flex-wrap items-center gap-1.5 text-gray-500 min-w-0">
      <!-- Home -->
      <li class="inline-flex items-center shrink-0">
        <router-link
          :to="homeRoute"
          class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-1"
          aria-label="Beranda"
        >
          <i class="ri-home-4-line text-lg"></i>
        </router-link>
      </li>

      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.name || index">
        <!-- Separator -->
        <li
          class="flex items-center shrink-0 text-gray-300 pointer-events-none"
          aria-hidden="true"
        >
          <i class="ri-arrow-right-s-line text-base"></i>
        </li>
        <!-- Crumb -->
        <li class="inline-flex items-center min-w-0">
          <router-link
            v-if="!isLast(index)"
            :to="{ name: crumb.name }"
            class="rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 truncate max-w-[180px] sm:max-w-[240px] transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-1"
          >
            {{ crumb.title }}
          </router-link>
          <span
            v-else
            class="rounded-lg px-2 py-1.5 font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-[240px]"
            aria-current="page"
          >
            {{ crumb.title }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script>
import { computed } from "vue";

export default {
  name: "UBreadcrumb",
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    homeName: {
      type: String,
      default: "dashboard",
    },
  },
  setup(props) {
    const breadcrumbs = computed(() =>
      Array.isArray(props.breadcrumbs) ? props.breadcrumbs : []
    );

    const hasItems = computed(() => breadcrumbs.value.length > 0);

    const homeRoute = computed(() => ({ name: props.homeName }));

    const isLast = (index) => index === breadcrumbs.value.length - 1;

    return {
      breadcrumbs,
      hasItems,
      homeRoute,
      isLast,
    };
  },
};
</script>
