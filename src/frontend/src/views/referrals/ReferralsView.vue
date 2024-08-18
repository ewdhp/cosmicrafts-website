<script setup>
import SLinkList from '../../components/navs/SLinkList.vue';
const linkMap = [
  { path: '/', name: "Promos" },
  { path: '/', name: "Points" },
  { path: '/', name: "Top Weekly" },
  { path: '/', name: "Tiers" },


];
const title = "Referrals"
</script>
<template>

    <div>
        <SLinkList :items="linkMap" :title="title" />


    </div>
</template>
<style>
</style>