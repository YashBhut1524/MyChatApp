import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE} from "@/utils/constans";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "../../multiple-select-component/MultipleSelectComponent";

function CreateChannel() {

    const  {
        // setSelectedChatData, 
        // selectedChatType,
        addChannel,
    } = useAppStore()
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {withCredentials: true})
            console.log(response);
            setAllContacts(response.data.contacts)
        }
        getData()
    }, [])

    const createChannel = async () => {
        try {
                if(channelName.length > 0 && selectedContacts.length > 0) {
                    const response = await apiClient.post(
                        CREATE_CHANNEL_ROUTE, 
                        {
                            name: channelName,
                            members: selectedContacts.map(contact => contact.value) //sending selected contact's id's
                        },
                        {withCredentials: true },
                    )            
                    if(response.status === 201) {
                        setChannelName("")
                        setSelectedContacts([])
                        setNewChannelModel(false)
                        addChannel(response.data.channel)

                    }
                }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-[#cfcbcb] font-light text-opacity-90 text-sm hover:text-[#ffff] cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="border-none text-white bg-[#02021b]">
                        Create New Group
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#0c071f] border-none text-white w-[400px] h-[500px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please fill up the details for new Group.
                        </DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Group Name"
                            className="rounded-xl p-6 bg-[#231f3a] hover:bg-[#3a326a] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector 
                            className="rounded-lg bg-[#231f3a] hover:bg-[#3a326a] border-none py-2 text-white"
                            defaultOptions = {allContacts}
                            placeholder = "Search Contacts"
                            value = {selectedContacts}
                            onChange = {setSelectedContacts}
                            emptyIndicator = {
                                <p className="text-center text-lg leading-10 text-gray-600">No result Found!</p>
                            }
                        />
                        {/* <MultiSelect
                            options={allContacts}
                            // value={selectedContacts}
                            virtualScrollerOptions={{ itemSize: 43 }}
                            maxSelectedLabels={3}
                            placeholder="Select Contacts"
                            className="w-full rounded-lg p-2 bg-[#231f3a] hover:bg-[#3a326a] text-white border-none"
                            panelClassName="bg-[#231f3a] text-white border-none p-4"  // Style for dropdown panel
                            itemTemplate={(option) => (
                                <div className="p-2 hover:bg-[#3a326a] cursor-pointer">
                                    <span>{option.label}</span>
                                </div>
                            )}
                        /> */}
                    </div>
                    <div>
                        <Button 
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Group
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateChannel;
