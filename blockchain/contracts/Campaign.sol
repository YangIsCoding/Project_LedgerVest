// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract CampaignFactory {
    address[] public deployedCampaigns;
    address constant FEE_RECIPIENT = 0xaada21fD544dA24B3b96E465C4c7074f4D6E8632;

    event CampaignCreated(address campaignAddress, address creator, uint timestamp);

    function createCampaign(
        uint minimum,
        string memory _title,
        string memory _desc,
        uint _targetAmount,
        string memory _contactInfo
    ) public payable {
        uint fee = (msg.value * 2) / 100;
        require(fee > 0, "Insufficient fee: 2% required");

        payable(FEE_RECIPIENT).transfer(fee);

        address newCampaign = address(new Campaign(minimum, msg.sender, _title, _desc, _targetAmount, _contactInfo));
        deployedCampaigns.push(newCampaign);

        emit CampaignCreated(newCampaign, msg.sender, block.timestamp);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    // public metadata
    string public title;
    string public description;
    uint public targetAmount;
    uint public createdAt; // ⭐ 新增 createdAt
    string public contactInfo;

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;

    event ContributionReceived(address indexed contributor, uint amount);

    event RequestCreated(
        uint indexed index,
        string description,
        uint value,
        address recipient,
        bool complete,
        uint approvalCount,
        uint timestamp // ⭐ 新增 timestamp
    );

    event RequestApproved(uint indexed index, address approver);

    event RequestFinalized(
        uint indexed index,
        uint amount,
        address fundSeekerAddr,
        uint timestamp
    );

    uint public approvalThreshold = 66;
    address constant FEE_RECIPIENT = 0xaada21fD544dA24B3b96E465C4c7074f4D6E8632;

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    constructor(
        uint minimum,
        address creator,
        string memory _title,
        string memory _desc,
        uint _targetAmount,
        string memory _contactInfo
    ) {
        manager = creator;
        minimumContribution = minimum;
        title = _title;
        description = _desc;
        targetAmount = _targetAmount;
        contactInfo = _contactInfo;
        createdAt = block.timestamp; // ⭐ 設定 createdAt
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "Contribution too small");

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        emit ContributionReceived(msg.sender, msg.value);
    }

    function createRequest(
        string memory _description,
        uint _value,
        address payable _recipient
    ) public restricted {
        requests.push();
        Request storage newRequest = requests[requests.length - 1];

        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        emit RequestCreated(
            requests.length - 1,
            _description,
            _value,
            _recipient,
            false,
            0,
            block.timestamp // ⭐ emit timestamp
        );
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Only approvers can approve requests");
        require(!request.approvals[msg.sender], "Already approved");

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        emit RequestApproved(index, msg.sender);
    }

    function finalizeRequest(uint index) public restricted {
        require(index < requests.length, "Invalid request index");

        Request storage request = requests[index];

        require((request.approvalCount * 100) / approversCount >= approvalThreshold, "Not enough approvals");
        require(!request.complete, "Request already finalized");
        require(address(this).balance >= request.value, "Insufficient funds");

        uint fee = (request.value * 2) / 100;
        uint amountToRecipient = request.value - fee;

        request.recipient.transfer(amountToRecipient);
        payable(FEE_RECIPIENT).transfer(fee);

        request.complete = true;

        emit RequestFinalized(index, request.value, manager, block.timestamp);
    }

    function hasApproved(uint index, address approver) public view returns (bool) {
        Request storage request = requests[index];
        return request.approvals[approver];
    }

    function setApprovalThreshold(uint newThreshold) public restricted {
        require(newThreshold <= 100, "Must be <= 100");
        approvalThreshold = newThreshold;
    }

    function getRequest(uint index) public view returns (
        string memory _description,
        uint _value,
        address _recipient,
        bool _complete,
        uint _approvalCount
    ) {
        Request storage request = requests[index];
        return (
            request.description,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount
        );
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address, string memory, string memory, uint, uint
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            title,
            description,
            targetAmount,
            createdAt // ⭐ 新增 createdAt
        );
    }

    receive() external payable {
        contribute();
    }
}