<template>
      <div class="profile-container">
        <!-- Banner -->
        <div class="profile-banner">
          <img src="@/assets/images/banner.jpg" alt="Profile Banner" class="banner-img" />
        </div>
    
        <!-- Avatar, Username, Title, and Buttons -->
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img :src="selectedAvatar" alt="Avatar" class="profile-avatar" />
          </div>

          <!-- Profile Info (Adjusted for checkmark next to username) -->
          <div class="profile-info">
            <h1 class="profile-title">{{ title }}</h1>
            <h2 class="profile-username">{{ username }}</h2>
            <img src="@/assets/icons/verified_icon01.svg" alt="Verified" class="verified-icon" />
            <div class="profile-id">
              <span>Principal ID:</span> <span>{{ principalId }}</span>
              <img src="@/assets/icons/copy_icon01.svg" alt="Copy ID" class="copy-icon" />
            </div>
            <p class="profile-description">{{ description }}</p>
            <p class="profile-links">
              <span class="location"><img src="@/assets/icons/location_icon.svg" /> {{ location }}</span>
              <a :href="website" class="website">
                <img src="@/assets/icons/link_icon.svg" /> {{ website }}
              </a>
              <span class="joined"><img src="@/assets/icons/calendar_icon.svg" /> Joined {{ joinedDate }}</span>
            </p>
          </div>
          <!-- Buttons: Follow, DM, More -->
          <div class="profile-actions">
            <button class="follow-btn">Following</button>
            <button class="dm-btn"><img src="@/assets/icons/dm_icon.svg" /></button>
            <button class="more-btn"><img src="@/assets/icons/more_icon.svg" /></button>
          </div>
        </div>
    
        <!-- Follow Section -->
        <div class="profile-follow-section">
          <div class="followers-count">
            <span>{{ followingCount }} Following</span> • <span>{{ followersCount }} Followers</span>
          </div>
          <div class="followers-icons">
            <img v-for="follower in followers" :src="follower.avatar" :key="follower.id" class="follower-avatar" />
            <span>followed by X, Y, Z and {{ followersCount }} others</span>
          </div>
        </div>
    
        <!-- Profile Menu -->
        <div class="profile-menu">
          <button @click="showSection('statistics')" :class="{ active: activeSection === 'statistics' }">Statistics</button>
          <button @click="showSection('nfts')" :class="{ active: activeSection === 'nfts' }">NFTs</button>
          <button @click="showSection('achievements')" :class="{ active: activeSection === 'achievements' }">Achievements</button>
          <button @click="showSection('posts')" :class="{ active: activeSection === 'posts' }">Posts</button>
        </div>
    
        <!-- Statistics Section -->
        <div v-if="activeSection === 'statistics'" class="profile-stats">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ gamesPlayed }}</span>
              <span class="stat-label">Games Played</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ gamesWon }}</span>
              <span class="stat-label">Games Won</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ damageDone }}</span>
              <span class="stat-label">Damage Done</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ energySpent }}</span>
              <span class="stat-label">Energy Spent</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ timePlayed }}</span>
              <span class="stat-label">Time Played</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ cxp }}</span>
              <span class="stat-label">CXP</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script>
    import avatar1 from '@/assets/avatars/Avatar_01.jpg';
    import avatar2 from '@/assets/avatars/Avatar_02.jpg';
    
    export default {
      data() {
        return {
          selectedAvatarIndex: 0,
          avatarSrcArray: [avatar1, avatar2],
          title: "Starbound Initiate",
          username: "BiZKiT",
          principalId: "i7okk..afl",
          description: "Cosmicrafts Founder Game Designer, Developer, UX/UI and Tech Artist @cosmicrafts",
          joinedDate: "Sept 2024",
          location: "Mexico",
          website: "https://cosmicrafts.com",
          followersCount: 2200,
          followingCount: 800,
          followers: [
            { id: 1, avatar: avatar1 },
            { id: 2, avatar: avatar2 },
            { id: 3, avatar: avatar1 },
          ],
          activeSection: "statistics",
          gamesPlayed: 120,
          gamesWon: 60,
          damageDone: "124M",
          energySpent: "12.5K",
          timePlayed: "40 hours",
          cxp: "44.6K",
        };
      },
      methods: {
        showSection(section) {
          this.activeSection = section;
        },
      },
      computed: {
        selectedAvatar() {
          return this.avatarSrcArray.length > 0 ? this.avatarSrcArray[this.selectedAvatarIndex] : "";
        },
      },
    };
    </script>
    
    <style scoped>
    .profile-container {
      font-family: 'Arial', sans-serif;
      color: #fff;
      padding: 20px;
    }
    
    /* Banner */
    .profile-banner {
      width: 100%;
      height: 200px; /* Fixed height */
      position: relative; /* Allow avatar to be placed over it */
      overflow: hidden; /* To crop the banner if it overflows */
      }
    
      .profile-banner img {
            width: 100%;
            height: 100%; /* Maintain the aspect ratio and fill the space */
            object-fit: cover; /* Crop the image if necessary to fit */
            }
    
    /* Avatar Masked */
    /* Avatar Masked */
    .avatar-wrapper {
      position: absolute;
      top: -50px;
      left: 20px;
      width: 120px;
      height: 120px;
      overflow: hidden;
      border-radius: 50%;
      border: 4px solid #fff;
    }

      .profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the avatar fits within the circle */
}
    
    /* Responsive Info Section */
    .profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px; /* Adjusted to accommodate the avatar */
  position: relative;
  text-align: center;
}
    
