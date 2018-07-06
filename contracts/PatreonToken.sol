pragma solidity ^0.4.19;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
 library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract PatreonToken {
    
    using SafeMath for uint256;
    
    uint supply = 0;

    event Buy(address _buyer, uint _amount);
    event Sell(address _buyer, uint _amount);
    
    struct supporters {
        uint total;
        uint currentFiatValue;        
        mapping(address => investors) supporters;
    }
    
    struct stake {
        uint fiatPrice;
        uint amount;
    }
    
    struct investors {
        uint totalStake;
        uint numberOfStakes;
        mapping(address => stake) stakes;
    }
    
    mapping(address => uint256) public balance;
    
    mapping(address => supporters) artistSupporters;
    
    // tot supply
    function totalSupply() public view returns (uint256){
        return supply;
    }
    
    // buy token (with FIAT)
    function buy (uint _amount) public {
        balance[msg.sender] = balance[msg.sender].add(_amount);
        supply = supply.add(_amount);

        Buy(msg.sender, _amount);
    }
    
    // sell token (in to FIAT)
    function sell (uint _amount) public {
        balance[msg.sender] = balance[msg.sender].sub(_amount);
        supply = supply.sub(_amount);

        Sell(msg.sender, _amount);
    }
    
    // tokenBalance
    function tokenBalance(address _investor)  public view returns (uint256 _balance) {
        return balance[_investor];
    }
    
    // buy with PatreonToken
    function contribute (uint _amount, address _artist) public {
    	require(balance[msg.sender] >= _amount);

        supporters storage temp = artistSupporters[_artist];
        temp.supporters[msg.sender].totalStake = temp.supporters[msg.sender].totalStake.add(_amount);
        temp.total = temp.total.add(_amount);
        artistSupporters[_artist] = temp;
        
        balance[msg.sender] = balance[msg.sender].sub(_amount);
    }
    
    // sell with PatreonToken
    function revoke (uint _amount, address _artist) public {
        supporters storage temp = artistSupporters[_artist];

    	require(temp.supporters[msg.sender].totalStake >= _amount);
        
        temp.supporters[msg.sender].totalStake  = temp.supporters[msg.sender].totalStake.sub(_amount);
        temp.total = temp.total.sub(_amount);
        artistSupporters[_artist] = temp;
        
        balance[msg.sender] = balance[msg.sender].add(_amount);
    }
    
    // balance of the Artist
    function artistBalance(address _artist)  public view returns (uint256) {
        return artistSupporters[_artist].total;
    }
    
    // balance for each Artists  in which they Invest
    function balanceForArtist(address _artist)  public view returns (uint256) {
        return artistSupporters[_artist].supporters[msg.sender].totalStake;
    }   

    // current FIAT value of the Artist
    function currentFiatValue(address _artist)  public view returns (uint256) {
        return artistSupporters[_artist].currentFiatValue;
    }
    
    // set the current fiat value
    function setFiatValue(uint _amount, address _artist) public {
        supporters storage temp = artistSupporters[_artist];
        temp.currentFiatValue = _amount;
        artistSupporters[_artist] = temp;
    }   
    
    // gain/loss (IN PatreonToken)
}