import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// providers
import { AuthProvider } from "./contexts/authContext";
import { TransactionProvider } from "./contexts/transactionContext";
import SingleTransactionPage from "./pages/SingleTransactionPage";
import CreateTransactionPage from "./pages/CreateTransactionPage";
import UsersPage from "./pages/UsersPage";
import FriendsPage from "./pages/FriendsPage";
import UserAccount from "./pages/UserAccount";

function App() {
    return (
        <Router>
            <AuthProvider>
                <TransactionProvider>
                    <Header />
                    <main className="main">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route
                                path="/auth/register"
                                element={<RegisterPage />}
                            />
                            <Route
                                path="/transactions/:id"
                                element={<SingleTransactionPage />}
                            />
                            <Route
                                path="/transactions/create"
                                element={<CreateTransactionPage />}
                            />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/friends" element={<FriendsPage />} />
                            <Route path="/account" element={<UserAccount />} />
                        </Routes>
                    </main>
                </TransactionProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
