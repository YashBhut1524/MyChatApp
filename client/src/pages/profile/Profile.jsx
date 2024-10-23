import { useAppStore } from "@/store";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaTrash, FaCamera } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { HuePicker } from "react-color";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import ErrorAnimation from "@/components/animations/ErrorAnimation.jsx"
import SuccessAnimation from "@/components/animations/SuccessAnimation"
import { 
    ADD_PROFILE_IMAGE_ROUTE, 
    HOST, 
    REMOVE_PROFILE_IMAGE_ROUTE, 
    UPDATE_PROFILE_ROUTE 
} from "@/utils/constans";

function Profile() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [isThereImage, setIsThereImage] = useState(false)
    const [hovered, setHovered] = useState(false);
    const [colorPicker, setColorPicker] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [colors, setColors] = useState({
        bgColor: "",
        textColor: "",
        borderColor: "",
    });
    const fileInputRef = useRef(null)

    useEffect(() => {
        const hue = Math.floor(Math.random() * 360);
        const bgLightness = 70;
        const textLightness = 20;
        const borderLightness = 60;

        const newColors = {
            bgColor: `hsl(${hue}, 60%, ${bgLightness}%)`,
            textColor: `hsl(${hue}, 70%, ${textLightness}%)`,
            borderColor: `hsl(${hue}, 65%, ${borderLightness}%)`,
        };

        setColors(newColors);
        // console.log(newColors);
    }, []);

    useEffect(() => {
        console.log("userInfo:", userInfo);

        if (userInfo.profileSetup) {
            // console.log("Data ;", userInfo.firstName, userInfo.lastName);
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setColors(userInfo.colors);
        }
        if(userInfo.image) {
            console.log(`${HOST}/${userInfo.image}`);
            setImage(`${HOST}/${userInfo.image}`)
            setIsThereImage(true)
        }
    }, [userInfo]);

    const validateProfile = () => {
        if (!firstName) {
            toast.error(<ErrorAnimation msg="First Name is Required!!."/>, { duration: 2000 });
            return false;
        }
        if (!lastName) {
            toast.error(<ErrorAnimation msg="Last Name is Required!!."/>, { duration: 2000 });
            return false;
        }
        return true;
    };

    useEffect(() => {
        if(image === null) {
            setColorPicker(false);
        }
    }, [image])

    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                // console.log({ firstName, lastName, colors });
                const response = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    { firstName, lastName, colors },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast.success(<SuccessAnimation msg="Profile Updated Successfully"/>, { duration: 2000 });
                    navigate("/chat");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleNaviget = () => {
        if(userInfo.profileSetup) {
            navigate("/chat")
        } else {
            toast.error(<ErrorAnimation msg="Please complete Profile Setup"/>, { duration: 2000 });
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click()
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        // console.log(file);
        if(file) {
            const formData = new FormData()
            formData.append("profile-image", file)
            const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {withCredentials: true})
            if(response.status === 200 && response.data.image) {
                setUserInfo({...userInfo, image: response.data.image})
                toast.success(<SuccessAnimation msg="Image Updated Successfully"/>, { duration: 2000 });
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDeleteImage = () => {
        setShowDialog(true); // Show confirmation dialog
    };
    

    const confirmDeleteImage  = async () => {
        try {
            const response = await apiClient.delete(
                REMOVE_PROFILE_IMAGE_ROUTE,
                {
                    withCredentials: true
                }
            )
            if(response.status === 200) {
                setUserInfo({...userInfo, image:null})
                toast.success(<SuccessAnimation msg="Profile Image removed Successfully"/>, { duration: 2000 });
                setImage(null)
                setShowDialog(false)
                setIsThereImage(false)
            }
        } catch (error) {
            console.log(error);
            toast.error(<ErrorAnimation msg={error}/>, { duration: 2000 });
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#100621] via-[#0d041c] to-[#160334] flex items-center justify-center px-4 py-6 overflow-hidden">
            <div className="bg-[#06030a75] flex flex-col items-center justify-center gap-6 sm:gap-10 sm:h-full h-auto w-full sm:w-[85vw] md:w-[60vw] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-[#19162a] border-spacing-16 border-[#27154a]">
                <div 
                    className="w-full flex justify-start sm:pt-10"
                    onClick={handleNaviget}
                >
                    <IoArrowBack className="text-3xl sm:text-4xl lg:text-6xl text-white/90 cursor-pointer" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 w-full">
                    <div className="flex flex-col gap-5 items-center justify-center">
                        <div
                            className="h-24 w-24 md:w-36 md:h-36 lg:w-48 lg:h-48 relative flex items-center justify-center mx-auto"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Avatar className="h-24 w-24 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-md border-2 border-[#190f32] shadow-[#1d1f38] absolute ">
                                {image ? (
                                    <AvatarImage
                                        src={image}
                                        alt="Profile"
                                        className="object-cover w-full h-full bg-black "
                                    />
                                ) : (
                                    <div
                                        className={`uppercase h-24 w-24 md:w-36 md:h-36 lg:w-48 lg:h-48 text-5xl md:text-8xl font-semibold border-[1px] flex justify-center items-center rounded-full`}
                                        style={{
                                            backgroundColor: colors.bgColor,
                                            color: colors.textColor,
                                            borderColor: colors.borderColor,
                                        }}
                                    >
                                        {firstName
                                            ? firstName.split("").shift()
                                            : userInfo.email.split("").shift()}
                                    </div>
                                )}
                            </Avatar>
                            {hovered && (
                                <div 
                                    className="bg-gray-400/50 absolute inset-0 flex items-center justify-center rounded-full cursor-pointer"
                                    onClick={image ? handleDeleteImage : handleFileInputClick}
                                >
                                    {image ? (
                                        <FaTrash className="text-white text-3xl cursor-pointer" />
                                    ) : (
                                        <FaCamera size={30} className="text-black text-3xl cursor-pointer" />
                                    )}
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleImageChange}
                                name="profile-image"
                                accept=".png, .jpg, .jpeg, .svg, .webp"
                            />
                        </div>
                        <div className="w-full flex gap-5 justify-center items-center pt-5">
                            <div className="relative sm:w-1/3 md:w-1/3 lg:w-1/4 h-[40px] md:h-[40px] flex justify-center items-center">
                                {!colorPicker
                                ? (
                                    <Button
                                        onClick={() => setColorPicker(true)}
                                        className="w-full h-full bg-[#1e1236] hover:bg-[#332d6c] text-center"
                                    >
                                        Pick Color
                                    </Button>
                                ) 
                                : (
                                    <div className="flex flex-col gap-1 items-center">
                                        <div className="flex gap-2 items-center pl-10">
                                            <HuePicker
                                                width="20vw"
                                                color={colors.bgColor}
                                                onChange={(color) => {
                                                    const hue = color.hsl.h;
                                                    setColors({
                                                        bgColor: `hsl(${hue}, 60%, 70%)`,
                                                        textColor: `hsl(${hue}, 70%, 20%)`,
                                                        borderColor: `hsl(${hue}, 65%, 60%)`,
                                                    });
                                                }}
                                            />
                                            {/* Display a color box if the user has an image */}
                                            {isThereImage && (
                                                <Avatar className="relative flex justify-center items-center w-10 h-10 rounded-full overflow-hidden">
                                                {firstName || userInfo.email 
                                                    ? (
                                                        <div
                                                            className={`uppercase text-2xl font-semibold border-2 flex justify-center items-center rounded-full w-full h-full`}
                                                            style={{
                                                                backgroundColor: colors.bgColor,
                                                                color: colors.textColor,
                                                                borderColor: colors.borderColor,
                                                            }}
                                                        >
                                                            {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                                                        </div>
                                                    ) : null}
                                                </Avatar>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => setColorPicker(false)}
                                            className="mt-1 bg-[#494c5f] rounded-2xl"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 text-white items-center justify-center w-full">
                        <Input
                            placeholder="email"
                            type="email"
                            value={userInfo.email}
                            readOnly
                            className="rounded-2xl p-4 bg-[#231f3a] border-none hover:bg-[#3a326a]"
                        />
                        <Input
                            placeholder="First Name"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            className="rounded-2xl p-4 bg-[#231f3a] border-none hover:bg-[#3a326a]"
                        />
                        <Input
                            placeholder="Last Name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            className="rounded-2xl p-4 bg-[#231f3a] border-none hover:bg-[#3a326a]"
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <Button
                        className="sm:w-1/3 md:w-1/3 lg:w-1/4 h-12 sm:h-16 bg-[#2b225f] hover:bg-[#251f45] rounded-2xl text-xl shadow-md"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Confirm Delete</h2>
                        <p>Are you sure you want to delete the profile image?</p>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => setShowDialog(false)} className="mr-2">No</Button>
                            <Button onClick={confirmDeleteImage} className="bg-red-500 hover:bg-red-700">Yes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;