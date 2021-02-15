import { useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useLocation,
} from 'react-router-dom';
import Footer from './layout/Footer';
import Navbar from './layout/Navbar';
import Food from './pages/Food';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import LogOut from './pages/Logout';
import NotFoundPage from './pages/NotFoundPage';
import Nutrient from './pages/Nutrient';
import Profile from './pages/Profile';
import Recipe from './pages/Recipe';
import SignUp from './pages/SignUp';
import LoginContext from './context/LoginContext';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const value = { loggedIn, setLoggedIn };
    return (
        <Router>
            <LoginContext.Provider value={value}>
                <Website />
            </LoginContext.Provider>
        </Router>
    );
}

function Website() {
    let query = useQuery();
    return (
        <div className="flex flex-col min-h-screen App">
            <Navbar />
            <div className="container relative flex-grow mx-auto">
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/contact">
                        <Contact />
                    </Route>
                    <Route path="/nutrient">
                        <Nutrient search={query.get('query')} />
                    </Route>
                    <Route path="/food/:name">
                        <Food />
                    </Route>
                    <Route path="/recipe">
                        <Recipe />
                    </Route>
                    <Route path="/sign-up">
                        <SignUp />
                    </Route>
                    <Route path="/log-in">
                        <LogIn />
                    </Route>
                    <Route path="/log-out">
                        <LogOut />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                    <Route path="/forgot-password">
                        <ForgotPassword />
                    </Route>
                    <Route path="/new-password">
                        <NewPassword
                            username={query.get('username')}
                            token={query.get('token')}
                        />
                    </Route>
                    <Route path="*">
                        <NotFoundPage />
                    </Route>
                </Switch>
            </div>
            <Footer />
        </div>
    );
}

export default App;
