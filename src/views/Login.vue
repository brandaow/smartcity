<template>
  <v-container fill-height> 
    <v-snackbar v-model="snackbar.active" :color="snackbar.color" top>
      <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>{{ snackbar.text }}
    </v-snackbar>
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12">
        <form v-if="showLoginForm" @submit.prevent>
          <v-icon size="100" color="light-blue darken-4">location_city</v-icon>
          <div class="text-h4 mt-2 mb-10">Smart Monteiro</div>
          <v-text-field outlined v-model.trim="$v.loginForm.email.$model" :error="$v.loginForm.email.$error" type="email" label="E-mail" id="email1" autocomplete="off" />
          <v-text-field outlined v-model.trim="$v.loginForm.password.$model" :error="$v.loginForm.password.$error" type="password" label="Senha" id="password1" autocomplete="off" />
          <v-btn block x-large class="white--text" color="light-blue darken-4" @click="login()" :disabled="loginForm.email == '' || loginForm.password == ''">Entrar</v-btn>
          <div class="pt-5">
            <a @click="showPasswordReset = true">Esqueci minha senha</a>
          </div>
          <div class="pt-3">
            Não possui conta?<a @click="showLoginForm = false"> Registre-se</a>
          </div>
        </form>
        <form v-else @submit.prevent>
          <div v-if="showAddressForm">
            <div class="text-h7 mb-10">Só mais algumas informações...</div>
            <v-text-field outlined v-model.trim="$v.signupForm.address.$model" :error="$v.signupForm.address.$error" type="text" label="Logradouro" id="address1" autocomplete="off" />
            <v-text-field outlined v-model.trim="$v.signupForm.number.$model" :error="$v.signupForm.number.$error" type="number" label="Número" id="number1" autocomplete="off" />
            <v-text-field outlined v-model.trim="$v.signupForm.district.$model" :error="$v.signupForm.district.$error" type="text" label="Bairro" id="district1" autocomplete="off" />
            <v-text-field outlined v-model.trim="$v.signupForm.cep.$model" :error="$v.signupForm.cep.$error" v-mask="'#####-###'" inputmode="numeric" label="Cep" id="code" autocomplete="off" />       
            <v-btn block x-large class="white--text" color="light-blue darken-4" @click="signup()" :disabled="signupForm.address == '' || signupForm.number == '' || signupForm.district == '' || signupForm.cep == ''">Registrar</v-btn>
            <div class="pt-5">
              <a @click="showAddressForm = false">Voltar</a>
            </div>
          </div>
          <div v-else>
            <div class="text-h7 mb-10">Complete seus dados para prosseguir...</div>
            <v-text-field outlined v-model.trim="$v.signupForm.email.$model" :error="$v.signupForm.email.$error"  type="email" label="E-mail" id="email2" autocomplete="off" />
            <v-text-field outlined v-model.trim="$v.signupForm.password.$model" :error="$v.signupForm.password.$error" type="password" label="Senha" id="password2" autocomplete="off" /> 
            <v-text-field outlined v-model.trim="$v.signupForm.name.$model" :error="$v.signupForm.name.$error" type="text" label="Nome Completo" id="name1" autocomplete="off" />
            <v-row>
              <v-col cols="6">
                <v-text-field outlined v-model.trim="$v.signupForm.cpf.$model" :error="$v.signupForm.cpf.$error" v-mask="'###.###.###-##'" type="text" inputmode="numeric" label="CPF" id="cpf1" autocomplete="off" />
              </v-col>
              <v-col cols="6">
                <v-text-field outlined v-model.trim="$v.signupForm.phone.$model" :error="$v.signupForm.phone.$error" v-mask="'(##) #####-####'" type="text" inputmode="numeric" label="Celular" id="phone1" autocomplete="off" />
              </v-col>
            </v-row>      
            <v-btn block x-large class="white--text" color="light-blue darken-4" @click="showAddressForm = true" :disabled="signupForm.name == '' || signupForm.cpf == '' || signupForm.phone == '' || signupForm.email == '' || signupForm.password == ''">Continuar</v-btn>
            <div class="pt-5">
              <a @click="showLoginForm = true">Já possuo conta</a>
            </div>
          </div>
        </form>
      </v-col>
    </v-row>
    <v-dialog v-model="showPasswordReset">
      <v-card>
        <v-card-title>Redefinir Senha</v-card-title>
        <v-card-text class="pb-0">
          <p class="mb-3">Insira seu e-mail.</p>
          <form @submit.prevent>
            <v-text-field outlined v-model.trim="$v.resetForm.email.$model" :error="$v.resetForm.email.$error" type="email" label="E-mail" id="email3" autocomplete="off" />
          </form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-spacer></v-spacer>
          <v-btn color="light-blue darken-4" text @click="resetPassword()">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { email, minLength, required } from 'vuelidate/lib/validators'
