/* eslint-disable react/prop-types */
import LogoAnimation from "@/components/animations/LogoAnimation";
import ProfileInfo from "./profile-info/ProfileInfo";
import NewDm from "./new-Dm/NewDm";
import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { GET_DM_CONTACT_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constans";
import { useAppStore } from "@/store";
import ContactList from "./ContactList";
import CreateChannel from "./create-channel/CreateChannel";
import ChannelList from "./ChannelList"
import "../../../../components/scrollbar/scrollbarStyles.css"

const Logo = () => {
    return (
    <div className="flex p-5 justify-start items-center">
        <LogoAnimation />
        <span className="text-3xl font-semibold "><span className="text-[#805BE6]">C</span>hat<span className="text-[#805BE6]">A</span>pp</span>
    </div>
    );
};

const Title = ({text}) => {
    return (
        <h6 className="uppercase tracking-widest text-[#cfcbcb] pl-10 text-opacity-90 text-sm">
            {text}
        </h6>
    )
}


function ContactContainer() {
    const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore();
    
    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACT_ROUTE, { withCredentials: true });
            if (response.data.contacts) {
                setDirectMessagesContacts(response.data.contacts);
            }
        };
        
        const getChannels = async () => {
            const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {withCredentials: true})
            if (response.data.channels) {
                setChannels(response.data.channels);
            }
        }

        getContacts();
        getChannels()

    }, []);
    
    

    return (
        <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#100721] border-r-2 border-[#1f1443]">
            <div className="pt-1">
                <Logo />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Direct Messages" />
                    <NewDm />
                </div>
                <div className="max-h-[38vh] overflow-y-auto">
                    <ContactList contacts={directMessagesContacts} />
                </div>

            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Groups" />
                    <CreateChannel />
                </div>
                
                <div className="max-h-[38vh] overflow-y-auto">
                    <ChannelList contacts={channels} isChannel={true}/>
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
}

export default ContactContainer;
