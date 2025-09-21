<template>
  <tbody>
    <!-- Loading State -->
    <tr v-if="loading" class="animate-pulse">
      <td 
        v-for="(header, index) in headers" 
        :key="`loading-${index}`"
        :class="getCellClasses(header)"
        class="px-4 py-3"
      >
        <div class="h-4 bg-gray-200 rounded"></div>
      </td>
    </tr>

    <!-- Empty State -->
    <tr v-else-if="!data || data.length === 0">
      <td 
        :colspan="headers.length" 
        class="px-4 py-8 text-center text-gray-500"
      >
        <div class="flex flex-col items-center space-y-2">
          <i class="ri-database-2-line text-4xl text-gray-300"></i>
          <span class="text-sm">{{ emptyText }}</span>
        </div>
      </td>
    </tr>

    <!-- Data Rows -->
    <template v-else>
      <tr 
        v-for="(row, rowIndex) in data" 
        :key="getRowKey(row, rowIndex)"
        :class="[
          'hover:bg-gray-50 transition-colors duration-150 text-xs',
          {
            'bg-gray-50': striped && rowIndex % 2 === 1,
            'border-b border-gray-200': !borderless,
            'cursor-pointer': clickable,
            'bg-blue-50': isRowSelected(row, rowIndex)
          }
        ]"
        @click="handleRowClick(row, rowIndex, $event)"
      >
        <!-- Checkbox Column -->
        <td 
          v-if="showCheckbox" 
          class="px-4 py-3 text-center"
          @click.stop="handleCheckboxClick(row, rowIndex, $event)"
        >
          <slot 
            :name="`checkbox-${getRowKey(row, rowIndex)}`"
            :row="row"
            :rowIndex="rowIndex"
            :isSelected="isRowSelected(row, rowIndex)"
            :toggleSelection="() => toggleRowSelection(row, rowIndex)"
          >
            <div class="flex items-center justify-center">
              <input
                type="checkbox"
                :checked="isRowSelected(row, rowIndex)"
                @change="handleRowCheckboxChange(row, rowIndex, $event)"
                class="w-4 h-4 text-cyan-600 bg-white border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
              />
            </div>
          </slot>
        </td>
        <!-- Default Cell Rendering -->
        <td 
          v-for="(header, cellIndex) in headers" 
          :key="`${rowIndex}-${cellIndex}`"
          :class="getCellClasses(header)"
          class="px-4 py-3"
        >
          <!-- Custom Cell Slot -->
          <slot 
            :name="`cell-${header.key}`"
            :row="row"
            :rowIndex="rowIndex"
            :header="header"
            :value="getCellValue(row, header)"
            :cellIndex="cellIndex"
          >
            <!-- Default Cell Content -->
            <slot 
              name="cell"
              :row="row"
              :rowIndex="rowIndex"
              :header="header"
              :value="getCellValue(row, header)"
              :cellIndex="cellIndex"
            >
              <!-- Fallback to simple value display -->
              <span :class="getValueClasses(header)">
                {{ formatCellValue(getCellValue(row, header), header) }}
              </span>
            </slot>
          </slot>
        </td>

        <!-- Action Column Slot -->
        <td 
          v-if="showActions" 
          class="px-4 py-3 text-right"
        >
          <slot 
            name="actions"
            :row="row"
            :rowIndex="rowIndex"
          >
            <!-- Default Actions -->
            <div class="flex items-center justify-end space-x-2">
              <button
                v-if="showEdit"
                @click.stop="handleEdit(row, rowIndex, $event)"
                class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                :title="editTitle"
              >
                <i class="ri-edit-line text-sm"></i>
              </button>
              <button
                v-if="showDelete"
                @click.stop="handleDelete(row, rowIndex, $event)"
                class="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                :title="deleteTitle"
              >
                <i class="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          </slot>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script>
import { computed } from "vue";

export default {
  name: "UTableBody",
  props: {
    // Data
    data: {
      type: Array,
      default: () => [],
    },
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
    
    // Loading and Empty States
    loading: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: "No data available",
    },
    
    // Styling
    striped: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    
    // Actions
    showActions: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    editTitle: {
      type: String,
      default: "Edit",
    },
    deleteTitle: {
      type: String,
      default: "Delete",
    },
    
    // Checkbox
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    
    // Customization
    rowKey: {
      type: [String, Function],
      default: 'id',
    },
    valueFormatter: {
      type: Function,
      default: null,
    },
  },
  
  emits: [
    'row-click',
    'edit',
    'delete',
    'cell-click',
    'row-select',
    'row-deselect',
    'checkbox-click'
  ],
  
  setup(props, { emit }) {
    // Helper function to get unique row key
    const getRowKey = (row, index) => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey(row, index);
      }
      return row[props.rowKey] || `row-${index}`;
    };

    // Helper function to get cell value
    const getCellValue = (row, header) => {
      if (typeof header.key === 'function') {
        return header.key(row);
      }
      
      // Support nested object keys (e.g., 'user.name')
      const keys = header.key.split('.');
      let value = row;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null) break;
      }
      
      return value;
    };

    // Helper function to format cell value
    const formatCellValue = (value, header) => {
      // Use custom formatter if provided
      if (props.valueFormatter) {
        return props.valueFormatter(value, header);
      }
      
      // Use header formatter if provided
      if (header.formatter && typeof header.formatter === 'function') {
        return header.formatter(value);
      }
      
      // Default formatting
      if (value === null || value === undefined) {
        return header.emptyText || '-';
      }
      
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      return String(value);
    };

    // Helper function to get cell classes
    const getCellClasses = (header) => {
      const baseClasses = [];
      
      // Alignment
      if (header.align) {
        switch (header.align) {
          case 'left':
            baseClasses.push('text-left');
            break;
          case 'center':
            baseClasses.push('text-center');
            break;
          case 'right':
            baseClasses.push('text-right');
            break;
        }
      }
      
      // Custom classes
      if (header.class) {
        baseClasses.push(header.class);
      }
      
      return baseClasses.join(' ');
    };

    // Helper function to get value classes
    const getValueClasses = (header) => {
      const classes = [];
      
      if (header.valueClass) {
        classes.push(header.valueClass);
      }
      
      return classes.join(' ');
    };

    // Checkbox helpers
    const isRowSelected = (row, rowIndex) => {
      const rowKey = getRowKey(row, rowIndex);
      return props.selectedRows.some(selectedRow => {
        const selectedKey = typeof props.rowKey === 'function' 
          ? props.rowKey(selectedRow, props.selectedRows.indexOf(selectedRow))
          : selectedRow[props.rowKey];
        return selectedKey === rowKey;
      });
    };

    const toggleRowSelection = (row, rowIndex) => {
      if (isRowSelected(row, rowIndex)) {
        emit('row-deselect', { row, rowIndex });
      } else {
        emit('row-select', { row, rowIndex });
      }
    };

    // Event handlers
    const handleRowClick = (row, rowIndex, event) => {
      if (props.clickable) {
        emit('row-click', { row, rowIndex, event });
      }
    };

    const handleCheckboxClick = (row, rowIndex, event) => {
      event.stopPropagation();
      toggleRowSelection(row, rowIndex);
      emit('checkbox-click', { row, rowIndex, event, isSelected: isRowSelected(row, rowIndex) });
    };

    const handleRowCheckboxChange = (row, rowIndex, event) => {
      if (event.target.checked) {
        emit('row-select', { row, rowIndex });
      } else {
        emit('row-deselect', { row, rowIndex });
      }
    };

    const handleEdit = (row, rowIndex, event) => {
      emit('edit', { row, rowIndex, event });
    };

    const handleDelete = (row, rowIndex, event) => {
      emit('delete', { row, rowIndex, event });
    };

    return {
      getRowKey,
      getCellValue,
      formatCellValue,
      getCellClasses,
      getValueClasses,
      isRowSelected,
      toggleRowSelection,
      handleRowClick,
      handleCheckboxClick,
      handleRowCheckboxChange,
      handleEdit,
      handleDelete,
    };
  },
};
</script>