import { auth, usersCollection } from '@/firebase'

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        cpf: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        number: '',
        district: '',
        cep: ''
      },
      resetForm: {
        email: ''
      },
      snackbar: {
        active: false,
        color: '',
        text: ''
      },
      showLoginForm: true,
      showAddressForm: false,
      showPasswordReset: false
    }
  },
  validations: {
    loginForm: {
      email: {
        email
      },
      password: {
        required
      }
    },
    signupForm: {
      name: {
        minLength: minLength(5)
      },
      cpf: {
        minLength: minLength(14)
      },
      phone: {
        minLength: minLength(14)
      },
      email: {
        email
      },
      password: {
        minLength: minLength(6)
      },
      address: {
        minLength: minLength(5)
      },
      number: {
        minLength: minLength(1)
      },
      district: {
        minLength: minLength(6)
      },
      cep: {
        minLength: minLength(9)
      }
    },
    resetForm: {
      email: {
        email
      }
    }
  },
  methods: {

    async login() {
      await auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
        .then((val) => {
          if(typeof val !== 'undefined') this.$store.dispatch('fetchUserProfile', val.user)
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Erro, tente novamente'
          switch(e.code) {
            case 'auth/invalid-email':
              this.snackbar.text = 'E-mail inválido, tente novamente'
              break;
            case 'auth/user-disabled':
              this.snackbar.text = 'Conta desativada, entre em contato'
              break;
            case 'auth/user-not-found':
              this.snackbar.text = 'Conta não localizada, tente novamente'
              break;
            case 'auth/wrong-password':
              this.snackbar.text = 'Senha incorreta, tente novamente'
              break;
          }
        })
    },

    async signup() {
      let dataUser = ''
      await auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password)
        .then(async function(val) {
          if(typeof val !== 'undefined') {
            dataUser = val.user
            val.user.sendEmailVerification()
          }
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Erro, tente novamente'
          switch(e.code) {
            case 'auth/invalid-email':
              this.snackbar.text = 'E-mail inválido, tente novamente'
              break;
            case 'auth/email-already-in-use':
              this.snackbar.text = 'E-mail já vinculado, tente novamente'
              break;
            case 'auth/weak-password':
              this.snackbar.text = 'Senha fraca, tente novamente'
              break;
          }
        })
      if(dataUser !== '') {
        await usersCollection.doc(dataUser.uid).set({
          name: this.signupForm.name,
          email: this.signupForm.email,
          cpf:  this.signupForm.cpf.replace('.', '').replace('.', '').replace('-', ''),
          phone: this.signupForm.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''),
          photo: '',
          balance: 0,
          isAdmin: false,
          adminPermissions: {},   
          createdAt: new Date,
          cars: {},
          payment_history: {},
          address: {
            street: this.signupForm.address,
            number: this.signupForm.number,
            district: this.signupForm.district,
            cep: this.signupForm.cep.replace('.', '').replace('-', '')
          }
        })
        .then(() => {
          this.$store.dispatch('fetchUserProfile', dataUser)
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Erro, entre em contato'
        })
      }
    },

    async resetPassword() {
      await auth.sendPasswordResetEmail(this.resetForm.email)
        .then(() => {
          this.snackbar.active = true
          this.snackbar.color = 'success'
          this.snackbar.icon = 'done'
          this.snackbar.text = 'Link de recuperação enviado'
          this.resetForm.password = ''
        })
        .catch((e) => {
          this.snackbar.active = true
          this.snackbar.color = 'red'
          this.snackbar.icon = 'error'
          this.snackbar.text = 'Erro, tente novamente'
          switch(e.code) {
            case 'auth/invalid-email':
              this.snackbar.text = 'E-mail inválido, tente novamente'
              break;
            case 'auth/user-not-found':
              this.snackbar.text = 'E-mail não encontrado, tente novamente'
              break;
          }
        })
    }
  }
}
</script>
