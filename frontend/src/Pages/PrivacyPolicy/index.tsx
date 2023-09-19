import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/PageHeader";
import "./style.scss";
const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Privacy Policy" handleGoBack={() => navigate(-1)} />
      <div className="px-4 my-4 relative h-5/6 overflow-y-auto scroll-smooth read-only-content">
        <p>
          <strong>Effective Date:</strong>&nbsp;13 Sep, 2023
        </p>
        <br />
        <h3>Introduction</h3>
        <p>
          Welcome to Texting, a Progressive Web Application that allows you to
          chat with your friends in real-time. We value your privacy and are
          committed to protecting your personal information. This Privacy Policy
          outlines our practices regarding the collection, use, and protection
          of your data.&nbsp;
        </p>
        <p>
          By accessing or using our App, you consent to the practices described
          in this Privacy Policy. Please read this document carefully to
          understand how we handle your personal information.&nbsp;
        </p>
        <p>
          <br />
        </p>
        <h3>Information We Collect</h3>
        1. &nbsp;<span className="font-bold">User-Provided Information</span>
        : When you use our App, we may collect and store information you provide
        during the registration and chat process. This may include, but is not
        limited to:
        <br />
        - Your name
        <br />
        - Email address
        <br />
        - Profile picture (if provided)
        <br />
        - Chat messages and related data
        <br />
        2. &nbsp;<span className="font-bold">Google Authentication</span>
        : To facilitate the sign-up and login process, we use Google Sign-In.
        When you use this feature, Google may collect certain information, as
        specified in their privacy policy. We do not store your Google password.
        <br />
        3. &nbsp;
        <span className="font-bold">Automatically Collected Information</span>
        : We may collect certain technical information automatically when you
        use our App, including: - Device information (e.g., device type,
        operating system) - Browser information (e.g., browser type, version) -
        IP address - Usage data (e.g., pages visited, interactions)
        <br />
        <p>
          <br />
        </p>
        <h3>How We Use Your Information</h3>
        <p>
          We may use the collected information for the following purposes:&nbsp;
        </p>
        1. &nbsp;<span className="font-bold">User Account</span>
        : To create and manage your user account.
        <br />
        2. &nbsp;<span className="font-bold">Communication</span>
        : To enable one-to-one chat functionality.
        <br />
        3. &nbsp;<span className="font-bold">Authentication</span>
        : To verify your identity using Google Sign-In.
        <br />
        4. &nbsp;<span className="font-bold">Improvement</span>
        : To improve our App, troubleshoot issues, and enhance user experience.
        <br />
        5. &nbsp;<span className="font-bold">Legal Compliance</span>
        : To comply with legal obligations.
        <br />
        <p>
          <br />
        </p>
        <h3>Data Security</h3>
        <p>
          We take data security seriously and implement industry-standard
          security measures to protect your information. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>
        <p>
          <br />
        </p>
        <h3>Sharing of Information</h3>
        <p>
          We do not sell or rent your personal information to third parties.
          However, we may share your data with service providers, business
          partners, or authorities when required by law or to protect our
          rights, privacy, safety, or property.
        </p>
        <p>
          <br />
        </p>
        <h3>Cookies and Tracking</h3>
        <p>
          We may use cookies and similar tracking technologies to enhance your
          user experience. You can configure your browser to reject cookies, but
          this may limit some features of our App.
        </p>
        <p>
          <br />
        </p>
        <h3>Your Choices</h3>
        <p>
          You can access, update, or delete your account information by
          contacting us. You may also opt-out of marketing communications. Note
          that some information may be retained for legal or operational
          purposes.
        </p>
        <p>
          <br />
        </p>
        <h3>Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy to reflect changes in our practices
          or legal requirements. The revised policy will be effective when
          posted on this page.
        </p>
        <p>
          <br />
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please contact us at&nbsp;
          <a href="mailto:ashukumar959918+texting@gmail.com">Ashu Kumar</a>. By
          using our App, you acknowledge that you have read, understood, and
          agree to this Privacy Policy.
        </p>
        <br />
        <p>
          <strong>Last updated:</strong> 13 Sep, 2023
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
