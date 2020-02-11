pragma solidity ^0.5.0;

contract patient {
  string haship;
  string pairID;
  string validity;

  function set(string memory hash,string memory ID,string memory val) public {
    haship = hash;
    pairID = ID;
    validity = val;
  }

  function get() public view returns (string memory) {
    return haship;
  }
}
