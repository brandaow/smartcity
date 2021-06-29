<template>
  <v-container fluid>
    <v-row>
      <v-col cols="5">
        <v-btn block class="white--text" color="light-blue darken-4" @click="showAnnounce = true"><v-icon>add</v-icon></v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn block class="white--text" color="grey darken-3" @click="showFilter = true"><v-icon>search</v-icon></v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn block class="white--text" color="grey darken-3" @click="showInfo = true"><v-icon>info</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row v-if="showFilterList.show" justify="center" align="center" class="pl-2 pr-1">
      <span><v-icon class="mr-1">filter_list</v-icon><strong>Publicações de:</strong> {{ this.showFilterList.location | trimLength }}</span>
      <v-spacer></v-spacer>
      <v-btn color="light-blue darken-4" text @click="clearFilter()">Limpar</v-btn>
    </v-row>
    <div v-if="!showFilterList.show">
      <v-card class="mt-3 mb-5" color="grey lighten-2" v-for="ad in organicAds" :key="ad.id">
        <v-carousel hide-delimiters height="200px">
          <v-carousel-item v-for="(item,i) in ad.photos" :key="i" :src="item"></v-carousel-item>
        </v-carousel>
        <div @click="viewAd(ad)">
          <v-card-title class="pb-0">
            <v-row>
              <v-col cols="9">
                {{ ad.title }}
              </v-col>
              <v-col cols="3">
                <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                  R$ {{ ad.price }}
                </v-alert>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-subtitle>
            <v-icon class="mr-2">place</v-icon>{{ ad.location }}
          </v-card-subtitle>
        </div>
      </v-card>
    </div>
    <div v-if="showFilterList.show">
      <v-card class="mt-3 mb-5" color="grey lighten-2" v-for="ad in filterAds" :key="ad.id" @click="viewAd(ad)">
        <v-carousel hide-delimiters height="200px">
          <v-carousel-item v-for="(item,i) in ad.photos" :key="i" :src="item"></v-carousel-item>
        </v-carousel>
        <v-card-title class="pb-0">
          <v-row>
            <v-col cols="9">
              {{ ad.title }}
            </v-col>
            <v-col cols="3">
              <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                R$ {{ ad.price }}
              </v-alert>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle>
          <v-icon class="mr-2">place</v-icon>{{ ad.location }}
        </v-card-subtitle>
      </v-card>
    </div>
    <div v-if="organicAds.length == 0  || showFilterList.empty" class="mt-8 text-center">
      <v-icon large class="mb-4">sentiment_dissatisfied</v-icon>
      <p>Ops, parece que não há nada por aqui no momento, então seja o primeiro e clique no botão de adicionar acima.</p>
    </div>
    <v-dialog v-model="showAnnounce">
      <v-card>
        <v-card-title>Publicar anúncio</v-card-title>
        <v-card-text class="pt-2 pb-0">
          <form @submit.prevent>
            <v-file-input small-chips multiple prepend-icon="" :loading="announceForm.photosLoading" label="Fotos" accept="image/*" type="file" @change="uploadPhotos($event)" id="photo"></v-file-input>
            <v-text-field dense v-model.trim="$v.announceForm.title.$model" :error="$v.announceForm.title.$error" type="text" label="Título" id="title" autocomplete="off" />
            <v-autocomplete :items="districts" item-text="name" v-model.trim="announceForm.location" id="location" label="Localização"></v-autocomplete>
            <v-textarea dense v-model.trim="announceForm.content" type="text" label="Descrição" id="content" rows="2" autocomplete="off"></v-textarea>
            <v-text-field class="pt-4" dense v-model.trim="$v.announceForm.price.$model" :error="$v.announceForm.price.$error" type="number" label="Valor" id="value" prefix="R$"/>
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="announce()" :disabled="announceForm.title == '' || announceForm.location == '' || announceForm.photosLoading">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showFilter">
      <v-card>
        <v-card-title>Filtrar resultados</v-card-title>
        <v-card-text class="pb-0">
          <v-btn color="light-blue darken-4 white--text" block @click="filter('my')">Meus anúncios</v-btn>
          <p class="pt-4 mb-0 black--text text-center">OU</p>
          <form @submit.prevent>
            <v-autocomplete :items="districts" class="mt-0" item-text="name" v-model.trim="filterForm.location" id="filter" label="Localização"></v-autocomplete>
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="filter('others')" :disabled="filterForm.location == ''" >Pesquisar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showFullAd">
      <v-card>
        <v-card-text class="px-0 pb-0">
          <v-carousel hide-delimiters height="200px" >
            <v-carousel-item v-for="(item,i) in fullAd.photos" :key="i" :src="item"></v-carousel-item>
          </v-carousel>
          <div class="px-4 pt-3">
            <p><strong>{{ fullAd.title }}</strong></p>
            <p>{{ fullAd.content }}</p>
            <p><v-icon class="mr-2">navigation</v-icon><strong>Bairro:</strong> {{ fullAd.location }}</p>
            <p><v-icon class="mr-2">calendar_today</v-icon><strong>Publicado em:</strong> {{ fullAd.createdAt | formatDate }}</p>
            <v-row justify="center" align="center">
              <v-col cols="3">
                <v-avatar :color="fullAd.userPhoto !== '' ? '' : 'grey darken-3'">
                  <img v-if="fullAd.userPhoto !== ''" :src="fullAd.userPhoto">
                  <v-icon v-if="fullAd.userPhoto === ''" color="white">emoji_emotions</v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="9">
                <strong>{{ fullAd.userName }}</strong>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text :href="'tel:' + fullAd.userPhone">Contato</v-btn>
          <v-btn v-if="userProfile.isAdmin || fullAd.userId === userId" color="red darken-4" text @click="showFullAd = false; delAd(fullAd)">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showInfo">
      <v-card>
        <v-card-title class="headline">Ajuda</v-card-title>
        <v-card-text>
          <p class="mb-2">Anuncie aqui produtos locais para venda.</p>
          <p class="mb-2 text-justify">Com intuito de auxiliar os pequenos produtores rurais, este aplicativo permite a divulgação de produtos para toda base de usuários..</p>
          <center>
          <v-row>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/1.jpg"></v-img>
            </v-col>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/2.jpg"></v-img>
            </v-col>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/3.jpg"></v-img>
            </v-col>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/9.jpg"></v-img>
            </v-col>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/11.jpg"></v-img>
            </v-col>
            <v-col cols="3">
              <v-img contain max-width="100" max-height="100" src="../assets/ods/12.jpg"></v-img>
            </v-col>
          </v-row>
          </center>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import { auth, storageRef, organicAdsCollection } from '@/firebase'
