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
    
          <!-- Profile Info -->
          <div class="profile-info">
            <h1 class="profile-title">{{ title }}</h1>
            <div class="username-row">
            <h2 class="profile-username">{{ username }}</h2>
            <img src="@/assets/icons/verified_icon01.svg" alt="Verified" class="verified-icon" />
            </div>
            <div class="profile-id">
            <img src="@/assets/login/icp_logo.svg" alt="Principal Icon" class="principal-icon" />
            <span class="principal-id-label">Principal ID:</span>
            <span class="principal-id-text">{{ principalId }}</span>
            <img src="@/assets/icons/copy_icon01.svg" alt="Copy ID" class="copy-icon" />
            </div>
            <p class="profile-description">{{ description }}</p>
            <p class="profile-links">
            <span class="location">
                  <img src="@/assets/icons/location_icon.svg" /> {{ location }}
            </span>
            <a :href="website" class="website">
                  <img src="@/assets/icons/link_icon.svg" /> {{ website }}
            </a>
            <span class="joined">
                  <img src="@/assets/icons/calendar_icon.svg" /> Joined {{ joinedDate }}
            </span>
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
        <span>{{ followingCount }}</span> <span>Following</span> • <span>{{ followersCount }}</span> <span>Followers</span>
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
      padding: 2px;
    }
    
    /* Banner */
    .profile-banner {
      width: 100%;
      height: 128px;
      position: relative;
      overflow: hidden;
    }
    
    .profile-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
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
      object-fit: cover;
      
    }
    
    /* Responsive Info Section */
    .profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 64px;
      position: relative;
      text-align: center;
    }
    
    .profile-info {
      text-align: left;
      margin-left: 0;
      width: 100%;
      padding-top: 4px;
    }
    
    .username-row {
      display: flex;
      align-items: center;
    }
    
    .profile-title {
      font-size: 24px;
      color: gray;
      margin-bottom: 2px;
      font-weight: 600;
    }
    
    .profile-username {
      font-size: 36px;
      margin: 0;
      padding: 0;
      font-weight: 800;
    }
    
    .verified-icon {
      margin-left: 8px;
    }
    
    .profile-id {
      display: flex;
      align-items: center;
    }

    .principal-id-label {
  color: #aaa; /* Label is lighter */
  font-weight: 500;
  margin-right: 8px;
}

.principal-id-text {
  color: #00C2FF; /* The actual Principal ID stands out */
  font-weight: 600;
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
    
    .profile-actions {
      display: flex;
      gap: 4px;
      position: absolute;
      right: 20px;
      top: 12px;
    }

    .follow-btn{
      border-radius: 10px;
      font-weight: bold;
    }
    .dm-btn,
.more-btn {
  border-radius: 50%;
  width: 40px; /* Ensures consistent size */
  height: 40px; /* Ensures consistent size */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff23;
  cursor: pointer;
  border: 1px solid #ffffff1d;
}
    
    .follow-btn,
    .dm-btn,
    .more-btn {
      padding: 8px;
      border: none;
      background-color: #ffffff23;
      color: white;
      cursor: pointer;
      border: .25px solid #ffffff1d;
      font-weight: bold;
    }
    
    .dm-btn img,
.more-btn img {
  width: 18px; /* SVG size inside the button */
  height: 18px;
}
    
    .follow-btn:hover,
    .dm-btn:hover,
    .more-btn:hover {
      background-color: #ffffff55;
    }
    
    /* Links and Info */
    .profile-description {
      margin: 4px 0;
      font-size: 12px;
      
    }
    
    .profile-links {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color:#ADADAD;
    }

    .website {
      color: #00C2FF; /* Set to the required color */
      text-decoration: none; /* Remove underline */
      
      }

      .profile-links img {
      width: 12px; /* Adjust as necessary */
      height: 12px; /* Ensure a uniform height as well */
      margin-right: 2px;
      vertical-align: middle; /* Ensures alignment with the text */
      }
    

    .followers-count {
      font-size: 16px;
      font-weight: 600;
    }

    .followers-count span {
      color: white; /* Set the color for the numbers */
      }

      .followers-count span:nth-child(2n) {
      color: #ADADAD; /* Gray color for the text */
      font-size: 14px;
      
      }
    
    .followers-icons {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #ADADAD;
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
      margin-bottom: 16px;
      
    }
    
    .profile-menu button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 12px;
      margin-top: 12px;
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
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
    
    /* Media Queries for mobile responsiveness */
    @media screen and (max-width: 768px) {
      .profile-title {
        font-size: 18px;
      }
    
      .profile-username {
        font-size: 28px;
      }
    
      .verified-icon {
        width: 24px;
      }
    
      .profile-id {
        font-size: 12px;
      }
    
      .follow-btn,
      .dm-btn,
      .more-btn {
        padding: 4px;
      }
    
      .profile-stats .stat-value {
        font-size: 24px;
      }
    
      .profile-stats .stat-label {
        font-size: 12px;
      }
    }
    </style>
    