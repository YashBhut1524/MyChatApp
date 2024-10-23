/* eslint-disable react/prop-types */
import { useAppStore } from "@/store"

function ContactList({contacts, isChannel = false}) {

    const {
        selectedChatData, 
        setSelectedChatData, 
        setSelectedChatType, 
        setSelectedChatMessages
    } = useAppStore()

    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }

    // console.log("contacs:::: ",contacts)
    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                
                <div 
                    key={contact._id}
                    className={
                        `pl-10 py-2 transition-all duration-300 cursor-pointer 
                        ${selectedChatData && 
                            selectedChatData._id === contact._id 
                                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                                : "hover:bg-[#f1f1f111]"
                            }`
                    }
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 item-center justify-start text-[#ffff]">
                        {
                                <>
                                    <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                                    {
                                        <span>{contact.name}</span> 
                                    }
                                </>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
    
}

export default ContactList