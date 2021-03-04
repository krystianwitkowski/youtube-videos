<template>
  <section class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-wrapper">
        <div class="sorts">
          <h3 class="sorts__title">SORT</h3>
          <nav class="sorts-links">
            <li class="sorts-name">
              <a @click.prevent="getDate" class="sorts-name-link" href="#">Date</a>
            </li>
            <li class="sorts-name">
              <a @click.prevent="getRating" class="sorts-name-link" href="#">Rating</a>
            </li>
            <li class="sorts-name">
              <a @click.prevent="getViews" class="sorts-name-link" href="#">Views</a>
            </li>
            <li class="sorts-name">
              <a @click.prevent="getRelevance" class="sorts-name-link" href="#">Relevance</a>
            </li>
            <li class="sorts-name">
              <a @click.prevent="getTitle" class="sorts-name-link" href="#">Title</a>
            </li>
          </nav>
        </div>
        <a @click="getLogout" class="logout" href="#">Log out</a>
      </div>
    </aside>
    <main class="videos-content">
    <div @scroll="onScroll" class="videos-content-wrapper">
      <input v-model="search" class="search" href="#" @keyup.enter="serachEnter" placeholder="Search" />
      <div @click="activeFrame" v-for="(item, index) in items" :key="index" :class="'videos video-' + index">
        <div class="video-row-wrapper">
          <figure class="videos-media">
              <img
                class="videos-media"
                :src="item.snippet.thumbnails.medium.url"
                alt="ytube media"
              />
            </figure>
            <div class="videos-wrapper">
              <h2 class="videos__title">
                {{ item.snippet.title }}
              </h2>
              <div class="videos-info">
                <span class="videos-info-author">{{
                  item.snippet.channelTitle
                }}</span>
                <span class="videos-info-views">{{ getViewCount(item) }}</span>
                <span class="videos-info-date">{{
                  getPublishTime(item.snippet.publishedAt)
                }}</span>
                <p class="videos-description">
                  {{ getDescription(item.snippet.description) }}
                </p>
              </div>
            </div>
        </div>
        <Video :id-video="item.id"/>
      </div>
    </div>
    </main>
  </section>
</template>

<script>
import Video from './Video.vue';

