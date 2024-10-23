import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState} from "react"
import { Button } from "@/components/ui/button"
import login from "@/assets/login.png"
import signup from "@/assets/signup.png"
import { toast } from "sonner"
import {apiClient} from "@/lib/apiClient.js"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constans"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store"
import ErrorAnimation from "@/components/animations/ErrorAnimation.jsx"
import SuccessAnimation from "@/components/animations/SuccessAnimation"

function Auth() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [activeTab, setActiveTab] = useState("login")
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate()
    const {setUserInfo} = useAppStore()

    const validateSignup = () => {
        if(!email.length) {
            toast.error(<ErrorAnimation msg="Please provide a valid email address. "/>, { duration: 2000 });
            return false;
        }
        if(!password.length) {
            toast.error(<ErrorAnimation msg="Password cannot be empty. Please enter your password. "/>, { duration: 2000 });
            return false;
        }
        if(password !== confirmPassword) {
            toast.error(<ErrorAnimation msg="Passwords do not match. Please check and try again." />, { duration: 2000 });
            return false;
        }
        return true
    }

    const validateLogin = () => {
        if(!email.length) {
            toast.error(<ErrorAnimation msg="Please provide a valid email address."/>, { duration: 2000 });
            return false;
        }
        if(!password.length) {
            toast.error(<ErrorAnimation msg="Password cannot be empty. Please enter your password."/>, { duration: 2000 });
            return false;
        }
        return true
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
                setUserInfo(response.data.user)                
                console.log(response);
                toast.success(<SuccessAnimation msg="Welcome back! You have successfully logged in."/>, { duration: 2000 });

                if(response.data.user.id) {
                    if(response.data.user.profileSetup) navigate("/chat")
                    else navigate("/profile")
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    if (error.response.status === 404) {
                        // User not found
                        toast.error(<ErrorAnimation msg="User with this email does not exist. Please sign up."/>, { duration: 2000 });
                        setEmailError("Email does not exist! Please signUp")
                    } else if (error.response.status === 400) {
                        // Invalid credentials
                        toast.error(<ErrorAnimation msg="Invalid email or password. Please try again."/>, { duration: 2000 });
                    } else {
                        // Handle any other error
                        toast.error(<ErrorAnimation msg="An unexpected error occurred. Please try again later."/>, { duration: 2000 });

                    }
                } else {
                    // Network or unexpected error
                    toast.error(<ErrorAnimation msg="Network error. Please check your connection."/>, { duration: 2000 });
                }
            }
        }
    };
    

    const handleSignUp = async () => {
        if (validateSignup()) {
            try {
                const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, {withCredentials: true});
                setUserInfo(response.data.user)                
                // console.log(response);
                // Clear the error state and display success message
                setEmailError("");  // Clear error
                toast.success(<SuccessAnimation msg="Signup complete! Welcome to the platform."/>, { duration: 2000 });

                if(response.status === 201) {
                    navigate("/profile")
                }
            } catch (error) {
                // Check if the error is due to the email being already registered
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data.msg || "Error occurred during signup.";
                    setEmailError(errorMessage);  // Set error message for email input
                    toast.error(<ErrorAnimation msg="This email is already registered. Try logging in."/>, { duration: 2000 });

                } else {
                    setEmailError("An unexpected error occurred. Please try again.");
                }
            }
        }
    };
    
    return (
        <div className={`h-[100vh] w-[100vw] flex items-center justify-center ${activeTab === "login" ? "bg-[#100621]" : "bg-[#1a0622]"}`}>
            <div className={`h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3x grid xl:grid-cols-2 md:grid-cols-2 rounded-2xl`}>
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                        </div>
                        <p className="font-medium text-center">Fill in the details to Get Started!</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs 
                            className="w-3/4" 
                            onValueChange={
                                (value) => {
                                    setActiveTab(value)
                                    setEmail("")
                                    setPassword("")
                                    setConfirmPassword("")
                                    setEmailError("")
                                }
                            }
                            defaultValue="login"
                            value={activeTab}
                        >
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger 
                                    value="login"
                                    className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-[hsl(271,68%,16%)] p-3 transition-all duration-300 text-xl"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="signup"
                                    className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-xl"
                                >
                                    SignUp
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="flex flex-col gap-5 mt-10" >
                                <div className="relative w-full">
                                    <Input 
                                        placeholder="Email" 
                                        type="email" 
                                        className={`rounded-2xl p-6 ${emailError ? 'border-red-500' : ''}`} 
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError("");  // Clear error when typing
                                        }}
                                    />
                                    {emailError && (
                                        <p className="absolute text-red-500 text-[10px] pb-[5px] left-6 bottom-[-20px]">
                                            {emailError}
                                        </p>
                                    )}
                                </div>
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-2xl p-6" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5">
                            <div className="relative w-full">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    className={`rounded-2xl p-6 ${emailError ? 'border-red-500' : ''}`}  // Add error border color
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError("");  // Clear error when typing
                                    }}
                                />
                                {/* Conditionally render the error message as an absolutely positioned element */}
                                {emailError && (
                                    <p className="absolute text-red-500 text-[10px] pb-[5px] left-6 bottom-[-20px]">
                                        {emailError}
                                    </p>
                                )}
                            </div>
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-2xl p-6" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input 
                                    placeholder="Confirm Password" 
                                    type="password" 
                                    className="rounded-2xl p-6" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleSignUp}>SignUp</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden md:flex xl:flex justify-center items-center p-1">
                    <img
                        src={activeTab === "login" ? login : signup}
                        alt={activeTab === "login" ? "Login background" : "SignUp background"}
                        className="lg:h-[350px] rounded-2xl xl:h-[400px] md:h-[300px] transition-all duration-500 ease-in-out transform
                                    opacity-100 scale-100 hover:opacity-90 hover:scale-105 xl:mr-10 md:mt-20 md:mr-10"
                        onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                    />
                </div>
            </div>
        </div>
    )
}

export default Auth