import { minLength } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      userId: auth.currentUser.uid,
      announceForm: {
        title: '',
        content: '',
        photos: [],
        photosLoading: false,
        location: '',
        price: 0
      },
      filterForm: {
        location: ''
      },
      uploadTask: '',
      fullAd: {},
      filterAds: {},
      showInfo: false,
      showFilter: false,
      showFullAd: false,
      showAnnounce: false,
      showFilterList: {
        show: false,
        empty: false,
        location: ''
      }
    }
  },
  validations: {
    announceForm: {
      title: {
        minLength: minLength(5)
      },
      price: {
        minLength: minLength(1)
      }
    }
  },
  computed: {
    ...mapState(['districts', 'organicAds', 'userProfile'])
  },
  methods: {
    
    async announce() {
      await organicAdsCollection.add({
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name,
        userPhoto: this.$store.state.userProfile.photo,
        userPhone: this.$store.state.userProfile.phone,
        title: this.announceForm.title,
        content: this.announceForm.content,
        photos: this.announceForm.photos,
        location: this.announceForm.location,
        price: this.announceForm.price,
        isSold: false
      })

      this.announceForm.title = ''
      this.announceForm.content = ''
      this.announceForm.photos = []
      this.announceForm.location = ''
      this.announceForm.price = 0
      this.showAnnounce = false
    },

    async delAd(ad) {
      await organicAdsCollection.doc(ad.id).delete()
        .then(function() {
        })
        .catch(function(e) {
          console.log("ERRO" + e)
        })
    },

    uploadPhotos(e) {
      this.announceForm.photosLoading = true
      let paste = Math.floor(Math.random() * 65536)
      e.forEach((doc, key) => {
        this.uploadTask = storageRef.child('organicPictures/' + '/' + auth.currentUser.uid + '/' + paste + '/' + Math.floor(Math.random() * 65536)).put(doc)
          .then(response => {
            response.ref.getDownloadURL().then(downloadURL => {
              this.announceForm.photos.push(downloadURL)
              if(Object.is(e.length - 1, key)) {
                this.announceForm.photosLoading = false
              }
            })
          })
      })
    },

    async filter(ad) {
      var query = organicAdsCollection

      if(ad === 'others') {
        query = organicAdsCollection
          .where("location", "==", this.filterForm.location)
          .where("isCollected", "==", false)
      }
        
      if(ad === 'my') {
        query = organicAdsCollection
          .where("userId", "==", auth.currentUser.uid)
      }

      await query
        .get()
        .then((querySnapshot) => {
          let organicArray = []

          querySnapshot.forEach(function(doc) {
            let organic = doc.data()
            organic.id = doc.id

            organicArray.push(organic)
          })
          
          this.filterAds = organicArray
          this.showFilterList.show = true
          this.showFilterList.empty = this.filterAds.length ? false : true
        })
        .catch((error) => {
          console.log("Erro: ", error)
        })
     
      this.showFilterList.location = this.filterForm.location ? this.filterForm.location : 'Meus Anúncios'
      this.filterForm.location = ''
      this.showFilter = false
    },

    clearFilter() {
      this.filterAds = {}
      this.showFilterList.show = false
      this.showFilterList.empty = false
      this.showFilterList.location = ''
    },

    viewAd(ad) {
      this.fullAd = ad                        
      this.fullAd.userName = this.fullAd.userName.split(' ')[0] + ' ' + ((this.fullAd.userName.split(' ').length > 1) ? this.fullAd.userName.split(' ').reverse()[0] : '')
      this.showFullAd = true
    } 
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }

      let date = val.toDate()
      moment.locale('pt-BR')
      return moment(date).format('DD/MM/YY à\\s HH:mm')
    },
    trimLength(val) {
      if (val.length < 12) { return val }
      return `${val.substring(0, 12)}...`
    }
  }
}
</script>