export default {
  components: {
    Video
  },
  computed: {
    items(){
      return this.$store.state.items;
    },
    search: {
      get(){
        return this.$store.state.search;
      },
      set(value){
        this.$store.commit('setSearch', { value })
      }
    }
  },
  methods: {
    activeFrame(e){
      const videos = document.querySelectorAll('.videos');

      return ([...videos].map(video => video.lastElementChild.classList.remove('video-show')), e.currentTarget.lastElementChild.classList.add('video-show'));
    },
    async getFirstSearchList(){
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.$store.state.search}&order=${this.$store.state.order}&type=video&maxResults=5&key=AIzaSyCUiYXkj5-rXRnmHGfDu0GHuYlX4evYRnk`

      const promise = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = promise.json();

      return result;
    },

    async getFirstVideosViews(){
      const searchList = await this.getFirstSearchList();
      const videosId = [...searchList.items].map(item => item.id.videoId).join(',');

      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videosId}&key=AIzaSyCUiYXkj5-rXRnmHGfDu0GHuYlX4evYRnk`

      const promise = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const videos = await promise.json();

      this.$store.commit('addNextPageToken', { nextPageToken: searchList.nextPageToken })
      this.$store.commit('addItems', { items: [...videos.items] })
    },

    getFirstPage(){
      this.getFirstVideosViews();
    },

    getPublishTime(time){
      return time.slice(0, time.indexOf('T'));
    },

    getDescription(description){
      return `${description.slice(0, 244)}...`
    },

    getViewCount(item){
      return `${Number(item.statistics.viewCount).toLocaleString()}`;
    },

    async getScrollSearchList(){
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.$store.state.search}&order=${this.$store.state.order}&pageToken=${this.$store.state.nextPageToken}&type=video&maxResults=5&key=AIzaSyCUiYXkj5-rXRnmHGfDu0GHuYlX4evYRnk`

      const promise = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = promise.json();

      return result;
    },

    async getScrollVideosViews(){
      const searchList = await this.getScrollSearchList();
      const videosId = [...searchList.items].map(item => item.id.videoId).join(',');

      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videosId}&key=AIzaSyCUiYXkj5-rXRnmHGfDu0GHuYlX4evYRnk`

      const promise = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const videos = await promise.json();

      this.$store.commit('addNextPageToken', { nextPageToken: searchList.nextPageToken })
      this.$store.commit('addItems', { items: [...videos.items], scroll: true })
    },

    onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.getScrollVideosViews();
      }
    },
    getDate(e){
      this.$store.commit('setOrder', { order: e.target.textContent.toLowerCase()})
      this.getFirstVideosViews()
    },
    getRating(e){
      this.$store.commit('setOrder', { order: e.target.textContent.toLowerCase()})
      this.getFirstVideosViews()
    },
    getViews(){
      this.$store.commit('setOrder', { order: 'viewCount'})
      this.getFirstVideosViews()
    },
    getRelevance(e){
      this.$store.commit('setOrder', { order: e.target.textContent.toLowerCase()})
      this.getFirstVideosViews()
    },
    getTitle(e){
      this.$store.commit('setOrder', { order: e.target.textContent.toLowerCase()})
      this.getFirstVideosViews()
    },

    serachEnter(){
      this.getFirstVideosViews()
    },
    getLogout(){
      localStorage.removeItem('tokens');
      this.$router.push('/')
    }

  },

  mounted(){
    this.getFirstPage();
  }
};
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 10rem 68.4rem;
  justify-content: center;
  color: #606060;
  font-size: 1.3rem;
  font-weight: 300;
  height: 100%;
}

.sidebar {
  text-align: right;
  height: 100vh;
}

.sidebar-wrapper {
  position: fixed;
  bottom: 2.8rem;
}

.sorts {
  margin-bottom: 14.5rem;
}

.sorts-links {
  line-height: 1.8;
}

.sorts__title {
  text-transform: uppercase;
  color: #111111;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

.sorts-name {
  list-style-type: none;
}

.sorts-name-link {
  text-decoration: none;
  color: inherit;
}

.logout {
  text-decoration: none;
  color: inherit;
  display: block;
}

.logout {
  margin-bottom: 8.5rem;
}

.search {
  width: 100%;
  outline: 0;
  border: none;
  font-size: 1.5rem;
  color: #a0a0a0;
  height: 6.1rem;
  font-family: inherit;
  font-weight: 300;
  padding: 2rem;
  position: fixed;
  top: 0;
}

::placeholder {
  color: #a0a0a0;
}

.videos__title {
  color: #030303;
  font-size: 1.6rem;
}

.videos {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.videos:hover .videos__title {
  color: #4693fb;
  text-decoration: underline;
}

.videos:nth-child(2) {
  margin-top: 6.1rem;
}

.videos:nth-child(1n + 3) {
  margin-top: 2rem;
}

.videos__title {
  line-height: 1.125;
}

.videos-media {
  max-width: 24.6rem;
}

.videos-wrapper {
  margin-left: 2.4rem;
  padding-top: 0.5rem;
}

.videos-info {
  line-height: 1.385;
  margin-top: 0.5rem;
}

.videos-info-views {
  margin-left: 1.2rem;
}

.videos-info-date {
  margin-left: 1.2rem;
}

.videos-description {
  margin-top: 0.9rem;
}

.videos-content {
  position: relative;
  left: -1.7rem;
  overflow-x: hidden;
}

.videos-content-wrapper {
  overflow-y: scroll;
  position: relative;
  left: 1.7rem;
  height:100%;
}

.video-row-wrapper {
  display: flex;
  flex-direction: row;
}
</style>
