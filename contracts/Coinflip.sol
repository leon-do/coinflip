//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coinflip {
    struct Commitment {
        uint256 entropy;
        uint256 blockNumber;
    }
    mapping(address => Commitment) commitments;
    event Game(bool _win, address _player, uint256 _reward);

    receive() external payable {}

    // 1. Commit a number on chain. Use as entropy
    function commit(uint256 _entropy) public {
        commitments[msg.sender].entropy = _entropy;
        commitments[msg.sender].blockNumber = block.number;
    }

    // 2. After a few blocks, reveal random number
    function reveal() public payable {
        require(commitments[msg.sender].blockNumber != 0, "Must commit");
        require(
            commitments[msg.sender].blockNumber < block.number,
            "Reveal too soon"
        );
        uint256 entropy = commitments[msg.sender].entropy;
        // reset commitment
        commitments[msg.sender].blockNumber = 0;
        commitments[msg.sender].entropy = 0;
        // set random number
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, entropy))
        );
        handleGame(randomNumber);
    }

    // 3. Handle game logic
    function handleGame(uint256 _randomNumber) private returns (bool) {
        require(msg.value > 0, "Must send value");
        // win
        if ((_randomNumber % 100) + 1 > 50) {
            uint256 reward = msg.value * 2;
            payable(msg.sender).transfer(reward);
            emit Game(true, msg.sender, reward);
            return true;
        }
        // lose
        emit Game(false, msg.sender, 0);
        return false;
    }
}
