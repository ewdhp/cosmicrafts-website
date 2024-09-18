<script>
export default {
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
    selectedItem: {
      type: String,
      required: true,
    },
    tableHeaders: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:selectedItem'],
  methods: {
    handleMenuClick(item) {
      this.$emit('update:selectedItem', item);
    },
  },
};
</script>

<template>
  <div>
    <ListH 
      :items="menuItems" 
      :selectedItem="selectedItem" 
      @update:selectedItem="handleMenuClick" 
    />
    <div v-if="selectedItem">
      <table>
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td v-for="header in tableHeaders" :key="header">
              {{ row[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #0c0b0b;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}
</style>