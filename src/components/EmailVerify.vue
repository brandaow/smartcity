<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar.active" :color="snackbar.color" top>
      <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>{{ snackbar.text }}
    </v-snackbar>
    <v-alert border="left" color="grey" dark>
        <v-row class="px-3" align="center">
            Verificação de e-mail pendente
            <v-spacer></v-spacer>
            <v-btn @click="sendEmail()">
                <v-icon>send</v-icon>
            </v-btn>
        </v-row>
    </v-alert>
    <v-card elevation="20">
      <v-card-text class="text-center">
        <v-icon size="50" class="py-2">email</v-icon>
        <p class="text-center subtitle-1 font-weight-bold pb-3">Verifique sua caixa de e-mail para continuar...</p>
        <div class="body-2 pb-2">
          <p class="text-justify">Para acessar nossos serviços, é necessário confirmar seu endereço de email.</p>
          <p class="text-justify">Um link de ativação foi enviado para você.</p>
          <p class="text-justify">Confirme sua caixa de spam caso não encontre.</p>
        </div>
        <v-btn block class="white--text mb-3" color="light-blue darken-4" @click="confirmEmail()">Já Confirmei</v-btn>
        <v-btn block color="light-grey darken-4" @click="sendEmail()">Enviar novamente</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import router from '@/router'
import { auth } from '@/firebase'

export default {
  data() {
    return {
      snackbar: {
        active: false,
        color: '',
        text: ''
      }
    }
  },
  methods: {
    async sendEmail() {
      await auth.currentUser.sendEmailVerification()
        .then(() => {
            this.snackbar.active = true
            this.snackbar.color = 'success'
            this.snackbar.text = 'Email enviado com sucesso'
        })
        .catch((e) => {
            this.snackbar.active = true
            this.snackbar.color = 'red'
            this.snackbar.text = 'Erro, tente novamente'
        })
    },
    confirmEmail() {
            router.push('/')
        
    }
  }
}
</script>