.profile-info {
  text-align: left;
  margin-left: 0;
  width: 100%;
}

.username-row {
    display: flex;
    align-items: center;
}
    
.profile-title {
    font-size: 22px;
    font-weight: bold;
    color: gray; /* Make title gray */
}
    
    .profile-username {
      font-size: 36px;
      font-weight: bold;
    }
    
    .verified-icon {
      width: 20px;
      margin-left: 10px;
    }
    
    /* Principal ID & More */
    .profile-id {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #888;
    }

    .principal-icon {
      width: 14px;
      margin-right: 5px;
      }
      
    .copy-icon {
      width: 14px;
      margin-left: 5px;
      cursor: pointer;
    }
    
    /* Buttons: Follow, DM, More */
    .profile-actions {
  display: flex;
  gap: 5px;
  position: absolute;
  right: 20px;
  top: 40px;
}
    
    .follow-btn,
    .dm-btn,
    .more-btn {
      padding: 10px;
      border: none;
      background-color: #333;
      color: white;
      cursor: pointer;
      border-radius: 5px;
    }
    
    .follow-btn:hover,
    .dm-btn:hover,
    .more-btn:hover {
      background-color: #444;
    }
    
    /* Links and Info */
    .profile-description {
      margin: 4px 0;
    }
    
    .profile-links {
      display: flex;
      gap: 12px;
    }
    
    .location img,
    .website img,
    .joined img {
      width: 12px;
      margin-right: 5px;
    }
    
    .profile-follow-section {
      margin: 10px 0;
    }
    
    .followers-count {
      font-size: 12px;
    }
    
    .followers-icons {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .follower-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    
    /* Menu */
    .profile-menu {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #333;
      margin-bottom: 20px;
    }
    
    .profile-menu button {
      background: none;
      border: none;
      font-size: 16px;
      color: white;
      cursor: pointer;
      padding: 10px;
    }
    
    .profile-menu button.active {
      border-bottom: 2px solid #00ccff;
    }
    
    /* Stats */
    .profile-stats {
      padding: 20px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
    }
    
    .stat-label {
      font-size: 14px;
      color: #888;
    }
    
    /* Media Queries for responsiveness */
    /* Media Queries for mobile responsiveness */
@media screen and (max-width: 768px) {

    .profile-title {
        font-size: 18px; /* Smaller font size */
    }

    .profile-username {
        font-size: 28px; /* Smaller font size */
    }

    .verified-icon {
        width: 16px; /* Smaller verified icon */
    }

    .profile-id {
        font-size: 12px; /* Smaller text for Principal ID */
    }

    .follow-btn, .dm-btn, .more-btn {
        padding: 8px; /* Slightly smaller buttons */
    }

    .profile-stats .stat-value {
        font-size: 20px; /* Reduced stat font size */
    }

    .profile-stats .stat-label {
        font-size: 12px; /* Reduced stat label size */
    }
}

    </style>
    