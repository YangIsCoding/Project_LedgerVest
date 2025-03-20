# System Design
## UML

```plantuml
abstract class User {
  +userId: String
  +username: String
  +email: String
  +password: String
  +register()
  +updateInfo()
  +login()
  +logout()
}

class FundProviderUser {
  +investProposal()
  +withdrawInvestment()
  +voteOnFundWithdrawal()
  +readInvestmentStatus()
}

class FundSeekerUser {
  +createProposal()
  +readProposal()
  +updateProposal()
  +cancelProposal()
  +requestFundWithdrawal()
}

class Proposal {
  +proposalId: String
  +projectDetails: String
  +minInvestment: Double
  +targetAmount: Double
  +status: ProposalStatus
  +create()
  +read()
  +update()
  +cancel()
  +getStatus()
}

class Investment {
  +investmentId: String
  +investorId: String
  +proposalId: String
  +amount: Double
  +status: String
  +makeInvestment()
  +cancelInvestment()
}

class FundWithdrawal {
  +withdrawalId: String
  +proposalId: String
  +amount: Double
  +reason: String
  +status: WithdrawalStatus
  +notifyVote()
  +recordVote()
  +createWithdrawal()
  +approveWithdrawal()
  +rejectWithdrawal()
}

class SmartContract {
  +contractId: String
  +escrowBalance: Double
  +collateralReserve: Double
  +deployContract()
  +executeTransaction()
  +triggerInvest()
  +triggerWithdrawal()
  +updateBalance()
}

class Transaction {
  +transactionId: String
  +sender: String
  +receiver: String
  +amount: Double
  +timestamp: Date
  +execute()
  +getTransactionStatus()
  +rollback()
}

abstract class APIHandler {
  +handleRequest()
  +validateRequest()
  +sendResponse()
  +handleError()
}

class AuthenticationAPIHandler {
  +handleAuthentication()
}

class ProposalAPIHandler {
  +handleProposalRequests()
}

class InvestmentAPIHandler {
  +handleInvestmentRequests()
}

class WithdrawalAPIHandler {
  +handleWithdrawalRequests()
}

class UserService {
  +registerUser()
  +loginUser()
  +updateUserInfo()
}

class ProposalService {
  +createProposal()
  +updateProposal()
  +cancelProposal()
  +getProposalStatus()
}

class InvestmentService {
  +makeInvestment()
  +cancelInvestment()
  +validateInvestment()
}

class WithdrawalService {
  +requestWithdrawal()
  +voteWithdrawal()
  +processWithdrawal()
}

User <|-- FundProviderUser
User <|-- FundSeekerUser

FundSeekerUser --> Proposal : "Creates"
FundSeekerUser --> FundWithdrawal : "Requests"
FundProviderUser --> Proposal : "Funds"
FundProviderUser --> Investment : "Owns"
FundProviderUser --> FundWithdrawal : "Votes"
FundWithdrawal --> SmartContract : "Triggers"
Proposal --> Investment : "Receives"
Proposal --> FundWithdrawal : "Has"
Investment --> SmartContract : "Secured By"
SmartContract --> Transaction : "Processes"
Transaction --> SmartContract : "Belongs To"

APIHandler <|-- AuthenticationAPIHandler
APIHandler <|-- ProposalAPIHandler
APIHandler <|-- InvestmentAPIHandler
APIHandler <|-- WithdrawalAPIHandler

AuthenticationAPIHandler --> UserService : "delegates"
ProposalAPIHandler --> ProposalService : "delegates"
InvestmentAPIHandler --> InvestmentService : "delegates"
WithdrawalAPIHandler --> WithdrawalService : "delegates"
```

