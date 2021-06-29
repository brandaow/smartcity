<template>
    <v-container fluid>
        <v-row align="center">
            <v-col cols="9" class="pl-4">
                <v-btn block disabled><span class="pr-3"><strong>Saldo: </strong></span> {{ userProfile.balance }},00</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn block class="white--text" color="light-blue darken-4"><v-icon>add</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row class="pb-2">
            <v-col cols="3">
                <v-btn block class="white--text" color="grey darken-3" @click="userProfile.cars.forEach((v) => { parkForm.cars.push(v.name) }); showPark = true"><v-icon>local_parking</v-icon></v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn block class="white--text" color="grey darken-3" @click="showHistory = true"><v-icon>history</v-icon></v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn block class="white--text" color="grey darken-3" @click="showView = showView == 'parkeds' ? 'cars' : 'parkeds'"><v-icon>{{ showView == 'parkeds' ? 'directions_car' : 'view_list' }}</v-icon></v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn block class="white--text" color="grey darken-3" @click="showInfo = true"><v-icon>info</v-icon></v-btn>
            </v-col>
        </v-row>
        <div v-if="showView == 'parkeds'">
            <v-card class="mt-3" outlined loading>
                <v-card-title class="pb-0">
                    <v-row class="subtitle-2">
                        <v-col cols="9" class="red--text">
                            <v-icon class="mr-2">directions_car</v-icon>EM ANDAMENTO
                        </v-col>
                        <v-col cols="3">
                            <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                                R$ 1
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-subtitle class="ml-1">
                    <strong>Iniciado em:</strong> Hoje, às 12h19
                </v-card-subtitle>
                <v-card-actions class="pt-0 mt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="light-blue darken-4" text>Finalizar</v-btn>
                </v-card-actions>
            </v-card>
            <v-card class="mt-3" outlined>
                <v-card-title class="pb-0">
                    <v-row class="subtitle-2">
                        <v-col cols="9" class="green--text">
                            <v-icon class="mr-2" color="green">directions</v-icon>FINALIZADO
                        </v-col>
                        <v-col cols="3">
                            <v-alert color="light-blue darken-4" class="white--text text-center px-0 py-1">
                                R$ 9
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-subtitle class="ml-1">
                    <strong>Iniciado em:</strong> Hoje, às 12h19<br>
                    <strong>Finalizado em:</strong> Hoje, às 15h43
                </v-card-subtitle>
            </v-card>
        </div>
        <div v-if="showView == 'cars'">
            <v-btn block class="white--text" color="light-blue darken-4" @click="showNewCar = true">NOVO VEÍCULO</v-btn>
            <v-card class="mt-3" outlined color="grey lighten-2" v-for="car in userProfile.cars" :key="car.plate">
                <v-card-title class="pt-0 pb-2">
                    <v-row>
                        <v-col cols="9">
                              {{ car.name }}
                        </v-col>
                        <v-col cols="3">
                              <v-btn color="light-blue darken-4" class="white--text text-center px-0 py-1" @click="deleteCar(car)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                        </v-col>
                      </v-row>
                </v-card-title>
                <v-card-subtitle>
                    <strong>Placa:</strong> {{ car.plate }}
                </v-card-subtitle>
            </v-card>
        </div>
        <v-dialog v-model="showPark">
      <v-card>
        <v-card-title class="pb-1">Estacionar</v-card-title>
        <v-card-text class="pb-2">
          <form @submit.prevent>
                        <v-select :items="parkForm.cars" label="Carro"></v-select>
          </form>
                    <strong>Iniciando em:</strong> {{ new Date() | formatDate }}
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="park()">Iniciar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <v-dialog v-model="showHistory">
      <v-card class="pb-3">
        <v-card-title>
                    Recargas
                    <v-spacer></v-spacer>
                    <v-icon @click="showHistory = false">close</v-icon>
                </v-card-title>
                <div class="mx-3 mb-3">
                    <v-card class="mb-3" outlined color="grey lighten-2">
                        <v-card-title class="pt-0 pb-0">
                            <v-row>
                                <v-col cols="9">
                                    R$ 10,00
                                </v-col>
                                <v-col cols="3">
                                    <v-alert color="light-green darken-1" class="text-center px-0 py-1">
                                        <v-icon color="white">done</v-icon>
                                    </v-alert>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-card-subtitle class="pb-1">
                            <strong>Em:</strong> 14/08/20 às 14:09
                        </v-card-subtitle>
                        <v-card-text>
                            <strong>Método:</strong> Cartão de Crédito
                        </v-card-text>
                    </v-card>
                </div>
      </v-card>
    </v-dialog>
        <v-dialog v-model="showNewCar">
      <v-card>
        <v-card-title>Novo Veículo</v-card-title>
        <v-card-text class="pt-2 pb-0">
          <form @submit.prevent>
            <v-text-field dense v-model.trim="$v.newCarForm.name.$model" :error="$v.newCarForm.name.$error" type="text" label="Apelido" id="nameCar" autocomplete="off" />
                        <v-text-field dense v-model.trim="$v.newCarForm.plate.$model" :error="$v.newCarForm.plate.$error" type="text" label="Placa" id="plate" autocomplete="off" />
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="newCar()" :disabled="newCarForm.name == '' || newCarForm.plate == ''">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <v-dialog v-model="showInfo">
      <v-card>
        <v-card-title>Ajuda</v-card-title>
        <v-card-text>
          <p class="mb-0">Opções</p>
        </v-card-text>
      </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
import { minLength } from 'vuelidate/lib/validators'
import { auth, usersCollection } from '@/firebase'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data () {
        return {
            parkForm: {
                cars: [],
                car: '',
                start: new Date()
            },
            newCarForm: {
                name: '',
                plate: ''
            },
            showPark: false,
            showInfo: false,
            showNewCar: false,
            showHistory: false,
            showView: 'parkeds',
            showAddBalance: false
        }
    },
    validations: {
        newCarForm: {
            name: {
                minLength: minLength(4)
            },
            plate: {
                minLength: minLength(5)
            }
        }
    },
  computed: {
    ...mapState(['userProfile'])
    },
    methods: {

        async newCar() {
            let listCar = this.userProfile.cars.length ? this.userProfile.cars : []
            listCar.push({
                name: this.newCarForm.name,
                plate: this.newCarForm.plate
            })

            await usersCollection.doc(auth.currentUser.uid).update({
                cars: listCar
            })

            this.$store.dispatch('fetchUserProfile', { uid: auth.currentUser.uid })

            this.newCarForm.name = ''
      this.newCarForm.plate = ''
      this.showNewCar = false
        },

        async deleteCar(car) {
            let listCar = this.userProfile.cars
            listCar.splice(listCar.indexOf(car), 1)

            await usersCollection.doc(auth.currentUser.uid).update({
                cars: listCar
            })

            this.$store.dispatch('fetchUserProfile', { uid: auth.currentUser.uid })
        }

    },
    filters: {
    formatDate(val) {
      if (!val) { return '-' }

      moment.locale('pt-BR')
      return moment(val).format('DD/MM/YY à\\s HH:mm')
    }
  }
}
</script>