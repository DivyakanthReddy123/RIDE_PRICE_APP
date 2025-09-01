import React from "react";
import ProfileCard from "./ProfileCard";
import "./ProfileCard.css";

const MyProfile = () => (
  <div className="flex justify-center items-center py-10">
  <ProfileCard
    name=" Divyakanth "
    title=" AI Developer , NY     "
    handle="divyakanthreddy"
    status="Online"
    contactText="クリシュナ "
    avatarUrl="/src/assets/divya.png"
    showUserInfo={true}
    enableTilt={true}
    enableMobileTilt={false}
    onContactClick={() => window.location.href = "mailto:kanth.buchupalle@gmail.com"}

/>
  </div>
);

export default MyProfile;
