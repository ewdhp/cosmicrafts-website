<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LinkList from '@/components/LinkList.vue';

// Define a map of routes and their associated link items
const linkMap = {
  '/marketing': [     
    { name: 'Main', path: '/marketing/promos' },
    { name: 'Signup referral', path: '/marketing/promos/signup_referral'},
    { name: 'Tiers', path: '/marketing/promos/tiers'}
  ],
};

const route = useRoute();
const items = computed(() => {
  let matchedPath = Object.keys(linkMap).find(
    path => path === route.path || 
    route.path.startsWith(path + '/'));
  return linkMap[matchedPath] || [];
});

const title = computed(() => {
  const currentPath = route.path;
  const item = items.value.find(item => item.path === currentPath);
  return item ? item.name : 'Default Title'; // Set a default title if no match is found
});

const orientation = 'vertical';
</script>
<template>

  <div style="display:flex; flex-direction: row; ">

    <div class="left-nav">
      <LinkList 
        :items="items" 
        :orientation="orientation" 
        :title="title" 
      />
    </div>
      

        <div class="content" >
          
            <div class="form-container">
              <h2 class="title" >New Tier</h2>
    <form action="#" method="post">
        <label for="tier-name">Tier Name:</label>
        <input type="text" id="tier-name" name="tier-name" required>

        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" required></textarea>

        <label for="amount">Amount:</label>
        <input type="text" id="amount" name="amount" required>

        <button type="submit">Create Tier</button>
    </form>
</div>
        </div>
        </div>
  
</template>
<style scoped lang="scss">
.left-nav {

  min-width: 150px;
  margin-right: 2px;

}
 .form-container {
  display: flex;
  flex-direction: column;
    max-width: 500px;

  }

.form-container input[type="text"],
.form-container textarea {
    width: 95%;
    margin-bottom: 15px;
    color: #1a1919;
    outline: none;
      padding: 8px;
}


.form-container button {
    width: 100%;
    padding: 10px;
    background-color: #279dd4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
    .title {
      margin: 10px 0px 30px 0px;

    }

.main-container {

    display: flex;
    flex-wrap: wrap; 
    gap: 30px;
    margin-top: 15px;
    justify-content: center;
    align-items: center; 
    

}
.blurred-container {
  position: absolute; /* Or relative, depending on layout */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the container */
  padding: 20px;
  background: rgba(255, 255, 255, 0.5); /* Semi-transparent background */
  /* Optional: shadow for better visibility */
}

.content {
    flex: 1 1 200px;
    min-width: 300px;
    max-width: 500px;
    padding: 10px 15px 15px 15px;
    margin: 20px;
    box-sizing: border-box;



}


  
 

</style>
