import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

fb.ridesCollection.where('when', '>=', new Date()).orderBy('when', 'asc').onSnapshot(snapshot => {
  let ridesArray = []

  snapshot.forEach(doc => {
    let ride = doc.data()
    ride.id = doc.id

    ridesArray.push(ride)
  })

  store.commit('setRides', ridesArray)
})

fb.parkedsCollection.orderBy('createdAt', 'desc').onSnapshot(snapshot => {
  let parkedsArray = []

  snapshot.forEach(doc => {
    let parked = doc.data()
    parked.id = doc.id

    parkedsArray.push(parked)
  })

  store.commit('setParkeds', parkedsArray)
})

fb.organicAdsCollection.where('isSold', '==', false).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
  let organicAdsArray = []

  snapshot.forEach(doc => {
    let ads = doc.data()
    ads.id = doc.id

    organicAdsArray.push(ads)
  })

  store.commit('setOrganicAds', organicAdsArray)
})

fb.garbageAdsCollection.where('isCollected', '==', false).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
  let garbageAdsArray = []

  snapshot.forEach(doc => {
    let ads = doc.data()
    ads.id = doc.id

    garbageAdsArray.push(ads)
  })

  store.commit('setGarbageAds', garbageAdsArray)
})

const store = new Vuex.Store({
  state: {
    userProfile: {
      name: '',
      email: '',
      cpf: '',
      photo: '',
      phone: '',
      balance: 0,
      isAdmin: false,
      createdAt: null,
      cars: {},
      payment_history: {},
      address: {
        street: '',
        number: '',
        district: '',
        cep: ''
      }
    },
    rides: [],
    parkeds: [],
    organicAds: [],
    garbageAds: [],
    districts: [
      {  id: 1, name: 'Alpes Buquira' },
      {  id: 2, name: 'Bairro do Taquari' },
      {  id: 3, name: 'Bairro dos Sousas' },
      {  id: 4, name: 'Bairro dos Sousas 2' },
      {  id: 5, name: 'Centro' },
      {  id: 6, name: 'Descoberto' },
      {  id: 7, name: 'Distrito Industrial' },
      {  id: 8, name: 'Florada das Serras' },
      {  id: 9, name: 'Fazenda Ponte Preta' },
      {  id: 10, name: 'Jardim Alvorada' },
      {  id: 11, name: 'Jardim Iracema' },
      {  id: 12, name: 'Jardim Morada do Sol' },
      {  id: 13, name: 'Matinada' },
      {  id: 14, name: 'Pedra Branca'},
      {  id: 15, name: 'Ponte Nova' },
      {  id: 16, name: 'Rio do Braço' },
      {  id: 17, name: 'Rio Manso' },
      {  id: 18, name: 'Romeiros' },
      {  id: 19, name: 'São Benedito' },
      {  id: 20, name: 'São Gotardo' },
      {  id: 21, name: 'Subúrbio Humaitá' },
      {  id: 22, name: 'São Sebastião' },
      {  id: 23, name: 'Serrinha' },
      {  id: 24, name: 'Taquari' },
      {  id: 25, name: 'Teixeiras' },
      {  id: 26, name: 'Vargem Alegre' },
      {  id: 27, name: 'Vila Esperança' },
      {  id: 28, name: 'Vila São Sebastião' },
      {  id: 29, name: 'Visconde' },
      {  id: 30, name: 'São José dos Campos' },
      {  id: 31, name: 'São Francisco Xavier' },
      {  id: 32, name: 'Campos do Jordão' },
      {  id: 33, name: 'São Bento do Sapucaí' },
      {  id: 34, name: 'Santo Antônio do Pinhal' },
      {  id: 35, name: 'São Paulo' }
    ]
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
    setPosts(state, val) {
      state.posts = val
    },
    setRides(state, val) {
      state.rides = val
    },
    setParkeds(state, val) {
      state.parkeds = val
    },
    setOrganicAds(state, val) {
      state.organicAds = val
    },
    setGarbageAds(state, val) {
      state.garbageAds = val
    }
  },
  actions: {

    async fetchUserProfile({ commit }, user) {
      
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      commit('setUserProfile', userProfile.data())

      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },

    async logout({ commit }) {
      
      await fb.auth.signOut()

      commit('setUserProfile', {})

      router.push('/login')
    }
  }
})

export default store