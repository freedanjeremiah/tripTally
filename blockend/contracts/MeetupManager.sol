// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ReputationLedger.sol";

contract MeetupManager {
    struct Meetup {
        uint256 id;
        address organizer;
        string location;
        uint256 timestamp;
        uint256 capacity;
        address[] participants;
        bool settled;
    }

    uint256 public meetupCounter;
    mapping(uint256 => Meetup) public meetups;
    ReputationLedger public reputationLedger;

    event MeetupCreated(uint256 indexed meetupId, address indexed organizer, string location, uint256 timestamp, uint256 capacity);
    event JoinedMeetup(uint256 indexed meetupId, address indexed participant);

    constructor(address _reputationLedger) {
        reputationLedger = ReputationLedger(_reputationLedger);
    }

    function createMeetup(
        string memory _location,
        uint256 _timestamp,
        uint256 _capacity
    ) external {
        require(_capacity > 0, "Capacity must be > 0");
        meetupCounter++;

        Meetup storage meetup = meetups[meetupCounter];
        meetup.id = meetupCounter;
        meetup.organizer = msg.sender;
        meetup.location = _location;
        meetup.timestamp = _timestamp;
        meetup.capacity = _capacity;

        emit MeetupCreated(meetupCounter, msg.sender, _location, _timestamp, _capacity);
    }

    function joinMeetup(uint256 _meetupId) external {
        Meetup storage meetup = meetups[_meetupId];
        require(block.timestamp < meetup.timestamp, "Meetup already started");
        require(meetup.participants.length < meetup.capacity, "Meetup full");

        // check DID verification via Yellow SDK off-chain before allowing join
        meetup.participants.push(msg.sender);
        emit JoinedMeetup(_meetupId, msg.sender);
    }

    function getParticipants(uint256 _meetupId) external view returns (address[] memory) {
        return meetups[_meetupId].participants;
    }
}
