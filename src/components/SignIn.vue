<template>
    <transition name="fade">
        <section v-show="show" class="form">
            <div class="form-wrapper">
                <figure class="logo">
                    <span class="logo-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </span>
                    <img class="logo__img" src="../assets/logo.png" alt="logo">
                </figure>
                <input v-model="email" @keyup="getLogin" class="form-inputs input-email" placeholder="Email" />
                <p v-bind:class="{'text-validate' : validate ? validate[0] : null }">{{ this.validate ? this.validate[0] : null }}</p>
                <input v-model="password" @keyup="getLogin" class="form-inputs input-password" type="password" placeholder="Password" />
                <p v-bind:class="{'text-validate' : validate ? validate[1] : null }">{{ this.validate ? this.validate[1] : null }}</p>
                <label class="remember-me">
                    Remember me
                    <input @click="saveCredentials" type="checkbox" class="checkbox-remember-me"/>
                    <span v-bind:class="{'checked-active' : credentials }" class="checkmark"></span>
                </label>
                <button @click="getLogin" class="form-btn" type="button">Sign in</button>
                <router-link to="/signup" class="form-btn">Sign up</router-link>
            </div>
        </section>
    </transition>
</template>

<script>
    export default {
        data(){
            return {
                email: '',
                password: '',
                validate: null,
                show: false,
                credentials: false
            }
        },
        methods: {
            async getLogin(e){
                try {
                    const login = await this.fetchLogin(e);
                    const data = await login.json();
                    
                    if(data.validate){
                        this.validate = data.validate
                    }

                    if(data.tokens){
                        localStorage.setItem('tokens', JSON.stringify(data.tokens))

                        await this.fetchCredentials();

                        this.$router.push('/dashboard')
                    }

                } catch {
                    console.log('catch errors')
                }
    
            },
            fetchLogin(e){
                const { email, password } = this;

                return fetch('https://ytubevueapp.herokuapp.com/api/login', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ email, password, eventType: e.type })
                })
            },
            saveCredentials(){
                this.credentials = !this.credentials
            },
            fetchCredentials(){
                const { email, password, credentials } = this;
                
                return fetch('https://ytubevueapp.herokuapp.com/api/credentials', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ email, password, credentials })
                })
            },
            getTransition(){
                this.show = !this.show;
            },
            getCookie(){
                if(document.cookie){
                    const decode = decodeURIComponent(document.cookie);
                    const pos = decode.indexOf('{');
                    const slice = decode.slice(pos, decode.length);
                    const data = JSON.parse(slice);
                    
                    this.email = data.email;
                    this.password = data.password;
                    this.credentials = true;
                }
            }

        },
        mounted(){
            this.getTransition()
            this.getCookie()
        }
    }
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.8s, transform 0.8s;
}

.fade-enter {
    transform: translateY(-60px);
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.logo {
    position: relative;
    max-width: max-content;
    margin-left: 1.1rem;
}

.logo-dots {
    display: flex;
    flex-direction: row;
    position: absolute;
    right: 1.5rem;
    top: -1.6rem;
}

.dot {
    display: block;
    width: 4px;
    height:4px;
    border-radius: 50%;
    background: #fc4947;
}

.dot:nth-child(2){
    margin-left: 0.9rem;
    margin-right: 0.9rem;
}

.form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 30.6rem;
    width: 100%;
    margin: 0 auto;
    font-weight: 300;
    letter-spacing: 0.035rem;
}

.form-inputs {
    height: 4.2rem;
    border: none;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    color: #b2b2b2;
    font-weight: 300;
    font-size: 1.5rem;
    outline: 0;
    padding: 0 2.05rem;
    font-family: inherit;
    letter-spacing: inherit;
}

.input-email {
    margin-top: 3.7rem;
}

.input-password {
    margin-top: 1.1rem;
}

::placeholder {
    color: #b2b2b2;
}

.text-validate {
    letter-spacing: inherit;
    font-size: 1.3rem;
    margin-top: 1rem;
    padding-left: 1.5rem;
    color: #fc4947;
}

.remember-me {
    font-size: 1.5rem;
    color: #858585;
    margin-top: 1.7rem;
    padding-left: 1.15rem;
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.checked-active:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fc4947;
    border-radius: 2px;
}

.checkbox-remember-me {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
}

.checkmark {
    display: block;
    width: 12px;
    height: 12px;
    background: #f0efef;
    border-radius: 2px;
    position: relative;
    left: 1.3rem;
}

.form-btn {
    height: 4.2rem;
    background-image: linear-gradient( 0deg, rgb(253,73,71) 0%, rgb(221,52,50) 100%);
    font-family: inherit;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: inherit;
    outline: 0;
    cursor: pointer;
    letter-spacing: inherit;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.form-btn:nth-child(7) {
    margin-top: 2.8rem;
}

.form-btn:nth-child(8) {
    margin-top: 0.8rem;
}

</style>