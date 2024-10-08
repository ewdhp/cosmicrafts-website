<template>
  <div class="content">
    <h1>Referral Tree</h1>
    <div v-if="tree">
      <ReferralNode :node="tree" />
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCanisterStore } from '@/stores/canister';
import { useAuthStore } from '@/stores/auth';
import ReferralNode from '@/components/referral/ReferralNode.vue';
import { Principal } from '@dfinity/principal';

export default {
  name: 'ReferralView',
  components: {
    ReferralNode,
  },
  setup() {
    const tree = ref(null);
    const canister = useCanisterStore();
    const authStore = useAuthStore();

    onMounted(async () => {
      const cosmicrafts = await canister.get('cosmicrafts');
      const id = authStore.getIdentity().getPrincipal();
      console.log(Principal.from(id).toText());
      const result = await cosmicrafts.getReferralTree(id);
      if (result && result.length > 0) {
        tree.value = result[0]; // Access the first element of the array
      } else {
        console.error('Failed to fetch referral tree');
      }

      console.log(result);
    });

    return {
      tree,
    };
  },
};
</script>
<style scoped>
.content {
  display: flex;
  align-items: left;
  margin-top: 75px;

}
</style>