```plantuml
title Sequence Diagram for Crowdfunding Platform

actor FundSeekerUser as FSU
actor FundProviderUser as FPU

participant "AuthenticationAPIHandler" as AuthAPI
participant "UserService" as UserSvc
participant "ProposalAPIHandler" as ProposalAPI
participant "ProposalService" as ProposalSvc
participant "InvestmentAPIHandler" as InvestAPI
participant "InvestmentService" as InvestSvc
participant "WithdrawalAPIHandler" as WithdrawAPI
participant "WithdrawalService" as WithdrawSvc
participant "SmartContract" as SC
participant "Transaction" as Tx

== User Registration & Authentication ==
FSU -> AuthAPI: register(userData)
AuthAPI -> UserSvc: registerUser(userData)
UserSvc --> AuthAPI: registrationSuccess
AuthAPI -> FSU: registrationSuccess

FSU -> AuthAPI: login(username, password)
AuthAPI -> UserSvc: loginUser(username, password)
UserSvc --> AuthAPI: authenticationSuccess
AuthAPI -> FSU: loginSuccess

== Proposal Submission & Investment ==
FSU -> ProposalAPI: createProposal(proposalData)
ProposalAPI -> ProposalSvc: createProposal(proposalData)
ProposalSvc --> ProposalAPI: proposalCreated(proposalId)
ProposalAPI -> FSU: proposalSubmissionConfirmation(proposalId)

FPU -> InvestAPI: investProposal(proposalId, amount)
InvestAPI -> InvestSvc: makeInvestment(proposalId, amount)
InvestSvc-> SC: triggerInvest(investmentId)
SC -> Tx: executeTransaction(amount, receiver)
Tx --> SC: transactionSuccess(transactionId)
SC -> InvestSvc: InvestApproved(investmentId)
InvestSvc --> InvestAPI: investmentSuccess(investmentId)
InvestAPI -> FPU: investmentConfirmed(investmentId)

== Fund Withdrawal Request & Voting ==
FSU -> WithdrawAPI: requestWithdrawal(proposalId, amount, reason)
WithdrawAPI -> WithdrawSvc: requestWithdrawal(proposalId, amount, reason)
WithdrawSvc --> WithdrawAPI: withdrawalRequestCreated(withdrawalId)
WithdrawAPI -> FSU: withdrawalRequestSubmitted(withdrawalId)

FPU -> WithdrawAPI: voteOnWithdrawal(withdrawalId, vote)
WithdrawAPI -> WithdrawSvc: recordVote(withdrawalId, vote)
WithdrawSvc --> WithdrawAPI: voteRecorded
WithdrawAPI -> FPU: voteAcknowledged(withdrawalId)

== Smart Contract Execution ==
WithdrawSvc -> SC: triggerWithdrawal(withdrawalId)
SC -> Tx: executeTransaction(amount, receiver)
Tx --> SC: transactionSuccess(transactionId)
SC -> WithdrawSvc: withdrawalApproved(withdrawalId)
WithdrawSvc -> WithdrawAPI: processWithdrawal(withdrawalId, approved)
WithdrawAPI -> FSU: withdrawalProcessed(withdrawalId)
```

## Database Design

### 1. Users and Roles
FundSeeker and FundProvider

#### Users Table

| Column Name      | Data Type                  | Description                                   |
|------------------|----------------------------|-----------------------------------------------|
| user_id          | UUID/VARCHAR (PK)          | Unique identifier for the user                |
| username         | VARCHAR                    | User's login name (unique)                    |
| email            | VARCHAR                    | User's email address (unique)                 |
| hashed_password  | VARCHAR                    | Password hash for security                    |
| user_type        | ENUM('fund_provider', 'fund_seeker') | Differentiates user roles             |
| created_at       | TIMESTAMP                  | Record creation time                          |
| updated_at       | TIMESTAMP                  | Last update time                              |

---

### 2. Proposals

Fund seekers create proposals that include project details, investment goals, and status.

#### Proposals Table

| Column Name      | Data Type                  | Description                                                  |
|------------------|----------------------------|--------------------------------------------------------------|
| proposal_id      | UUID/VARCHAR (PK)          | Unique identifier for the proposal                           |
| fund_seeker_id   | UUID/VARCHAR (FK)          | References the `user_id` from the **Users** table (fund seeker)|
| project_details  | TEXT                       | Detailed description of the project                          |
| min_investment   | DECIMAL                    | Minimum investment amount required                           |
| target_amount    | DECIMAL                    | Total amount needed for the project                          |
| status           | ENUM('draft', 'submitted', 'approved', 'cancelled') | Current state of the proposal   |
| created_at       | TIMESTAMP                  | Record creation time                                           |
| updated_at       | TIMESTAMP                  | Last update time                                               |

