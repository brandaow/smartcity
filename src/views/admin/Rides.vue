<template>
  <v-container fluid v-if="userProfile.isAdmin && userProfile.adminPermissions.rides">
    <v-btn block class="white--text" color="grey darken-3" @click="showFilter = true"><v-icon>search</v-icon></v-btn>
    <v-row v-if="showFilterList.show" justify="center" align="center" class="pl-2 pr-1">
      <span><v-icon class="mr-1">filter_list</v-icon><strong>Caronas para:</strong> {{ this.showFilterList.end | trimLength }}</span>
      <v-spacer></v-spacer>
      <v-btn color="light-blue darken-4" text @click="clearFilter()">Limpar</v-btn>
    </v-row>
    <div v-if="!showFilterList.show">
      <v-card class="mt-3 mb-5" color="grey lighten-2" v-for="ride in rides" :key="ride.id" @click="viewRide(ride)">
        <v-card-title class="pb-0">
          <v-row class="subtitle-2">
            <v-col cols="9">
              <v-icon class="mr-2">place</v-icon>{{ ride.end }}
            </v-col>
            <v-col cols="3">
              <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                R$ {{ ride.price }}
              </v-alert>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle class="ml-1 pb-0">
          <v-row class="subtitle-2">
            <v-col cols="9" class="pt-0 pb-0">
              De: {{ ride.start }}
            </v-col>
            <v-col cols="3" class="pt-0 pb-0">
              <v-btn color="red darken-4" class="text-center px-0 py-1">
                <v-icon color="white">delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-list-item class="grow mx-2">
          <v-list-item-avatar :color="ride.userPhoto !== '' ? '' : 'grey darken-3'">
            <img v-if="ride.userPhoto !== ''" :src="ride.userPhoto">
            <v-icon v-if="ride.userPhoto === ''" color="white">emoji_emotions</v-icon>
          </v-list-item-avatar>
          <v-row align="center" justify="end">
            <v-icon class="mr-2">calendar_today</v-icon>
            <span class="subheading mr-2">{{ ride.when | formatDate | capitalize }}</span>
          </v-row>
        </v-list-item>
      </v-card>
    </div>
    <div v-if="showFilterList.show"> 
      <v-card class="mt-3 mb-5" color="grey lighten-2" v-for="ride in filterRides" :key="ride.id" @click="viewRide(ride)">
        <v-card-title class="pb-0">
          <v-row class="subtitle-2">
            <v-col cols="9">
              <v-icon class="mr-2">place</v-icon>{{ ride.end }}
            </v-col>
            <v-col cols="3">
              <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                R$ {{ ride.price }}
              </v-alert>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle class="ml-1">
          De: {{ ride.start }}
        </v-card-subtitle>
        <v-list-item class="grow mx-2">
          <v-list-item-avatar :color="ride.userPhoto !== '' ? '' : 'grey darken-3'">
            <img v-if="ride.userPhoto !== ''" :src="ride.userPhoto">
            <v-icon v-if="ride.userPhoto === ''" color="white">emoji_emotions</v-icon>
          </v-list-item-avatar>
          <v-row align="center" justify="end">
            <v-icon class="mr-2">calendar_today</v-icon>
            <span class="subheading mr-2">{{ ride.when | formatDate | capitalize }}</span>
          </v-row>
        </v-list-item>
      </v-card>
    </div>
    <div v-if="rides.length == 0 || showFilterList.empty" class="mt-8 text-center">
      <v-icon large class="mb-4">sentiment_dissatisfied</v-icon>
      <p>Ops, parece que não há caronas no momento.</p>
    </div>
    <v-dialog v-model="showFilter">
      <v-card>
        <v-card-title>Filtrar resultados</v-card-title>
        <v-card-text class="pb-0">
          <form @submit.prevent>
            <v-autocomplete :items="districts" item-text="name" v-model.trim="filterForm.end" id="end2" label="Destino"></v-autocomplete>
            <v-autocomplete :items="districts" item-text="name" v-model.trim="filterForm.start" id="start2" label="Origem (Opcional)"></v-autocomplete>
            <v-dialog ref="dialogDate" v-model="dateModal" :return-value.sync="filterForm.date" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="filterForm.date" label="Data (Opcional)" prepend-icon="event" readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filterForm.date" scrollable :min="filterForm.dateMin">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dateModal = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogDate.save(filterForm.date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="filter()" :disabled="filterForm.end == ''" >Pesquisar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showRide">
      <v-card>
        <v-card-text class="pt-5 pb-0">
          <p><v-icon class="mr-2">place</v-icon><strong>Destino:</strong> {{ fullRide.end }}</p>
          <p><v-icon class="mr-2">navigation</v-icon><strong>Origem:</strong> {{ fullRide.start }}</p>
          <p><v-icon class="mr-2">calendar_today</v-icon><strong>Data:</strong> {{ fullRide.when | formatDate | capitalize }}</p>
          <v-row justify="center" align="center">
            <v-col cols="3">
              <v-avatar :color="fullRide.userPhoto !== '' ? '' : 'grey darken-3'">
                <img v-if="fullRide.userPhoto !== ''" :src="fullRide.userPhoto">
                <v-icon v-if="fullRide.userPhoto === ''" color="white">emoji_emotions</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9">
              <strong>{{ fullRide.userName }}</strong>
              <br>
              Membro desde {{ fullRide.userSince | formatSince | capitalize }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text :href="'tel:' + fullRide.userPhone">Contato</v-btn>
          <v-btn color="red darken-4" text @click="del(fullRide)">Apagar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { auth, ridesCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      filterForm: {
        start: '',
        end: '',
        date: null,
        dateMin: new Date().toISOString().substr(0, 10)
      },
      filterRides: {},
      fullRide: {},
      showRide: false,
      showFilter: false,
      showFilterList: {
        show: false,
        empty: false,
        end: ''
      },
      timeModal: false,
      dateModal: false
    }
  },
  computed: {
    ...mapState(['districts', 'userProfile', 'rides'])
  },
  methods: {

    async del(ride) {
      console.log(this.$route.meta.title)
      //ridesCollection.doc(ride.id).delete()
      //this.showRide = false
    },

    async filter() {
      let whenValue = new Date()

      if(this.filterForm.date)
        whenValue = new Date(this.filterForm.date)

      var query = ridesCollection
        .where("end", "==", this.filterForm.end)
        .where("when", ">=", whenValue)

      if(this.filterForm.start) 
        query = ridesCollection
          .where("start", "==", this.filterForm.start)
          .where("end", "==", this.filterForm.end)
          .where("when", ">=", whenValue)
      
      await query
        .get()
        .then((querySnapshot) => {
          let ridesArray = []

          querySnapshot.forEach(function(doc) {
            let ride = doc.data()
            ride.id = doc.id

            ridesArray.push(ride)
          })
          
          this.filterRides = ridesArray
          this.showFilterList.show = true
          this.showFilterList.empty = this.filterRides.length ? false : true
        })
        .catch((error) => {
          console.log("Erro na consulta: ", error)
        })
     
      this.showFilterList.end = this.filterForm.end
      this.filterForm.start = ''
      this.filterForm.end = ''
      this.filterForm.date = null
      this.showFilter = false
    },

    clearFilter() {
      this.filterRides = {}
      this.showFilterList.show = false
      this.showFilterList.empty = false
      this.showFilterList.end = ''
    },

    viewRide(ride) {
      this.fullRide = ride
      this.fullRide.userName = this.fullRide.userName.split(' ')[0] + ' ' + this.fullRide.userName.split(' ').reverse()[0]
      this.showRide = true
    } 
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }

      let date = val.toDate()
      moment.locale('pt-BR')
      return moment(date).format('DD/MM/YY à\\s HH:mm')
    },
    formatSince(val) {
      if (!val) { return '-' }

      let date = val.toDate()
      moment.locale('pt-BR')
      return moment(date).format('DD/MM/YY')
    },
    capitalize(val) {
      return val.charAt(0).toUpperCase() + val.slice(1)
    },
    trimLength(val) {
      if (val.length < 12) { return val }
      return `${val.substring(0, 12)}...`
    }
  }
}
</script>