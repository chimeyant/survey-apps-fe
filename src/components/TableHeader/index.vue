<template>
  <thead>
    <tr class="bg-gray-200  text-xs rounded-md h-[30px]">
      <!-- Checkbox Column -->
      <th 
        v-if="showCheckbox" 
        class="px-4 py-2 border border-gray-300 text-white text-center"
        :style="{ width: checkboxColumnWidth }"
      >
        <slot name="checkbox-header">
          <div class="flex items-center justify-center">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
              class="w-4 h-4 text-gray-700 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-0"
            />
          </div>
        </slot>
      </th>
      
      <th
        v-for="(header, index) in headers"
        :key="`header-${index}`"
        :style="{
          '--width-custom': header.width || 'auto'
        }"
        :class="[
          'w-custom px-4 py-2 border border-gray-300 text-gray-700',
          getHeaderClasses(header)
        ]"
        @click="handleHeaderClick(header, index, $event)"
      >
        <!-- Custom Header Slot -->
        <slot 
          :name="`header-${header.key}`"
          :header="header"
          :index="index"
          :sortable="header.sortable"
          :sortDirection="getSortDirection(header.key)"
        >
          <!-- Default Header Content -->
          <slot 
            name="header"
            :header="header"
            :index="index"
            :sortable="header.sortable"
            :sortDirection="getSortDirection(header.key)"
          >
            <div class="flex items-center justify-between">
              <span>{{ header.title }}</span>
              
              <!-- Sort Indicator -->
              <div v-if="header.sortable" class="ml-2 flex flex-col">
                <i 
                  :class="[
                    'ri-arrow-up-s-line text-xs transition-colors duration-200',
                    {
                      'text-white': getSortDirection(header.key) === 'asc',
                      'text-gray-300': getSortDirection(header.key) !== 'asc'
                    }
                  ]"
                ></i>
                <i 
                  :class="[
                    'ri-arrow-down-s-line text-xs -mt-1 transition-colors duration-200',
                    {
                      'text-white': getSortDirection(header.key) === 'desc',
                      'text-gray-300': getSortDirection(header.key) !== 'desc'
                    }
                  ]"
                ></i>
              </div>
            </div>
          </slot>
        </slot>
      </th>
      
      <!-- Action Column Header -->
      <th 
        v-if="showActions" 
        class="px-4 py-2 border border-gray-300 text-gray-700 text-center"
        :style="{ width: actionColumnWidth }"
      >
        <slot name="action-header">
          Aksi
        </slot>
      </th>
    </tr>
    
    <!-- Additional Header Rows -->
    <slot name="additional-headers" />
  </thead>
</template>

<script>
import { computed } from "vue";

export default {
  name: "UTableHeader",
  props: {
    // Headers configuration
    headers: {
      type: Array,
      default: () => [],
      validator: (headers) => {
        return headers.every(header => 
          typeof header === 'object' && 
          header !== null && 
          'key' in header && 
          'title' in header
        );
      }
    },
    
    // Sorting
    sortBy: {
      type: String,
      default: '',
    },
    sortDirection: {
      type: String,
      default: 'asc',
      validator: (value) => ['asc', 'desc', ''].includes(value),
    },
    
    // Actions
    showActions: {
      type: Boolean,
      default: false,
    },
    actionColumnWidth: {
      type: String,
      default: '120px',
    },
    
    // Checkbox
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkboxColumnWidth: {
      type: String,
      default: '50px',
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    totalRows: {
      type: Number,
      default: 0,
    },
    
    // Styling
    sticky: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: String,
      default: '',
    },
  },
  
  emits: [
    'sort',
    'header-click',
    'select-all',
    'deselect-all'
  ],
  
  setup(props, { emit }) {
    // Computed properties for checkbox
    const isAllSelected = computed(() => {
      return props.totalRows > 0 && props.selectedRows.length === props.totalRows;
    });

    const isIndeterminate = computed(() => {
      return props.selectedRows.length > 0 && props.selectedRows.length < props.totalRows;
    });

    // Helper function to get header classes
    const getHeaderClasses = (header) => {
      const classes = [];
      
      // Alignment
      if (header.align) {
        switch (header.align) {
          case 'left':
            classes.push('text-left');
            break;
          case 'center':
            classes.push('text-center');
            break;
          case 'right':
            classes.push('text-right');
            break;
        }
      } else {
        classes.push('text-left'); // Default alignment
      }
      
      // Sortable cursor
      if (header.sortable) {
        classes.push('cursor-pointer hover:bg-cyan-700 select-none');
      }
      
      // Custom classes
      if (header.class) {
        classes.push(header.class);
      }
      
      // Header class
      if (props.headerClass) {
        classes.push(props.headerClass);
      }
      
      return classes.join(' ');
    };

    // Get sort direction for a specific column
    const getSortDirection = (key) => {
      if (props.sortBy === key) {
        return props.sortDirection;
      }
      return '';
    };

    // Handle select all checkbox
    const handleSelectAll = (event) => {
      if (event.target.checked) {
        emit('select-all');
      } else {
        emit('deselect-all');
      }
    };

    // Handle header click (for sorting)
    const handleHeaderClick = (header, index, event) => {
      if (header.sortable) {
        let newDirection = 'asc';
        
        if (props.sortBy === header.key) {
          // Toggle direction if same column
          newDirection = props.sortDirection === 'asc' ? 'desc' : 'asc';
        }
        
        emit('sort', {
          key: header.key,
          direction: newDirection,
          header,
          index,
          event
        });
      }
      
      emit('header-click', {
        header,
        index,
        event
      });
    };

    return {
      isAllSelected,
      isIndeterminate,
      getHeaderClasses,
      getSortDirection,
      handleSelectAll,
      handleHeaderClick,
    };
  },
};
</script>

<style scoped>
.w-custom {
  width: var(--width-custom);
}

/* Sticky header styles */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
