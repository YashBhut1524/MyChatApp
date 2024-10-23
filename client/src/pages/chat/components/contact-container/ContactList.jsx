/* eslint-disable react/prop-types */
import {AvatarImage, Avatar } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constans"

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
                            !isChannel && (
                                <>
                                    <Avatar className="h-10 w-10 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38]">
                                        {contact.image 
                                        ? (
                                            <AvatarImage
                                                src={`${HOST}/${contact.image}`}
                                                alt="Profile"
                                                className="object-cover w-full h-full bg-black"
                                            />
                                        ) 
                                        : (
                                            <div
                                                className={`uppercase h-10 w-10 text-lg md:text-lg font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                                    style={{
                                                    backgroundColor: contact.colors.bgColor,
                                                    color: contact.colors.textColor,
                                                    borderColor: contact.colors.borderColor,
                                                }}
                                            >
                                                {contact.firstName
                                                    ? contact.firstName.charAt(0)
                                                    : contact.email.charAt(0)
                                                }
                                            </div>
                                        )}
                                    </Avatar>
                                    {isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>}
                                    {
                                        
                                        isChannel 
                                            ? <span>{contact.name}</span> 
                                            : (
                                                <div className="flex flex-col">
                                                    <span>
                                                        {contact.firstName && contact.lastName
                                                            ? `${contact.firstName} ${contact.lastName}`
                                                            : `${contact.email}`}
                                                    </span>
                                                    <span className="text-sm">
                                                            {contact.email}
                                                    </span>
                                                </div>    
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
            ))}
        </div>
    );
    
}

export default ContactList