---

### 3. Investments

Fund providers invest in proposals. This table tracks each investment.

#### Investments Table

| Column Name      | Data Type                  | Description                                                  |
|------------------|----------------------------|--------------------------------------------------------------|
| investment_id    | UUID/VARCHAR (PK)          | Unique identifier for the investment                         |
| fund_provider_id | UUID/VARCHAR (FK)          | References the `user_id` from the **Users** table (fund provider)|
| proposal_id      | UUID/VARCHAR (FK)          | Identifier of the proposal being funded                      |
| amount           | DECIMAL                    | Investment amount                                            |
| status           | ENUM('active', 'cancelled')| Status of the investment                                     |
| created_at       | TIMESTAMP                  | Record creation time                                           |
| updated_at       | TIMESTAMP                  | Last update time                                               |

---

### 4. Fund Withdrawals and Voting

When a fund seeker requests a withdrawal, a record is created. Fund providers vote on these withdrawal requests using a separate table.

#### FundWithdrawals Table

| Column Name   | Data Type                  | Description                                                  |
|---------------|----------------------------|--------------------------------------------------------------|
| withdrawal_id | UUID/VARCHAR (PK)          | Unique identifier for the withdrawal request                 |
| proposal_id   | UUID/VARCHAR (FK)          | References the proposal related to the withdrawal              |
| amount        | DECIMAL                    | Withdrawal amount                                             |
| reason        | TEXT                       | Reason for the withdrawal request                             |
| status        | ENUM('requested', 'voting', 'approved', 'rejected', 'processed') | Current state of the withdrawal |
| created_at    | TIMESTAMP                  | Record creation time                                           |
| updated_at    | TIMESTAMP                  | Last update time                                               |

#### WithdrawalVotes Table

| Column Name      | Data Type                  | Description                                                  |
|------------------|----------------------------|--------------------------------------------------------------|
| vote_id          | UUID/VARCHAR (PK)          | Unique identifier for the vote                               |
| withdrawal_id    | UUID/VARCHAR (FK)          | References the withdrawal request                           |
| fund_provider_id | UUID/VARCHAR (FK)          | References the voting fund provider’s `user_id`               |
| vote             | ENUM('approve', 'reject')  | Vote decision by the fund provider                           |
| created_at       | TIMESTAMP                  | Record creation time                                           |

---

### 5. Smart Contracts & Transactions

Smart contracts handle fund escrow and execute transactions. Two tables are used to manage these aspects.

#### SmartContracts Table

| Column Name        | Data Type                  | Description                                                  |
|--------------------|----------------------------|--------------------------------------------------------------|
| contract_id        | UUID/VARCHAR (PK)          | Unique identifier for the contract                           |
| escrow_balance     | DECIMAL                    | Balance held in escrow                                         |
| collateral_reserve | DECIMAL                    | Collateral reserve amount                                      |
| created_at         | TIMESTAMP                  | Record creation time                                           |
| updated_at         | TIMESTAMP                  | Last update time                                               |

#### Transactions Table

| Column Name    | Data Type                  | Description                                                  |
|----------------|----------------------------|--------------------------------------------------------------|
| transaction_id | UUID/VARCHAR (PK)          | Unique identifier for the transaction                        |
| contract_id    | UUID/VARCHAR (FK)          | References the **SmartContracts** table                        |
| sender         | VARCHAR                    | Identifier for the sender (user or contract address)           |
| receiver       | VARCHAR                    | Identifier for the receiver (user or contract address)         |
| amount         | DECIMAL                    | Transaction amount                                            |
| timestamp      | TIMESTAMP                  | When the transaction was executed                              |

---
