import Link from "next/link";
import Image from "next/image";
import { menuItems } from "./menuItems";
import { role } from "@/lib/data";

function Menu() {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map( item => (
        <div className="flex flex-col" 
        key={item.title}>
          <span className="hidden lg:block text-gray-400 font-light my-2">{item.title}</span>
          {item.items.map( item => {
            if (item.visible.includes(role)) {
              return (
                <Link className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight" 
                href={item.href} key={item.label}>
                  <Image src={item.icon} alt="" width={20} height={20}></Image>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              )
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu;