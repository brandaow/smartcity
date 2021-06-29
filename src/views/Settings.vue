<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar.active" :color="snackbar.color" top>
      <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>{{ snackbar.text }}
    </v-snackbar>
    <v-card elevation="20">
      <v-card-title>
        <v-avatar :color="userProfile.photo !== '' ? '' : 'grey darken-3'" size="100">
          <img v-if="userProfile.photo !== ''" :src="userProfile.photo">
          <v-icon v-if="userProfile.photo === ''" color="white" size="80">face</v-icon>
        </v-avatar>
        <form @submit.prevent>
          <v-file-input accept="image/*" type="file" @change="uploadPhoto($event)" id="photo" hide-input prepend-icon="mdi-camera" class="ml-3"></v-file-input>      
        </form>
      </v-card-title>
      <v-card-text class="pt-5 pb-1">
        <p><v-icon class="mr-2">account_circle</v-icon>{{ userProfile.name }}</p>
        <p><v-icon class="mr-2">email</v-icon>{{ userProfile.email }}</p>
        <p><v-icon class="mr-2">assignment</v-icon>{{ userProfile.cpf | formatCpf}}</p>
      </v-card-text>
    </v-card>
    <v-card class="mt-3" elevation="20">
      <form @submit.prevent>
        <v-card-text>
          <v-row>
            <v-col cols="7" class="py-0">
              <v-text-field dense outlined v-model.trim="$v.addressForm.street.$model" :error="$v.addressForm.street.$error" type="text" label="Logradouro" :placeholder="userProfile.address.street" id="address"/>
            </v-col>
            <v-col cols="5" class="py-0">
              <v-text-field dense outlined v-model.trim="$v.addressForm.number.$model" :error="$v.addressForm.number.$error" type="number" label="Número" :placeholder="userProfile.address.number" id="number" />
            </v-col>
            <v-col cols="7" class="py-0">
              <v-text-field dense outlined v-model.trim="$v.addressForm.district.$model" :error="$v.addressForm.district.$error" type="text" label="Bairro" :placeholder="userProfile.address.district" id="district"/>
            </v-col>
            <v-col cols="5" class="py-0">
              <v-text-field dense outlined v-model.trim="$v.addressForm.cep.$model" :error="$v.addressForm.cep.$error" v-mask="'##.###-###'" type="text" label="Cep" :placeholder="userProfile.address.cep | formatCep" id="cep" />
            </v-col>
          </v-row>
          <v-btn block class="white--text" @click="updateAddress()" :disabled="addressForm.street == '' && addressForm.number == '' && addressForm.district == '' &&  addressForm.cep == ''" color="light-blue darken-4">Atualizar Endereço</v-btn>
        </v-card-text>
      </form>
    </v-card>
    <v-card class="mt-3" elevation="20">
      <form @submit.prevent>
        <v-card-text>
          <v-text-field dense outlined v-model.trim="$v.phone.new.$model" :error="$v.phone.new.$error" v-mask="'(##) #####-####'" type="text" label="Celular" :placeholder="userProfile.phone | formatPhone" id="phone"/>
          <v-btn block class="white--text" @click="updatePhone()" :disabled="phone.new == ''" color="light-blue darken-4">Atualizar Celular</v-btn>
        </v-card-text>
      </form>
    </v-card>
    <v-card class="mt-3" elevation="20">
      <form @submit.prevent>
        <v-card-text>
          <v-text-field dense outlined v-model.trim="$v.password.new.$model" :error="$v.password.new.$error" type="password" label="Senha" placeholder="" id="password"/>
          <v-btn block class="white--text" @click="updatePassword()" :disabled="password.new == ''" color="light-blue darken-4">Atualizar Senha</v-btn>
        </v-card-text>
      </form>
    </v-card>
    <v-card class="mt-3" elevation="20">
      <v-card-text class="text-center">
        <p class="body-2 mb-0">Smart Monteiro App</p>
        <p class="body-2 mb-1">v0.8</p>
        <v-btn class="body-2" color="light-blue darken-4" @click="toggleTheme()" text>Tema Escuro</v-btn>
        <v-btn class="body-2" color="light-blue darken-4" @click="showPMMUModal = true" text>Equipe PMMU</v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showPasswordConfirm">
      <v-card>
        <v-card-text class="pt-4 pb-0">
          <p>Insira sua senha antiga para continuar</p>
          <form @submit.prevent>
            <v-text-field outlined dense v-model.trim="$v.password.old.$model" :error="$v.password.old.$error" type="password" label="Senha Antiga" id="password2" />
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="updatePasswordConfirmed()">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPMMUModal">
      <v-card>
        <v-card-title class="headline">Equipe PMMU</v-card-title>
        <v-card-text>
          <p class="mb-0">Desenvolvimento em Smart City</p>
          <v-list class="pt-0">
            <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>link</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-if="!showSite" @click="showSite = true">Ver Site</v-list-item-title>
                  <v-list-item-title v-if="showSite" @click="showSite = false">pmmu.com.br</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item href="mailto:contato@pmmu.com.br">
                <v-list-item-icon>
                  <v-icon>email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Enviar e-mail</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { auth, storageRef, usersCollection, ridesCollection, organicAdsCollection, garbageAdsCollection } from '@/firebase'
import { minLength } from 'vuelidate/lib/validators'
import * as firebase from 'firebase/app'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      snackbar: {
        active: false,
        color: '',
        text: ''
      },
      addressForm: {
        street: '',
        number: '',
        district: '',
        cep: ''
      },
      photoForm: {
        progress: ''
      },
      phone: {
        new: ''
      },
      password: {
        old: '',
        new: ''
      },
      uploadTask: '',
      showSite: false,
      showPMMUModal: false,
      showPasswordConfirm: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  validations: {
    addressForm: {
      street: {
        minLength: minLength(5)
      },
      number: {
        minLength: minLength(1)
      },
      district: {
        minLength: minLength(6)
      },
      cep: {
        minLength: minLength(10)
      }
    },
    phone: {
      new: {
        minLength: minLength(14)
      }
    },
    password: {
      new: {
        minLength: minLength(6)
      },
      old: {
        minLength: minLength(6)
      }
    }
  },
  methods: {
    uploadPhoto(e) {
      this.uploadTask = storageRef.child('profilePictures/' + auth.currentUser.uid).put(e)
        .then(response => {
          response.ref.getDownloadURL().then(downloadURL => {
            
            usersCollection.doc(auth.currentUser.uid).update({
              photo: downloadURL
            })
            this.userProfile.photo = downloadURL
            ridesCollection.where('userId', '==', auth.currentUser.uid).get()
              .then((docs) => {
                docs.forEach(doc => {
                  ridesCollection.doc(doc.id).update({
                    userPhoto: downloadURL
                  })
                })
              })
              .catch((e) => {
                this.snackbar.active = true
                this.snackbar.color = 'red'
                this.snackbar.icon = 'error'
                this.snackbar.text = 'Falha ao atualizar, tente novamente'
              })
            organicAdsCollection.where('userId', '==', auth.currentUser.uid).get()
              .then((docs) => {
                docs.forEach(doc => {
                  organicAdsCollection.doc(doc.id).update({
                    userPhoto: downloadURL
                  })
                })
              })
              .catch((e) => {
                this.snackbar.active = true
                this.snackbar.color = 'red'
                this.snackbar.icon = 'error'
                this.snackbar.text = 'Falha ao atualizar, tente novamente'
              })
            garbageAdsCollection.where('userId', '==', auth.currentUser.uid).get()
              .then((docs) => {
                docs.forEach(doc => {
                  garbageAdsCollection.doc(doc.id).update({
                    userPhoto: downloadURL
                  })
                })
              })
              .catch((e) => {
                this.snackbar.active = true
                this.snackbar.color = 'red'
                this.snackbar.icon = 'error'
                this.snackbar.text = 'Falha ao atualizar, tente novamente'
              })

          })
        })
    },

    async updateAddress() {
      await usersCollection.doc(auth.currentUser.uid).update({
        address: {
          street: this.addressForm.street !== '' ? this.addressForm.street : this.userProfile.address.street,
          number: this.addressForm.number !== '' ? this.addressForm.number : this.userProfile.address.number,
          district: this.addressForm.district !== '' ? this.addressForm.district : this.userProfile.address.district,
          cep: this.addressForm.cep !== '' ? this.addressForm.cep.replace('.', '').replace('-', '') : this.userProfile.address.cep
        }
      })
      
      this.$store.dispatch('fetchUserProfile', { uid: auth.currentUser.uid })

      this.addressForm.street = ''
      this.addressForm.number = ''
      this.addressForm.district = ''
      this.addressForm.cep = ''

      this.snackbar.active = true
      this.snackbar.color = 'success'
      this.snackbar.icon = 'done'
      this.snackbar.text = 'Alterações realizadas com sucesso'
    },

    async updatePhone() {
      await usersCollection.doc(auth.currentUser.uid).update({
        phone: this.phone.new !== '' ? this.phone.new.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') : this.userProfile.phone
      })

      await ridesCollection.where('userId', '==', auth.currentUser.uid).get()
        .then((docs) => {
          docs.forEach(doc => {
            ridesCollection.doc(doc.id).update({
              userPhone: this.phone.new !== '' ? this.phone.new.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') : this.userProfile.phone
            })
          })
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Falha ao atualizar, tente novamente'
        })

      await organicAdsCollection.where('userId', '==', auth.currentUser.uid).get()
        .then((docs) => {
          docs.forEach(doc => {
            organicAdsCollection.doc(doc.id).update({
              userPhone: this.phone.new !== '' ? this.phone.new.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') : this.userProfile.phone
            })
          })
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Falha ao atualizar, tente novamente'
        })

      await garbageAdsCollection.where('userId', '==', auth.currentUser.uid).get()
        .then((docs) => {
          docs.forEach(doc => {
            garbageAdsCollection.doc(doc.id).update({
              userPhone: this.phone.new !== '' ? this.phone.new.replace('(', '').replace(')', '').replace(' ', '').replace('-', '') : this.userProfile.phone
            })
          })
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Falha ao atualizar, tente novamente'
        })
      
      this.$store.dispatch('fetchUserProfile', { uid: auth.currentUser.uid })

      this.phone.new = ''

      this.snackbar.active = true
      this.snackbar.color = 'success'
      this.snackbar.icon = 'done'
      this.snackbar.text = 'Celular atualizado com sucesso'
    },

    async updatePassword() {
      await auth.currentUser.updatePassword(this.password.new)
        .then(() => {
          this.snackbar.active = true
          this.snackbar.color = 'success'
          this.snackbar.icon = 'done'
          this.snackbar.text = 'Senha alterada com sucesso'
          this.password.new = ''  
          this.password.old = ''
        })
        .catch((e) => {
          if(e.code == 'auth/requires-recent-login') {
            this.showPasswordConfirm = true
          } else {
            this.snackbar.active = true
            this.snackbar.color = 'red'
            this.snackbar.icon = 'error'
            this.snackbar.text = 'Erro, tente novamente'
            this.password.new = ''  
            this.password.old = ''
          }
        })
    },

    async updatePasswordConfirmed() {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.userProfile.email, 
        this.password.old
      );
      
      await auth.currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          this.updatePassword()
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Erro, tente novamente'
          this.password.new = ''  
          this.password.old = ''
          switch(e.code) {
            case 'auth/user-mismatch':
              this.snackbar.text = 'Credenciais inválidas, tente novamente'
              break;
            case 'auth/user-not-found':
              this.snackbar.text = 'Conta não identificada, tente novamente'
              break;
            case 'auth/invalid-credential':
              this.snackbar.text = 'Credenciais inválidas, tente novamente'
              break;
            case 'auth/invalid-email':
              this.snackbar.text = 'E-mail inválido, tente novamente'
              break;
            case 'auth/wrong-password':
              this.snackbar.text = 'Senha incorreta, tente novamente'
              break;
          }
        })
      
      this.showPasswordConfirm = false
    },

    toggleTheme() {
      this.snackbar.active = true
      this.snackbar.color = ''
      this.snackbar.icon = 'error'
      this.snackbar.text = 'Função indisponível no momento'
    }
  },
  filters: {
    formatCpf(val) {
      if (!val) { return '-' }
      
      let cpf = val.split('')
      cpf.splice(3, 0, '.')
      cpf.splice(7, 0, '.')
      cpf.splice(11, 0, '-')
      return cpf.join('')
    },
    formatCep(val) {
      if (!val) { return '-' }

      let cep = val.split('')
      cep.splice(2, 0, '.')
      cep.splice(6, 0, '-')
      return cep.join('')
    },
    formatPhone(val) {
      if (!val) { return '-' }

      let phone = val.split('')
      phone.splice(0, 0, '(')
      phone.splice(3, 0, ')')
      phone.splice(4, 0, ' ')
      val.lenght == 10 ? phone.splice(9, 0, '-') : phone.splice(10, 0, '-') 
      return phone.join('')
    }
  }
}
</script>
