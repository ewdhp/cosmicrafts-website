<template>
  <div class="friend-container">
    <div class="avatar">
      <img :src="avatarUrl" alt="Avatar" />
    </div>
    <div class="name">{{ name }}</div>
    <div class="btnAdd"><button class="add-friend-btn">Add Friend</button></div>
    
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: String,
    name: String,
  },
};
</script>

<style scoped>
.friend-container {
  display: flex;
  align-items: center;
  justify-content: center;
border: 1px solid;
  padding: 2px;
  border-radius: 5px;
}

.avatar {
  display: flex;
  border: 1px solid;
  margin: 2px;
}

.avatar img {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.name {
  display: flex;
  font-weight: bold;
  border: 1px solid;
  margin: 2px;
}
.btnAdd {
  margin: 2px;
}

.add-friend-btn {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.add-friend-btn:hover {
  background-color: #3e8e41;
}
</style>