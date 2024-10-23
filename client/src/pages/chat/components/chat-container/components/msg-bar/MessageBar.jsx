import { useRef, useEffect, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/apiClient";
import { UPLOAD_FILE_ROUTE } from "@/utils/constans";

function MessageBar() {

    const socket = useSocket()
    const emojiRef = useRef()
    const fileInputRef = useRef()
    const [message, setMsg] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const {
        selectedChatType, 
        selectedChatData, 
        userInfo,
        setIsUploading,
        setFileUploadProgress,
    } = useAppStore()
    
    useEffect(() => {
        function handleClickOutSide(event) {
            if(emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutSide)
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide)
        }
    }, [emojiRef])

    const handleSendMessage = async () => {
        if(selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileURL: undefined,
            })
        } else if (selectedChatType === 'channel') {
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileURL: undefined,
                channelId: selectedChatData._id,
            })
        }
        setMsg('')
    };

    const handleAddEmoji = (emoji) => {
        setMsg((msg) => msg + emoji.emoji);
    };

    const handleAttachmentClick = () => {
        if(fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            if(file) {
                const formData = new FormData()
                formData.append("file", file)
                setIsUploading(true)
                const response = await apiClient.post(
                    UPLOAD_FILE_ROUTE, 
                    formData, 
                    {
                        withCredentials: true,
                        onUploadProgress: data => {setFileUploadProgress(Math.round((100 * data.loaded)/data.total))}
                    }
                )
                
                if(response.status === 200 && response.data) {
                    setIsUploading(false)

                    if(selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            contact: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        })
                    } else if (selectedChatType === 'channel') {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id,
                        })
                    }

                } 
            }
        } catch (error) {
            setIsUploading(false)
            console.log(error);
        }
    }

    return (
        <div className="h-[10vh] bg-[#0b0518] flex justify-center items-center px-5 md:px-10 mb-2 gap-3 md:gap-6">
            <div className="flex-1 flex bg-[#1b1739] rounded-xl items-center gap-2 md:gap-5 pr-2 md:pr-5">
                <input
                    type="text"
                    className="flex-1 p-3 md:p-5 bg-transparent rounded-2xl focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(event) => { if (event.keyCode === 13) handleSendMessage() }} 
                />
                <button 
                    className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-xl md:text-2xl" />
                </button>
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleAttachmentChange}
                />
                <div className="relative">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        <RiEmojiStickerFill className="text-xl md:text-2xl mt-1 md:mt-2" />
                    </button>
                    <div ref={emojiRef} className="absolute bottom-8 right-0">
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={handleAddEmoji}
                            open={emojiPickerOpen}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button
                className="bg-[#2f1b88] rounded-xl flex items-center justify-center p-3 md:p-4 focus:border-none focus:outline-none  hover:bg-[#180f3d]"
                onClick={handleSendMessage}
            >
                <IoSendSharp className="text-xl md:text-2xl" />
            </button>
        </div>
    );
}

export default MessageBar;
