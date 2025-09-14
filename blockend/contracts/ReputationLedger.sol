// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReputationLedger {
    mapping(address => int256) public reputationScore;
    mapping(address => mapping(address => bool)) public hasRated;

    event ReputationRated(address indexed rater, address indexed rated, int8 score);

    function rateParticipant(address _participant, int8 _score) external {
        require(_participant != msg.sender, "Can't rate yourself");
        require(!hasRated[msg.sender][_participant], "Already rated");

        reputationScore[_participant] += _score;
        hasRated[msg.sender][_participant] = true;

        emit ReputationRated(msg.sender, _participant, _score);
    }

    function getReputation(address _participant) external view returns (int256) {
        return reputationScore[_participant];
    }
}
