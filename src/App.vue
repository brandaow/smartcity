<template>
  <v-app>
    <SiteNav v-if="showNav"></SiteNav>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return this.userProfile.name !== '' && typeof this.userProfile !== 'undefined'
    }
  }
}
</script>