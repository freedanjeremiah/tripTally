// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ExpenseChannel {
    struct Channel {
        uint256 id;
        address[] participants;
        mapping(address => uint256) balances;
        bool closed;
    }

    uint256 public channelCounter;
    mapping(uint256 => Channel) public channels;

    event ChannelOpened(uint256 indexed id, address[] participants);
    event FundsDeposited(uint256 indexed id, address indexed from, uint256 amount);
    event ChannelClosed(uint256 indexed id);

    function openChannel(address[] memory _participants) external {
        channelCounter++;
        Channel storage channel = channels[channelCounter];
        channel.id = channelCounter;
        channel.participants = _participants;

        emit ChannelOpened(channelCounter, _participants);
    }

    function deposit(uint256 _channelId) external payable {
        Channel storage channel = channels[_channelId];
        require(!channel.closed, "Channel closed");

        channel.balances[msg.sender] += msg.value;
        emit FundsDeposited(_channelId, msg.sender, msg.value);
    }

    function closeChannel(uint256 _channelId, address payable[] memory _recipients, uint256[] memory _amounts) external {
        Channel storage channel = channels[_channelId];
        require(!channel.closed, "Already closed");
        require(_recipients.length == _amounts.length, "Mismatched arrays");

        channel.closed = true;

        for (uint256 i = 0; i < _recipients.length; i++) {
            (bool sent, ) = _recipients[i].call{value: _amounts[i]}("");
            require(sent, "Transfer failed");
        }

        emit ChannelClosed(_channelId);
    }
}
