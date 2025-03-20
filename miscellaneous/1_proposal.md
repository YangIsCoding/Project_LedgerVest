**Blockchain Investment and Lending Platform Proposal**

### **Project Background and Issues**

Many companies seeking loans or investments struggle to find suitable platforms for fundraising, while investors face risks of being defrauded. Due to the lack of effective safeguards, we aim to leverage blockchain technology to create a transparent, fair, and decentralized investment and lending platform, ensuring trust and security between investors and borrowing companies.

### **Solution**

We plan to develop a blockchain-based platform that allows investors and borrowing companies to conduct financial transactions while ensuring security and transparency through smart contracts. The platform will include the following features:

#### **Investment Proposal**

Borrowing companies can submit loan proposals on the platform, including:

- Project details
- Minimum investment amount per investor
- Target fundraising amount (success criteria)
- Loan interest rate
- Repayment period and method
- **Collateral requirements** (if applicable)
- Minimum investors requirement
- Maximum investors requirement

#### **Investment Participation**

Investors can browse and select investment projects, contributing funds to become stakeholders.

#### **Fund Management**

- All investor funds will be stored in a dedicated smart contract account, ensuring transparency and security.
- If fundraising reaches, say \$10,000, successfully, the funds will be locked in the account.

### **Future Expansion: Collateral Mechanism**

To further protect investors, borrowing companies may need to **pledge crypto assets as collateral**. If the borrowing company fails to meet repayment conditions, the collateral will be liquidated to recover investor funds. The platform will use **on-chain price oracles** to ensure real-time valuation of the collateral.further protect investors, borrowing companies may need to **pledge crypto assets as collateral**. If the borrowing company fails to meet repayment conditions, the collateral will be liquidated to recover investor funds. The platform will use **on-chain price oracles** to ensure real-time valuation of the collateral.

#### **Fund Usage Approval Mechanism**

- When the borrowing company needs to withdraw funds (e.g., \$1,000), they must submit a purpose statement along with supporting documents for verification.
- Investors can review and vote on the fund usage.
- If more than **3/5 of investors** approve, the funds are released.
- A **minimum voting threshold** will be set to ensure that a small number of investors cannot disproportionately influence decisions.

#### **Interest Distribution**

- Upon successful withdrawal, a certain percentage (e.g., \$50) will be distributed to investors as interest based on their investment proportion.
- The platform will adopt a batch settlement mechanism, automatically distributing interest via smart contracts to avoid withdrawal delays.
- Example: If an investor holds 50% of the total investment, they will receive 50 \* 50% = \$25.

#### **Fund Transfer**

- The remaining \$950 will be transferred to the borrowing company’s designated account.

#### **Investor Protection Mechanism**

- If investors find the fund usage unclear or the project not progressing as expected, they can initiate a vote to decide whether to reclaim unused funds.

#### **Repayment Mechanism and Credit Scoring**

- If the borrowing company fails to repay on time, they will face additional penalties and may be **blacklisted**, restricting future fundraising opportunities.
- If the repayment is successful, the funds will be proportionally returned to investors.

#### **Return Calculation**

Example:

- If an investor contributes \$5,000, their total return will be:
  - **Interest Return**: 5000 \* 50% = \$2,500
  - **Principal Return**: 10,000 \* 50% = \$5,000
  - **Total Return**: \$7,500

### **Team Roles and Responsibilities**

#### **Frontend Developer**
- Develop and maintain the user interface using Next.js.
- Implement API calls to interact with backend services and smart contracts.
- Ensure responsive and accessible UI/UX design.

#### **Backend Developer**
- Build and maintain the backend using Node.js and Prisma.
- Design and implement RESTful APIs for frontend interaction.
- Handle authentication, authorization, and data storage using SQLite.

#### **Blockchain Developer**
- Develop, deploy, and audit Solidity smart contracts.
- Manage smart contract integration with backend services.
- Implement security measures to prevent vulnerabilities.

#### **Product Manager (PM)**
- Define and manage project requirements and milestones.
- Ensure alignment between technical teams and business goals.
- Oversee the development cycle and coordinate team efforts.

#### **UI/UX Designer**
- Create wireframes and design prototypes for the platform.
- Optimize user experience and ensure intuitive navigation.
- Collaborate with frontend developers to maintain design consistency.

### **Technical Architecture and Workflow**

#### **Technology Stack**

- **Frontend**: Next.js (for UI and API interaction)
- **Backend**: Node.js + Prisma (data management)
- **Blockchain**: Solidity + Hardhat (smart contract development and testing)
- **Database**: SQLite (storing platform data)
- **API Interaction**: RESTful API (for frontend-backend communication)

#### **Technical Workflow**

1. **Smart Contract Development and Deployment**

   - Develop smart contracts using Solidity to manage fundraising, fund access, voting, and collateral mechanisms.
   - Deploy and test contracts using Hardhat.

2. **Backend API Development**

   - Build a RESTful API using Node.js to interact with smart contracts.
   - Prisma manages data storage and retrieval via SQLite, handling investor and project information.

3. **Frontend Development**

   - Develop the frontend using Next.js, enabling investors and borrowing companies to interact.
   - Fetch smart contract and backend data via API calls.

#### **Platform Workflow**

1. **Company Registration**: Borrowing companies register and submit fundraising proposals.
2. **Investment and Fund Management**: Investors contribute funds, which are stored in the smart contract.
3. **Collateral Locking (if applicable)**: Borrowers must deposit collateral before funds are released.
4. **Withdrawal and Voting**: Borrowing companies request withdrawals, and investors vote on approvals.
5. **Interest Distribution**: Upon successful withdrawals, part of the funds is distributed to investors as interest.
6. **Repayment and Credit System**: Borrowing companies must repay within the specified period, or their credit score will be affected.

### **Expected Outcomes**

- **Enhanced Investment Transparency**: Blockchain technology ensures all transactions are traceable, preventing fund misappropriation.
- **Investor Protection**: Voting and monitoring mechanisms safeguard investor interests and ensure fund accountability.
- **Reinforced Borrower Credibility**: The credit scoring system incentivizes borrowing companies to maintain good standing and repayment behavior.
- **Automated Smart Contracts**: Smart contracts ensure automatic transaction execution, reducing manual verification costs.

### **Future Expansion: Risk Grading Mechanism**

As the platform matures, we will introduce a **risk grading system** to classify investment opportunities based on factors such as:

- Borrowing company's repayment history and credit rating
- Collateral type and value
- Fundraising success rate
- Market volatility analysis

By implementing this system, investors will have clearer risk visibility, allowing them to choose between low-risk and high-risk investment opportunities.

