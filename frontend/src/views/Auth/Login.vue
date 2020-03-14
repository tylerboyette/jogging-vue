<template>
  <v-container style="min-height:100%; padding:15%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="6">
        <span class="headline">Log in</span>
        <form>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()">
          </v-text-field>
          <v-text-field
              v-model="password"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 3 characters"
              :error-messages="passwordErrors"
              @click:append="show_password = !show_password"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
          ></v-text-field>

          <v-btn class="mr-4 primary" @click="submit">
            Log in
            <v-icon dark right>mdi-login</v-icon>
          </v-btn>
          <v-btn class="mr-4 success" to="/signup">
            Sign up
            <v-icon dark right>mdi-account</v-icon>
          </v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import AuthService from '@/services/AuthService'
import { mapActions } from 'vuex'
import * as constants from '@/store/constants'

export default {
  name: 'Login',
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: {
      required,
      minLength: minLength(3)
    }
  },

  data: () => ({
    email: '',
    password: '',
    show_password: false
  }),

  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push('Password must be at most 3 characters long')
      !this.$v.password.required && errors.push('Password is required')
      return errors
    }
  },
  methods: {
    ...mapActions({
      setCurrentUser: constants.ACTION_SET_CURRENT_USER,
    }),
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        AuthService.login(this.email, this.password).then(data => {
          this.clear()
          this.$toast.success("Login successfully!",{
            timeout:900
          });
          localStorage.setItem('token', data.data.token)
          this.setCurrentUser(data.data);
          this.$router.push({
            name: 'dashboard'
          })
        }).catch((err) => {
          this.$toast.error(err.response.data.message,{
             timeout:900
          });
        })
      }
    },
    clear () {
      this.$v.$reset()
      this.email = ''
      this.password = ''
    }
  }
}
</script>
<style scoped>
</style>
