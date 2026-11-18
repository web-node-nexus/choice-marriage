import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacy_policy_context: any;
  usingFallback = true;

  private fallbackHtml = `
    <h2>Privacy Policy for Choice Marriage</h2>
    <p>This Privacy Policy explains how Choice Marriage (“we”, “our”, “us”) collects, uses, stores, shares, and protects personal information when you visit our website, create an account, complete a profile, search for matches, communicate with members, purchase membership, or contact support.</p>
    <p>By using Choice Marriage, you agree to the practices described in this policy. If you do not agree, please do not use the platform.</p>

    <h3>1. Who this policy applies to</h3>
    <p>This policy applies to all visitors and registered members of Choice Marriage, including individuals creating profiles for themselves and family members assisting with profile creation or communication on behalf of a candidate, where permitted.</p>

    <h3>2. Information we collect</h3>
    <p><strong>Account information:</strong> name, email address, mobile number, password-related authentication data, and login activity.</p>
    <p><strong>Profile information:</strong> gender, date of birth, marital status, religion, caste/community details (if provided), mother tongue, education, occupation, income range, location, lifestyle preferences, family details, partner preferences, about-me content, and other matrimonial details you choose to share.</p>
    <p><strong>Media and documents:</strong> profile photographs, ID proof uploads, horoscope uploads, payment slip uploads, and related files required for verification or membership processing.</p>
    <p><strong>Communication data:</strong> interest expressions, messages, requests, feedback forms, support tickets, and related conversation metadata needed to operate platform features.</p>
    <p><strong>Technical data:</strong> IP address, browser type, device information, approximate location (if enabled), cookies, local storage values, and usage logs that help us secure and improve the service.</p>
    <p><strong>Payment-related data:</strong> membership plan selection, payment confirmation details, and transaction references. We do not encourage sharing unnecessary card secrets in open messages; use official payment flows.</p>

    <h3>3. Why we collect your information</h3>
    <ul>
      <li>To create, display, and manage matrimonial profiles</li>
      <li>To provide match suggestions based on preferences and activity</li>
      <li>To enable search, shortlist, interest, messaging, and membership features</li>
      <li>To verify account authenticity and reduce misuse</li>
      <li>To process membership upgrades and support requests</li>
      <li>To improve website performance, design, and member experience</li>
      <li>To send important service notifications and account updates</li>
      <li>To protect the community against fraud, spam, and abuse</li>
    </ul>

    <h3>4. How profile visibility works</h3>
    <p>Some information from your profile may be visible to other members depending on your privacy settings, membership access, and platform rules. Contact numbers, email addresses, and other sensitive details are intended to remain protected unless your settings and membership permissions allow sharing.</p>
    <p>We strongly recommend that members:</p>
    <ul>
      <li>Share personal contact details only after basic comfort and family discussion</li>
      <li>Avoid sending financial information to unknown members</li>
      <li>Report suspicious behavior immediately through Contact Us</li>
    </ul>

    <h3>5. Sharing of information</h3>
    <p>We may share limited information in these situations:</p>
    <ul>
      <li><strong>With other members:</strong> as needed for matchmaking features and according to your privacy/membership settings</li>
      <li><strong>With service providers:</strong> hosting, analytics, communication, or payment support partners who help operate the platform under confidentiality expectations</li>
      <li><strong>For legal reasons:</strong> when required by law, regulation, court order, or to protect rights, safety, and security</li>
      <li><strong>During business changes:</strong> if platform ownership or operations are reorganized, relevant data may transfer with continued privacy protection commitments</li>
    </ul>
    <p>We do not sell personal information as a product.</p>

    <h3>6. Cookies, local storage, and similar technologies</h3>
    <p>Choice Marriage may use cookies and local storage to keep you signed in, remember preferences, support captcha/security flows, and improve speed and reliability. You can control cookies through browser settings, but some features may not work correctly if storage is blocked.</p>

    <h3>7. Data retention</h3>
    <p>We retain account and profile information for as long as your account remains active or as needed to provide services, resolve disputes, prevent abuse, and meet legal/accounting requirements. If you request account deletion, we process the request according to platform policy and applicable obligations.</p>

    <h3>8. Data security</h3>
    <p>We use reasonable technical and organizational safeguards to protect personal data. However, no internet service can guarantee perfect security. Members should use strong passwords, avoid sharing OTPs/passwords, and log out from shared devices.</p>

    <h3>9. Your rights and choices</h3>
    <p>Depending on your account status and applicable law, you may be able to:</p>
    <ul>
      <li>Access and update profile information</li>
      <li>Manage privacy and visibility preferences</li>
      <li>Request support related to account corrections</li>
      <li>Request account deletion or deactivation where available</li>
      <li>Opt out of non-essential promotional communication where offered</li>
    </ul>
    <p>To exercise these options, use in-account settings where available or contact us through the Contact Us page with your registered email and profile ID.</p>

    <h3>10. Children’s privacy</h3>
    <p>Choice Marriage is intended only for users who are legally eligible for marriage under applicable law. We do not knowingly create matrimonial profiles for children.</p>

    <h3>11. Third-party links</h3>
    <p>Our website may contain links to third-party sites or app stores. We are not responsible for the privacy practices of external websites. Please review their policies separately.</p>

    <h3>12. International access</h3>
    <p>If you access Choice Marriage from outside India, you understand that your information may be processed in India or in locations where our service infrastructure operates.</p>

    <h3>13. Changes to this Privacy Policy</h3>
    <p>We may update this Privacy Policy to reflect product, legal, or operational changes. Updated versions will be posted on this page. Continued use of the platform after updates means you accept the revised policy.</p>

    <h3>14. Contact for privacy questions</h3>
    <p>If you have questions about this Privacy Policy, data use, or your account privacy settings, please contact Choice Marriage Support through the Contact Us page. Include your registered email and profile ID for faster assistance.</p>
    <p><strong>Support email:</strong> support@choicemarriage.com</p>
    <p>We are committed to helping members feel safe, respected, and informed throughout their matrimonial journey.</p>
  `;

  constructor(private ApiParameter: ApiParameterScript) { }

  ngOnInit(): void {
    this.privacy_policy_context = this.fallbackHtml;
    this.ApiParameter.unsecuredFatchquary('privacy_policy', { projection: ['*'] }).subscribe({
      next: (res: any) => {
        if (res.success && res['data']?.[0]?.privacy_policy_content) {
          this.privacy_policy_context = res['data'][0].privacy_policy_content;
          this.usingFallback = false;
        }
      },
      error: () => {
        this.usingFallback = true;
      }
    });
  }
}
