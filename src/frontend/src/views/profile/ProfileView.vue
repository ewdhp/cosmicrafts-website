<template>
      <div class="profile-container">
       <!-- SVG Definition for ClipPath -->
    <svg width="0" height="0">
      <defs>
        <clipPath id="bannerClip">
          <circle cx="88" cy="87" r="74" />
        </clipPath>
        <clipPath id="bannerClip2">
          <circle cx="71" cy="69" r="54" />
        </clipPath>
      </defs>
    </svg>

    <!-- Banner with the masked circle using the SVG clip-path -->
    <div class="profile-banner">
      <div class="banner-mask"></div>
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
          
            <button class="more-btn"><img src="@/assets/icons/more_icon.svg" /></button>
            <button class="dm-btn"><img src="@/assets/icons/dm_icon.svg" /></button>
            <button class="follow-btn">Following</button>
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
          timePlayed: "40 Hrs",
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
      padding: 1rem;
      margin-top: 2rem;
    }
    
    /* Banner */
    .profile-banner {
  position: relative;
  width: 100%;
  height: 8rem;
}

    .profile-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }

.banner-mask {
  position: absolute;
  top: 2.5rem;
  width: 100%;
  height: 100%;
  background: rgba(28, 36, 44, 1);
  clip-path: url(#bannerClip); /* Use SVG clip-path */
  z-index: 0;
}

    .avatar-wrapper {
      position: absolute;
      top: -4rem;
      left: 1.5rem;
      width: 128px;
      height: 128px;
      overflow: hidden;
      border-radius: 50%;
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
      padding-top: 3rem;
      position: relative;
      text-align: center;
    }
    
    .profile-info {
      text-align: left;
      margin-left: 0;
      width: 100%;
      padding-top: .5rem;
    }
    
    .username-row {
      display: flex;
      align-items: center;
    }
    
    .profile-title {
      font-size: 1.5rem;
      color: gray;
      margin-bottom: 1px;
      font-weight: 600;
    }
    
    .profile-username {
      font-size: 2.5rem;
      margin: 0;
      padding: 0;
      font-weight: 800;
    }
    
    .verified-icon {
      margin-left: .5rem;
      width: 1.5rem;
    }
    
    .profile-id {
      display: flex;
      align-items: center;
    }

    .principal-id-label {
  color: #aaa; /* Label is lighter */
  font-weight: 500;
  margin-right: .5rem;
}

.principal-id-text {
  color: #00C2FF; /* The actual Principal ID stands out */
  font-weight: 600;
}
    
    .principal-icon {
      width: 1rem;
      margin-right: .25rem;
    }
    
    .copy-icon {
      width: 1rem;
      margin-left: .25rem;
      cursor: pointer;
    }
    
    .profile-actions {
      display: flex;
      gap: .5rem;
      position: absolute;
      right: .25rem;
      top: .5rem;
    }

    .follow-btn{
      border-radius: 10px;
      width: 8rem;
    }

.dm-btn,
.more-btn {
  border-radius: 50%;
  width: 42px; /* Ensures consistent size */
  height: 42px; /* Ensures consistent size */
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
      font-weight: 600;
      font-size: .9rem;
      font-family: 'Montserrat', sans-serif;
    }
    
    .dm-btn img,
.more-btn img {
  width: 1.25rem; /* SVG size inside the button */
  height: 1.25rem;
}
    
    .follow-btn:hover,
    .dm-btn:hover,
    .more-btn:hover {
      background-color: #ffffff55;
    }
    
    /* Links and Info */
    .profile-description {
      margin: 4px 0;
      font-size: 1rem;
      
    }
    
    .profile-links {
      display: flex;
      gap: 1rem;
      font-size: 1rem;
      color:#ADADAD;
    }

    .website {
      color: #00C2FF; /* Set to the required color */
      text-decoration: none; /* Remove underline */
      
      }

      .profile-links img {
      width: 1rem;
      height: 1rem;
      margin-right: .25rem;
      margin-bottom: .25rem;
      vertical-align: middle; /* Ensures alignment with the text */
      }
    

    .followers-count {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .followers-count span {
      color: white; /* Set the color for the numbers */
      }

      .followers-count span:nth-child(2n) {
      color: #ADADAD; /* Gray color for the text */
      font-size: 1rem;
      
      }
    
    .followers-icons {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: .25rem;
      font-size: .75rem;
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
      padding: .5rem;
      margin-top: .5rem;
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
      gap: 2rem;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
    }
    
    .stat-label {
      font-size: 1rem;
      color: #888;
    }
    

    @media screen and (max-width: 480px) {
      .profile-title {
        font-size: 1.25rem;
      }
    
      .profile-username {
        font-size: 2rem;
      }
    
      .profile-id {
        font-size: 1rem;
      }


      .profile-description {
      font-size: .75rem;
    }
    
      .profile-stats .stat-label {
        font-size: .5rem;
      }

      .follow-btn{
        width: 88px;
      }
      .followers-count {
      font-size: 1rem;
    }
    
      .profile-stats .stat-value {
        font-size: 1.5rem;
      }

      .profile-links {
      display: flex;
      gap: .5rem;
      font-size: .55rem;
    }

    .banner-mask {
  position: absolute;
  top: 2.5rem;
  background: rgba(28, 36, 44, 1);
  clip-path: url(#bannerClip2);
  z-index: 0;
}

    .avatar-wrapper {
      width: 92px;
      height: 92px;
    }
    
    .dm-btn,
.more-btn {
  width: 36px; /* Ensures consistent size */
  height: 36px; /* Ensures consistent size */

}
.profile-info {
      padding-top: 0rem;
    }
    }
    </style>
    