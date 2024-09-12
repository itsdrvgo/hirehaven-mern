import { GeneralShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Services",
    description: "Terms of services of the website",
};

function Page() {
    return (
        <GeneralShell>
            <div>
                <p className="text-4xl font-bold md:text-5xl">
                    Terms of Services
                </p>
            </div>

            <div className="prose prose-base max-w-full text-foreground prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
                <p>
                    <strong>Effective Date:</strong> September 12, 2024
                </p>
                <p>
                    By accessing or using HireHaven, you agree to be bound by
                    these Terms of Service. If you do not agree with these
                    terms, please do not use the website.
                </p>

                <h2>1. Use of HireHaven</h2>
                <p>
                    HireHaven provides a platform for accessing and using the
                    jobs available on the website. You may use HireHaven for
                    personal, non-commercial purposes only. You are not allowed
                    to modify, reproduce, distribute, or create derivative works
                    based on the content or products available on HireHaven
                    without explicit permission.
                </p>

                <h2>2. Accounts and User Content</h2>
                <p>
                    When signing up for an account on HireHaven, you are
                    responsible for providing accurate and complete information.
                    You are solely responsible for the content you post on
                    HireHaven, and you agree not to upload any content that
                    violates any applicable laws, infringes on third-party
                    rights, or contains harmful elements.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    HireHaven and its content are protected by intellectual
                    property laws and are the property of HireHaven and its
                    licensors. If you wish to use HireHaven&apos;s logo,
                    trademarks, or any proprietary information, you must use
                    them in the format specified.
                </p>

                <h2>4. Refunds</h2>
                <p>
                    Refunds are only possible if we are unable to fulfill your
                    order. No refunds will be issued for completed orders or if
                    you are banned from our services.
                </p>

                <h2>5. Developer Rights</h2>
                <p>
                    Developers who purchase products from HireHaven acknowledge
                    that the seller (HireHaven) retains the right to use the
                    code or materials from the product in other or personal
                    projects. Buyers are explicitly prohibited from reselling
                    the purchased product.
                </p>

                <h2>6. Changes to the Terms of Service</h2>
                <p>
                    We reserve the right to change these terms and conditions at
                    any time.
                </p>

                <h2>7. Usage of Services</h2>
                <ul>
                    <li>
                        You may not resell any products you purchase from us.
                    </li>
                    <li>
                        You may not redistribute any products you purchase from
                        us.
                    </li>
                    <li>
                        You may not claim any products you purchase from us as
                        your own.
                    </li>
                    <li>
                        You may not use any products you purchase from us for
                        illegal purposes.
                    </li>
                </ul>

                <h2>8. Strikes and Cancelled Ongoing Projects</h2>
                <ul>
                    <li>
                        Canceling an ongoing project with HireHaven results in
                        receiving a strike.
                    </li>
                    <li>
                        Strikes are recorded to ensure fair and reliable
                        service.
                    </li>
                    <li>
                        For each strike, a 10% fee will be applied to the total
                        price of your next order.
                    </li>
                    <li>
                        If you have accumulated strikes, one strike will be
                        deducted for every 10% fee paid.
                    </li>
                    <li>
                        For example, if you have 1 strike and pay a 10% fee on
                        your new order, your strike count will be reduced to 0.
                    </li>
                </ul>

                <h2>9. Chargebacks</h2>
                <p>
                    Chargebacks are not allowed. If you initiate a chargeback,
                    you will be banned from our services.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    If you have any questions or concerns regarding these Terms
                    of Service, please contact us at thedragoluca@gmail.com.
                </p>

                <hr />

                <p>
                    HireHaven reserves the right to suspend or terminate access
                    to the website for users who violate these Terms of Service
                    or engage in any harmful activities.
                </p>
            </div>
        </GeneralShell>
    );
}

export default Page;
