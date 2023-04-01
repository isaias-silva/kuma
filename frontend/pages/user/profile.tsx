import TypingText from "@/components/TypingText"
import EditProfileForm from "@/components/editProfileForm"
import LayoutUser from "@/components/userLayout"


export default function Profile() {

  return (
    
      <>
      <LayoutUser title="edit your profile">
        <>
        <h1>edit profile</h1>
        <TypingText text="update your info! user name and your profile."
          typingDelay={100}
          />

          <div>
          <EditProfileForm/>           
          </div>
        </>
      </LayoutUser></>
  )
}
