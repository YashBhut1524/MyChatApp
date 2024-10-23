import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constans"
import {RiCloseFill} from "react-icons/ri"

function ChatHeader() {

    const {closeChat , selectedChatData, selectedChatType} = useAppStore()

    return (
        <div className="h-[10vh] border-b-2 border-[#1f1443] flex items-center justify-between px-20">
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-start justify-center">
                    <div className="w-12 h-12 relative">
                        {
                            selectedChatType === "contact" 
                                ? 
                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38] absolute">
                                        {selectedChatData.image ? (
                                            <AvatarImage
                                                src={`${HOST}/${selectedChatData.image}`}
                                                alt="Profile"
                                                className="object-cover w-full h-full bg-black"
                                            />
                                        ) : (
                                            <div
                                                className={`uppercase h-12 w-12 text-lg md:text-lg font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                                    style={{
                                                    backgroundColor: selectedChatData.colors.bgColor,
                                                    color: selectedChatData.colors.textColor,
                                                    borderColor: selectedChatData.colors.borderColor,
                                                }}
                                            >
                                                {selectedChatData.firstName
                                                    ? selectedChatData.firstName.charAt(0)
                                                    : selectedChatData.email.charAt(0)}
                                            </div>
                                        )}
                                    </Avatar>
                                : <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                    #
                                </div>

                        }
                    </div>
                    <div className="flex flex-col">
                        {selectedChatType === 'channel' && selectedChatData.name}
                        {
                            selectedChatType === "contact" &&
                            (
                                <>
                                    <span>
                                        {selectedChatData.firstName && selectedChatData.lastName
                                            ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                            : `${selectedChatData.email}`}
                                    </span>
                                    <span className="text-sm">
                                            {selectedChatData.email}
                                    </span>
                                </>                                
                            )
                        }
                    </div>                                        
                </div>
                <div className="flex items-center justify-center gap-5">
                    <button 
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={closeChat}
                    >
                        <RiCloseFill className="text-3xl"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader