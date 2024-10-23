import ChatHeader from "./components/chat-header/ChatHeader"
import MessageBar from "./components/msg-bar/MessageBar"
import MessageContainer from "./components/msg-container/MessageContainer"
// import { useAppStore } from "@/store"
// import MessageContainerForChannel from "./components/msg-container/MessageContainerForChannel"

function ChatContainer() {
    // const {selectedChatType} = useAppStore()

    return (
        <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#0b0518] flex flex-col md:static md:flex-1 ">
            <ChatHeader />
            {/* {
                selectedChatType === 'contact' ? <MessageContainer /> : <MessageContainerForChannel />
            } */}
            <MessageContainer />
            <MessageBar />
        </div>
    )
}

export default ChatContainer