import EditProfileForm from "@/components/editProfileForm"
import LayoutUser from "@/components/userLayout"


export default function Profile() {

  return (
    
      <>
      <LayoutUser title="edit your profile">
        <>
        <h1>edit profile</h1>
          <div>
          <EditProfileForm/>           
          </div>
        </>
      </LayoutUser></>
  )
}
