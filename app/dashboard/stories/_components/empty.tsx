import React from "react";
import { Caption, Kbd, Text, Title } from "@/components/tailus-ui/typography";
import Card from "@/components/tailus-ui/card";
import { PenTool, Puzzle, Rocket } from "lucide-react";
import StoriesIllustration from "@/components/illustration/stories-illustration";

const EmptyStories = () => {
   const cards = [
      {
         icon: <PenTool size={24} />,
         title: "Craft Your Narrative",
         description:
            "Stories are your canvas. Paint your ideas, research, and creativity into compelling content.",
      },
      {
         icon: <Rocket size={24} />,
         title: "AI-Powered Journeys",
         description:
            "Let our AI buddy guide you through the storytelling process, from research to polished prose.",
      },
      {
         icon: <Puzzle size={24} />,
         title: "Organize Your Thoughts",
         description:
            "Stories help you piece together information, creating a coherent narrative from scattered ideas.",
      },
   ];
   return (
      <div className="flex flex-col space-y-12">
         <div className="flex h-full w-full flex-col items-center justify-center space-y-5">
            <div className="w-1/2 xl:w-1/5">
               <StoriesIllustration />
            </div>
            <div className="text-balance text-center">
               <Title as="h1" size="2xl">
                  No stories found
               </Title>
               <Caption>
                  You can add a new story by clicking on the button above or by
                  clicking <Kbd>N</Kbd>
               </Caption>
            </div>
         </div>
         <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
               <div key={index} className="w-full">
                  <Card variant="mixed" className="flex items-start gap-4 p-4">
                     <div className="text-primary">{card.icon}</div>
                     <div>
                        <Title
                           as="h2"
                           size="lg"
                           weight="medium"
                           className="mb-1"
                        >
                           {card.title}
                        </Title>
                        <Caption>{card.description}</Caption>
                     </div>
                  </Card>
               </div>
            ))}
         </div>
      </div>
   );
};

export default EmptyStories;
