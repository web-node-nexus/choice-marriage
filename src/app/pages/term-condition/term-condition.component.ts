import { Component, OnInit } from '@angular/core';
import { ApiParameterScript } from 'src/app/script/api-parameter';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss']
})
export class TermConditionComponent implements OnInit {
  termsCondition: any;
  usingFallback = true;

  private fallbackHtml = `
    <h2>Terms &amp; Conditions of Choice Marriage</h2>
    <p>These Terms &amp; Conditions (“Terms”) govern your access to and use of the Choice Marriage website, membership services, profile tools, communication features, and related support. By registering, browsing, or using any part of the platform, you agree to these Terms.</p>
    <p>Please read them carefully. If you do not accept these Terms, do not create an account or use the services.</p>

    <h3>1. About the service</h3>
    <p>Choice Marriage is an online matrimonial platform that helps eligible individuals and families discover potential life partners through profiles, preferences, search tools, membership plans, and communication features. We provide technology and support for matchmaking; we do not guarantee marriage outcomes.</p>

    <h3>2. Eligibility</h3>
    <ul>
      <li>You must be legally eligible to marry under applicable law.</li>
      <li>You must provide true, accurate, and complete information.</li>
      <li>You must not create a profile for someone without proper authority/consent.</li>
      <li>You must not use the platform for dating misuse, spam, fraud, or non-matrimonial purposes.</li>
    </ul>

    <h3>3. Account registration and security</h3>
    <p>When you register, you agree to maintain the confidentiality of your login credentials and to accept responsibility for activities performed through your account. If you suspect unauthorized access, change your password and contact support immediately.</p>
    <p>We may refuse, suspend, or terminate accounts that appear duplicate, fake, abusive, or non-compliant with these Terms.</p>

    <h3>4. Profile content standards</h3>
    <p>You are solely responsible for the content you upload or publish, including text, photos, documents, and any statements about yourself or your family. You agree that your content:</p>
    <ul>
      <li>Is accurate and not misleading</li>
      <li>Does not infringe another person’s rights</li>
      <li>Does not contain offensive, unlawful, defamatory, or sexually explicit material</li>
      <li>Does not promote hate, harassment, or illegal activity</li>
      <li>Uses photographs that genuinely represent the profile holder</li>
    </ul>
    <p>We may remove or restrict content that violates these standards, with or without prior notice.</p>

    <h3>5. Acceptable use of communication features</h3>
    <p>Members must communicate respectfully. You agree not to:</p>
    <ul>
      <li>Harass, threaten, or pressure other members</li>
      <li>Send spam, promotional schemes, or irrelevant commercial offers</li>
      <li>Request money, OTP, banking passwords, or financial favors</li>
      <li>Misrepresent identity, marital status, education, or profession</li>
      <li>Share another member’s private information without consent</li>
    </ul>
    <p>Any member who experiences suspicious behavior should stop communication and report the issue through Contact Us.</p>

    <h3>6. Membership plans and payments</h3>
    <p>Some features require paid membership. Plan details such as duration, contacts, messages, visibility, and pricing are shown on the Membership page and may change over time.</p>
    <ul>
      <li>Fees are payable according to the selected plan</li>
      <li>Benefits activate after successful confirmation as per platform process</li>
      <li>Misuse of membership benefits may lead to suspension</li>
      <li>Refund eligibility, if any, follows the platform’s applicable policy and payment circumstances</li>
    </ul>
    <p>Please keep payment references safe and use only official Choice Marriage payment instructions.</p>

    <h3>7. No warranty of match or response</h3>
    <p>Choice Marriage provides tools to help you discover and connect with potential partners. We do not promise that:</p>
    <ul>
      <li>Every profile will respond</li>
      <li>Every introduction will lead to marriage</li>
      <li>All member-provided information is independently verified in every case</li>
      <li>Search results will always meet every preference exactly</li>
    </ul>
    <p>Members and families should perform their own due diligence before finalizing any marriage decision.</p>

    <h3>8. Privacy</h3>
    <p>Your use of Choice Marriage is also governed by our Privacy Policy. Please review it to understand how personal information is collected and used. Privacy settings help you control parts of your visibility, but no online platform can eliminate all risk.</p>

    <h3>9. Intellectual property</h3>
    <p>The Choice Marriage name, logo, website design, software, text, and original creative materials are protected by applicable intellectual property laws. You may not copy, modify, distribute, or exploit platform materials without permission, except for personal non-commercial use of your own account experience.</p>

    <h3>10. Platform availability and changes</h3>
    <p>We aim to keep services available and improving, but we do not guarantee uninterrupted access. Features may be updated, paused, or discontinued as the platform evolves. Temporary downtime may occur for maintenance, upgrades, or reasons beyond our control.</p>

    <h3>11. Suspension and termination</h3>
    <p>We may suspend or terminate access if we reasonably believe an account violates these Terms, harms other members, creates legal risk, or misuses the platform. You may also request account closure through support channels subject to verification.</p>

    <h3>12. Limitation of liability</h3>
    <p>To the maximum extent permitted by law, Choice Marriage and its team are not liable for indirect, incidental, special, or consequential damages, including emotional distress, lost opportunities, or decisions made by members after connecting on the platform. Our role is to provide matrimonial technology and support services.</p>

    <h3>13. Indemnity</h3>
    <p>You agree to indemnify and hold Choice Marriage harmless from claims arising out of your content, your communications, your misuse of the platform, or your violation of these Terms or applicable law.</p>

    <h3>14. Governing law</h3>
    <p>These Terms are governed by the applicable laws of India. Disputes shall be subject to the jurisdiction of competent courts as applicable to the platform’s operating entity, unless otherwise required by law.</p>

    <h3>15. Updates to these Terms</h3>
    <p>We may revise these Terms from time to time. The latest version will be published on this page. Continued use after updates constitutes acceptance of the revised Terms.</p>

    <h3>16. Contact</h3>
    <p>For questions about these Terms &amp; Conditions, membership rules, or account policies, please contact us through the Contact Us page.</p>
    <p><strong>Support email:</strong> support@choicemarriage.com</p>
    <p>Thank you for helping us keep Choice Marriage a respectful and trustworthy matrimonial community.</p>
  `;

  constructor(private ApiParameter: ApiParameterScript) { }

  ngOnInit(): void {
    this.termsCondition = this.fallbackHtml;
    this.ApiParameter.unsecuredFatchquary('termand_condition', { projection: ['*'] }).subscribe({
      next: (res: any) => {
        if (res.success && res['data']?.[0]?.termand_condition_content) {
          this.termsCondition = res['data'][0].termand_condition_content;
          this.usingFallback = false;
        }
      },
      error: () => {
        this.usingFallback = true;
      }
    });
  }
}
