"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github, Heart, ExternalLink } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  github: string;
  description: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Nikhil",
    role: "Full Stack Developer",
    github: "chrsnikhil",
    description: "Lead developer working on blockchain integration and smart contracts. Passionate about decentralized identity and social media platforms.",
    image: "https://github.com/chrsnikhil.png?size=200"
  },
  {
    name: "Aditya",
    role: "Full Stack Developer", 
    github: "alienworld1",
    description: "UI/UX specialist focused on creating beautiful, user-friendly interfaces. Expert in React and modern web technologies.",
    image: "https://github.com/alienworld1.png?size=200"
  }
];

export function TeamPassport() {
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black font-mono text-white tracking-wider transform -skew-x-1 shadow-[4px_4px_0px_0px_#666] inline-block px-6 py-3 bg-black border-4 border-white rounded">
          TEAM PASSPORT
        </h2>
        <p className="text-sm font-mono text-gray-300 mt-2">Meet the developers behind MustaFair</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-black border-4 border-white shadow-[8px_8px_0px_0px_#666] p-6 rounded-lg cursor-pointer hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => {
              setSelectedMember(member);
              setOpen(true);
            }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-black shadow-[6px_6px_0px_0px_#666] overflow-hidden flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ${member.image ? 'hidden' : ''}`}>
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                {/* Heart indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-[2px_2px_0px_0px_#666] flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-black font-mono text-white tracking-wider transform -skew-x-1 shadow-[2px_2px_0px_0px_#666] inline-block px-3 py-1 bg-black border-2 border-white rounded">
                  {member.name}
                </h3>
                <p className="text-sm font-mono text-gray-300 bg-black border border-white rounded px-2 py-1 shadow-[2px_2px_0px_0px_#666]">
                  {member.role}
                </p>
                <p className="text-xs font-mono text-gray-400 max-w-xs">
                  {member.description}
                </p>
              </div>

              {/* GitHub Link */}
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black font-black font-mono px-3 py-1 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 tracking-wider text-xs transform -skew-x-1 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3 h-3" />
                @{member.github}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Member Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] p-0 overflow-hidden">
          <DialogHeader className="bg-black text-white px-6 py-4 border-b-4 border-white flex flex-col items-center relative">
            <DialogTitle className="text-xl font-black font-mono tracking-[0.1em] transform -skew-x-1 text-center">
              TEAM MEMBER
            </DialogTitle>
            <DialogClose asChild>
              <Button
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white text-black border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:bg-[#e8e8e8] focus:outline-none"
                aria-label="Close"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          
          {selectedMember && (
            <div className="p-6 flex flex-col items-center gap-6 bg-black">
              {/* Large Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-black shadow-[8px_8px_0px_0px_#666] overflow-hidden flex items-center justify-center">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ${selectedMember.image ? 'hidden' : ''}`}>
                    <span className="text-4xl">👤</span>
                  </div>
                </div>
                {/* Heart indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-[3px_3px_0px_0px_#666] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>

              {/* Member Details */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-black font-mono text-white tracking-wider transform -skew-x-1 shadow-[3px_3px_0px_0px_#666] inline-block px-4 py-2 bg-black border-2 border-white rounded">
                  {selectedMember.name}
                </h2>
                
                <div className="bg-black border-2 border-white rounded px-4 py-2 shadow-[3px_3px_0px_0px_#666]">
                  <p className="text-sm font-mono text-white font-bold">
                    {selectedMember.role}
                  </p>
                </div>

                <p className="text-sm font-mono text-gray-300 max-w-xs leading-relaxed">
                  "{selectedMember.description}"
                </p>

                {/* GitHub Link */}
                <a
                  href={`https://github.com/${selectedMember.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black font-black font-mono px-4 py-2 border-2 border-white shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300 tracking-wider text-sm transform -skew-x-1 rounded"
                >
                  <Github className="w-4 h-4" />
                  @{selectedMember.github}
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 