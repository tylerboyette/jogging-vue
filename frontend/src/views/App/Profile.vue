<template>
  <v-container style="min-height:100%; padding:10%">
    <v-row class="text-center" justify="center" align="center">
      <v-col cols="6">
        <span class="headline">Profile</span>
        <v-row>
          <v-col>
            <v-progress-circular
            v-if="loading"
            :size="50"
            color="primary"
            indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="avatar-wrapper">
                <img
                  class="profile-pic"
                  :src="profileImg"
                />
                <div class="upload-button">
                  <i class="fa fa-arrow-circle-up" aria-hidden="true" />
                </div>
                <input class="file-upload" type="file" accept="image/*" />
              </div>
          </v-col>
        </v-row>
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

          <v-btn class="mr-4 primary" @click="submit">Save</v-btn>
          <v-btn class="mr-4" to="/">
            <v-icon dark left>mdi-arrow-left</v-icon>
            Cancel
          </v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import * as constants from '@/store/constants'
import { storage } from '@/firebaseconfig.js';
import { required, minLength, email } from 'vuelidate/lib/validators'
import $ from 'jquery'

let file = null;
export default {
  name: 'Profile',
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
    loading: false,
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    profileImg:'https://cdn.vuetifyjs.com/images/john.jpg',
    show_password: false,
    show_confirm_password: false
  }),
  created () {
   this.name = this.currentUser.name
   this.email = this.currentUser.email
   this.profileImg = this.currentUser.profileImg
  
  },

  computed: {
    ...mapGetters([
      'currentUser'
    ]),
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
    ...mapActions({
      updateProfile: constants.ACTION_SET_PROFILE,
    }),
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let profileImg = this.profileImg
        if (file) {
          this.loading = true;
        const previewName = +new Date() + '-avatar.jpg';
          profileImg = await storage
          .ref(`images/${previewName}`)
          .putString(file, 'data_url')
          .then(snapshot => snapshot.ref.getDownloadURL());
          this.loading = false;
        }
        const data = {
          name: this.name,
          email: this.email,
          password: this.password,
          profileImg: profileImg
        }
         this.updateProfile(data)
        .then(()=>{
          this.$toast.success("Profile updated",{
          timeout:900
          });
        })
        .catch(()=>{
          this.$toast.error("Email is already taken",{
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
$(document).ready(function() {
  var readURL = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('.profile-pic').attr('src', e.target.result);
        file = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  $('.file-upload').on('change', function() {
    console.log("ahaa")
    readURL(this);
  });

  $('.upload-button').on('click', function() {
    console.log("zzzz")
    $('.file-upload').click();
  });
});
</script>
<style scoped>
.avatar-wrapper {
  position: relative;
  height: 150px;
  width: 150px;
  margin: 5px auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 1px 1px 15px -5px black;
  transition: all 0.3s ease;
}
.avatar-wrapper:hover {
  transform: scale(1.05);
  cursor: pointer;
}
.avatar-wrapper:hover .profile-pic {
  opacity: 0.5;
}
.avatar-wrapper .profile-pic {
  height: 100%;
  width: 100%;
  transition: all 0.3s ease;
}
.avatar-wrapper .profile-pic:after {
  font-family: FontAwesome;
  content: '\f007';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  font-size: 140px;
  background: #ecf0f1;
  color: #34495e;
  text-align: center;
}
.avatar-wrapper .upload-button {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.avatar-wrapper .upload-button .fa-arrow-circle-up {
  position: absolute;
  font-size: 184px;
  top: -17px;
  left: 0;
  text-align: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: #34495e;
}
.avatar-wrapper .upload-button:hover .fa-arrow-circle-up {
  opacity: 0.9;
}

</style>
