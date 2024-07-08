import Card from "@/tailus-ui/card";
import { Caption, Text, Title } from "@/tailus-ui/typography";
import { TrendingDown, TrendingUp } from "lucide-react";

const data = [
   {
      name: "Jan",
      Primary: 3000,
      Secondary: 4000,
      Accent: 5000,
      Gray: 6000,
      Neutral: 7000,
   },
   {
      name: "Feb",
      Primary: 3000,
      Secondary: 4000,
      Accent: 5000,
      Gray: 6000,
      Neutral: 7000,
   },
   {
      name: "Mar",
      Primary: 2000,
      Secondary: 3000,
      Accent: 4000,
      Gray: 5000,
      Neutral: 6000,
   },
   {
      name: "Apr",
      Primary: 2780,
      Secondary: 3780,
      Accent: 4780,
      Gray: 5780,
      Neutral: 6780,
   },
   {
      name: "May",
      Primary: 1890,
      Secondary: 2890,
      Accent: 3890,
      Gray: 4890,
      Neutral: 5890,
   },
   {
      name: "Jun",
      Primary: 2390,
      Secondary: 3390,
      Accent: 4390,
      Gray: 5390,
      Neutral: 6390,
   },
   {
      name: "Jul",
      Primary: 3490,
      Secondary: 4490,
      Accent: 5490,
      Gray: 6490,
      Neutral: 7490,
   },
   {
      name: "Aug",
      Primary: 3490,
      Secondary: 4490,
      Accent: 5490,
      Gray: 6490,
      Neutral: 7490,
   },
   {
      name: "Sep",
      Primary: 5490,
      Secondary: 6490,
      Accent: 7490,
      Gray: 8490,
      Neutral: 9490,
   },
   {
      name: "Oct",
      Primary: 3490,
      Secondary: 4490,
      Accent: 5490,
      Gray: 6490,
      Neutral: 7490,
   },
   {
      name: "Nov",
      Primary: 3000,
      Secondary: 4000,
      Accent: 5000,
      Gray: 6000,
      Neutral: 7000,
   },
   {
      name: "Dec",
      Primary: 3490,
      Secondary: 4490,
      Accent: 5490,
      Gray: 6490,
      Neutral: 7470,
   },
];

export const StackedCards = () => {
   return (
      <Card variant="outlined" className="w-full">
         <Title as="h2" size="lg" weight="medium" className="mb-1">
            Overview
         </Title>
         <Text className="my-0" size="sm">
            Visualize your main activities data
         </Text>

         <div className="mt-6 grid gap-6 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            <div>
               <Caption as="span">New Orders</Caption>

               <div className="mt-2 flex items-center justify-between gap-3">
                  <Title as="span">{data[3].Primary * 230}</Title>
                  <div className="flex items-center gap-1.5 [--body-text-color:theme(colors.success.600)] dark:[--body-text-color:theme(colors.success.400)]">
                     <TrendingUp className="size-4 text-[--body-text-color]" />
                     <Text size="sm" className="my-0">
                        32%
                     </Text>
                  </div>
               </div>
            </div>
            <div className="pt-6 sm:pl-6 sm:pt-0">
               <Caption as="span">New Customers</Caption>

               <div className="mt-2 flex items-center justify-between gap-3">
                  <Title as="span">{data[3].Accent * 100}</Title>
                  <div className="flex items-center gap-1.5 [--body-text-color:theme(colors.danger.600)] dark:[--body-text-color:theme(colors.danger.400)]">
                     <TrendingDown className="size-4 text-[--body-text-color]" />
                     <Text size="sm" className="my-0">
                        15%
                     </Text>
                  </div>
               </div>
            </div>
            <div className="pt-6 sm:hidden sm:pl-6 sm:pt-0 lg:block">
               <Caption as="span">New Customers</Caption>

               <div className="mt-2 flex items-center justify-between gap-3">
                  <Title as="span">{data[3].Accent * 100}</Title>
                  <div className="flex items-center gap-1.5 [--body-text-color:theme(colors.danger.600)] dark:[--body-text-color:theme(colors.danger.400)]">
                     <TrendingDown className="size-4 text-[--body-text-color]" />
                     <Text size="sm" className="my-0">
                        15%
                     </Text>
                  </div>
               </div>
            </div>
         </div>
      </Card>
   );
};
