/* eslint-disable react/prop-types */
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constans";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {  // Accept children as a prop
    const socket = useRef(null);
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            const handleReceiveMessage = (message) => {
                const {
                    selectedChatType, 
                    selectedChatData, 
                    addMessage,
                    addContactInDMContacts,
                } = useAppStore.getState()
                if(
                    selectedChatType !== undefined && selectedChatType === "contact" && 
                    (selectedChatData._id === message.sender._id 
                        || selectedChatData._id === message.recipient._id)
                ) {
                    // console.log("Message Received at handleReceiveMessage:", message);
                addMessage(message);
                }
                addContactInDMContacts(message)
            }

            const handleReceiveChannelMessage = (message) => {
                const {
                    selectedChatData, 
                    selectedChatType, 
                    addMessage, 
                    addChannelInChannelList
                } = useAppStore.getState()
                if(selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    // console.log("Message Received at handleReceiveChannelMessage:", message);
                    addMessage(message)
                }
                addChannelInChannelList(message)
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("recieve-channel-message", handleReceiveChannelMessage);

            // Cleanup on component unmount
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
