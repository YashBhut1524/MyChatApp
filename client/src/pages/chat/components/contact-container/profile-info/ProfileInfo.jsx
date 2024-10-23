import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constans"
import { 
        Tooltip, 
        TooltipProvider,   
        TooltipContent,
        TooltipTrigger, 
    } from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi"
import {useNavigate } from "react-router-dom"
import { MdLogout } from "react-icons/md";
import { toast } from "sonner"
import ErrorAnimation from "@/components/animations/ErrorAnimation"
import SuccessAnimation from "@/components/animations/SuccessAnimation"
import { apiClient } from "@/lib/apiClient"

function ProfileInfo() {

    const {userInfo, setUserInfo, closeChat} = useAppStore()
    const navigate = useNavigate()
    // console.log(userInfo);

    const logOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials:true})
            if(response.status === 200) {
                toast.success(<SuccessAnimation msg={"LogOut Successful"}/>, { duration: 2000 });
                navigate("/auth")
                setUserInfo(null)
                closeChat()
            }
        } catch (error) {
            toast.error(<ErrorAnimation msg={error}/>, { duration: 2000 });
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#1e034e]">
            <div className="flex gap-3 justify-center items-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38] absolute">
                        <h1>{}</h1>
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt="Profile"
                                className="object-cover w-full h-full bg-black "
                            />
                        ) : (
                            <div
                                className={`uppercase h-12 w-12 text-lg md:text-lg font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                style={{
                                    backgroundColor: userInfo.colors.bgColor,
                                    color: userInfo.colors.textColor,
                                    borderColor: userInfo.colors.borderColor,
                                }}
                            >
                                {userInfo.firstName
                                ? userInfo.firstName.split("").shift()
                                : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div className="">
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 
                                className="text-[#abaab7] text-xl font-medium hover:text-white"
                                onClick={() => {
                                    navigate("/profile")
                                    closeChat()
                                }}
                            />
                        </TooltipTrigger>
                            <TooltipContent className="border-none text-white bg-[#02021b]">
                                Edit Profile
                            </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <MdLogout 
                                className="text-red-600 text-xl font-medium"
                                onClick={logOut}
                            />
                        </TooltipTrigger>
                            <TooltipContent className="border-none text-white bg-[#02021b]">
                                LogOut
                            </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo