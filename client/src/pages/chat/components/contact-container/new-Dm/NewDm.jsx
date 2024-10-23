import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import SearchCat from "@/components/animations/SearchCat";
import { apiClient } from "@/lib/apiClient";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constans";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constans";
import { useAppStore } from "@/store";

function NewDm() {

    const  {setSelectedChatType, setSelectedChatData, selectedChatType} = useAppStore()
    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchText) => {
        try {
            if (searchText.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchText },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                }
            } else {
                setSearchedContacts([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const selectNewContact = (contact) => {
        console.log(contact);
        setOpenNewContactModel(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchedContacts([])
        console.log(selectedChatType);
        
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-[#cfcbcb] font-light text-opacity-90 text-sm hover:text-[#ffff] cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="border-none text-white bg-[#02021b]">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
                <DialogContent className="bg-[#0c071f] border-none text-white w-[400px] h-[500px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please Select a Contact
                        </DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-xl p-6 bg-[#231f3a] hover:bg-[#3a326a] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-full rounded-md p-4">
                        <div className="flex flex-col gap-5">
                            {searchedContacts.length > 0 ? (
                                searchedContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        onClick={() => selectNewContact(contact)}
                                        className="flex gap-3 items-center cursor-pointer hover:border-2 hover:border-[#25164d] p-2 rounded-2xl"
                                    >
                                        <div className="w-12 h-12 relative">
                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38] absolute">
                                                {contact.image ? (
                                                    <AvatarImage
                                                        src={`${HOST}/${contact.image}`}
                                                        alt="Profile"
                                                        className="object-cover w-full h-full bg-black"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`uppercase h-12 w-12 text-lg md:text-lg font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                                        style={{
                                                            backgroundColor: contact.colors.bgColor,
                                                            color: contact.colors.textColor,
                                                            borderColor: contact.colors.borderColor,
                                                        }}
                                                    >
                                                        {contact.firstName
                                                            ? contact.firstName.charAt(0)
                                                            : contact.email.charAt(0)}
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>
                                                {
                                                    contact.firstName && contact.lastName
                                                        ? `${contact.firstName} ${contact.lastName}`
                                                        : `${contact.email}`
                                                }
                                            </span>
                                            <span className="text-sm">
                                                {contact.email}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-5 mt-5">
                                    <SearchCat />
                                    <span className="">
                                        Search for new <span className="text-[#8645FF]">Contacts</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default NewDm;
