<template>
  <v-container style="min-height:100%; padding:15%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="6">
        <span class="headline">Sign up</span>
        <form>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          label="Name"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
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
         <v-text-field
            v-model="confirm_password"
            :append-icon="show_confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show_confirm_password ? 'text' : 'password'"
            name="input-10-2"
            label="Confirm Password"
            hint="At least 3 characters"
            :error-messages="confirm_passwordErrors"
            @click:append="show_confirm_password = !show_confirm_password"
            @input="$v.confirm_password.$touch()"
            @blur="$v.confirm_password.$touch()"
          ></v-text-field>

          <v-btn class="mr-4 primary" @click="submit">Sign up</v-btn>
          <v-btn class="mr-4" to="/login">Back to log in</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import AuthService from '@/services/AuthService'

export default {
  name: 'SignUp',
  mixins: [validationMixin],

  validations: {
    name: {
      required,
      minLength: minLength(3)
    },
    email: { required, email },
    password: {
      required,
      minLength: minLength(3)
    },
    confirm_password: {
      required,
      minLength: minLength(3)
    }
  },

  data: () => ({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    show_password: false,
    show_confirm_password: false
  }),

  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.minLength && errors.push('Name must be at most 3 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
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
      this.password !== this.confirm_password && errors.push('Password and ConfirmPassword doesnt match')
      return errors
    },
    confirm_passwordErrors () {
      const errors = []
      if (!this.$v.confirm_password.$dirty) return errors
      !this.$v.confirm_password.minLength && errors.push('Password must be at most 3 characters long')
      !this.$v.confirm_password.required && errors.push('Password is required')
      this.password !== this.confirm_password && errors.push('Password and ConfirmPassword doesnt match')
      return errors
    }
  },

  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const data = {
          name: this.name,
          email: this.email,
          password: this.password
        }
        AuthService.signup(data).then(res => {
          console.log(res)
          this.$toast.success("Login successfully!",{
           timeout:900
          });
        }).catch(err => {
          console.log('asdf', err)
          this.$toast.error("Email is already existed",{
           timeout:900
          });
        })
      }
    },
    clear () {
      this.$v.$reset()
      this.email = ''
      this.password = ''
      this.confirm_password = ''
      this.name = ''
    }
  }
}
</script>
<style scoped>
</style>
