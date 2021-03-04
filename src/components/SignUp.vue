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
            <input @keyup="getRegister" v-model="name" class="form-inputs input-name" placeholder="Name" />
            <p v-bind:class="{'text-validate' : validate ? validate[0] : null }">{{ this.validate ? this.validate[0] : null }}</p>
            <input @keyup="getRegister" v-model="email" class="form-inputs input-email" placeholder="Email" />
            <p v-bind:class="{'text-validate' : validate ? validate[1] : null }">{{ this.validate ? this.validate[1] : null }}</p>
            <input @keyup="getRegister" v-model="password" class="form-inputs input-password" type="password" placeholder="Password" />
            <p v-bind:class="{'text-validate' : validate ? validate[2] : null }">{{ this.validate ? this.validate[2] : null }}</p>
            <input @keyup="getRegister" v-model="repeatPassword" class="form-inputs input-repeat-password" type="password" placeholder="Repeat password" />
            <p v-bind:class="{'text-validate' : validate ? validate[3] : null }">{{ this.validate ? this.validate[3] : null }}</p>
            <p class="account-info">Do you have an account ? <router-link to="/" class="sign-in-link">Sign in</router-link></p>
            <button @click="getRegister" class="form-btn" type="button">Create</button>
            <router-link to="/" class="form-btn">Sign in</router-link>
        </div>
    </section>
</transition>
</template>

<script>
    export default {
        data(){
            return {
                name: '',
                email: '',
                password: '',
                repeatPassword: '',
                validate: null,
                show: false
            }
        },
        methods: {
            async getRegister(e){
                try {
                    const register = await this.fetchRegister(e);
                    const data = await register.json();

                    this.validate = data.validate

                    if(data.register){
                        this.name = '';
                        this.email = '';
                        this.password = '';
                        this.repeatPassword = '';
                    }

                    
                } catch {
                    console.log('catch errors')
                }
    
            },
            fetchRegister(e){
                const { name, email, password, repeatPassword } = this;

                return fetch('http://localhost:3001/api/register', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ name, email, password, repeatPassword, eventType: e.type })
                })
            }
        },
        mounted(){
            this.show = !this.show;
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

.fade-enter, .fade-leave-to{
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

.input-name {
    margin-top: 3.7rem;
}

.input-email {
    margin-top: 1.1rem;
}

.input-password {
    margin-top: 2.7rem;
}

.input-repeat-password {
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


.account-info {
    text-align: right;
    font-size: 1.3rem;
    color: #858585;
    margin-top: 1.7rem;
    padding-right: 1.2rem;
    letter-spacing: inherit;
}

.sign-in-link {
    text-decoration: none;
    color: inherit;
    position: relative;
    color: #fc4947;
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
}

.form-btn:nth-child(11) {
    margin-top: 2.8rem;
}

.form-btn:nth-child(12) {
    margin-top: 0.8rem;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

</style>