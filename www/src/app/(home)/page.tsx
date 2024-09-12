import { ProfileComplete, ProfileVerify } from "@/components/globals/warnings";
import { About, Hero, HowItWorks, WhyChoose } from "@/components/home";

function Page() {
    return (
        <>
            <ProfileComplete />
            <ProfileVerify />
            <Hero />
            <About />
            <HowItWorks />
            <WhyChoose />
        </>
    );
}

export default Page;
