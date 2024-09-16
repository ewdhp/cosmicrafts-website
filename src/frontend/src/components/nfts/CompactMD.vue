<template>
  <div :class="['nft-item', layout]">
   
    <img src="@/assets/logos/logo_menu.svg" alt="Logo" class="logo-menu" />
    <div class="nft-info">
      <p>{{ nft.name }}</p>
      <p>Token ID: {{ nft.tokenId }}</p>
    </div>
    <div class="nft-actions">
      <button @click="viewDetails(nft.tokenId)">Details</button>
      <button @click="transferNFT(nft.tokenId)">Transfer</button>
      <button @click="openNFT(nft.tokenId)">Open</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nft: Object,
    layout: String
  },
  methods: {
    viewDetails(tokenId) {
      // View details logic here
    },
    transferNFT(tokenId) {
      // Transfer NFT logic here
    },
    openNFT(tokenId) {
      // Open NFT logic here
    }
  }
};
</script>

<style scoped>
.nft-item {
  width: 155px;
  height: 155px;
  margin: 20px;
  padding: 10px;;
  border-radius: 10px;
  border: 2px solid rgb(11, 182, 235);
  box-shadow: 0 2px 8px rgba(226, 147, 28, 0.945); /* Add shadow effect */
  background-color: rgb(23, 28, 37);
  color:rgb(194, 192, 186);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nft-item.horizontal {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
button {
  display: flex;
  align-items: center;
  background-color: rgba(43, 78, 168, 0.938); 
  border:none; 
  overflow: hidden;
  border-radius: 2px;

  margin: 2px;
  padding: 5px;;
  color:#141414;
  background-color: rgb(227, 240, 243);

}
.nft-item img {
  width: 100px;
  height: 100px;
}

.nft-info {
  text-align: center;
}

.nft-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>