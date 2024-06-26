import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import UserService from "@/services/UserService";

const LoginScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loggedUser, setLoggedUser] = useState({});

    const checkLoggedIn = async () => {
        try {
            const user = await UserService.getLoggedUser();
            setIsLoggedIn(user != null);
            setLoggedUser(user || {});
        } catch (error) {
            console.error("Error checking logged in status:", error);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const handleLogin = async () => {
        try {
            const user = await UserService.getUserByLogin(email, password);
            if (user == null) {
                Alert.alert('Erro', 'Usuário ou senha inválidos');
                return;
            }
            await UserService.setLoggedUser(user);
            await checkLoggedIn();
            clearFields()
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert('Erro', 'Falha no login. Por favor, tente novamente.');
        }
    };

    const handleSignup = async () => {
        try {
            console.log(await UserService.addUser(email, username, password));
            const user = await UserService.getUserByLogin(email, password);
            await UserService.setLoggedUser(user);
            await checkLoggedIn();
            clearFields()
        } catch (error) {
            console.error("Error during signup:", error);
            Alert.alert('Erro', 'Falha no cadastro. Por favor, tente novamente.');
        }
    };

    const clearFields = () => {
        setEmail('');
        setPassword('');
        setUsername('');
    }

    const signOut = async () => {
        try {
            await UserService.removeLoggedUser();
            setLoggedUser({});

            checkLoggedIn();
        } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert('Erro', 'Falha ao sair. Por favor, tente novamente.');
        }
    }

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Você está logado!</Text>
                    <Text style={styles.bannerText}>Bem-vindo, {loggedUser.username}!</Text>
                    <Text style={styles.bannerText}>Email: {loggedUser.email}</Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                                style={[styles.tab, isLogin && styles.activeTab]}
                                onPress={() => signOut()}
                            >
                            <Text style={styles.tabText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={styles.tabText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, !isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={styles.tabText}>Cadastro</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>{isLogin ? "Login" : "Cadastro"}</Text>
                        {!isLogin && (
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Nome"
                                placeholderTextColor="#aaa"
                                style={styles.input}
                            />
                        )}
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={isLogin ? handleLogin : handleSignup}
                        >
                            <Text style={styles.buttonText}>{isLogin ? "Login" : "Cadastrar"}</Text>
                        </TouchableOpacity>
                        {isLogin && (
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    activeTab: {
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
    },
    input: {
        width: '100%',
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: '#000',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        marginTop: 16,
        color: '#000',
    },
    banner: {
        padding: 25,
        backgroundColor: '#435C34',
        borderRadius: 8,
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    bannerText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    bannerHighlight: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default LoginScreen;
