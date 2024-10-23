import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/apiClient";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constans.js";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {IoMdArrowRoundDown } from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";


function MessageContainerForChannel() {
    const scrollRef = useRef();
    const { 
        selectedChatType, 
        selectedChatData, 
        userInfo, 
        selectedChatMessages, 
        setSelectedChatMessages,
        setIsDownloading,
        setFileDownloadProgress,
    } = useAppStore();
    const [showImage, setShowImage] = useState(false)
    const [imageURL, setImageURL] = useState(null)

    const styleForSender = 
    {
        backgroundColor: userInfo.colors.bgColor,
        color: userInfo.colors.textColor,
        borderColor: userInfo.colors.borderColor,
    }

    // const styleForRecipient = 
    // {
    //     backgroundColor: selectedChatData.colors.bgColor,
    //     color: selectedChatData.colors.textColor,
    //     borderColor: selectedChatData.colors.borderColor,
    // }

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath)
    }

    useEffect(() => {

        const getMessages = async () => {
            try {
                // console.log("selectedChatDate: ",selectedChatData);
                const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {id: selectedChatData._id}, {withCredentials: true})
                if(response.data.messages) {
                    setSelectedChatMessages(response.data.messages)
                }                
            } catch (error) {
                console.log(error);
            }
        }

        if(selectedChatData._id) {
            if(selectedChatType === "contact") getMessages();
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    const renderMessages = () => {
        // console.log(selectedChatData);
        
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-white my-2">
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {selectedChatType === "channel" && renderChannelMessages(message)}
                </div>
            );
        });
    };

    const downloadFile = async (fileUrl) => {
        setIsDownloading(true)
        setFileDownloadProgress(0)
        const response = await apiClient.get(
            `${HOST}/${fileUrl}`, 
            {
                responseType: "blob",
                onDownloadProgress:(progressEvent) => {
                    const {loaded, total} = progressEvent;
                    const percentageCompleted = Math.round((loaded * 100)/ total);
                    setFileDownloadProgress(percentageCompleted)
                } 
            }
        )
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = urlBlob
        link.setAttribute("download", fileUrl.split("/").pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(urlBlob)
        setIsDownloading(false)
    }


    const renderChannelMessages = (message) => {
        const isSender = message.sender._id === userInfo.id;
        console.log("Message in renderChannelMessages:",message);
        
        return (
            <div className={`mt-5 ${isSender ? "text-right" : "text-left"}`}>
                {message.messageType === "text" && (
                    <div
                        className={`inline-block p-3 rounded-2xl my-1 max-w-[50%] break-words text-md font-medium ml-9`}
                        style={isSender ? styleForSender : {
                            backgroundColor: message.sender.colors.bgColor,
                            color: message.sender.colors.textColor,
                            borderColor: message.sender.colors.borderColor,
                        }}
                    >
                        {message.content}
                    </div>
                )}
{
                    message.messageType === "file" && 
                    <div
                        className={`inline-block p-1 rounded my-1 max-w-[50%]`}
                        // style={message.sender === userInfo.id ? styleForSender  : styleForRecipient}
                    >
                        {checkIfImage(message.fileUrl) 
                            ? <div 
                                className="cursor-pointer border-2 border-black"
                                onClick={() => {
                                    setShowImage(true)
                                    setImageURL(message.fileUrl)
                                }}    
                            >
                                <img 
                                    src={`${HOST}/${message.fileUrl}`} 
                                    height={300} 
                                    width={300} 
                                />
                            </div> 
                            : <div className="flex items-center justify-center gap-5 p-2 sm:p-4">
                                <span className="text-white/80 text-xl sm:text-3xl bg-black/20 rounded-full p-2 sm:p-3">
                                    <MdFolderZip />
                                </span>
                                <span className="text-sm sm:text-base">{message.fileUrl.split("/").pop()}</span>
                                <span 
                                    className="hover:bg-[#1b1a1a3e] bg-[#42414135] rounded-full p-2 sm:p-3 cursor-pointer"
                                    onClick={() => downloadFile(message.fileUrl)}    
                                >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        }
                    </div>  
                }
                {
                    message.sender._id !== userInfo.id ? (
                        <div className="flex items-center justify-start gap-2 mt-1">
                            <Avatar className="h-8 w-8 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38] ">
                                {message.sender.image && (
                                    <AvatarImage
                                        src={`${HOST}/${message.sender.image}`}
                                        alt="Profile"
                                        className="object-cover w-full h-full bg-black"
                                    />
                                )}
                                    <AvatarFallback
                                        className={`uppercase h-8 w-8 text-lg md:text-lg font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                            style={{
                                            backgroundColor: message.sender.colors.bgColor,
                                            color: message.sender.colors.textColor,
                                            borderColor: message.sender.colors.borderColor,
                                        }}
                                    >
                                            {message.sender.firstName 
                                                ? message.sender.firstName.split("").shift()
                                                : message.sender.email.split("").shift()
                                            }
                                    </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white/60">{message.sender.firstName} {message.sender.lastName}</span>
                            <span className="text-sm text-white/60">
                                {
                                    moment(message.timestamp).format("LT")
                                }
                            </span>
                        </div>
                    ) : (
                        <div className="text-sm text-white/60">
                            {
                                moment(message.timestamp).format("LT")
                            }
                        </div>
                    )
                }
            </div>
        );
    };
    

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            {
                showImage && 
                <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
                <div className="relative">
                    <img 
                        src={`${HOST}/${imageURL}`}
                        className="lg:h-[80vh] lg:w-[80vw] md:h-[60vh] md:w-full sm:h-[40vh] sm:w-full px-2 object-cover"    
                    />
                    <div className="flex gap-5 absolute top-0 right-0 mt-5 mr-5">
                        <button 
                            className="hover:bg-[#222121ec] bg-[#222121ec] rounded-full p-2 cursor-pointer"
                            onClick={() => downloadFile(imageURL)}    
                        >
                            <IoMdArrowRoundDown />
                        </button>
                        <button 
                            className="hover:bg-[#222121ec] bg-[#222121ec] rounded-full p-2 cursor-pointer"
                            onClick={() => {
                                setShowImage(false)
                                setImageURL(null)
                            }}    
                        >
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            </div>
            
            }
            <div ref={scrollRef} />
        </div>
    );
}

export default MessageContainerForChannel;
