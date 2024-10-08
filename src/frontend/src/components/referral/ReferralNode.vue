<template>
  <div v-if="node" class="referral-node">
    <div class="bracket">
      <div>ID: {{ getTruncatedPrincipalText(node.id) }}</div>
      <div>Username: {{ node.username }}</div>
      <div>Multiplier: {{ node.multiplier }}</div>
      <div>Earnings: {{ node.earnings }}</div>
      <div>Referral Code: {{ node.referralCode }}</div>
    </div>
    <div v-if="node.nodes && node.nodes.length" class="children">
      <ReferralNode
        v-for="(child, i) in node.nodes"
        :key="getPrincipalText(child.id)"
        :node="child"
      />
    </div>
  </div>
</template>


<script>
import { Principal } from '@dfinity/principal';

export default {
  name: 'ReferralNode',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getPrincipalText(principal) {
      if (!principal) {
        return 'Unknown';
      }
      return Principal.from(principal).toText();
    },
    getTruncatedPrincipalText(principal) {
      const fullText = this.getPrincipalText(principal);
      return fullText.length > 3 ? `${fullText.slice(0, 3)}...` : fullText;
    },
  },
};
</script>

<style scoped>
.referral-node {
  display: flex;
  flex-direction: row; /* Stack child nodes vertically */
  margin: 20px; /* Vertical margin for spacing */
  align-items: center;
  align-content: center;
}

.bracket {
  display: flex;
  flex-direction: column; /* Stack details vertically */
  border: 1px solid #ccc; /* Box around node */
  padding: 10px;
  width:200px;
}

.children {

  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Responsive columns */
  align-items: center;
  align-content: center;
  justify-content: center; /* Center the grid */

}



</style>