import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image"

const Navbar = async () => {

  const user = await currentUser();
  console.log(user)

  return (
    <div className='flex items-center justify-between p-4'>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">{user?.firstName} {user?.lastName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata?.role as string}
          </span>
        </div>
        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar