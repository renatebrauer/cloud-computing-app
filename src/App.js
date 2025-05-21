import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import {MainContext} from "./contexts";
import {db} from "./firebase";
import {useState} from "react";
import {LoginPage, LoginPageWrapper} from "./components/Login";
function App() {
    const [user] = useAuthState(auth);
    const defaultState = {
        login: {email: "", password: ""},
        register: {email: "", password: "", confirmPassword: "", country: ""},
        userId: "",
        invalidFields: new Map()
    }
    const [state, setState] = useState(defaultState)

  return (
    <div className="App">
        <MainContext.Provider value={{state, setState, db}}>
            <NavBar/>
            {!user ? (
                <div>
                    <Welcome/>
                    <LoginPageWrapper/>
                </div>

            ) : (
                <>
                    <ChatBox/>
                </>
            )}
        </MainContext.Provider>
    </div>
  );
}

export default App;
