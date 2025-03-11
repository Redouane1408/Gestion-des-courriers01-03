import * as React from "react"
import {
  AudioWaveform,
  //BookOpen,
  Bot,
  Command,
  //Frame,
  GalleryVerticalEnd,
  //Map,
  //PieChart,
  
  FileArchive,
  SquareTerminal
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
//import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  //SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Zohra Ait Heddad ",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },

    {
      title: "Gestion des Utilisateurs",
      url: "#",
      icon: Bot,

    },
    
    {
      title: "Impoter des Fichiers",
      url: "http://localhost:5173/documents", // This is a relative URL
      icon: FileArchive,
    },
  ],
  projects: [

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      {/*<SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>*/}
      <SidebarRail />
    </Sidebar>
  )
}
