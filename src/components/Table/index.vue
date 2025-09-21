<template>
  <div class="min-w-full">
    <!-- Loading State -->
    <USkeletonTable
      v-if="loading"
      :headers="headers"
    />

    <!-- Table -->
    <table
      v-else
      :class="[
        'min-w-full table-auto border-collapse border border-gray-300',
        {
          'sticky-header': stickyHeader
        }
      ]"
    >
      <!-- Table Header -->
      <UTableHeader
        :headers="headers"
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        :show-actions="showActions"
        :action-column-width="actionColumnWidth"
        :show-checkbox="showCheckbox"
        :checkbox-column-width="checkboxColumnWidth"
        :selected-rows="selectedRows"
        :total-rows="data.length"
        :sticky="stickyHeader"
        :header-class="headerClass"
        @sort="handleSort"
        @header-click="handleHeaderClick"
        @select-all="handleSelectAll"
        @deselect-all="handleDeselectAll"
        
      >
        <!-- Pass through header slots -->
        <template 
          v-for="header in headers" 
          :key="`header-slot-${header.key}`"
          #[`header-${header.key}`]="slotProps"
        >
          <slot 
            :name="`header-${header.key}`" 
            v-bind="slotProps"
          />
        </template>
        
        <template #header="slotProps">
          <slot name="header" v-bind="slotProps" />
        </template>
        
        <template #action-header>
          <slot name="action-header" />
        </template>
        
        <template #additional-headers>
          <slot name="additional-headers" />
        </template>
      </UTableHeader>

      <!-- Table Body -->
      <UTableBody
        :data="data"
        :headers="headers"
        :loading="loading"
        :empty-text="emptyText"
        :striped="striped"
        :borderless="borderless"
        :clickable="clickable"
        :show-actions="showActions"
        :show-edit="showEdit"
        :show-delete="showDelete"
        :edit-title="editTitle"
        :delete-title="deleteTitle"
        :show-checkbox="showCheckbox"
        :selected-rows="selectedRows"
        :row-key="rowKey"
        :value-formatter="valueFormatter"
        @row-click="handleRowClick"
        @edit="handleEdit"
        @delete="handleDelete"
        @cell-click="handleCellClick"
        @row-select="handleRowSelect"
        @row-deselect="handleRowDeselect"
        @checkbox-click="handleCheckboxClick"
      >
        <!-- Pass through body slots -->
        <template 
          v-for="header in headers" 
          :key="`cell-slot-${header.key}`"
          #[`cell-${header.key}`]="slotProps"
        >
          <slot 
            :name="`cell-${header.key}`" 
            v-bind="slotProps"
          />
        </template>
        
        <template #cell="slotProps">
          <slot name="cell" v-bind="slotProps" />
        </template>
        
        <template #actions="slotProps">
          <slot name="actions" v-bind="slotProps" />
        </template>
      </UTableBody>
    </table>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import UTableHeader from "../TableHeader/index.vue";
import UTableBody from "../TableBody/index.vue";
import USkeletonTable from "../SkeletonTable/index.vue";

export default {
  name: "UTable",
  components: {
    UTableHeader,
    UTableBody,
    USkeletonTable,
  },
  props: {
    // Data
    data: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
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
    stickyHeader: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: String,
      default: '',
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
    'sort',
    'header-click',
    'row-click',
    'edit',
    'delete',
    'cell-click',
    'row-select',
    'row-deselect',
    'select-all',
    'deselect-all',
    'checkbox-click',
    'selection-change'
  ],
  
  setup(props, { emit }) {
    // Internal sorting state
    const internalSortBy = ref(props.sortBy);
    const internalSortDirection = ref(props.sortDirection);

    // Watch for external sort changes
    watch(() => props.sortBy, (newVal) => {
      internalSortBy.value = newVal;
    });

    watch(() => props.sortDirection, (newVal) => {
      internalSortDirection.value = newVal;
    });

    // Event handlers
    const handleSort = (sortData) => {
      internalSortBy.value = sortData.key;
      internalSortDirection.value = sortData.direction;
      
      emit('sort', sortData);
    };

    const handleHeaderClick = (headerData) => {
      emit('header-click', headerData);
    };

    const handleRowClick = (rowData) => {
      emit('row-click', rowData);
    };

    const handleEdit = (editData) => {
      emit('edit', editData);
    };

    const handleDelete = (deleteData) => {
      emit('delete', deleteData);
    };

    const handleCellClick = (cellData) => {
      emit('cell-click', cellData);
    };

    // Checkbox event handlers
    const handleRowSelect = (rowData) => {
      emit('row-select', rowData);
      emit('selection-change', {
        selectedRows: [...props.selectedRows, rowData.row],
        action: 'select',
        row: rowData.row,
        rowIndex: rowData.rowIndex
      });
    };

    const handleRowDeselect = (rowData) => {
      emit('row-deselect', rowData);
      const newSelectedRows = props.selectedRows.filter(row => {
        const rowKey = typeof props.rowKey === 'function' 
          ? props.rowKey(row, props.selectedRows.indexOf(row))
          : row[props.rowKey];
        const selectedKey = typeof props.rowKey === 'function' 
          ? props.rowKey(rowData.row, rowData.rowIndex)
          : rowData.row[props.rowKey];
        return rowKey !== selectedKey;
      });
      emit('selection-change', {
        selectedRows: newSelectedRows,
        action: 'deselect',
        row: rowData.row,
        rowIndex: rowData.rowIndex
      });
    };

    const handleSelectAll = () => {
      emit('select-all');
      emit('selection-change', {
        selectedRows: [...props.data],
        action: 'select-all'
      });
    };

    const handleDeselectAll = () => {
      emit('deselect-all');
      emit('selection-change', {
        selectedRows: [],
        action: 'deselect-all'
      });
    };

    const handleCheckboxClick = (checkboxData) => {
      emit('checkbox-click', checkboxData);
    };

    return {
      internalSortBy,
      internalSortDirection,
      handleSort,
      handleHeaderClick,
      handleRowClick,
      handleEdit,
      handleDelete,
      handleCellClick,
      handleRowSelect,
      handleRowDeselect,
      handleSelectAll,
      handleDeselectAll,
      handleCheckboxClick,
    };
  },
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
