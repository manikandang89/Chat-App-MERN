import { useState } from "react";
import { authCheck , loginUser,updateProfile } from '../redux/userSlice';
import { Camera, Mail, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from '../redux/useHooks';
import { current } from "@reduxjs/toolkit";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const {currentUser, isUpdatingProfile} = useAppSelector(state => state.user);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    const reader = new FileReader();

    reader.readAsDataURL(selectedFile || new Blob());

    reader.onload = async (): Promise<void> => {
      const base64Image: string | ArrayBuffer | null = reader.result;
      setSelectedImg(base64Image as string);
      await dispatch(updateProfile({ profilePic: base64Image as string }));
    };
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-2xl p-6 space-y-4">
        <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-colitems-center gap-4">
            <div className="relative">
              <img src={selectedImg || currentUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 " />
                  <label htmlFor="image-upload" className={`absolute bottom-0 right-0 cursor-pointer
                  bg-base-content rounded-full p-2 transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} `} >

                  <Camera className="w-5 h-5 text-base-200" />
                  <input type="file" id="image-upload" className="hidden"
                  accept="image/*" onChange={handleImageUpload} 
                  disabled={isUpdatingProfile}    />
                  </label>
               </div>

               <div className="space-y-5">
                    <div className="text-sm text-zinc-400 flex items-center gap-3">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{currentUser?.fullName}</p>
                </div>

                <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{currentUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{currentUser?.id?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default ProfilePage

