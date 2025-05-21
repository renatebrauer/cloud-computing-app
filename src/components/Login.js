
import {useCallback, useContext, useState} from "react";
import {LoginFormContext, MainContext, RegisterFormContext} from "../contexts";
import {ConfigInput} from "./config-input";
import {useLogin, useRegisterForm} from "../forms";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {toast} from "react-toastify";

export const notify = (message) => toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});


export function LoginPageWrapper() {
    const loginForm = useLogin()
    const registerForm = useRegisterForm()
    return (<LoginFormContext.Provider value={loginForm}>
        <RegisterFormContext.Provider value={registerForm}>
            <LoginPage/>
        </RegisterFormContext.Provider>
    </LoginFormContext.Provider>)
}

export function LoginPage() {
    const [hasAccount, setHasAccount] = useState(true)
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const {state, setState} = useContext(MainContext)
    const {db} = useContext(MainContext)
    const {email: emailLog, password: passwordLog} = useContext(LoginFormContext)
    const {email, password, confirmPassword, country} = useContext(RegisterFormContext)


    const isLoginDisabled = state.invalidFields.has('emailLog') || state.invalidFields.has('passwordLog')
    const isRegisterDisabled = state.invalidFields.has('email') || state.invalidFields.has('password') || state.invalidFields.has('confirmPassword') || state.invalidFields.has('country') || !acceptedTerms

    const registerUser = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then(async (userCredential) => {
                const newDoc = await setDoc(doc(db, 'users', userCredential.user.uid), {
                    country: country.value,
                    products: []
                })
            })
            .catch((error) => {
                console.log(error.code)
                notify(ErrorCodes.get(error.code))
            });

    }

    const ErrorCodes = new Map([
        ['auth/wrong-password', 'Wrong password'],
        ['auth/user-not-found', 'User not found'],
        ['auth/invalid-email', 'Invalid email'],
        ['auth/weak-password', 'Password should be at least 6 characters'],
        ['auth/email-already-in-use', 'Email already used']
    ])

    const logInUser = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, emailLog.value, passwordLog.value)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setState((prev) => ({...prev, userId: userCredential.user.uid}))
            })
            .catch((error) => {
                console.log(error.code)
                notify(ErrorCodes.get(error.code))
            });

    }
    return (<div className={"page-login"}>
        {hasAccount && <div className={"modal-login"}>
            <ConfigInput label={"Email"} value={emailLog.value} onChange={emailLog.onChange}
                         error={emailLog.error}></ConfigInput>
            <ConfigInput label={'Password'} type={'password'} value={passwordLog.value} onChange={passwordLog.onChange}
                         error={passwordLog.error}></ConfigInput>
            <button className={'button-login'} onClick={logInUser} disabled={isLoginDisabled}>Log in</button>
            <div className={'no-account'} onClick={() => {
                setHasAccount(false)
            }}>If you are not registered Sign up
            </div>
        </div>}
        {!hasAccount && <div className={"modal-login"}>
            <ConfigInput label={"Email"} value={email.value} onChange={email.onChange}
                         error={email.error}></ConfigInput>
            <ConfigInput label={"Password"} type={'password'} value={password.value} onChange={password.onChange}
                         error={password.error}></ConfigInput>
            <ConfigInput label={"Confirm Password"} type={'password'} value={confirmPassword.value} onChange={confirmPassword.onChange}
                         error={confirmPassword.error}></ConfigInput>
            {/*<heckbox checked={acceptedTerms} onChange={() => {*/}
            {/*    setAcceptedTerms((prev: boolean) => !prev)}>*/}
            <button className={'button-signup'} onClick={registerUser} >Sign in</button>
            <div className={'no-account'} onClick={() => {
                setHasAccount(true)
            }}>Already have an account?
            </div>
        </div>}


    </div>)
}